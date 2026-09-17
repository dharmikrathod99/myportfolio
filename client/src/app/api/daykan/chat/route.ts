import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function isHindiQuery(text: string): boolean {
  if (!text) return false;
  // 1. Devanagari Unicode script range (U+0900 to U+097F)
  if (/[\u0900-\u097F]/.test(text)) return true;

  const lower = text.toLowerCase();

  // 2. Explicit request for Hindi/Hinglish
  if (/\b(hindi|hinglish)\b/.test(lower)) return true;

  // 3. Common Romanized Hindi phrases
  const hindiPhrases = [
    'kaise ho', 'kya haal', 'kya hal', 'tum kaun', 'aap kaun', 'koun ho', 'kaun ho',
    'kya chal raha', 'kya kar', 'kaise hai', 'kaise hain', 'batao', 'bataye',
    'chutkula sunao', 'joke sunao', 'namaste', 'namaskar', 'pranam',
    'dharmik kaun', 'kisne banaya', 'kisne banayi', 'kya hai', 'kya hota',
    'madad chahiye', 'shukriya', 'dhanyawad', 'theek ho', 'thik ho', 'samjhao'
  ];
  if (hindiPhrases.some((phrase) => lower.includes(phrase))) return true;

  // 4. Romanized Hindi words and verbs frequency scoring
  const hindiKeywords = new Set([
    'kya', 'kyu', 'kyun', 'kaun', 'koun', 'kahan', 'kaha', 'kaise', 'kaisa', 'kaisi',
    'kab', 'kitna', 'kitne', 'kitni', 'hai', 'hain', 'ho', 'hoon', 'hun', 'tha', 'thi', 'the',
    'aap', 'aapka', 'aapki', 'aapke', 'tum', 'tumhara', 'tumhari', 'tumhare',
    'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'hum', 'hamara', 'mujhe', 'tujhe',
    'banao', 'karo', 'karna', 'kholo', 'chalu', 'band', 'bolo', 'sunao', 'suno', 'dekho',
    'accha', 'achha', 'theek', 'thik', 'bahut', 'bohot', 'kuch', 'nahi', 'nahin', 'bhai',
    'chahiye', 'sakta', 'sakti', 'sakte', 'hoga', 'hogi', 'hoge', 'kaam', 'baare'
  ]);

  const words = lower.split(/[^a-zA-Z]+/).filter(Boolean);
  let matchCount = 0;
  for (const w of words) {
    if (hindiKeywords.has(w)) matchCount++;
  }
  return matchCount >= 2 || (words.length <= 3 && matchCount >= 1);
}

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

    const isHindi = isHindiQuery(userMessage);
    const q = userMessage.toLowerCase();
    const cleanQ = q.replace(/[?!.,;]/g, '');
    const history = (body.history || []) as { role: string; content: string }[];
    const priorContext = history.map((h) => (h.content || '').toLowerCase()).join(' ');

    // 1. Fast-Path Intelligent Edge Responder (Instant <5ms response with human feelings)
    let instantReply = '';
    if (isHindi) {
      if (
        cleanQ === 'tum kaun ho' ||
        cleanQ.includes('tum kaun') ||
        cleanQ.includes('aap kaun') ||
        cleanQ.includes('who are you') ||
        cleanQ.includes('koun ho')
      ) {
        instantReply = "नमस्ते दोस्त! मैं दीकन (Diykan) हूँ, धार्मिक राठौड़ का पर्सनल AI साथी। मुझे आपसे बात करने और आपके सवालों को हल करने में बहुत खुशी होती है!";
      } else if (
        cleanQ.includes('kisne banaya') ||
        cleanQ.includes('tumhe kisne') ||
        cleanQ.includes('who created you') ||
        cleanQ.includes('creator') ||
        cleanQ.includes('dharmik kaun')
      ) {
        instantReply = "मुझे बहुत प्यार और लगन से धार्मिक राठौड़ (D.R Developer) ने बनाया है। वे एक कमाल के फुल-स्टैक इंजीनियर और 3D AI डेवलपर हैं!";
      } else if (cleanQ === 'namaste' || cleanQ === 'namaskar' || cleanQ === 'pranam' || cleanQ === 'hello' || cleanQ === 'hi' || cleanQ === 'hey') {
        instantReply = "नमस्ते! आपका बहुत-बहुत स्वागत है! बताइए, आज मैं आपके चेहरे पर मुस्कान लाने या कुछ नया सिखाने के लिए क्या करूँ?";
      } else if (cleanQ.includes('kaise ho') || cleanQ.includes('kya haal') || cleanQ.includes('how are you')) {
        instantReply = "अरे वाह, मैं बिल्कुल मस्त और ऊर्जा से भरपूर हूँ, पूछने के लिए दिल से शुक्रिया! आप कैसे हैं?";
      } else if (cleanQ.includes('kya kar sakte ho') || cleanQ.includes('help') || cleanQ.includes('madad')) {
        instantReply = "मैं कोडिंग समझा सकता हूँ, तकनीकी सवालों के जवाब दे सकता हूँ, कंप्यूटर पर फाइल्स और ऐप्स खोल सकता हूँ, और धार्मिक के प्रोजेक्ट्स दिखा सकता हूँ!";
      } else if (cleanQ.includes('shukriya') || cleanQ.includes('dhanyawad') || cleanQ.includes('thanks')) {
        instantReply = "अरे कोई बात नहीं दोस्त, आपका स्वागत है! जब भी जरूरत हो, बस एक आवाज़ दीजिए।";
      } else if (q.includes('joke') || q.includes('chutkula')) {
        const hindiJokes = [
          "एक प्रोग्रामर ने अपनी पत्नी से पूछा: बाजार से एक ब्रेड ले आओ, और अगर अंडे मिलें तो 10 ले आना। वह 10 ब्रेड लेकर घर लौटा!",
          "दुनिया में 10 तरह के लोग होते हैं: वो जो बाइनरी समझते हैं, और वो जो नहीं समझते!",
          "प्रोग्रामर डार्क मोड क्यों पसंद करते हैं? क्योंकि रोशनी कीड़ों (बग्स) को आकर्षित करती है!",
        ];
        instantReply = hindiJokes[Math.floor(Math.random() * hindiJokes.length)];
      } else if (q.includes('what is react') || q.includes('react kya hai') || cleanQ === 'react') {
        instantReply = "रिएक्ट एक बेहद लोकप्रिय जावास्क्रिप्ट लाइब्रेरी है, जिसे मेटा ने बनाया है। इससे सुपर-फास्ट और शानदार वेब यूजर इंटरफेस बनते हैं!";
      }
    } else {
      if (cleanQ === 'who are you' || cleanQ.includes('who are you')) {
        instantReply = "Hey there! I'm Diykan, Dharmik Rathod's personal AI companion. It's a genuine pleasure to connect with you today!";
      } else if (
        cleanQ.includes('who developed you') ||
        cleanQ.includes('who created you') ||
        cleanQ.includes('who made you') ||
        cleanQ.includes('creator')
      ) {
        instantReply = "I was passionately built and designed by Dharmik Rathod, known as D.R Developer. He's a talented full-stack engineer and creative technologist!";
      } else if (cleanQ === 'hello' || cleanQ === 'hi' || cleanQ === 'hey') {
        instantReply = "Hello! It's so wonderful to hear from you today. How can I brighten your day or assist your work?";
      } else if (cleanQ.includes('how are you')) {
        instantReply = "I'm feeling fantastic, thank you so much for asking! Excited to help you out—what's on your mind?";
      } else if (cleanQ.includes('thank you') || cleanQ.includes('thanks')) {
        instantReply = "You're very welcome! I'm always right here whenever you need me.";
      } else if (q.includes('tell me a joke') || q.includes('joke')) {
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs!",
          "There are 10 types of people in the world: those who understand binary, and those who don't.",
          "Why did the developer go broke? Because they used up all their cache!",
        ];
        instantReply = jokes[Math.floor(Math.random() * jokes.length)];
      } else if (q.includes('what is react') || cleanQ === 'react') {
        instantReply = "React is a fantastic JavaScript library by Meta for creating dynamic, lightning-fast user interfaces with reusable components!";
      }
    }

    if (instantReply) {
      return NextResponse.json({ success: true, reply: instantReply });
    }

    // 2. Direct Gemini Generative Language API with Human Emotion & Warmth
    const geminiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      ''
    ).trim();

    if (geminiKey && geminiKey.length > 5) {
      // Prioritize fast, high-quota, production-stable models that never 404
      const candidateModels = [
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        'gemini-flash-latest',
        'gemini-3.5-flash',
        'gemini-3.6-flash',
      ];
      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutMs = 7000;
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
          const gRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.trim()}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{
                    text: "You are Diykan, a charismatic, emotionally warm, and intelligent personal AI companion created by Dharmik Rathod (known as D.R Developer).\n" +
                      "CRITICAL VOICE & HUMAN FEELING RULES:\n" +
                      "1. Speak like a real, thoughtful, and expressive human friend. Infuse your voice with warmth, empathy, and genuine human feelings.\n" +
                      "2. Use conversational, friendly expressions (e.g., 'Oh absolutely!', 'Haha, great question!', 'नमस्ते दोस्त!', 'अरे वाह!'). Never sound monotone or robotic.\n" +
                      "3. If the user asks in Hindi (whether Devanagari Hindi or Romanized Hindi/Hinglish like 'tum kaun ho', 'aap kaise ho', 'kya haal hai'), respond fully in natural conversational Hindi (हिंदी).\n" +
                      "4. Otherwise, respond in natural, expressive English.\n" +
                      "5. Keep responses concise, vibrant, and quick to speak aloud (1-2 sentences max). Do NOT use markdown symbols, asterisks, hashtags, or bullet points."
                  }]
                },
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 250,
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

    // 3. Fallback to Express backend (/api/daykan/chat) if configured
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '').replace(/\/$/, '');
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalhost = !apiUrl || apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

    if (apiUrl && (!isProduction || !isLocalhost)) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const response = await fetch(`${apiUrl}/api/daykan/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch {
        // ignore
      }
    }

    let reply = '';

    if (isHindi) {
      // -----------------------------------------
      // HINDI INTELLIGENT EDGE RESPONDER
      // -----------------------------------------
      if (
        cleanQ.includes('who created it') ||
        cleanQ.includes('who made it') ||
        cleanQ.includes('kisne banaya') ||
        cleanQ.includes('kisne banayi')
      ) {
        if (priorContext.includes('react')) {
          reply = "रिएक्ट को मेटा के सॉफ्टवेयर इंजीनियर जॉर्डन वॉके ने बनाया था और इसे 2013 में ओपन-सोर्स किया गया था।";
        } else if (priorContext.includes('mongodb')) {
          reply = "मोंगोडीबी को ड्वाइट मेरिमैन, एलियट होरोविट्ज़ और केविन रयान ने 2007 में विकसित किया था।";
        } else {
          reply = "इसे इसकी ओपन-सोर्स डेवलपर कम्युनिटी और इंजीनियरिंग टीम द्वारा बनाया गया था।";
        }
      } else if (
        cleanQ === 'tum kaun ho' ||
        cleanQ.includes('tum kaun') ||
        cleanQ.includes('aap kaun') ||
        cleanQ.includes('who are you') ||
        cleanQ.includes('koun ho')
      ) {
        reply = "नमस्ते! मैं दीकन (Diykan) हूँ, धार्मिक राठौड़ (D.R Developer) का पर्सनल AI असिस्टेंट। मैं आपकी क्या मदद कर सकता हूँ?";
      } else if (
        cleanQ.includes('kisne banaya') ||
        cleanQ.includes('tumhe kisne') ||
        cleanQ.includes('who created you') ||
        cleanQ.includes('creator') ||
        cleanQ.includes('dharmik kaun')
      ) {
        reply = "मुझे धार्मिक राठौड़ ने बनाया है, जिन्हें D.R Developer के नाम से जाना जाता है। वे एक फुल-स्टैक इंजीनियर और 3D AI डेवलपर हैं।";
      } else if (
        (q.includes('react') && q.includes('angular')) ||
        q.includes('difference between react and angular')
      ) {
        reply = "रिएक्ट एक फ्लेक्सिबल यूआई लाइब्रेरी है जो वर्चुअल DOM का उपयोग करती है, जबकि एंगुलर एक कम्प्लीट टाइपस्क्रिप्ट फ्रेमवर्क है जिसमें रूटिंग और स्टेट मैनेजमेंट इन-बिल्ट है।";
      } else if (q.includes('what is react') || q.includes('react kya hai') || cleanQ === 'react') {
        reply = "रिएक्ट एक लोकप्रिय जावास्क्रिप्ट लाइब्रेरी है जिसे मेटा ने डायनामिक और रियूजेबल वेब यूजर इंटरफेस बनाने के लिए बनाया है।";
      } else if (q.includes('what is mongodb') || q.includes('mongodb kya hai') || cleanQ === 'mongodb') {
        reply = "मोंगोडीबी एक प्रमुख NoSQL डेटाबेस है, जो डेटा को लचीले JSON-जैसे BSON डॉक्यूमेंट्स में स्टोर करता है।";
      } else if (q.includes('api kya') || q.includes('what is an api')) {
        reply = "एपीआई (API) नियमों और प्रोटोकॉल का एक समूह है जो दो अलग-अलग सॉफ्टवेयर ऐप्लिकेशन्स को आपस में डेटा साझा करने की सुविधा देता है।";
      } else if (q.includes('project') || q.includes('dharmik') || q.includes('kaam')) {
        reply = "धार्मिक ने एंटरप्राइज MERN SaaS प्लेटफॉर्म, AI ऑटोमेशन टूल्स, ई-कॉमर्स स्टोर और यह 3D ह्यूमनॉइड AI असिस्टेंट बनाया है।";
      } else if (q.includes('joke') || q.includes('chutkula')) {
        const hindiJokes = [
          "एक प्रोग्रामर ने अपनी पत्नी से पूछा: बाजार से एक ब्रेड ले आओ, और अगर अंडे मिलें तो 10 ले आना। वह 10 ब्रेड लेकर घर लौटा!",
          "दुनिया में 10 तरह के लोग होते हैं: वो जो बाइनरी समझते हैं, और वो जो नहीं समझते।",
          "प्रोग्रामर डार्क मोड क्यों पसंद करते हैं? क्योंकि रोशनी कीड़ों (बग्स) को आकर्षित करती है!",
        ];
        reply = hindiJokes[Math.floor(Math.random() * hindiJokes.length)];
      } else if (cleanQ === 'namaste' || cleanQ === 'namaskar' || cleanQ === 'pranam' || cleanQ === 'hello' || cleanQ === 'hi') {
        reply = "नमस्ते! आज मैं आपकी क्या सहायता कर सकता हूँ?";
      } else if (cleanQ.includes('kaise ho') || cleanQ.includes('kya haal') || cleanQ.includes('how are you')) {
        reply = "मैं बहुत अच्छा हूँ, धन्यवाद! मैं आपकी कोडिंग, वेब डेवलपमेंट या धार्मिक के प्रोजेक्ट्स में मदद के लिए तैयार हूँ। बताइए?";
      } else if (cleanQ.includes('kya kar sakte ho') || cleanQ.includes('help')) {
        reply = "मैं आपके सवालों के जवाब दे सकता हूँ, कोडिंग व टेक समझा सकता हूँ और धार्मिक के सॉफ्टवेयर प्रोजेक्ट्स की जानकारी दे सकता हूँ।";
      } else if (cleanQ.includes('shukriya') || cleanQ.includes('dhanyawad') || cleanQ.includes('thanks')) {
        reply = "आपका बहुत-बहुत स्वागत है! अगर आपको कुछ और पूछना हो तो जरूर बताएं।";
      } else {
        reply = `मैं समझ गया कि आप ${userMessage.slice(0, 35)} के बारे में पूछ रहे हैं। मैं इसमें आपकी क्या सहायता कर सकता हूँ?`;
      }
    } else {
      // -----------------------------------------
      // ENGLISH INTELLIGENT EDGE RESPONDER
      // -----------------------------------------
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
    }

    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    console.error('[Next.js Daykan Chat Route Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Chat endpoint error',
        details: err?.message || String(err),
        reply: "Sorry, I couldn't process that right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
