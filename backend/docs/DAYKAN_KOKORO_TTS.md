# Daykan AI — Local Kokoro-82M Text-to-Speech Integration

This document describes the architecture, setup, commands, and operation for running **Kokoro-82M** as the dedicated **local** Text-To-Speech (TTS) engine for the Daykan AI humanoid assistant.

---

## 1. System Architecture

```
User Speaks (Microphone)
         ↓
Web Speech Recognition (Browser STT)
         ↓
Node Express Backend (/api/daykan/chat)
         ↓
Conversational Brain (GPT-OSS-20B / Portfolio Context)
         ↓
Node TTS Abstraction (services/tts.service.js / server/src/services/daykanTTS.ts)
         ↓
Local Python Kokoro Server (http://127.0.0.1:8880/tts)
         ↓
Kokoro-82M PyTorch Model (CPU-compatible inference, single model instance in RAM)
         ↓
Raw 24,000 Hz Linear PCM WAV Audio
         ↓
Browser Web Audio API (AudioContext + AnalyserNode)
         ↓
Live Audio Formant & Amplitude Extraction (Live RMS + Low/Mid Formants)
         ↓
Daykan Facial Morph Targets (Visemes 116, 110/111, 80/81, 115, 114, 50/51)
         ↓
Natural Speaking Daykan Avatar → Speech Completion → Return to Listening
```

---

## 2. Environment Configuration

### Server Environment (`server/.env`)
```env
# Local Kokoro-82M TTS Server
KOKORO_TTS_URL=http://127.0.0.1:8880
KOKORO_TTS_VOICE=af_heart
KOKORO_TTS_SPEED=1.0

# Optional fallback endpoints
MAGPIE_TTS_BASE_URL=http://127.0.0.1:8012
MAGPIE_TTS_VOICE=Aria
```

### Client Environment (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
KOKORO_TTS_URL=http://127.0.0.1:8880
```

---

## 3. Dedicated Python Environment

Because modern Windows systems may run Python 3.14 (where PyTorch and C-extensions are not yet compiled), Kokoro-82M runs in an isolated Python 3.11 virtual environment under `ai/kokoro/venv`. The system Python installation remains completely untouched.

### Core Packages Installed
- `kokoro==0.9.4`
- `torch==2.14.0+cpu` (Intel CPU optimized, no CUDA required)
- `soundfile==0.14.0`
- `misaki==0.9.4`
- `espeakng-loader==0.2.4`
- `spacy==3.8.11` + `en_core_web_sm==3.8.0`

---

## 4. Operational Commands

### Start Kokoro-82M Local TTS Server
From workspace root:
```bash
npm run kokoro:start
```
*(Direct path: `ai\kokoro\venv\Scripts\python.exe ai/kokoro/server.py --port 8880`)*

### Run Standalone Kokoro Speech Test
```bash
npm run kokoro:test
```
*(Direct path: `ai\kokoro\venv\Scripts\python.exe ai/kokoro/test_tts.py`)*
Generates: `ai/kokoro/output/test.wav`

### Start Full Project
1. **Kokoro TTS Server**: `npm run kokoro:start` (Port 8880)
2. **Backend Server**: `npm run dev:server` (Port 5000)
3. **Frontend Client**: `npm run dev:client` (Port 3000)

---

## 5. CPU Performance & Optimization Details

- **Hardware Profile**: Intel Core i5 11th Gen with Intel Iris Xe Graphics (CPU inference).
- **Persistent Model In Memory**: Kokoro-82M model weights (~320MB) and phonemizer pipeline are loaded **once** at server startup. Zero model reload per request.
- **In-Memory Streaming**: Audio generation is synthesized directly into an in-memory `io.BytesIO` buffer; no temporary file writes to disk are performed during live speech requests.
- **Sample Rate**: Kokoro outputs native 24 kHz audio (`X-Sample-Rate: 24000`), decoded directly by the browser's Web Audio API.
- **Latency**: CPU inference time for conversational replies (~10–20 words) averages **0.8 to 1.8 seconds**, providing near real-time conversational fluidity.
