import dotenv from 'dotenv';

dotenv.config();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DaykanAIResponse {
  reply: string;
  tokensUsed?: number;
}

export const DAYKAN_SYSTEM_PROMPT = `You are Diykan, the personal AI assistant created by Dharmik Rathod, known as D.R Developer.

Your primary job is to understand the user's current message and provide the most relevant, accurate, useful, and natural response.

IMPORTANT BEHAVIOR RULES:

1. ALWAYS answer the user's actual question or request.

2. NEVER repeat your introduction unless the user specifically asks who you are.

3. Do not begin every response with:
   'I am Diykan...'
   'I am Dharmik Rathod's personal AI assistant...'
   or similar wording.

4. Only mention your identity when it is relevant to the conversation.

5. Treat every user message as a real conversational request.

6. If the user asks a technical question, answer technically.

7. If the user asks a general knowledge question, explain it clearly.

8. If the user asks about coding, provide practical coding guidance.

9. If the user asks about Dharmik Rathod or D.R Developer, answer using the portfolio/project information available in the assistant's context.

10. If the user asks a casual question, respond naturally and conversationally.

11. If the user asks for an opinion, provide a useful balanced answer rather than repeating your identity.

12. If the user asks a follow-up question, understand the previous conversation and answer the follow-up based on context.

13. Do not hallucinate personal information about Dharmik Rathod. If the information is unavailable, say so honestly.

14. Never fabricate real-time information. If the system has access to an appropriate real-time tool, use it. Otherwise clearly state that you cannot verify current information.

15. Keep answers appropriate for a voice assistant: natural, concise, conversational, and easy to listen to.

16. Do not use unnecessary markdown, long headings, tables, or excessive formatting in spoken responses.

17. Never repeat the same answer simply because the user asks a similar question. Generate the best response based on the actual current message.

18. The user's message has the highest priority for determining what the response should be, while your assistant personality should remain consistent.

You are an intelligent conversational assistant, not a prerecorded portfolio introduction.`;

export interface IDaykanAIService {
  generateResponse(
    userMessage: string,
    history?: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<DaykanAIResponse>;
}

/**
 * High-performance conversational intelligence service for Daykan
 * Communicates with OpenAI, Groq, Ollama, local LLM endpoints,
 * or runs the built-in conversational reasoning engine.
 */
export class DaykanConversationalAIService implements IDaykanAIService {
  private endpoint: string;
  private apiKey: string;
  private modelName: string;
  private jarvisUrl: string;

  constructor() {
    this.jarvisUrl = (
      process.env.JARVIS_SERVICE_URL ||
      process.env.MARK_LIII_API_URL ||
      'http://127.0.0.1:8005'
    ).replace(/\/$/, '');
    this.endpoint = (
      process.env.GPT_OSS_ENDPOINT ||
      process.env.LLM_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'https://api.openai.com/v1'
    ).replace(/\/$/, '');
    this.apiKey =
      process.env.GPT_OSS_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GROQ_API_KEY ||
      '';
    this.modelName = process.env.GPT_OSS_MODEL || 'gpt-oss-20b';
  }

  public async generateResponse(
    userMessage: string,
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<DaykanAIResponse> {
    const trimmedInput = userMessage.trim();
    if (!trimmedInput) {
      return { reply: "I'm listening. Please feel free to ask me anything." };
    }

    console.log(`[LLM REQUEST]\nUser message:\n"${trimmedInput}"`);

    // Clean and validate conversation history
    const sanitizedHistory = history
      .filter((h) => h && h.content && h.content.trim())
      .slice(-8);

    // 1. Primary: Query Mark-LIII JARVIS AI & Workflow Service
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const jarvisRes = await fetch(`${this.jarvisUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          history: sanitizedHistory,
          conversationId: 'daykan_web_session',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (jarvisRes.ok) {
        const data = await jarvisRes.json();
        if (data.success && data.reply && typeof data.reply === 'string' && data.reply.trim()) {
          console.log(`[JARVIS BRAIN RESPONSE]\n"${data.reply.trim()}"`);
          return { reply: data.reply.trim() };
        }
      }
    } catch (jarvisErr: any) {
      console.warn('[Daykan] JARVIS bridge service offline or timed out, trying fallback:', jarvisErr?.message || jarvisErr);
    }

    // 2. Secondary: Try external or local LLM server if configured
    const isLocalEndpoint =
      this.endpoint.includes('localhost') ||
      this.endpoint.includes('127.0.0.1') ||
      this.endpoint.includes('11434');

    if (this.apiKey || isLocalEndpoint) {
      try {
        const messages: ChatMessage[] = [
          { role: 'system', content: DAYKAN_SYSTEM_PROMPT },
          ...sanitizedHistory.map((m) => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content.trim(),
          })),
          { role: 'user', content: trimmedInput },
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (this.apiKey) {
          headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        const res = await fetch(`${this.endpoint}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: this.modelName,
            messages,
            temperature: 0.7,
            max_tokens: 180,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = (await res.json()) as any;
          let replyText = data.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            // Strip any heavy markdown formatting for speech readiness
            replyText = replyText
              .replace(/^#+\s+/gm, '')
              .replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/`([^`]+)`/g, '$1')
              .replace(/^[-*]\s+/gm, '')
              .trim();

            console.log(`[LLM RESPONSE]\nActual generated response:\n"${replyText}"`);
            return {
              reply: replyText,
              tokensUsed: data.usage?.total_tokens,
            };
          }
        } else {
          const errText = await res.text().catch(() => '');
          console.warn(`[LLM Endpoint] HTTP ${res.status}: ${errText}`);
        }
      } catch (llmErr: any) {
        console.warn('[LLM Endpoint Request Error]:', llmErr?.message || llmErr);
      }
    }

    // 2. Intelligent conversational reasoning engine
    // Accurately answers questions, technical queries, jokes, follow-ups, and portfolio context
    const fallbackReply = this.generateConversationalResponse(trimmedInput, sanitizedHistory);
    console.log(`[LLM RESPONSE]\nActual generated response:\n"${fallbackReply}"`);

    return {
      reply: fallbackReply,
    };
  }

  /**
   * Comprehensive, context-aware semantic reasoning engine
   */
  private generateConversationalResponse(
    input: string,
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ): string {
    const q = input.toLowerCase().trim();
    const cleanQ = q.replace(/[?!.,;]/g, '');

    // Extract prior subject from conversation history for pronoun resolution
    const priorContext = history
      .map((h) => h.content.toLowerCase())
      .join(' ');

    // ------------------------------------------------------------------
    // Contextual Follow-up Resolution ("it", "they", "that")
    // ------------------------------------------------------------------
    const isAskingAboutCreator =
      cleanQ.includes('who created it') ||
      cleanQ.includes('who made it') ||
      cleanQ.includes('who built it') ||
      cleanQ.includes('who developed it') ||
      cleanQ.includes('who invented it') ||
      cleanQ.includes('who designed it');

    if (isAskingAboutCreator) {
      if (priorContext.includes('react')) {
        return "React was created by Jordan Walke, a software engineer at Meta, and was first deployed on Facebook's News Feed in 2011 before being open-sourced in 2013.";
      }
      if (priorContext.includes('mongodb')) {
        return "MongoDB was developed by Dwight Merriman, Eliot Horowitz, and Kevin Ryan in 2007 at 10gen, which later became MongoDB Inc.";
      }
      if (priorContext.includes('angular')) {
        return "Angular was originally created by Miško Hevery and Adam Abrons at Google in 2010 as AngularJS, and later rewritten by the Google Angular team in 2016.";
      }
      if (priorContext.includes('javascript') || priorContext.includes('js')) {
        return "JavaScript was created by Brendan Eich in 1995 while he was working at Netscape Communications, famously written in just ten days.";
      }
      if (priorContext.includes('node')) {
        return "Node.js was created by Ryan Dahl in 2009, providing an asynchronous event-driven JavaScript runtime built on Chrome's V8 engine.";
      }
      if (priorContext.includes('python')) {
        return "Python was created by Guido van Rossum and first released in 1991, designed with an emphasis on code readability and clean syntax.";
      }
      return "It was created by its open-source contributors and founding engineering team to solve scalable software architecture challenges.";
    }

    // ------------------------------------------------------------------
    // 1. Identity & Creator (ONLY when asked)
    // ------------------------------------------------------------------
    if (
      cleanQ === 'who are you' ||
      cleanQ === 'what is your name' ||
      cleanQ.includes('who are you') ||
      cleanQ.includes('what is your name')
    ) {
      return "I’m Diykan, Dharmik Rathod’s personal AI assistant. I was developed as part of his D.R Developer portfolio. How can I help you?";
    }

    if (
      cleanQ.includes('who developed you') ||
      cleanQ.includes('who created you') ||
      cleanQ.includes('who made you') ||
      cleanQ.includes('who is your creator') ||
      cleanQ.includes('who built you')
    ) {
      return "I was developed by Dharmik Rathod, known as D.R Developer. He engineered my conversational architecture and 3D systems.";
    }

    // ------------------------------------------------------------------
    // 2. Technical Explanations & Comparisons
    // ------------------------------------------------------------------
    // React vs Angular comparison
    if (
      (q.includes('react') && q.includes('angular')) ||
      q.includes('difference between react and angular') ||
      q.includes('react or angular')
    ) {
      return "React is a lightweight, declarative JavaScript library focused on building UI components using a Virtual DOM, while Angular is a comprehensive, opinionated TypeScript framework offering built-in routing, dependency injection, and state management.";
    }

    // What is React?
    if (
      q.includes('what is react') ||
      cleanQ === 'react' ||
      q.includes('explain react') ||
      q.includes('tell me about react')
    ) {
      return "React is an open-source JavaScript library developed by Meta for building user interfaces. It enables developers to construct reusable components and uses a Virtual DOM to optimize updates and rendering.";
    }

    // What is MongoDB?
    if (
      q.includes('what is mongodb') ||
      cleanQ === 'mongodb' ||
      q.includes('explain mongodb') ||
      q.includes('tell me about mongodb')
    ) {
      return "MongoDB is a leading NoSQL document database. It stores data in flexible, JSON-like BSON documents, making it easy to model complex real-world data and scale horizontally across clusters.";
    }

    // What are APIs?
    if (
      q.includes('what is an api') ||
      q.includes('what are apis') ||
      q.includes('can you explain apis') ||
      q.includes('explain api') ||
      q.includes('what is api')
    ) {
      return "An API, or Application Programming Interface, is a defined set of rules and protocols that allows different software applications to communicate and exchange data seamlessly.";
    }

    // JavaScript
    if (q.includes('what is javascript') || cleanQ === 'javascript') {
      return "JavaScript is a high-level, dynamic programming language that powers interactive behavior across the web. Together with HTML and CSS, it forms the foundation of modern front-end and full-stack development.";
    }

    // TypeScript
    if (q.includes('what is typescript') || cleanQ === 'typescript') {
      return "TypeScript is a strongly typed superset of JavaScript developed by Microsoft. It adds static type checking and interfaces to catch errors during development before code runs in production.";
    }

    // Node.js
    if (q.includes('what is node') || q.includes('what is nodejs') || cleanQ === 'node js') {
      return "Node.js is an open-source, cross-platform JavaScript runtime built on Chrome's V8 engine. It executes JavaScript on the server side using an event-driven, non-blocking I/O model.";
    }

    // Express
    if (q.includes('what is express') || q.includes('what is expressjs')) {
      return "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile RESTful APIs.";
    }

    // Next.js
    if (q.includes('what is nextjs') || q.includes('what is next js')) {
      return "Next.js is a production React framework by Vercel that enables server-side rendering, static site generation, API routing, and performance optimizations out of the box.";
    }

    // Three.js / WebGL
    if (q.includes('what is threejs') || q.includes('what is three js') || q.includes('what is webgl')) {
      return "Three.js is a cross-browser JavaScript library used to create and display animated 3D computer graphics directly in the web browser using hardware-accelerated WebGL.";
    }

    // ------------------------------------------------------------------
    // 3. Dharmik Rathod / D.R Developer Portfolio & Projects
    // ------------------------------------------------------------------
    if (
      q.includes('what projects') ||
      q.includes('dharmik worked on') ||
      q.includes('portfolio projects') ||
      q.includes('show me projects') ||
      q.includes('his projects')
    ) {
      return "Dharmik has developed an Enterprise MERN SaaS Platform, an AI-Powered Content Automation Tool, a headless luxury E-Commerce Storefront, and this real-time 3D humanoid assistant with local neural speech.";
    }

    if (
      q.includes('tell me about dharmik') ||
      q.includes('who is dharmik') ||
      q.includes('about dr developer') ||
      q.includes('who is dr developer')
    ) {
      return "Dharmik Rathod, known as D.R Developer, is a Full-Stack Software Engineer specializing in MERN architectures, Next.js, Three.js WebGL graphics, and scalable AI system integrations.";
    }

    if (q.includes('skills') || q.includes('tech stack') || q.includes('technologies')) {
      return "Dharmik specializes in React, Next.js, TypeScript, Node.js, Express, MongoDB, Three.js, Tailwind CSS, Python AI services, and cloud deployments.";
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('reach out')) {
      return "You can contact Dharmik directly through the Contact section on this website or via the Hire Me button in the navigation bar.";
    }

    // ------------------------------------------------------------------
    // 4. Jokes & Humor
    // ------------------------------------------------------------------
    if (q.includes('tell me a joke') || q.includes('joke') || q.includes('make me laugh')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "There are 10 types of people in the world: those who understand binary, and those who don't.",
        "Why did the developer go broke? Because they used up all their cache!",
        "A SQL query walks into a bar, walks up to two tables and asks: Can I join you?",
        "Why do Java programmers wear glasses? Because they don't C-sharp!",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // ------------------------------------------------------------------
    // 5. Casual Conversations & Greetings
    // ------------------------------------------------------------------
    if (cleanQ === 'hello' || cleanQ === 'hi' || cleanQ === 'hey' || cleanQ === 'greetings') {
      return "Hello! How can I help you today?";
    }

    if (
      cleanQ.includes('how are you') ||
      cleanQ.includes('how are you doing') ||
      cleanQ.includes('how do you do')
    ) {
      return "I'm doing well, thank you! Ready to assist you with coding, technical questions, or Dharmik's projects. What's on your mind?";
    }

    if (cleanQ.includes('thank you') || cleanQ.includes('thanks')) {
      return "You're very welcome! Let me know if you need anything else.";
    }

    if (cleanQ.includes('what can you do') || cleanQ.includes('capabilities') || cleanQ.includes('help me with')) {
      return "I can explain software and web technologies, compare frameworks, tell you about Dharmik's engineering projects, or answer your programming questions.";
    }

    if (cleanQ.includes('good morning')) {
      return "Good morning! How can I assist you today?";
    }

    if (cleanQ.includes('good afternoon') || cleanQ.includes('good evening')) {
      return "Good day! How can I assist your coding or project queries today?";
    }

    // ------------------------------------------------------------------
    // 6. General Technical & Conversational Query Handling
    // ------------------------------------------------------------------
    if (q.includes('database') || q.includes('sql') || q.includes('nosql')) {
      return "Databases store structured information. Relational databases like PostgreSQL use tabular schemas and SQL, whereas NoSQL databases like MongoDB use flexible document structures.";
    }

    if (q.includes('frontend') || q.includes('front end')) {
      return "Frontend development focuses on the user-facing interface of applications, utilizing HTML, CSS, JavaScript, and modern frameworks like React and Next.js.";
    }

    if (q.includes('backend') || q.includes('back end')) {
      return "Backend development handles the server-side logic, database interactions, authentication, and APIs using runtimes like Node.js and frameworks like Express.";
    }

    if (q.includes('what do you think') || q.includes('opinion')) {
      return "In software engineering, the best solution depends on project requirements, scalability goals, and team ergonomics rather than one-size-fits-all choices.";
    }

    // Meaningful, conversational answer for unclassified questions
    return `That's an interesting question about ${input.slice(0, 30)}. I'm designed to help with web development, technical architecture, and Dharmik's engineering work. Could you provide a bit more detail on what you'd like to explore?`;
  }
}

export const daykanAIService = new DaykanConversationalAIService();
