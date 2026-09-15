import path from 'path';
import fs from 'fs';
import { spawn, ChildProcess } from 'child_process';

let kokoroProcess: ChildProcess | null = null;

/**
 * Checks if Kokoro TTS server is already answering on http://127.0.0.1:8880/health
 */
async function isKokoroRunning(port: number = 8880): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`http://127.0.0.1:${port}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Automatically ensures the local Kokoro Python server is running.
 * If not already running, spawns it in the background using the project virtualenv.
 */
export async function ensureKokoroServerRunning(port: number = 8880): Promise<void> {
  const isRunning = await isKokoroRunning(port);
  if (isRunning) {
    console.log(`🎙️  [Kokoro TTS] Active server detected on port ${port}. Ready for speech.`);
    return;
  }

  // Resolve backend root (from dist or src)
  const backendDir = path.resolve(__dirname, '../../');
  const pyWin = path.join(backendDir, 'ai', 'kokoro', 'venv', 'Scripts', 'python.exe');
  const pyUnix = path.join(backendDir, 'ai', 'kokoro', 'venv', 'bin', 'python');
  const pythonPath = fs.existsSync(pyWin) ? pyWin : (fs.existsSync(pyUnix) ? pyUnix : null);
  const serverScript = path.join(backendDir, 'ai', 'kokoro', 'server.py');
  const kokoroDir = path.join(backendDir, 'ai', 'kokoro');

  if (!pythonPath || !fs.existsSync(serverScript)) {
    console.warn('⚠️  [Kokoro TTS] Local Python environment not found. Speech fallback to browser synthesis.');
    return;
  }

  console.log(`🚀 [Kokoro TTS] Auto-starting Kokoro-82M server on port ${port}...`);

  try {
    kokoroProcess = spawn(pythonPath, [serverScript, '--port', String(port)], {
      cwd: kokoroDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    kokoroProcess.stdout?.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg) {
        console.log(`[Kokoro TTS Engine] ${msg}`);
      }
    });

    kokoroProcess.stderr?.on('data', (data) => {
      const errStr = data.toString().trim();
      // Only log if not just standard uvicorn info
      if (errStr && !errStr.includes('INFO:')) {
        console.warn(`[Kokoro TTS Engine] ${errStr}`);
      }
    });

    kokoroProcess.on('exit', (code, signal) => {
      if (code !== 0 && code !== null) {
        console.warn(`[Kokoro TTS] Process exited with code ${code}, signal: ${signal}`);
      }
      kokoroProcess = null;
    });

    const cleanup = () => {
      if (kokoroProcess && !kokoroProcess.killed) {
        try {
          console.log('[Kokoro TTS] Shutting down child process...');
          kokoroProcess.kill();
        } catch {
          // Ignore error during cleanup
        }
      }
    };

    process.on('exit', cleanup);
    process.on('SIGINT', () => {
      cleanup();
      process.exit();
    });
    process.on('SIGTERM', () => {
      cleanup();
      process.exit();
    });

    console.log(`🎙️  [Kokoro TTS] Process spawned successfully. Auto-connecting...`);
  } catch (err: any) {
    console.warn('⚠️  [Kokoro TTS] Failed to auto-launch Kokoro process:', err?.message || err);
  }
}
