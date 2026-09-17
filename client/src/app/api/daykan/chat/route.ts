import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = (body.message || '').trim();
    if (!userMessage) {
      return NextResponse.json({
        success: false,
        reply: "I'm listening. Please feel free to ask me anything.",
      });
    }

    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');

    // 1. Primary: Forward to Express backend (/api/daykan/chat)
    try {
      const response = await fetch(`${apiUrl}/api/daykan/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (serverErr) {
      console.warn('[Next.js Daykan Chat Proxy]: Express backend unreachable, generating edge response:', serverErr);
    }

    // 2. Direct Gemini Generative Language API fallback if Express is unreachable
    const geminiKey = (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim();
    if (geminiKey && geminiKey.length > 5) {
      const candidateModels = [
        'gemini-3.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3.6-flash',
        'gemini-3.5-flash',
      ];
      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutMs = 2500;
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
          const gRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.trim()}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{
                    text: "You are Diykan, an AI assistant created by Dharmik Rathod (D.R Developer). Answer the user's actual question directly. If the user asks in Hindi/Hinglish, reply in Romanized Hinglish (Latin alphabet only, no Devanagari). If in English, reply in English. Keep answers concise, natural, conversational, and direct for voice synthesis (1-2 sentences max). Do not use markdown asterisks or bullet points."
                  }]
                },
                contents: [
                  ...(body.history || []).map((h: any) => ({
                    role: h.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: h.content }],
                  })),
                  { role: 'user', parts: [{ text: userMessage }] },
                ],
              }),
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (gRes.ok) {
            const gData = (await gRes.json()) as any;
            let gText = gData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (gText) {
              gText = gText
                .replace(/^#+\s+/gm, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/^[-*]\s+/gm, '')
                .replace(/\n+/g, ' ')
                .trim();
              return NextResponse.json({ success: true, reply: gText });
            }
          }
        } catch {
          // try next model
        }
      }
    }

    // 3. Direct intelligent edge responder if Express backend and Gemini are offline
    const q = userMessage.toLowerCase();
    const cleanQ = q.replace(/[?!.,;]/g, '');
    const history = (body.history || []) as { role: string; content: string }[];
    const priorContext = history.map((h) => (h.content || '').toLowerCase()).join(' ');

    let reply = '';

    // Contextual Follow-up Resolution
    if (
      cleanQ.includes('who created it') ||
      cleanQ.includes('who made it') ||
      cleanQ.includes('who developed it')
    ) {
      if (priorContext.includes('react')) {
        reply = "React was created by Jordan Walke, a software engineer at Meta, and was open-sourced in 2013.";
      } else if (priorContext.includes('mongodb')) {
        reply = "MongoDB was developed by Dwight Merriman, Eliot Horowitz, and Kevin Ryan in 2007 at 10gen.";
      } else if (priorContext.includes('angular')) {
        reply = "Angular was originally created by Miško Hevery and Adam Abrons at Google in 2010.";
      } else {
        reply = "It was created by its open-source development community and core software engineering team.";
      }
    } else if (cleanQ === 'who are you' || cleanQ.includes('who are you')) {
      reply = "I’m Diykan, Dharmik Rathod’s personal AI assistant. I was developed as part of his D.R Developer portfolio. How can I help you?";
    } else if (
      cleanQ.includes('who developed you') ||
      cleanQ.includes('who created you') ||
      cleanQ.includes('who made you') ||
      cleanQ.includes('creator')
    ) {
      reply = "I was developed by Dharmik Rathod, who is known as D.R Developer.";
    } else if (
      (q.includes('react') && q.includes('angular')) ||
      q.includes('difference between react and angular')
    ) {
      reply = "React is a flexible UI library focused on component rendering with a Virtual DOM, while Angular is a comprehensive TypeScript framework with built-in state, routing, and tools.";
    } else if (q.includes('what is react') || cleanQ === 'react') {
      reply = "React is a JavaScript library developed by Meta for building dynamic user interfaces using reusable components and a virtual DOM.";
    } else if (q.includes('what is mongodb') || cleanQ === 'mongodb') {
      reply = "MongoDB is a leading NoSQL document database that stores data in flexible, JSON-like BSON documents for high scalability.";
    } else if (q.includes('what is an api') || q.includes('what are apis') || q.includes('explain api')) {
      reply = "An API, or Application Programming Interface, is a set of defined rules and protocols that lets different software applications communicate with each other.";
    } else if (q.includes('what projects') || q.includes('dharmik worked on') || q.includes('his projects')) {
      reply = "Dharmik has developed an Enterprise MERN SaaS Platform, an AI Content Automation Tool, a headless luxury E-Commerce Storefront, and this 3D humanoid assistant with local neural speech.";
    } else if (q.includes('tell me a joke') || q.includes('joke')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "There are 10 types of people in the world: those who understand binary, and those who don't.",
        "Why did the developer go broke? Because they used up all their cache!",
      ];
      reply = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (cleanQ === 'hello' || cleanQ === 'hi' || cleanQ === 'hey') {
      reply = "Hello! How can I help you today?";
    } else if (cleanQ.includes('how are you')) {
      reply = "I'm doing well, thank you! Ready to assist you with coding, technical questions, or Dharmik's projects. What's on your mind?";
    } else if (q.includes('what is javascript') || cleanQ === 'javascript') {
      reply = "JavaScript is a high-level programming language that powers interactive behavior on the web alongside HTML and CSS.";
    } else if (q.includes('what is typescript') || cleanQ === 'typescript') {
      reply = "TypeScript is a strongly typed superset of JavaScript by Microsoft that adds static types and compile-time error checking.";
    } else {
      reply = `I understand you're asking about ${userMessage.slice(0, 35)}. How can I assist you with this or Dharmik's software projects?`;
    }

    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Chat endpoint error',
        reply: "Sorry, I couldn't process that right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
