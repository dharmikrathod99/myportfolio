import os
import sys
import json
import io
import argparse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import numpy as np
import soundfile as sf
import torch

# Ensure UTF-8 and unbuffered output on Windows (prevents IPA phoneme encoding crashes)
os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["PYTHONUTF8"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

from kokoro import KPipeline

DEFAULT_PORT = int(os.environ.get("PORT", os.environ.get("KOKORO_PORT", 8880)))
DEFAULT_HOST = os.environ.get("KOKORO_HOST", os.environ.get("HOST", "0.0.0.0"))
DEFAULT_VOICE = os.environ.get("KOKORO_VOICE", "af_heart")
DEFAULT_LANG = os.environ.get("KOKORO_LANG", "a") # 'a' = American English

# Global pipeline instance loaded ONCE at startup
pipeline = None
default_voice_pack = None

class KokoroHTTPServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        exc_type, exc_val, _ = sys.exc_info()
        if exc_type in (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            return
        try:
            print(f"[Kokoro Server] Request error from {client_address}: {exc_val}", flush=True)
        except Exception:
            pass

class KokoroRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Clean server logging
        print(f"[Kokoro Server] {self.address_string()} - {format % args}", flush=True)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        if self.path in ('/health', '/ready', '/'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            status_data = {
                "status": "ready",
                "model": "Kokoro-82M",
                "sample_rate": 24000,
                "default_voice": DEFAULT_VOICE,
                "device": "cpu"
            }
            self.wfile.write(json.dumps(status_data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        # Support both POST /tts and POST /v1/audio/speech
        if self.path not in ('/tts', '/v1/audio/speech'):
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error": "Empty request body"}')
            return

        try:
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Invalid JSON: {str(e)}"}).encode('utf-8'))
            return

        text = data.get('text') or data.get('input') or ''
        text = text.strip()
        if not text:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"error": "text or input field is required and cannot be empty"}')
            return

        voice = data.get('voice') or DEFAULT_VOICE
        speed = float(data.get('speed', 1.0))

        try:
            # Generate audio in memory (model loaded once at server startup)
            print(f"[Kokoro Server] Synthesizing: \"{text[:45]}...\" (voice: {voice}, speed: {speed})", flush=True)
            generator = pipeline(text, voice=voice, speed=speed, split_pattern=r'\n+')
            audio_chunks = []
            sample_rate = 24000

            for item in generator:
                audio = None
                if hasattr(item, 'audio') and item.audio is not None:
                    audio = item.audio
                elif isinstance(item, (tuple, list)) and len(item) >= 3:
                    audio = item[2]
                elif hasattr(item, 'output') and item.output is not None:
                    audio = getattr(item.output, 'audio', item.output)

                if audio is not None and len(audio) > 0:
                    audio_chunks.append(audio)

            if not audio_chunks:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "No audio was generated by Kokoro model"}')
                return

            full_audio = np.concatenate(audio_chunks)

            # In-memory WAV encoding
            wav_io = io.BytesIO()
            sf.write(wav_io, full_audio, sample_rate, format='WAV', subtype='PCM_16')
            wav_bytes = wav_io.getvalue()

            self.send_response(200)
            self.send_header('Content-Type', 'audio/wav')
            self.send_header('Content-Length', str(len(wav_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('X-Sample-Rate', str(sample_rate))
            self.send_header('X-Duration-Seconds', f"{len(full_audio) / sample_rate:.2f}")
            self.end_headers()
            self.wfile.write(wav_bytes)

        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            print("[Kokoro Server] Client disconnected before audio could be delivered", flush=True)
            return
        except Exception as e:
            print(f"[Kokoro Server Error] Inference failed: {e}", flush=True)
            try:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"TTS synthesis failed: {str(e)}"}).encode('utf-8'))
            except Exception:
                pass

def main():
    global pipeline
    parser = argparse.ArgumentParser(description="Kokoro-82M Local TTS Server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port to listen on")
    parser.add_argument("--host", type=str, default=DEFAULT_HOST, help="Host address to bind to")
    parser.add_argument("--voice", type=str, default=DEFAULT_VOICE, help="Default voice")
    args = parser.parse_args()

    print("=" * 60)
    print(" [Kokoro-82M] Initializing Local Neural TTS Service...")
    print(f" Target Device: CPU (Intel Iris Xe friendly)")
    print(f" Default Voice: {args.voice}")
    print("=" * 60)

    # Optimize PyTorch CPU memory footprint
    try:
        torch.set_num_threads(1)
    except Exception:
        pass

    # Load model into memory before accepting connections
    print("[Kokoro-82M] Loading model into memory...", flush=True)
    pipeline = KPipeline(lang_code=DEFAULT_LANG, repo_id='hexgrad/Kokoro-82M')
    print("[Kokoro-82M] Pre-warming voice pack...", flush=True)
    pipeline.load_voice(args.voice)
    print("[Kokoro-82M] Model ready and cached in RAM.", flush=True)
    print("=" * 60, flush=True)

    server_address = (args.host, args.port)
    httpd = KokoroHTTPServer(server_address, KokoroRequestHandler)
    print(f"[Kokoro-82M] HTTP Server bound on http://{args.host}:{args.port}", flush=True)
    print(f"  - Health Endpoint:  GET  http://{args.host}:{args.port}/health", flush=True)
    print(f"  - Speech Synthesis: POST http://{args.host}:{args.port}/tts", flush=True)
    print("=" * 60, flush=True)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Kokoro-82M] Shutting down server...", flush=True)
        httpd.shutdown()
        print("[Kokoro-82M] Server stopped.", flush=True)
    except Exception as e:
        print(f"\n[Kokoro-82M Fatal] Server error: {e}", flush=True)
        httpd.shutdown()

if __name__ == '__main__':
    main()
