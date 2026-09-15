import dotenv from 'dotenv';

dotenv.config();

export interface VisemeTimestamp {
  viseme: string;
  start: number;
  end: number;
}

export interface DaykanTTSResult {
  audioBuffer: Buffer;
  contentType: string;
  sampleRate?: number;
  visemes?: VisemeTimestamp[];
}

export interface DaykanSpeechOptions {
  voice?: string;
  speed?: number;
  language?: string;
}

/**
 * Local Kokoro-82M Text-To-Speech Service
 * Communicates with the lightweight local Python Kokoro server running on CPU.
 */
export class KokoroTTSService {
  private baseUrl: string;
  private defaultVoice: string;
  private defaultSpeed: number;

  constructor() {
    this.baseUrl = (
      process.env.KOKORO_TTS_URL ||
      process.env.TTS_BASE_URL ||
      'http://127.0.0.1:8880'
    ).replace(/\/$/, '');
    this.defaultVoice = process.env.KOKORO_TTS_VOICE || 'af_heart';
    this.defaultSpeed = parseFloat(process.env.KOKORO_TTS_SPEED || '1.0') || 1.0;
  }

  /**
   * Generates high-quality 24kHz speech WAV audio from text using local Kokoro-82M.
   */
  public async generateSpeech(text: string, options?: DaykanSpeechOptions): Promise<DaykanTTSResult | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const endpoint = `${this.baseUrl}/tts`;
    const selectedVoice = options?.voice || this.defaultVoice;
    const selectedSpeed = options?.speed || this.defaultSpeed;

    try {
      const controller = new AbortController();
      // Kokoro CPU generation is typically ~1-2s for a sentence; 25s timeout allows longer paragraphs on CPU
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmed,
          voice: selectedVoice,
          speed: selectedSpeed,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'audio/wav';
        const sampleRate = parseInt(response.headers.get('x-sample-rate') || '24000', 10);

        return {
          audioBuffer: buffer,
          contentType,
          sampleRate,
        };
      } else {
        const errText = await response.text().catch(() => '');
        console.warn(`[Kokoro TTS] Local server returned status ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      console.warn(`[Kokoro TTS] Local service unreachable at ${endpoint}:`, err?.message || err);
    }

    return null;
  }
}

export const kokoroTTSService = new KokoroTTSService();

/**
 * Primary Daykan Speech Abstraction:
 * Generates speech for Daykan without callers needing to know internal engine details.
 */
export async function generateDaykanSpeech(
  text: string,
  options?: DaykanSpeechOptions
): Promise<DaykanTTSResult | null> {
  return kokoroTTSService.generateSpeech(text, options);
}

export default {
  KokoroTTSService,
  kokoroTTSService,
  generateDaykanSpeech,
};
