import dotenv from 'dotenv';
import { kokoroTTSService, generateDaykanSpeech } from './tts.service';

dotenv.config();

export interface VisemeTimestamp {
  viseme: string;
  start: number;
  end: number;
}

export interface DaykanTTSResponse {
  audioBuffer: Buffer;
  contentType: string;
  sampleRate?: number;
  visemes?: VisemeTimestamp[];
}

export interface SpeechOptions {
  language?: string;
  voice?: string;
  speed?: number;
}

export interface IDaykanTTSService {
  generateSpeech(text: string, options?: SpeechOptions): Promise<DaykanTTSResponse | null>;
}

/**
 * Primary Daykan Local TTS Service
 * Prioritizes local Kokoro-82M on CPU, with graceful fallbacks.
 */
export class DaykanUnifiedTTSService implements IDaykanTTSService {
  private magpieBaseUrl: string;
  private magpieDefaultVoice: string;

  constructor() {
    this.magpieBaseUrl = (
      process.env.MAGPIE_TTS_BASE_URL ||
      process.env.MAGPIE_TTS_ENDPOINT ||
      'http://127.0.0.1:8012'
    ).replace(/\/$/, '');
    this.magpieDefaultVoice = process.env.MAGPIE_TTS_VOICE || 'Aria';
  }

  public async generateSpeech(text: string, options?: SpeechOptions): Promise<DaykanTTSResponse | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;

    // 1. First priority: Local Kokoro-82M TTS engine
    try {
      const kokoroResult = await kokoroTTSService.generateSpeech(trimmed, {
        voice: options?.voice,
        speed: options?.speed,
        language: options?.language,
      });

      if (kokoroResult && kokoroResult.audioBuffer && kokoroResult.audioBuffer.length > 0) {
        return {
          audioBuffer: kokoroResult.audioBuffer,
          contentType: kokoroResult.contentType || 'audio/wav',
          sampleRate: kokoroResult.sampleRate || 24000,
        };
      }
    } catch (err: any) {
      console.warn('[Daykan TTS] Kokoro attempt failed, checking fallback:', err?.message || err);
    }

    // 2. Secondary fallback: Local Magpie TTS if active
    if (this.magpieBaseUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${this.magpieBaseUrl}/v1/audio/speech`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'magpie',
            input: trimmed,
            voice: options?.voice || this.magpieDefaultVoice,
            ...(options?.language ? { language: options.language } : {}),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = response.headers.get('content-type') || 'audio/wav';

          let visemes: VisemeTimestamp[] | undefined;
          const visemeHeader = response.headers.get('x-daykan-visemes');
          if (visemeHeader) {
            try {
              visemes = JSON.parse(visemeHeader);
            } catch {
              // ignore
            }
          }

          return {
            audioBuffer: buffer,
            contentType,
            visemes,
          };
        }
      } catch {
        // Magpie is offline, fallback gracefully
      }
    }

    return null;
  }
}

export const daykanTTSService = new DaykanUnifiedTTSService();
export { generateDaykanSpeech, kokoroTTSService };
