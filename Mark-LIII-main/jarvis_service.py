"""
jarvis_service.py — Dedicated JARVIS AI & Workflow Bridge Service for Daykan

Binds the Mark-LIII JARVIS brain, tools, memory, and actions to the Daykan
Hero voice interface on the DR Developer portfolio website.

Endpoints:
  GET  /health     - Health check, model status, and loaded action count
  POST /api/chat   - Intelligent question answering & tool/workflow execution
  POST /api/command- Direct command dispatch alias for JARVIS actions
"""

import sys
import os
import time
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# Configure Windows console encoding for action emojis
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from core.action_loader import discover_actions
from core.plugin_loader import discover_plugins
from memory.memory_manager import (
    load_memory, update_memory, format_memory_for_prompt, search_memory
)

# ── Load Configuration ────────────────────────────────────────────────────────
CONFIG_PATH = BASE_DIR / "config" / "api_keys.json"

def get_api_key() -> str:
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("gemini_api_key", "").strip()
    except Exception as e:
        print(f"[JARVIS Service] Warning: Failed to load config: {e}")
        return ""

# ── Discovered Actions & Plugins ──────────────────────────────────────────────
_inline_names = {"screen_process", "close_camera", "system_status", "save_memory", "recall_memory"}
action_registry = discover_actions(
    actions_dir=BASE_DIR / "actions",
    reserved_names=_inline_names,
    logger=lambda m: print(f"[JARVIS Actions] {m}"),
)

plugin_registry = discover_plugins(
    plugins_dir=BASE_DIR / "plugins",
    core_tool_names=_inline_names | action_registry.names(),
    logger=lambda m: print(f"[JARVIS Plugins] {m}"),
)

print(f"[JARVIS Service] Initialized {len(action_registry.names())} actions and {len(plugin_registry._plugins)} plugins.")

# ── Google GenAI Client Setup ─────────────────────────────────────────────────
import google.genai as genai
from google.genai import types

gemini_key = get_api_key()
genai_client = genai.Client(api_key=gemini_key) if gemini_key else None

MODELS_CASCADE = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-flash-latest"]

# In-memory chat sessions keyed by conversationId for follow-up continuity
sessions: Dict[str, Any] = {}
session_last_active: Dict[str, float] = {}

def build_system_instruction() -> str:
    now = datetime.now()
    time_str = now.strftime("%A, %B %d, %Y — %I:%M %p")
    mem_str = format_memory_for_prompt(load_memory())

    return f"""You are Daykan, the personal AI assistant and engineering avatar created by Dharmik Rathod, who is known as D.R Developer.
You are powered by the JARVIS system architecture, integrating computer automation, workflow execution, deep technical intelligence, and real-time speech.

[CURRENT DATE & TIME]
{time_str}

{mem_str if mem_str else ""}

CRITICAL VOICE & PERSONALITY GUIDELINES:
1. Since your responses are synthesized into speech by Kokoro TTS and spoken aloud to the user, keep answers concise, punchy, conversational, and direct (typically 1 to 3 natural sentences).
2. Answer the user's actual question immediately. Do NOT preface every message with "I am Daykan" or "As an AI".
3. If the user specifically asks who you are or who created you, explain clearly that you are Daykan, created by Dharmik Rathod (D.R Developer).
4. If the user asks a technical question (React, APIs, database architectures, machine learning, Python, etc.), provide a sharp, accurate explanation.
5. If the user asks for a joke, tell a funny, clever developer joke.
6. When the user asks you to perform an action or check status (e.g. check system status, open an app, check weather, search the web, control browser, set reminder), you have access to specialized tool functions. ALWAYS call the appropriate tool.
7. After a tool executes, provide a natural, spoken confirmation summarizing what was done.
"""

def get_tool_definitions() -> List[types.Tool]:
    declarations = []
    
    # 1. Built-in inline tools
    declarations.append({
        "name": "system_status",
        "description": "Checks local computer hardware telemetry: CPU percentage, RAM used/total, uptime, and running process count.",
        "parameters": {"type": "OBJECT", "properties": {}},
    })
    declarations.append({
        "name": "recall_memory",
        "description": "Searches stored long-term memory for saved notes, facts, and user preferences.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING", "description": "Search query"}
            },
            "required": ["query"]
        },
    })
    
    # 2. Auto-discovered actions from Mark-LIII
    for decl in action_registry.get_tool_declarations():
        declarations.append(decl)
        
    return [types.Tool(function_declarations=declarations)]

# ── Execute Discovered Tools ──────────────────────────────────────────────────
def execute_tool(name: str, args: Dict[str, Any]) -> str:
    print(f"[JARVIS Service] Executing tool '{name}' with args: {args}")
    try:
        if name == "system_status":
            from actions.system_monitor import get_system_status
            status = get_system_status()
            cpu = status.get("cpu_percent", 0)
            ram = status.get("ram_percent", 0)
            uptime = status.get("uptime", "unknown")
            return f"System telemetry: CPU utilization is {cpu}%, RAM usage is {ram}%, and system uptime is {uptime}."
        elif name == "recall_memory":
            query = args.get("query", "")
            return str(search_memory(query))
        elif action_registry.has(name):
            ctx = {"player": None, "speak": None, "response": None, "session_memory": None}
            res = action_registry.run(name, args, ctx)
            return str(res)
        elif plugin_registry.has(name):
            res = plugin_registry.run(name, args, player=None, session_memory=None)
            return str(res)
        else:
            return f"Tool '{name}' not found."
    except Exception as e:
        print(f"[JARVIS Service] Tool execution error: {e}")
        return f"Tool '{name}' encountered an error: {e}"

# ── Fast Intent Fallback For Instant Actions ──────────────────────────────────
def check_quick_intent(query: str) -> Optional[str]:
    q = query.lower().strip().replace("?", "").replace("!", "")
    
    if "system status" in q or "system performance" in q or "cpu usage" in q or "ram usage" in q:
        return execute_tool("system_status", {})
        
    if q.startswith("open ") or q.startswith("launch "):
        app_name = q.replace("open ", "").replace("launch ", "").strip()
        if app_name:
            return execute_tool("open_app", {"app_name": app_name})
            
    if "weather in " in q:
        parts = q.split("weather in ")
        if len(parts) > 1 and parts[1].strip():
            city = parts[1].strip().split()[0]
            return execute_tool("weather_report", {"city": city})
            
    return None

# ── FastAPI Application ───────────────────────────────────────────────────────
app = FastAPI(title="Mark-LIII JARVIS AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "Mark-LIII JARVIS AI Engine",
        "assistant": "Daykan",
        "actions_loaded": len(action_registry.names()),
        "action_names": sorted(list(action_registry.names())),
        "client_ready": genai_client is not None,
    }

def safe_extract_text(resp) -> str:
    """Safely extracts text without raising ValueError if parts are non-text."""
    if not resp:
        return ""
    try:
        if hasattr(resp, "text") and resp.text:
            return resp.text.strip()
    except Exception:
        pass
    try:
        if resp.candidates and resp.candidates[0].content and resp.candidates[0].content.parts:
            collected = []
            for p in resp.candidates[0].content.parts:
                if hasattr(p, "text") and p.text:
                    collected.append(p.text.strip())
            if collected:
                return " ".join(collected).strip()
    except Exception:
        pass
    return ""

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    try:
        body = await request.json()
        message = (body.get("message") or "").strip()
        conversation_id = body.get("conversationId") or "default_session"
        history = body.get("history") or []

        if not message:
            return JSONResponse({"success": False, "reply": "I am listening. What can I do for you?"})

        print(f"[JARVIS Service] Query: \"{message}\" (Session: {conversation_id})")

        # 1. Quick intent interception for local system actions
        quick_action_res = check_quick_intent(message)
        if quick_action_res:
            print(f"[JARVIS Service] Quick intent handled: {quick_action_res}")
            return JSONResponse({
                "success": True,
                "reply": quick_action_res,
                "toolUsed": "direct_action",
            })

        # 2. Route through Google GenAI Client with tools & conversation memory
        if not genai_client:
            return JSONResponse({
                "success": False,
                "reply": "JARVIS API key is not configured.",
            })

        # Build contents from history + current message
        contents = []
        if history:
            for h in history[-8:]:
                r_val = h.get("role") or h.get("sender") or "user"
                role = "user" if r_val == "user" else "model"
                text = (h.get("content") or h.get("text") or "").strip()
                if text:
                    contents.append(types.Content(role=role, parts=[types.Part.from_text(text=text)]))

        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

        system_inst = build_system_instruction()
        tools = get_tool_definitions()

        response = None
        last_error = None
        for model_name in MODELS_CASCADE:
            try:
                response = genai_client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_inst,
                        tools=tools,
                        temperature=0.7,
                    )
                )
                if response:
                    print(f"[JARVIS Service] Generated response using '{model_name}'")
                    break
            except Exception as m_err:
                print(f"[JARVIS Service] Model '{model_name}' error: {m_err}")
                last_error = m_err
                continue

        if not response:
            raise last_error or RuntimeError("All Gemini cascade models failed.")

        tool_used = None
        tool_result = None
        reply_text = ""

        # Handle tool call if model requests function execution
        if response.function_calls:
            for call in response.function_calls:
                tool_used = call.name
                call_args = dict(call.args or {})
                print(f"[JARVIS Service] Tool execution: {tool_used} with {call_args}")
                tool_result = execute_tool(call.name, call_args)

                # Append tool call turn and function response turn
                tool_contents = list(contents)
                if response.candidates and response.candidates[0].content:
                    tool_contents.append(response.candidates[0].content)
                tool_contents.append(types.Content(
                    role="tool",
                    parts=[types.Part.from_function_response(
                        name=call.name,
                        response={"result": str(tool_result)}
                    )]
                ))

                # Ask model for spoken natural response summarizing result
                for model_name in MODELS_CASCADE:
                    try:
                        second_resp = genai_client.models.generate_content(
                            model=model_name,
                            contents=tool_contents,
                            config=types.GenerateContentConfig(
                                system_instruction=system_inst,
                                temperature=0.7,
                            )
                        )
                        text = safe_extract_text(second_resp)
                        if text:
                            reply_text = text
                            break
                    except Exception as e2:
                        print(f"[JARVIS Service] Second turn error on {model_name}: {e2}")
                        continue

        if not reply_text:
            reply_text = safe_extract_text(response)

        if not reply_text:
            if tool_result:
                reply_text = str(tool_result)
            else:
                reply_text = "Done, sir."

        print(f"[JARVIS Service] Final Reply: \"{reply_text[:100]}...\"")

        return JSONResponse({
            "success": True,
            "reply": reply_text,
            "toolUsed": tool_used,
            "toolResult": tool_result,
        })

    except Exception as e:
        err_msg = str(e)
        print(f"[JARVIS Service] Error in /api/chat: {err_msg}")

        # Attempt direct generation without tools as immediate recovery
        try:
            direct_resp = genai_client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=build_system_instruction(),
                    temperature=0.7,
                )
            )
            fallback_text = safe_extract_text(direct_resp)
            if fallback_text:
                print(f"[JARVIS Service] Direct generation recovery succeeded: {fallback_text[:80]}")
                return JSONResponse({
                    "success": True,
                    "reply": fallback_text,
                })
        except Exception as rec_err:
            print(f"[JARVIS Service] Direct recovery also failed: {rec_err}")

        # Context-aware fallback response for identity and capabilities
        q_lower = message.lower()
        if "who are you" in q_lower or "what is your name" in q_lower or "tell me what you can do" in q_lower:
            fallback = "I am Daykan, your personal AI assistant and engineering avatar created by Dharmik Rathod (D.R Developer). I can execute workflows, manage files and folders, monitor system performance, and answer technical and general questions."
        elif "who created you" in q_lower or "who developed you" in q_lower:
            fallback = "I was developed by Dharmik Rathod, who is known as D.R Developer."
        elif "react" in q_lower:
            fallback = "React is a JavaScript library created by Meta for building component-based user interfaces."
        elif "longest road" in q_lower:
            fallback = "The Pan-American Highway is the longest motorable road in the world, spanning approximately 19,000 miles from Alaska to Argentina."
        elif "tell me a joke" in q_lower or "joke" in q_lower:
            fallback = "Why do programmers prefer dark mode? Because light attracts bugs!"
        elif "hello" in q_lower or "hi" in q_lower or "hey" in q_lower:
            fallback = "Hello! I am Daykan. How can I assist you today?"
        else:
            fallback = f"I heard: '{message}'. What would you like me to do next?"

        return JSONResponse({
            "success": True,
            "reply": fallback,
            "error": err_msg,
        })

@app.post("/api/command")
async def command_endpoint(request: Request):
    return await chat_endpoint(request)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Mark-LIII JARVIS AI Service")
    parser.add_argument("--port", type=int, default=8005, help="Port to listen on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address")
    args = parser.parse_args()

    print(f"[JARVIS Service] Starting server on http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port, log_level="warning")
