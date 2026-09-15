# Local NVIDIA Magpie TTS Multilingual Integration Guide

This guide details how **NVIDIA Magpie TTS Multilingual 357M** is installed, configured, and operated completely locally on Windows for the **Daykan 3D Hero** conversational AI assistant.

---

## 1. Requirements

- **Operating System**: Windows 10/11 (64-bit)
- **Processor**: x64 CPU (Intel / AMD)
- **RAM**: 8 GB minimum (16 GB recommended)
- **Storage**: ~2 GB free disk space
- **Graphics / Backend**: Intel Iris Xe Graphics, Vulkan, or CPU
- **Software Dependencies**:
  - `winget` (Windows Package Manager)
  - `git`
  - `node` (v18+)

---

## 2. Windows Installation

### Step A: Install llama.cpp via WinGet
WinGet provides the official Windows binary package:

```powershell
winget install llama.cpp --accept-source-agreements --accept-package-agreements
```

Verify the installation:
```powershell
llama --version
# or
llama-server --version
```

### Step B: Install NVIDIA NeMo-Speech.cpp (Native GGML Engine for Magpie TTS)
Magpie TTS Multilingual 357M uses the `magpietts` encoder-decoder architecture combined with NVIDIA's `NanoCodec` vocoder (`nvidia/nemo-nano-codec-22khz-1.89kbps-21.5fps`). 

NVIDIA's official native runtime, **NeMo-Speech.cpp** (built directly on `ggml` and `llama.cpp`), runs natively on Windows with Vulkan and CPU support.

Binaries are located at:
`%LOCALAPPDATA%\Programs\NeMoSpeech\bin\nemo-speech.exe`

Ensure the binary folder is added to your user `PATH`:
```powershell
$nemoPath = "$env:LOCALAPPDATA\Programs\NeMoSpeech\bin"
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$nemoPath*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$nemoPath;$userPath", "User")
}
```

Verify:
```cmd
nemo-speech doctor
```

---

## 3. Model Download

Download the official model stack (`nvidia/magpie_tts_multilingual_357m` + `nvidia/nemo-nano-codec-22khz-1.89kbps-21.5fps`):

```cmd
nemo-speech pull magpie
```

The model weights, tokenizer, and codec decoder will be downloaded and SHA-256 verified into:
`%LOCALAPPDATA%\NeMoSpeech\models\`

*(Files are kept safely outside Git, node_modules, and source directories).*

---

## 4. Starting the Local Magpie TTS Server

Start the local speech HTTP server on port `8012`:

```cmd
# Using npm script:
npm run tts:start

# Or directly with CLI:
nemo-speech serve --tts-model magpie --port 8012 --host 127.0.0.1 --no-ui
```

Check server readiness:
```cmd
nemo-speech health --url http://127.0.0.1:8012/ready
```
Output:
```json
{"capabilities":["tts"],"device":"auto","ready":true}
```

---

## 5. Testing English Speech Generation

Run a test synthesis directly:

```cmd
npm run tts:test
```
Or with CLI:
```cmd
nemo-speech synthesize -o magpie-test.wav --language en-US --force "Hello, I am Daykan. This is a local Magpie TTS test."
```

Generated audio file: `magpie-test.wav` (22,050 Hz 16-bit PCM WAV).

---

## 6. Testing Hindi Speech Generation

Run a Hindi test synthesis:

```cmd
npm run tts:hindi
```
Or with CLI:
```cmd
nemo-speech synthesize -o magpie-hindi-test.wav --language hi-IN --force "नमस्ते, मैं Daykan हूँ। मैं आपकी कैसे मदद कर सकती हूँ?"
```

Generated audio file: `magpie-hindi-test.wav`.

---

## 7. Local HTTP Endpoint & API Format

The local server provides an OpenAI-compatible speech synthesis endpoint:

- **URL**: `http://127.0.0.1:8012/v1/audio/speech`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "model": "magpie",
  "input": "Your text to synthesize here",
  "voice": "Aria",
  "language": "en-US"
}
```
- **Response**: Binary WAV audio (`audio/wav`)

---

## 8. Environment Variables

### In `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000

# Daykan Conversational AI
GPT_OSS_ENDPOINT=https://integrate.api.nvidia.com/v1
GPT_OSS_API_KEY=your_key_here
GPT_OSS_MODEL=gpt-oss-20b

# Local Daykan Magpie TTS Multilingual (Zero API key required)
MAGPIE_TTS_BASE_URL=http://127.0.0.1:8012
MAGPIE_TTS_VOICE=Aria
```

### In `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
MAGPIE_TTS_BASE_URL=http://127.0.0.1:8012
```

> [!IMPORTANT]
> **No API Key is required for local TTS**. Do NOT commit any private cloud API keys to frontend code, `.env.local`, or version control.

---

## 9. Starting the Website & Daykan Assistant

Open two terminals:

**Terminal 1 — Local Magpie TTS Server:**
```cmd
npm run tts:start
```

**Terminal 2 — Website & Frontend:**
```cmd
cd client
npm run dev
```

Visit `http://localhost:3000` in your browser. Click **Say "Hello"** or click the microphone to converse with Daykan.

---

## 10. How to Stop the Magpie Server

- If running in a console window, press `Ctrl + C`.
- Or from PowerShell:
```powershell
Stop-Process -Name nemo-speech -Force -ErrorAction SilentlyContinue
```

---

## 11. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `nemo-speech: command not found` | PATH variable not reloaded | Add `%LOCALAPPDATA%\Programs\NeMoSpeech\bin` to User PATH and restart terminal. |
| `health: not ready` | Server still initializing | Wait 3-5 seconds after launching `nemo-speech serve`. |
| Port 8012 already in use | Previous instance running | Run `Get-NetTCPConnection -LocalPort 8012` and kill the old process. |
| Fallback speech used | Local server offline | Ensure `npm run tts:start` is running on `http://127.0.0.1:8012`. |
