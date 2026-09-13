/**
 * services/tts.service.js
 * Node.js wrapper for Local Kokoro-82M Text-To-Speech engine.
 *
 * Provides the clean abstraction:
 * generateDaykanSpeech(text, options)
 */

const dotenv = require('dotenv');
dotenv.config();

const KOKORO_TTS_URL = (
  process.env.KOKORO_TTS_URL ||
  process.env.TTS_BASE_URL ||
  'http://127.0.0.1:8880'
).replace(/\/$/, '');

const DEFAULT_VOICE = process.env.KOKORO_TTS_VOICE || 'af_heart';
const DEFAULT_SPEED = parseFloat(process.env.KOKORO_TTS_SPEED || '1.0') || 1.0;

/**
 * Generates Daykan speech WAV audio using the local Kokoro-82M service.
 * @param {string} text - Text to synthesize.
 * @param {object} [options] - Optional overrides (voice, speed).
 * @returns {Promise<{audioBuffer: Buffer, contentType: string, sampleRate: number}|null>}
 */
async function generateDaykanSpeech(text, options = {}) {
  const trimmed = (text || '').trim();
  if (!trimmed) return null;

  const endpoint = `${KOKORO_TTS_URL}/tts`;
  const voice = options.voice || DEFAULT_VOICE;
  const speed = options.speed || DEFAULT_SPEED;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: trimmed,
        voice,
        speed,
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
      console.warn(`[Kokoro TTS] Local service error (${response.status}):`, errText);
    }
  } catch (err) {
    console.warn(`[Kokoro TTS] Request failed to ${endpoint}:`, err.message || err);
  }

  return null;
}

module.exports = {
  generateDaykanSpeech,
  KOKORO_TTS_URL,
};
