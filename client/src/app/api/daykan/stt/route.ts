import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    let base64Audio = '';
    let mimeType = 'audio/webm';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('audio') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: 'No audio file provided' }, { status: 400 });
      }
      mimeType = file.type || 'audio/webm';
      const buffer = Buffer.from(await file.arrayBuffer());
      base64Audio = buffer.toString('base64');
    } else {
      const body = await req.json();
      base64Audio = body.audio || '';
      if (body.mimeType) mimeType = body.mimeType;
    }

    if (!base64Audio) {
      return NextResponse.json({ success: false, error: 'Empty audio content' }, { status: 400 });
    }

    const cleanMimeType = mimeType.split(';')[0].trim() || 'audio/webm';

    // Model fallback chain: gemini-flash-latest has highest availability and quota
    const candidateModels = [
      'gemini-flash-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
    ];

    if (geminiKey) {
      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.trim()}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        inline_data: {
                          mime_type: cleanMimeType,
                          data: base64Audio,
                        },
                      },
                      {
                        text: 'Transcribe the user audio verbatim. If in Hindi, write in Hindi or Romanized Hindi as spoken. If in English, write in English. Return ONLY the transcribed text without any extra commentary, quotation marks, or punctuation preface. If the audio contains only background noise, silence, or is unintelligible, reply with empty string.',
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 150,
                },
              }),
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = (await res.json()) as any;
            let text = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
            // Strip any surrounding quotes or markdown
            text = text.replace(/^["']|["']$/g, '').trim();
            return NextResponse.json({ success: true, text });
          } else {
            const errText = await res.text().catch(() => '');
            console.warn(`[Daykan STT Model ${model} HTTP ${res.status}]:`, errText.slice(0, 150));
          }
        } catch (mErr: any) {
          console.warn(`[Daykan STT Model ${model} Error]:`, mErr?.message || mErr);
        }
      }
    }

    return NextResponse.json({ success: false, error: 'Transcription unavailable' }, { status: 500 });
  } catch (err: any) {
    console.error('[Daykan STT Endpoint Error]:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
