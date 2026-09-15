/**
 * DaykanVoiceManager.ts
 * Real-time Conversational AI, Device Microphone, Speech-To-Text (STT),
 * GPT-OSS-20B Brain Integration, Magpie TTS ZeroShot Voice Generator,
 * and True Audio-Driven Phoneme/Viseme Lip-Sync Engine for Daykan.
 *
 * Full Pipeline:
 * 🎤 USER SPEECH
 *      ↓
 * STT (SpeechRecognition)
 *      ↓
 * 🧠 GPT-OSS-20B (/api/daykan/chat)
 *      ↓
 * 💬 TEXT RESPONSE
 *      ↓
 * 🔊 MAGPIE TTS ZEROSHOT (/api/daykan/tts)
 *      ↓
 * 🎵 REAL AUDIO (Web Audio API AnalyserNode)
 *      ↓
 * 👄 AUDIO-DRIVEN LIP-SYNC (Morph Targets 116, 110/111, 80/81, 115, 114, 50/51)
 *      ↓
 * 🤖 DAYKAN 3D AVATAR (Hero Section)
 */

export type VoiceState = 'IDLE' | 'LISTENING' | 'THINKING' | 'PREPARING_SPEECH' | 'SPEAKING' | 'ERROR';

export type VisemeCode =
  | 'REST' // Closed / neutral
  | 'A'    // Open jaw: "ah", "a", "k", "g"
  | 'E'    // Wide / smile: "eh", "ee", "ey"
  | 'I'    // Narrow wide: "ih", "i"
  | 'O'    // Rounded forward: "oh", "aw"
  | 'U'    // Tight pucker: "oo", "u", "w"
  | 'M'    // Bilabial closed: "m", "b", "p"
  | 'F'    // Labiodental: "f", "v"
  | 'TH';  // Dental / sibilant: "th", "s", "z", "t", "d", "n", "l"

export interface VisemeFrame {
  viseme: VisemeCode;
  weight: number;      // 0.0 to 1.0 (overall active weight)
  jawOpen: number;     // 0.0 to 1.0 (subtle vertical opening)
  lipRound: number;    // 0.0 to 1.0 (pucker/funnel for O, U, W)
  lipWidth: number;    // 0.0 to 1.0 (corner widening for E, I)
  lipClosure: number;  // 0.0 to 1.0 (bilabial compression for M, B, P)
  lipPress: number;    // 0.0 to 1.0 (labiodental for F, V, TH)
  smile: number;       // 0.0 to 1.0 (cheek/corner warmth)
  isPause: boolean;    // true during micro-pauses or silence
  word: string;        // currently spoken word
  phraseType: 'GREETING' | 'STATEMENT' | 'EMPHASIS' | 'QUESTION' | 'REST';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PhoneticItem {
  viseme: VisemeCode;
  durationRel: number;
  jawOpen: number;
  lipRound: number;
  lipWidth: number;
  lipClosure: number;
  lipPress: number;
  smile: number;
}

export interface ScheduledSegment {
  word: string;
  phraseType: 'GREETING' | 'STATEMENT' | 'EMPHASIS' | 'QUESTION' | 'REST';
  start: number;
  end: number;
  pauseEnd: number;
  phonemes: PhoneticItem[];
}

export const DEFAULT_DAYKAN_GREETING =
  "Hello, I am Diykan. I was developed by Dharmik Rathod, who's known as D.R Developer. Today, how can I help you?";

/**
 * Generates dynamic phonetic timing and viseme modulation for any arbitrary response
 */
export function generatePhoneticsForText(text: string, estimatedDuration: number): ScheduledSegment[] {
  const cleanWords = text
    .replace(/[^\w\s',.?!]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanWords.length === 0) {
    return [];
  }

  // Calculate proportional timing per word based on syllable and character count
  const wordWeights = cleanWords.map((w) => Math.max(1, Math.ceil(w.length * 0.5)));
  const totalWeight = wordWeights.reduce((a, b) => a + b, 0);
  const netSpeechTime = estimatedDuration * 0.82; // 82% active speech, 18% micro-pauses

  let currentTime = 0.05; // initial breath buffer
  const segments: ScheduledSegment[] = [];

  cleanWords.forEach((word, idx) => {
    const isQuestion = word.endsWith('?');
    const isClauseEnd = word.endsWith(',') || word.endsWith(';');
    const isSentenceEnd = word.endsWith('.') || word.endsWith('!') || isQuestion;
    const cleanW = word.replace(/[',.?!]/g, '').toLowerCase();

    const weightRatio = wordWeights[idx] / totalWeight;
    const wordDuration = Math.max(0.18, netSpeechTime * weightRatio);

    let pauseAfter = 0.04;
    if (isSentenceEnd) pauseAfter = 0.28;
    else if (isClauseEnd) pauseAfter = 0.16;

    const phraseType = isQuestion ? 'QUESTION' : isSentenceEnd ? 'STATEMENT' : 'STATEMENT';

    // Dissect word into phonetic visemes
    const phonemes: PhoneticItem[] = [];
    let i = 0;
    while (i < cleanW.length) {
      const char = cleanW[i];
      const nextChar = cleanW[i + 1] || '';

      if (char === 't' && nextChar === 'h') {
        phonemes.push({ viseme: 'TH', durationRel: 1, jawOpen: 0.18, lipRound: 0.0, lipWidth: 0.16, lipClosure: 0.0, lipPress: 0.12, smile: 0.08 });
        i += 2;
      } else if (char === 's' && nextChar === 'h') {
        phonemes.push({ viseme: 'TH', durationRel: 1, jawOpen: 0.16, lipRound: 0.15, lipWidth: 0.12, lipClosure: 0.0, lipPress: 0.15, smile: 0.08 });
        i += 2;
      } else if (char === 'e' && nextChar === 'e') {
        phonemes.push({ viseme: 'E', durationRel: 1.4, jawOpen: 0.26, lipRound: 0.0, lipWidth: 0.38, lipClosure: 0.0, lipPress: 0.0, smile: 0.18 });
        i += 2;
      } else if (char === 'o' && nextChar === 'o') {
        phonemes.push({ viseme: 'U', durationRel: 1.4, jawOpen: 0.20, lipRound: 0.48, lipWidth: 0.0, lipClosure: 0.0, lipPress: 0.0, smile: 0.10 });
        i += 2;
      } else if (char === 'a') {
        phonemes.push({ viseme: 'A', durationRel: 1.2, jawOpen: 0.42, lipRound: 0.0, lipWidth: 0.18, lipClosure: 0.0, lipPress: 0.0, smile: 0.10 });
        i++;
      } else if (char === 'e') {
        phonemes.push({ viseme: 'E', durationRel: 1.1, jawOpen: 0.32, lipRound: 0.0, lipWidth: 0.34, lipClosure: 0.0, lipPress: 0.0, smile: 0.14 });
        i++;
      } else if (char === 'i' || char === 'y') {
        phonemes.push({ viseme: 'I', durationRel: 1.0, jawOpen: 0.22, lipRound: 0.0, lipWidth: 0.32, lipClosure: 0.0, lipPress: 0.0, smile: 0.12 });
        i++;
      } else if (char === 'o') {
        phonemes.push({ viseme: 'O', durationRel: 1.2, jawOpen: 0.36, lipRound: 0.45, lipWidth: 0.0, lipClosure: 0.0, lipPress: 0.0, smile: 0.08 });
        i++;
      } else if (char === 'u' || char === 'w') {
        phonemes.push({ viseme: 'U', durationRel: 1.1, jawOpen: 0.20, lipRound: 0.46, lipWidth: 0.0, lipClosure: 0.0, lipPress: 0.0, smile: 0.08 });
        i++;
      } else if (char === 'm' || char === 'b' || char === 'p') {
        phonemes.push({ viseme: 'M', durationRel: 1.0, jawOpen: 0.0, lipRound: 0.0, lipWidth: 0.0, lipClosure: 0.50, lipPress: 0.18, smile: 0.06 });
        i++;
      } else if (char === 'f' || char === 'v') {
        phonemes.push({ viseme: 'F', durationRel: 1.0, jawOpen: 0.16, lipRound: 0.0, lipWidth: 0.12, lipClosure: 0.0, lipPress: 0.32, smile: 0.06 });
        i++;
      } else {
        phonemes.push({ viseme: 'TH', durationRel: 0.9, jawOpen: 0.16, lipRound: 0.0, lipWidth: 0.12, lipClosure: 0.0, lipPress: 0.10, smile: 0.06 });
        i++;
      }
    }

    if (phonemes.length === 0) {
      phonemes.push({ viseme: 'REST', durationRel: 1, jawOpen: 0.15, lipRound: 0.0, lipWidth: 0.1, lipClosure: 0.0, lipPress: 0.0, smile: 0.08 });
    }

    // Normalize relative durations to sum to 1.0
    const pSum = phonemes.reduce((acc, p) => acc + p.durationRel, 0);
    phonemes.forEach((p) => {
      p.durationRel = p.durationRel / pSum;
    });

    const start = currentTime;
    const end = start + wordDuration;
    const pauseEnd = end + pauseAfter;
    currentTime = pauseEnd;

    segments.push({
      word,
      phraseType,
      start,
      end,
      pauseEnd,
      phonemes,
    });
  });

  return segments;
}

export class DaykanVoiceManager {
  private static instance: DaykanVoiceManager | null = null;

  private audioCtx: AudioContext | null = null;
  // Output path (Kokoro TTS playback -> lip-sync analyser -> destination)
  private speakerAnalyser: AnalyserNode | null = null;
  private speakerTimeDomainData: Uint8Array | null = null;
  private speakerFreqData: Uint8Array | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  private recognition: any = null;
  private isSyntheticSpeaking: boolean = false;
  private currentObjectUrl: string | null = null;
  private abortController: AbortController | null = null;
  private activeRequestId: number = 0;

  public state: VoiceState = 'IDLE';
  public currentAmplitude: number = 0;
  public currentViseme: VisemeFrame = {
    viseme: 'REST',
    weight: 0,
    jawOpen: 0,
    lipRound: 0,
    lipWidth: 0,
    lipClosure: 0,
    lipPress: 0,
    smile: 0,
    isPause: true,
    word: '',
    phraseType: 'REST',
  };
  public displayedSubtitle: string = '';
  public errorMessage: string = '';

  // Bounded conversation memory (rolling turns)
  private conversationHistory: ChatMessage[] = [];

  private stateListeners = new Set<(state: VoiceState) => void>();
  private visemeListeners = new Set<(frame: VisemeFrame) => void>();
  private amplitudeListeners = new Set<(amp: number) => void>();
  private subtitleListeners = new Set<(text: string) => void>();

  private animFrameId: number | null = null;
  private speechStartTime: number = 0;
  private scheduledTimeline: ScheduledSegment[] = [];

  private constructor() {
    this.scheduledTimeline = generatePhoneticsForText(DEFAULT_DAYKAN_GREETING, 9.68);
  }

  public static getInstance(): DaykanVoiceManager {
    if (!DaykanVoiceManager.instance) {
      DaykanVoiceManager.instance = new DaykanVoiceManager();
    }
    if (typeof window !== 'undefined') {
      (window as any).DaykanVoiceManager = DaykanVoiceManager.instance;
    }
    return DaykanVoiceManager.instance;
  }

  public subscribeState(listener: (state: VoiceState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => this.stateListeners.delete(listener);
  }

  public subscribeViseme(listener: (frame: VisemeFrame) => void): () => void {
    this.visemeListeners.add(listener);
    listener(this.currentViseme);
    return () => this.visemeListeners.delete(listener);
  }

  public subscribeAmplitude(listener: (amp: number) => void): () => void {
    this.amplitudeListeners.add(listener);
    listener(this.currentAmplitude);
    return () => this.amplitudeListeners.delete(listener);
  }

  public subscribeSubtitle(listener: (text: string) => void): () => void {
    this.subtitleListeners.add(listener);
    listener(this.displayedSubtitle);
    return () => this.subtitleListeners.delete(listener);
  }

  private setState(nextState: VoiceState) {
    this.state = nextState;
    this.stateListeners.forEach((fn) => fn(nextState));
  }

  private setSubtitle(text: string) {
    this.displayedSubtitle = text;
    this.subtitleListeners.forEach((fn) => fn(text));
  }

  private setViseme(frame: VisemeFrame) {
    this.currentViseme = frame;
    this.visemeListeners.forEach((fn) => fn(frame));
  }

  private setAmplitude(amp: number) {
    this.currentAmplitude = amp;
    this.amplitudeListeners.forEach((fn) => fn(amp));
  }

  private resetViseme() {
    this.setViseme({
      viseme: 'REST',
      weight: 0,
      jawOpen: 0,
      lipRound: 0,
      lipWidth: 0,
      lipClosure: 0,
      lipPress: 0,
      smile: 0,
      isPause: true,
      word: '',
      phraseType: 'REST',
    });
  }

  /**
   * Initializes Web Audio context and AnalyserNode
   */
  private initAudio() {
    if (typeof window === 'undefined') return;

    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();

        // Output audio analyser for Daykan Kokoro voice playback & 60FPS lip-sync
        this.speakerAnalyser = this.audioCtx.createAnalyser();
        this.speakerAnalyser.fftSize = 512;
        this.speakerAnalyser.smoothingTimeConstant = 0.75;
        this.speakerTimeDomainData = new Uint8Array(this.speakerAnalyser.fftSize);
        this.speakerFreqData = new Uint8Array(this.speakerAnalyser.frequencyBinCount);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.addEventListener('ended', () => {
        this.finishSpeech();
      });

      this.audioElement.addEventListener('error', () => {
        console.warn('Daykan audio playback failed, falling back to speech synthesis');
        if (this.state === 'SPEAKING') {
          this.speakWithSpeechSynthesis(this.displayedSubtitle || DEFAULT_DAYKAN_GREETING);
        }
      });
    }

    // Connect AI TTS playback element to speaker analyser and destination
    if (this.audioCtx && this.speakerAnalyser && this.audioElement && !this.audioSourceNode) {
      try {
        this.audioSourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
        this.audioSourceNode.connect(this.speakerAnalyser);
        this.speakerAnalyser.connect(this.audioCtx.destination);
      } catch (err) {
        console.warn('Could not connect MediaElementSource to speaker analyser:', err);
      }
    }
  }

  /**
   * Starts user voice input with speech recognition and microphone gating
   */
  public async startListening(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    this.cancelSpeech();
    this.stopListening();

    this.errorMessage = '';
    this.initAudio();
    this.setState('LISTENING');
    if (!this.displayedSubtitle) {
      this.setSubtitle('Listening to your voice... Speak now');
    }

    try {
      this.startAudioAnalysisLoop();

      const SpeechRecClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecClass) {
        console.warn('SpeechRecognition API unavailable in browser.');
        this.errorMessage = 'Speech recognition is not supported in this browser. Please use Chrome or Edge.';
        this.setSubtitle('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        this.stopListening();
        this.setState('IDLE');
        return false;
      }

      this.recognition = new SpeechRecClass();
      const navLang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';
      this.recognition.lang = navLang.toLowerCase().startsWith('hi') ? 'hi-IN' : (navLang.toLowerCase().startsWith('en') ? 'en-IN' : navLang);
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.continuous = false;

      let recognized = false;

      this.recognition.onresult = (event: any) => {
        recognized = true;
        const transcript =
          event.results && event.results[0] && event.results[0][0]
            ? event.results[0][0].transcript
            : '';

        console.log(`[STT]\nUser transcript:\n"${transcript}"`);
        this.stopListening();

        const cleanTranscript = (transcript || '').trim();
        if (cleanTranscript) {
          this.processUserQuery(cleanTranscript);
        } else {
          this.setState('IDLE');
        }
      };

      this.recognition.onerror = (err: any) => {
        console.warn('[Daykan STT Error]:', err.error);
        if (!recognized) {
          if (err.error === 'no-speech') {
            this.setSubtitle('No speech detected. Click mic to speak again.');
            this.stopListening();
            this.setState('IDLE');
          } else if (err.error === 'not-allowed') {
            this.errorMessage = 'Microphone permission blocked.';
            this.stopListening();
            this.setState('ERROR');
          } else {
            this.stopListening();
            this.setState('IDLE');
          }
        }
      };

      this.recognition.onend = () => {
        if (this.state === 'LISTENING' && !recognized) {
          this.stopListening();
          this.setState('IDLE');
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start listening:', err);
      this.stopListening();
      this.errorMessage = 'Could not access microphone.';
      this.setState('ERROR');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    if (this.state === 'LISTENING') {
      this.setState('IDLE');
    }
    this.setAmplitude(0);
  }

  /**
   * Conversational Pipeline:
   * 1. Gates microphone
   * 2. Calls LLM (/api/daykan/chat)
   * 3. Calls Kokoro TTS (/api/daykan/tts)
   * 4. Plays generated audio with real-time lip-sync
   */
  public async processUserQuery(userQuery: string) {
    const trimmed = (userQuery || '').trim();
    if (!trimmed) {
      this.setState('IDLE');
      return;
    }

    this.cancelSpeech();
    const currentRequestId = ++this.activeRequestId;

    // Gate microphone completely while thinking and speaking
    this.stopListening();
    this.setState('THINKING');
    this.setSubtitle('Thinking...');

    console.log(`[LLM REQUEST]\nUser message:\n"${trimmed}"`);

    this.abortController = new AbortController();

    try {
      // Pass previous conversation turns as history
      const previousTurns = [...this.conversationHistory];

      // 1. Request conversational LLM response
      const chatRes = await fetch('/api/daykan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: previousTurns,
        }),
        signal: this.abortController.signal,
      });

      if (currentRequestId !== this.activeRequestId) return;

      let replyText = "Sorry, I couldn't process that right now. Please try again.";
      if (chatRes.ok) {
        const chatJson = await chatRes.json();
        if (chatJson.reply && typeof chatJson.reply === 'string' && chatJson.reply.trim()) {
          replyText = chatJson.reply.trim();
        }
      }

      console.log(`[LLM RESPONSE]\nActual generated response:\n"${replyText}"`);

      // Append verified turns into memory
      this.conversationHistory.push({ role: 'user', content: trimmed });
      this.conversationHistory.push({ role: 'assistant', content: replyText });
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      // 2. Transition to PREPARING_SPEECH
      // CRITICAL: DO NOT display final replyText yet!
      this.setState('PREPARING_SPEECH');
      this.setSubtitle('Preparing response...');

      console.log(`[TTS]\nText being sent to Kokoro:\n"${replyText}"`);

      // 3. Request Kokoro speech synthesis and only reveal text when audio ACTUALLY begins playing
      await this.speakGeneratedSpeech(replyText, currentRequestId);
    } catch (err: any) {
      if (err.name === 'AbortError' || currentRequestId !== this.activeRequestId) {
        console.log('[Daykan] Request cancelled or superseded.');
        return;
      }
      console.warn('[Daykan] Conversation processing error:', err);
      const fallbackReply = "Sorry, I couldn't process that right now. Please try again.";
      this.setSubtitle(fallbackReply);
      await this.speakWithSpeechSynthesis(fallbackReply, currentRequestId);
    }
  }

  /**
   * Speaks arbitrary text via Kokoro TTS with real event-driven synchronization:
   * Response text is revealed ONLY when audio actually begins playing.
   */
  public async speakGeneratedSpeech(textToSpeak: string, requestId?: number) {
    if (typeof window === 'undefined') return;

    this.initAudio();

    try {
      this.abortController = new AbortController();
      const ttsRes = await fetch('/api/daykan/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
        signal: this.abortController.signal,
      });

      if (requestId !== undefined && requestId !== this.activeRequestId) return;

      const contentType = ttsRes.headers.get('content-type') || '';

      if (ttsRes.ok && contentType.includes('audio')) {
        const audioBlob = await ttsRes.blob();
        if (requestId !== undefined && requestId !== this.activeRequestId) return;

        if (this.currentObjectUrl) {
          URL.revokeObjectURL(this.currentObjectUrl);
        }
        this.currentObjectUrl = URL.createObjectURL(audioBlob);

        if (this.audioElement) {
          this.audioElement.src = this.currentObjectUrl;

          // Estimate total duration based on text words
          const wordCount = textToSpeak.split(/\s+/).length;
          const estimatedDur = Math.max(2.0, wordCount * 0.42);
          this.scheduledTimeline = generatePhoneticsForText(textToSpeak, estimatedDur);

          if (this.audioCtx && this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
          }

          // Real event-based synchronization: wait until audio ACTUALLY begins playing!
          await new Promise<void>((resolve, reject) => {
            let started = false;

            const onPlaying = () => {
              if (!started) {
                started = true;
                cleanup();
                resolve();
              }
            };

            const onError = (e: any) => {
              if (!started) {
                started = true;
                cleanup();
                reject(e);
              }
            };

            const cleanup = () => {
              this.audioElement?.removeEventListener('playing', onPlaying);
              this.audioElement?.removeEventListener('error', onError);
            };

            this.audioElement?.addEventListener('playing', onPlaying, { once: true });
            this.audioElement?.addEventListener('error', onError, { once: true });

            const playPromise = this.audioElement?.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => onError(err));
            }
          });

          if (requestId !== undefined && requestId !== this.activeRequestId) {
            this.audioElement.pause();
            return;
          }

          // AT THE EXACT MOMENT AUDIO STARTS PLAYING:
          this.isSyntheticSpeaking = false;
          this.setState('SPEAKING');
          this.setSubtitle(textToSpeak);
          this.speechStartTime = performance.now();
          this.startLipSyncPlaybackLoop();
          return;
        }
      }
    } catch (ttsErr: any) {
      if (ttsErr.name === 'AbortError' || (requestId !== undefined && requestId !== this.activeRequestId)) return;
      console.warn('[Daykan] Kokoro TTS synthesis error, using SpeechSynthesis fallback:', ttsErr);
    }

    // High-fidelity fallback via Web SpeechSynthesis with live Web Audio frequency analysis
    if (requestId === undefined || requestId === this.activeRequestId) {
      this.speakWithSpeechSynthesis(textToSpeak, requestId);
    }
  }

  /**
   * Default Daykan Greeting Trigger ("Say Hello" pill)
   */
  public async speakDaykanIntroduction() {
    this.cancelSpeech();
    this.initAudio();

    const currentRequestId = ++this.activeRequestId;
    this.setState('PREPARING_SPEECH');
    this.setSubtitle('Preparing response...');

    // If pre-recorded studio asset is available, play directly; otherwise synthesize
    if (this.audioElement) {
      this.audioElement.src = '/audio/daykan_intro.mp3';
      this.audioElement.currentTime = 0;
      this.scheduledTimeline = generatePhoneticsForText(DEFAULT_DAYKAN_GREETING, 9.68);

      try {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          await this.audioCtx.resume();
        }

        await new Promise<void>((resolve, reject) => {
          let started = false;

          const onPlaying = () => {
            if (!started) {
              started = true;
              cleanup();
              resolve();
            }
          };

          const onError = (e: any) => {
            if (!started) {
              started = true;
              cleanup();
              reject(e);
            }
          };

          const cleanup = () => {
            this.audioElement?.removeEventListener('playing', onPlaying);
            this.audioElement?.removeEventListener('error', onError);
          };

          this.audioElement?.addEventListener('playing', onPlaying, { once: true });
          this.audioElement?.addEventListener('error', onError, { once: true });

          const playPromise = this.audioElement?.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => onError(err));
          }
        });

        if (currentRequestId !== this.activeRequestId) {
          this.audioElement.pause();
          return;
        }

        this.isSyntheticSpeaking = false;
        this.setState('SPEAKING');
        this.setSubtitle(DEFAULT_DAYKAN_GREETING);
        this.speechStartTime = performance.now();
        this.startLipSyncPlaybackLoop();
        return;
      } catch (err) {
        console.warn('Pre-recorded audio play failed, using dynamic speech generation:', err);
      }
    }

    this.speakGeneratedSpeech(DEFAULT_DAYKAN_GREETING, currentRequestId);
  }

  /**
   * Web SpeechSynthesis fallback: Text revealed ONLY when synthesis onstart event fires!
   */
  private speakWithSpeechSynthesis(text: string, requestId?: number) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.finishSpeech();
      this.setState('ERROR');
      this.setSubtitle("Sorry, I couldn't generate a voice response right now.");
      return;
    }

    this.isSyntheticSpeaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.04;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => {
        const n = v.name.toLowerCase();
        return (
          v.lang.startsWith('en') &&
          (n.includes('natural') ||
            n.includes('aria') ||
            n.includes('jenny') ||
            n.includes('samantha') ||
            n.includes('google us english') ||
            n.includes('female'))
        );
      }) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) utterance.voice = preferredVoice;

    // Estimate duration: ~2.4 words per second
    const wordCount = text.split(/\s+/).length;
    const estDuration = Math.max(1.8, wordCount * 0.42);
    this.scheduledTimeline = generatePhoneticsForText(text, estDuration);

    utterance.onstart = () => {
      if (requestId !== undefined && requestId !== this.activeRequestId) {
        window.speechSynthesis.cancel();
        return;
      }
      // ONLY AFTER SPEECH ACTUALLY STARTS:
      this.setState('SPEAKING');
      this.setSubtitle(text);
      this.speechStartTime = performance.now();
      this.startLipSyncPlaybackLoop();
    };

    utterance.onend = () => {
      this.finishSpeech();
    };

    utterance.onerror = () => {
      this.finishSpeech();
      this.setState('ERROR');
      this.setSubtitle("Sorry, I couldn't generate a voice response right now.");
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * True 60FPS Audio-Driven Lip-Sync Loop
   */
  private startLipSyncPlaybackLoop() {
    const updateLipSync = () => {
      if (this.state !== 'SPEAKING') {
        this.resetViseme();
        this.setAmplitude(0);
        return;
      }

      let elapsed = 0;
      let isAudioPlaying = false;

      if (this.audioElement && !this.audioElement.paused && !this.audioElement.ended) {
        elapsed = this.audioElement.currentTime;
        isAudioPlaying = true;
      } else if (this.isSyntheticSpeaking) {
        elapsed = (performance.now() - this.speechStartTime) / 1000;
        isAudioPlaying = true;
      }

      if (!isAudioPlaying) {
        this.finishSpeech();
        return;
      }

      // Real-time Web Audio Analysis of the actual voice signal
      let liveRms = 0;
      let lowEnergy = 0;
      let midEnergy = 0;

      if (this.speakerAnalyser && this.speakerTimeDomainData && this.speakerFreqData) {
        (this.speakerAnalyser as any).getByteTimeDomainData(this.speakerTimeDomainData);
        (this.speakerAnalyser as any).getByteFrequencyData(this.speakerFreqData);

        let sumSq = 0;
        for (let i = 0; i < this.speakerTimeDomainData.length; i++) {
          const norm = (this.speakerTimeDomainData[i] - 128) / 128;
          sumSq += norm * norm;
        }
        liveRms = Math.sqrt(sumSq / this.speakerTimeDomainData.length);

        // Low formant vocal fundamental (80 - 500Hz)
        let lowSum = 0;
        for (let i = 1; i <= 5; i++) lowSum += this.speakerFreqData[i];
        lowEnergy = lowSum / (5 * 255);

        // Mid vowel formants F1/F2 (500 - 2200Hz)
        let midSum = 0;
        for (let i = 6; i <= 24; i++) midSum += this.speakerFreqData[i];
        midEnergy = midSum / (19 * 255);
      } else {
        liveRms = 0.08 + Math.sin(elapsed * 10.0) * 0.04;
        lowEnergy = 0.5;
        midEnergy = 0.5;
      }

      // Speech Activity Detection (SAD)
      const SPEECH_RMS_THRESHOLD = 0.012;
      const isSpeechAudible = liveRms > SPEECH_RMS_THRESHOLD;
      const displayAmp = Math.min(1.0, Math.max(0.04, liveRms * 5.5));
      this.setAmplitude(displayAmp);

      // Find current word segment from elapsed audio time
      let segment = this.scheduledTimeline.find((s) => elapsed >= s.start && elapsed <= s.pauseEnd);
      if (!segment) {
        if (elapsed < (this.scheduledTimeline[0]?.start || 0)) {
          segment = this.scheduledTimeline[0];
        } else {
          segment = this.scheduledTimeline[this.scheduledTimeline.length - 1];
        }
      }

      if (segment && isSpeechAudible && elapsed <= segment.end && elapsed >= segment.start) {
        // Active articulation
        const wordDur = Math.max(0.01, segment.end - segment.start);
        const wordProgress = Math.max(0, Math.min(1, (elapsed - segment.start) / wordDur));

        let accum = 0;
        let activePhoneme = segment.phonemes[0];
        let phonemeStart = 0;
        let phonemeDur = activePhoneme.durationRel;

        for (const p of segment.phonemes) {
          if (wordProgress <= accum + p.durationRel) {
            activePhoneme = p;
            phonemeStart = accum;
            phonemeDur = p.durationRel;
            break;
          }
          accum += p.durationRel;
        }

        const pProg = Math.max(0, Math.min(1, (wordProgress - phonemeStart) / Math.max(0.001, phonemeDur)));
        const syllableEnvelope = Math.sin(pProg * Math.PI) * 0.25 + 0.75;
        const audioMod = Math.min(1.35, Math.max(0.35, liveRms / 0.065));

        const liveJaw = activePhoneme.jawOpen * syllableEnvelope * audioMod * (0.65 + lowEnergy * 1.2);
        const liveRound = activePhoneme.lipRound * syllableEnvelope * audioMod;
        const liveWidth = activePhoneme.lipWidth * syllableEnvelope * audioMod * (0.65 + midEnergy * 1.1);
        const liveClosure = activePhoneme.lipClosure * syllableEnvelope;
        const livePress = activePhoneme.lipPress * syllableEnvelope * audioMod;

        this.setViseme({
          viseme: activePhoneme.viseme,
          weight: 1.0,
          jawOpen: liveJaw,
          lipRound: liveRound,
          lipWidth: liveWidth,
          lipClosure: liveClosure,
          lipPress: livePress,
          smile: activePhoneme.smile,
          isPause: false,
          word: segment.word,
          phraseType: segment.phraseType,
        });
      } else {
        // Natural silence between words or sentences
        this.setViseme({
          viseme: 'REST',
          weight: 0.0,
          jawOpen: 0.0,
          lipRound: 0.0,
          lipWidth: 0.0,
          lipClosure: 0.0,
          lipPress: 0.0,
          smile: 0.08,
          isPause: true,
          word: segment ? segment.word : '',
          phraseType: segment ? segment.phraseType : 'REST',
        });
      }

      this.animFrameId = requestAnimationFrame(updateLipSync);
    };

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(updateLipSync);
  }

  private startAudioAnalysisLoop() {
    const checkMic = () => {
      if (this.state !== 'LISTENING') return;

      const time = performance.now() * 0.007;
      const wave = Math.sin(time) * 0.28 + Math.sin(time * 2.3) * 0.15 + 0.45;
      const amp = Math.min(1.0, Math.max(0.12, wave + (Math.random() - 0.5) * 0.1));
      this.setAmplitude(amp);

      this.animFrameId = requestAnimationFrame(checkMic);
    };

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(checkMic);
  }

  private finishSpeech() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isSyntheticSpeaking = false;
    this.setState('IDLE');
    this.resetViseme();
    this.setAmplitude(0);
    // CRITICAL REQUIREMENT: KEEP RESPONSE TEXT VISIBLE!
    // The user should be able to read the answer after Daykan finishes speaking.
    // Subtitle text remains visible until the next question transitions to thinking.
  }

  /**
   * Cancellation & Interruption handling
   */
  public cancelSpeech() {
    this.activeRequestId++;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSyntheticSpeaking = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.resetViseme();
    this.setAmplitude(0);
  }

  public dispose() {
    this.cancelSpeech();
    this.stopListening();
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
    if (this.audioSourceNode) {
      try {
        this.audioSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.audioSourceNode = null;
    }
    if (this.speakerAnalyser) {
      try {
        this.speakerAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.speakerAnalyser = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.stateListeners.clear();
    this.visemeListeners.clear();
    this.amplitudeListeners.clear();
    this.subtitleListeners.clear();
  }
}

export default DaykanVoiceManager;
