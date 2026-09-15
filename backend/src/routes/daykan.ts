import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { daykanAIService } from '../services/daykanAI';
import { daykanTTSService } from '../services/daykanTTS';

const router = Router();

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .optional(),
});

const TTSRequestSchema = z.object({
  text: z.string().min(1).max(2000),
  language: z.string().optional(),
  voice: z.string().optional(),
});

/**
 * POST /api/daykan/chat
 * GPT-OSS-20B conversational brain endpoint
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const parseResult = ChatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message payload',
        details: parseResult.error.format(),
      });
    }

    const { message, history } = parseResult.data;
    console.log(`[Daykan-Chat] User message: "${message.substring(0, 80)}"`);

    const result = await daykanAIService.generateResponse(message, history);

    return res.status(200).json({
      success: true,
      reply: result.reply,
      tokensUsed: result.tokensUsed,
    });
  } catch (error: any) {
    console.error('[Daykan-Chat Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process AI conversation response',
      reply: "Sorry, I couldn't process that right now. Please try again.",
    });
  }
});

/**
 * POST /api/daykan/tts
 * Local Magpie TTS Multilingual voice generation endpoint
 */
router.post('/tts', async (req: Request, res: Response) => {
  try {
    const parseResult = TTSRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid TTS payload',
        details: parseResult.error.format(),
      });
    }

    const { text, language, voice } = parseResult.data;
    console.log(`[Daykan-TTS] Generating local Kokoro speech for: "${text.substring(0, 60)}..." (voice: ${voice || 'default'})`);

    const ttsResult = await daykanTTSService.generateSpeech(text, { language, voice });

    if (ttsResult && ttsResult.audioBuffer && ttsResult.audioBuffer.length > 0) {
      res.setHeader('Content-Type', ttsResult.contentType);
      res.setHeader('Content-Length', ttsResult.audioBuffer.length);
      res.setHeader('X-Daykan-Text', encodeURIComponent(text));
      if (ttsResult.sampleRate) {
        res.setHeader('X-Sample-Rate', ttsResult.sampleRate.toString());
      }
      if (ttsResult.visemes) {
        res.setHeader('X-Daykan-Visemes', JSON.stringify(ttsResult.visemes));
      }
      return res.status(200).send(ttsResult.audioBuffer);
    }

    // Endpoint not configured or unavailable: signal graceful fallback to client
    return res.status(200).json({
      success: false,
      fallback: true,
      message: 'Local Kokoro TTS endpoint not configured or offline; using browser synthesis fallback.',
    });
  } catch (error: any) {
    console.error('[Daykan-TTS Error]:', error);
    return res.status(500).json({
      success: false,
      fallback: true,
      error: 'TTS generation failed',
    });
  }
});

export default router;
