import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');

    // 1. Primary route: Node/Express backend (/api/daykan/tts)
    try {
      const response = await fetch(`${apiUrl}/api/daykan/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('audio')) {
        const audioBuffer = await response.arrayBuffer();
        const headers: Record<string, string> = {
          'Content-Type': contentType,
          'Content-Length': audioBuffer.byteLength.toString(),
        };

        const sampleRate = response.headers.get('x-sample-rate');
        if (sampleRate) headers['x-sample-rate'] = sampleRate;

        const visemes = response.headers.get('x-daykan-visemes');
        if (visemes) headers['x-daykan-visemes'] = visemes;

        return new NextResponse(audioBuffer, { status: 200, headers });
      }

      if (response.ok) {
        const json = await response.json();
        return NextResponse.json(json);
      }
    } catch (serverErr) {
      console.warn('[Next.js Daykan TTS Proxy]: Express backend unreachable, checking local Kokoro TTS directly:', serverErr);
    }

    // 2. Direct proxy to local Kokoro-82M server if Express is offline
    const localKokoroUrl = (process.env.KOKORO_TTS_URL || 'http://127.0.0.1:8880').replace(/\/$/, '');
    try {
      const kokoroRes = await fetch(`${localKokoroUrl}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: body.text,
          voice: body.voice || 'af_heart',
          speed: body.speed || 1.0,
        }),
      });

      if (kokoroRes.ok) {
        const audioBuffer = await kokoroRes.arrayBuffer();
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/wav',
            'Content-Length': audioBuffer.byteLength.toString(),
            'X-Sample-Rate': '24000',
          },
        });
      }
    } catch (kokoroErr) {
      console.warn('[Next.js Daykan TTS Direct]: Local Kokoro server unreachable:', kokoroErr);
    }

    // 3. Fallback to Magpie if configured
    const localMagpieUrl = (process.env.MAGPIE_TTS_BASE_URL || '').replace(/\/$/, '');
    if (localMagpieUrl) {
      try {
        const magpieRes = await fetch(`${localMagpieUrl}/v1/audio/speech`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'magpie',
            input: body.text,
            voice: body.voice || 'Aria',
            ...(body.language ? { language: body.language } : {}),
          }),
        });

        if (magpieRes.ok) {
          const audioBuffer = await magpieRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/wav',
              'Content-Length': audioBuffer.byteLength.toString(),
            },
          });
        }
      } catch (magpieErr) {
        // ignore
      }
    }

    return NextResponse.json({
      success: false,
      fallback: true,
      message: 'TTS backend offline; client will use high-fidelity synthesis fallback.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, fallback: true, error: 'TTS endpoint error' },
      { status: 500 }
    );
  }
}
