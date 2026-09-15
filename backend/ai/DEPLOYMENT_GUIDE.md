# Daykan AI (Kokoro TTS) Cloud Deployment Guide

This guide walks you through deploying the Daykan Python AI voice service and connecting all 3 parts of your architecture:
1. **Frontend (Next.js)** $\rightarrow$ Deployed on **Vercel**
2. **Backend (Node.js/Express)** $\rightarrow$ Deployed on **Render**
3. **AI Service (Kokoro TTS)** $\rightarrow$ Deployed on **Hugging Face Spaces** (100% Free 16GB RAM) OR **Render** (Docker Web Service)

---

## Architecture Flow

```
┌───────────────────────────────────────────────┐
│              FRONTEND (Vercel)                │
│       https://your-portfolio.vercel.app       │
└───────────────────────┬───────────────────────┘
                        │
                        │ NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
                        ▼
┌───────────────────────────────────────────────┐
│               BACKEND (Render)                │
│       https://your-backend.onrender.com       │
└───────────────────────┬───────────────────────┘
                        │
                        │ KOKORO_TTS_URL = https://your-ai.hf.space (or onrender.com)
                        ▼
┌───────────────────────────────────────────────┐
│              AI SERVICE (Kokoro)              │
│       https://your-ai.hf.space                │
└───────────────────────────────────────────────┘
```

---

## Option A (Recommended & 100% Free): Hugging Face Spaces (Docker)
*Hugging Face Spaces offers a generous 2 vCPU + 16 GB RAM tier for free, which runs Kokoro-82M fast and smoothly without RAM limits.*

1. Create a free account at [huggingface.co](https://huggingface.co).
2. Click **New Space** $\rightarrow$ select **Docker** as the SDK $\rightarrow$ set Space Hardware to **Free (2 vCPU, 16GB RAM)**.
3. Push or upload the files from `ai/kokoro/`:
   - `Dockerfile`
   - `requirements.txt`
   - `server.py`
4. Hugging Face builds the Docker container automatically.
5. In your Space **Settings**, get the **Direct Space URL** (e.g. `https://<username>-<space-name>.hf.space`).

---

## Option B: Render (Web Service via Docker)
*If you prefer having both backend and AI in one Render dashboard.*

1. In your [Render Dashboard](https://dashboard.render.com), click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `ai/kokoro`
   - **Runtime**: `Docker`
   - **Instance Type**: Starter ($7/mo recommended for PyTorch models) or Free tier.
4. Render will build using the `Dockerfile` and assign an HTTPS URL (e.g., `https://daykan-ai-tts.onrender.com`).

---

## How to Connect Everything Together

### Step 1: Set Backend (Render) Environment Variables
In your Express backend service on Render, add:
- `KOKORO_TTS_URL`: The URL of your deployed AI service (e.g., `https://your-ai.hf.space` or `https://daykan-ai-tts.onrender.com`)
- `CLIENT_ORIGIN`: Your Vercel domain (e.g., `https://your-portfolio.vercel.app`)

### Step 2: Set Frontend (Vercel) Environment Variables
In your Vercel Project Settings $\rightarrow$ Environment Variables, add:
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com`)
