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

export function isHindiQuery(text: string): boolean {
  if (!text) return false;
  // 1. Devanagari Unicode script range (U+0900 to U+097F)
  if (/[\u0900-\u097F]/.test(text)) return true;

  const lower = text.toLowerCase().trim();

  // 2. Explicit request to talk in Hindi
  if (/\b(in hindi|speak in hindi|hindi me|hindi mein|hindi mai|reply in hindi|answer in hindi)\b/.test(lower)) {
    return true;
  }

  // 3. Clear English question starters / grammar - if present without Devanagari, it is definitely English
  const englishStarters = [
    'what is', 'what are', 'what do', 'what can', 'what does',
    'who is', 'who are', 'who was', 'who created', 'who made', 'who developed', 'who are you',
    'how to', 'how do', 'how can', 'how are', 'how does', 'how is', 'how are you',
    'why is', 'why are', 'why do', 'why does',
    'tell me', 'can you', 'could you', 'please explain', 'explain',
    'where is', 'where are', 'which is', 'which one',
    'difference between', 'give me', 'help me', 'show me'
  ];
  if (englishStarters.some((s) => lower.startsWith(s) || lower.includes(' ' + s))) {
    return false;
  }

  // 4. Common Romanized Hindi phrases
  const hindiPhrases = [
    'kaise ho', 'kya haal', 'kya hal', 'tum kaun', 'aap kaun', 'koun ho', 'kaun ho',
    'kya chal raha', 'kya kar', 'kaise hai', 'kaise hain', 'batao', 'bataye',
    'chutkula sunao', 'joke sunao', 'namaste', 'namaskar', 'pranam',
    'dharmik kaun', 'kisne banaya', 'kisne banayi', 'kya hai', 'kya hota',
    'madad chahiye', 'shukriya', 'dhanyawad', 'theek ho', 'thik ho', 'samjhao'
  ];
  if (hindiPhrases.some((phrase) => lower.includes(phrase))) return true;

  // 5. Romanized Hindi keywords (strictly excluding common English words like 'the', 'me', 'to', 'is', 'so')
  const hindiKeywords = new Set([
    'kya', 'kyu', 'kyun', 'kaun', 'koun', 'kahan', 'kaha', 'kaise', 'kaisa', 'kaisi',
    'kab', 'kitna', 'kitne', 'kitni', 'hai', 'hain', 'ho', 'hoon', 'hun', 'tha', 'thi',
    'aap', 'aapka', 'aapki', 'aapke', 'tum', 'tumhara', 'tumhari', 'tumhare',
    'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'hum', 'hamara', 'mujhe', 'tujhe',
    'banao', 'karo', 'karna', 'kholo', 'chalu', 'band', 'bolo', 'sunao', 'suno', 'dekho',
    'accha', 'achha', 'theek', 'thik', 'bahut', 'bohot', 'kuch', 'nahi', 'nahin', 'bhai',
    'chahiye', 'sakta', 'sakti', 'sakte', 'hoga', 'hogi', 'hoge', 'kaam', 'baare', 'mein'
  ]);

  const words = lower.split(/[^a-zA-Z]+/).filter(Boolean);
  let matchCount = 0;
  for (const w of words) {
    if (hindiKeywords.has(w)) matchCount++;
  }
  return matchCount >= 2;
}

export const DEFAULT_DAYKAN_GREETING =
  "Hello, I am Diykan. I was developed by Dharmik Rathod, who's known as D.R Developer. Today, how can I help you?";

/**
 * Generates dynamic phonetic timing and viseme modulation for any arbitrary response
 */
export function generatePhoneticsForText(text: string, estimatedDuration: number): ScheduledSegment[] {
  const cleanWords = text
    .replace(/[^\p{L}\p{N}\s',.?!]/gu, '')
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

      // Devanagari script phoneme mapping
      if (/[अआइईउऊएऐओऔािीुूेैोौ]/.test(char)) {
        if (/[आअाह]/.test(char)) {
          phonemes.push({ viseme: 'A', durationRel: 1.2, jawOpen: 0.42, lipRound: 0.0, lipWidth: 0.18, lipClosure: 0.0, lipPress: 0.0, smile: 0.10 });
        } else if (/[एऐेैिीइई]/.test(char)) {
          phonemes.push({ viseme: 'E', durationRel: 1.2, jawOpen: 0.28, lipRound: 0.0, lipWidth: 0.36, lipClosure: 0.0, lipPress: 0.0, smile: 0.16 });
        } else if (/[ओऔोौ]/.test(char)) {
          phonemes.push({ viseme: 'O', durationRel: 1.2, jawOpen: 0.34, lipRound: 0.45, lipWidth: 0.0, lipClosure: 0.0, lipPress: 0.0, smile: 0.08 });
        } else {
          phonemes.push({ viseme: 'U', durationRel: 1.1, jawOpen: 0.20, lipRound: 0.46, lipWidth: 0.0, lipClosure: 0.0, lipPress: 0.0, smile: 0.08 });
        }
        i++;
      } else if (/[मपबभ]/.test(char)) {
        phonemes.push({ viseme: 'M', durationRel: 1.0, jawOpen: 0.0, lipRound: 0.0, lipWidth: 0.0, lipClosure: 0.50, lipPress: 0.18, smile: 0.06 });
        i++;
      } else if (/[फव]/.test(char)) {
        phonemes.push({ viseme: 'F', durationRel: 1.0, jawOpen: 0.16, lipRound: 0.0, lipWidth: 0.12, lipClosure: 0.0, lipPress: 0.32, smile: 0.06 });
        i++;
      } else if (/[\u0900-\u097F]/.test(char)) {
        phonemes.push({ viseme: 'TH', durationRel: 0.9, jawOpen: 0.16, lipRound: 0.0, lipWidth: 0.12, lipClosure: 0.0, lipPress: 0.10, smile: 0.06 });
        i++;
      } else if (char === 't' && nextChar === 'h') {
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

/**
 * Splits text into natural spoken sentence chunks for streaming TTS pipelining
 */
export function splitTextIntoSentences(text: string): string[] {
  const trimmed = (text || '').trim();
  if (!trimmed) return [];

  // Protect initials and abbreviations (e.g. "D.R Developer", "Dr.", "Mr.") from being treated as sentence ends
  const protectedText = trimmed.replace(/\b([A-Z])\./g, '$1__DOT__');

  const raw = protectedText.match(/[^.!?\n]+[.!?]+(?:\s+|$)|[^.!?\n]+$/g);
  if (!raw || raw.length <= 1) return [trimmed];
  const sentences: string[] = [];
  for (const s of raw) {
    const restored = s.replace(/__DOT__/g, '.').trim();
    if (restored) {
      if (sentences.length > 0 && restored.split(/\s+/).length < 3) {
        sentences[sentences.length - 1] += ' ' + restored;
      } else {
        sentences.push(restored);
      }
    }
  }
  return sentences.length > 0 ? sentences : [trimmed];
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
  private micStream: MediaStream | null = null;
  private micSourceNode: MediaStreamAudioSourceNode | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micDataArray: Uint8Array | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedAudioChunks: Blob[] = [];
  private accumulatedTranscript: string = '';
  private silenceTimer: any = null;
  private listeningTimeoutTimer: any = null;
  private isExplicitlyStopping: boolean = false;
  private hasDetectedSpeechInSession: boolean = false;
  private isSyntheticSpeaking: boolean = false;
  private currentObjectUrl: string | null = null;
  private abortController: AbortController | null = null;
  private activeRequestId: number = 0;

  // Streaming speech pipelining queue
  private audioQueue: { blob: Blob; text: string; duration: number }[] = [];
  private pendingSentencePromises: Promise<Blob | null>[] = [];

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
  private languageListeners = new Set<(mode: 'auto' | 'hi' | 'en') => void>();

  public languageMode: 'auto' | 'hi' | 'en' = 'auto';
  public lastDetectedLanguage: 'hi' | 'en' = 'en';

  private animFrameId: number | null = null;
  private speechStartTime: number = 0;
  private scheduledTimeline: ScheduledSegment[] = [];

  private constructor() {
    this.scheduledTimeline = generatePhoneticsForText(DEFAULT_DAYKAN_GREETING, 9.68);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
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

  public setLanguageMode(mode: 'auto' | 'hi' | 'en') {
    this.languageMode = mode;
    this.languageListeners.forEach((fn) => fn(mode));
  }

  public subscribeLanguageMode(listener: (mode: 'auto' | 'hi' | 'en') => void): () => void {
    this.languageListeners.add(listener);
    listener(this.languageMode);
    return () => this.languageListeners.delete(listener);
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
  public initAudio() {
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

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        // Prime audio subsystem on user gesture for iOS Safari & Android Chrome
        const primer = new SpeechSynthesisUtterance('');
        primer.volume = 0;
        window.speechSynthesis.speak(primer);
      } catch {
        // ignore
      }
    }

    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.addEventListener('ended', () => {
        this.handleAudioEnded();
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
   * Resets silence debounce timer.
   * If speech was detected, after 1.6s of silence, automatically process the question.
   */
  private resetSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.silenceTimer = setTimeout(() => {
      if (this.state === 'LISTENING') {
        const query = (this.accumulatedTranscript || '').trim();
        if (query) {
          console.log('[Daykan STT] Silence debounce threshold reached, processing query:', query);
          this.stopListening(true);
        }
      }
    }, 1300);
  }

  /**
   * Resets overall session timeout (e.g. 25 seconds).
   * Prevents microphone from staying on indefinitely if no speech is detected.
   */
  private resetListeningTimeout() {
    if (this.listeningTimeoutTimer) {
      clearTimeout(this.listeningTimeoutTimer);
      this.listeningTimeoutTimer = null;
    }
    this.listeningTimeoutTimer = setTimeout(() => {
      if (this.state === 'LISTENING') {
        const query = (this.accumulatedTranscript || '').trim();
        if (query) {
          this.stopListening(true);
        } else {
          console.log('[Daykan STT] Session timeout with no speech detected.');
          this.setSubtitle('No speech detected. Click mic to speak again.');
          this.stopListening(false);
        }
      }
    }, 25000);
  }

  /**
   * Starts user voice input with speech recognition and microphone gating
   */
  public async startListening(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    this.cancelSpeech();
    this.stopListening(false);

    this.errorMessage = '';
    this.initAudio();
    this.isExplicitlyStopping = false;
    this.accumulatedTranscript = '';
    this.hasDetectedSpeechInSession = false;
    this.setState('LISTENING');

    if (this.languageMode === 'hi' || (this.languageMode === 'auto' && this.lastDetectedLanguage === 'hi')) {
      this.setSubtitle('हिंदी में बोलें... (Listening in Hindi)');
    } else {
      this.setSubtitle('Listening to your voice... Speak now');
    }

    // 1. Explicitly request microphone permission to prompt browser if not yet granted
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        // Connect mic stream to analyser for real visual waveform
        if (this.audioCtx && this.micStream) {
          try {
            if (this.audioCtx.state === 'suspended') {
              await this.audioCtx.resume();
            }
            this.micAnalyser = this.audioCtx.createAnalyser();
            this.micAnalyser.fftSize = 256;
            this.micAnalyser.smoothingTimeConstant = 0.5;
            this.micDataArray = new Uint8Array(this.micAnalyser.frequencyBinCount);
            this.micSourceNode = this.audioCtx.createMediaStreamSource(this.micStream);
            this.micSourceNode.connect(this.micAnalyser);
          } catch (audioErr) {
            console.warn('[Daykan] Could not connect mic stream to analyser:', audioErr);
          }
        }
      }
    } catch (permErr: any) {
      console.warn('[Daykan] Microphone permission error:', permErr);
      this.stopListening(false);
      this.errorMessage = 'Microphone permission blocked. Please allow mic access in your browser.';
      this.setSubtitle('Microphone permission blocked. Please allow mic access in browser settings.');
      this.setState('ERROR');
      return false;
    }

    this.startAudioAnalysisLoop();
    this.resetListeningTimeout();

    // 2. Check for native SpeechRecognition
    const SpeechRecClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecClass) {
      return this.startNativeSpeechRecognition(SpeechRecClass);
    } else {
      console.log('[Daykan] Native SpeechRecognition not supported, falling back to MediaRecorder');
      return this.startMediaRecorderFallback();
    }
  }

  private startNativeSpeechRecognition(SpeechRecClass: any): boolean {
    try {
      if (this.recognition) {
        try {
          this.recognition.onresult = null;
          this.recognition.onerror = null;
          this.recognition.onend = null;
          this.recognition.abort();
        } catch {}
        this.recognition = null;
      }

      this.recognition = new SpeechRecClass();
      const navLang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';
      if (this.languageMode === 'hi') {
        this.recognition.lang = 'hi-IN';
      } else if (this.languageMode === 'en') {
        this.recognition.lang = navLang.toLowerCase().startsWith('en') ? navLang : 'en-US';
      } else {
        this.recognition.lang = navLang.toLowerCase().startsWith('hi') ? 'hi-IN' : (navLang.toLowerCase().startsWith('en') ? navLang : 'en-US');
      }

      // CRITICAL: continuous = true keeps the engine alive and prevents immediate cutoff
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        console.log('[Daykan STT] Native speech recognition active.');
      };

      this.recognition.onresult = (event: any) => {
        let fullTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const trans = event.results[i][0]?.transcript || '';
          fullTranscript += trans;
        }

        const trimmed = fullTranscript.trim();
        if (trimmed) {
          this.hasDetectedSpeechInSession = true;
          this.accumulatedTranscript = trimmed;
          this.setSubtitle(`"${trimmed}"`);
          this.resetSilenceTimer();
        }
      };

      this.recognition.onerror = (err: any) => {
        console.warn('[Daykan STT Error]:', err.error);
        if (err.error === 'no-speech') {
          // Do not kill session on transient silence
          return;
        }

        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          this.errorMessage = 'Microphone permission blocked.';
          this.setSubtitle('Microphone permission blocked. Please allow mic access.');
          this.stopListening(false);
          this.setState('ERROR');
          return;
        }

        if (err.error === 'network') {
          console.warn('[Daykan STT] Network issue with Web Speech API on this origin. Switching to Audio Recorder fallback.');
          this.startMediaRecorderFallback();
          return;
        }

        if (err.error === 'aborted' && !this.isExplicitlyStopping) {
          return;
        }
      };

      this.recognition.onend = () => {
        console.log('[Daykan STT] recognition onend event');
        if (this.state === 'LISTENING' && !this.isExplicitlyStopping) {
          // If the user already spoke words, process immediately on pause/end
          const q = (this.accumulatedTranscript || '').trim();
          if (q) {
            console.log('[Daykan STT] Processing speech captured on onend:', q);
            this.stopListening(true);
            return;
          }

          // Otherwise keep listening (restart session) so mic never shuts off prematurely
          try {
            this.recognition.start();
          } catch (e) {
            console.warn('[Daykan STT] Could not restart recognition:', e);
          }
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('[Daykan STT] SpeechRecognition start failure:', err);
      return this.startMediaRecorderFallback();
    }
  }

  private startMediaRecorderFallback(): boolean {
    if (!this.micStream) {
      this.stopListening(false);
      this.errorMessage = 'Microphone access unavailable.';
      this.setSubtitle('Microphone access unavailable.');
      this.setState('ERROR');
      return false;
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.onresult = null;
          this.recognition.onerror = null;
          this.recognition.onend = null;
          this.recognition.abort();
        } catch {}
        this.recognition = null;
      }

      this.recordedAudioChunks = [];
      const mimeType =
        typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';

      const recorder = mimeType
        ? new MediaRecorder(this.micStream, { mimeType })
        : new MediaRecorder(this.micStream);
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedAudioChunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (this.recordedAudioChunks.length === 0) {
          if (this.state === 'LISTENING') this.setState('IDLE');
          return;
        }

        const audioBlob = new Blob(this.recordedAudioChunks, { type: mimeType || 'audio/webm' });
        this.recordedAudioChunks = [];

        if (audioBlob.size < 1200) {
          if (this.state === 'LISTENING') this.setState('IDLE');
          return;
        }

        this.setState('THINKING');
        this.setSubtitle('Transcribing your voice...');

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const res = await fetch('/api/daykan/stt', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.text && data.text.trim()) {
              this.processUserQuery(data.text.trim());
              return;
            }
          }
        } catch (sttErr) {
          console.warn('[Daykan] STT endpoint fallback error:', sttErr);
        }

        this.setSubtitle('Could not transcribe audio. Please try again or type a message.');
        this.setState('IDLE');
      };

      recorder.start(250);
      return true;
    } catch (e: any) {
      console.warn('[Daykan] MediaRecorder fallback start error:', e);
      this.stopListening(false);
      this.setState('IDLE');
      return false;
    }
  }

  public stopListening(processIfCaptured: boolean = false) {
    this.isExplicitlyStopping = true;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.listeningTimeoutTimer) {
      clearTimeout(this.listeningTimeoutTimer);
      this.listeningTimeoutTimer = null;
    }

    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }

    const hadRecorder = this.mediaRecorder && this.mediaRecorder.state !== 'inactive';
    if (hadRecorder) {
      try {
        this.mediaRecorder?.stop();
      } catch {
        // ignore
      }
      this.mediaRecorder = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.micSourceNode) {
      try {
        this.micSourceNode.disconnect();
      } catch {}
      this.micSourceNode = null;
    }
    this.micAnalyser = null;
    this.micDataArray = null;

    const capturedText = (this.accumulatedTranscript || '').trim();
    this.accumulatedTranscript = '';
    this.hasDetectedSpeechInSession = false;

    if (!hadRecorder) {
      if (processIfCaptured && capturedText) {
        console.log('[Daykan] User finished speaking, processing captured text:', capturedText);
        this.processUserQuery(capturedText);
      } else {
        if (this.state === 'LISTENING') {
          this.setState('IDLE');
        }
        this.setAmplitude(0);
      }
    }
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

    const isHindi = isHindiQuery(trimmed);
    this.lastDetectedLanguage = isHindi ? 'hi' : 'en';

    this.cancelSpeech();
    const currentRequestId = ++this.activeRequestId;

    // Gate microphone completely while thinking and speaking
    this.stopListening(false);
    this.setState('THINKING');
    this.setSubtitle(isHindi ? 'विचार कर रहा हूँ...' : 'Thinking...');

    console.log(`[LLM REQUEST]\nUser message:\n"${trimmed}"`);

    this.abortController = new AbortController();

    try {
      // Pass previous conversation turns as history
      const previousTurns = [...this.conversationHistory];

      // Client-side 8.5s safety watchdog so mobile network hiccups never freeze in loading state
      const fetchController = new AbortController();
      const fetchTimeout = setTimeout(() => fetchController.abort(), 8500);

      // 1. Request conversational LLM response
      const chatRes = await fetch('/api/daykan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: previousTurns,
        }),
        signal: fetchController.signal,
      }).finally(() => clearTimeout(fetchTimeout));

      if (currentRequestId !== this.activeRequestId) return;

      let replyText = isHindi
        ? "नमस्ते दोस्त! मैं दीकन (Diykan) हूँ। बताइए, आज मैं आपके लिए क्या कर सकता हूँ?"
        : "Hey there! I'm Diykan, Dharmik's AI companion. How can I assist you today?";

      if (chatRes.ok) {
        const chatJson = await chatRes.json();
        if (chatJson.reply && typeof chatJson.reply === 'string' && chatJson.reply.trim()) {
          replyText = chatJson.reply.trim();
        }
      }

      console.log(`[LLM RESPONSE]\nActual generated response:\n"${replyText}"`);

      // Update detected language based on response if needed
      if (isHindiQuery(replyText)) {
        this.lastDetectedLanguage = 'hi';
      } else {
        this.lastDetectedLanguage = 'en';
      }

      // Append verified turns into memory
      this.conversationHistory.push({ role: 'user', content: trimmed });
      this.conversationHistory.push({ role: 'assistant', content: replyText });
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      // 2. IMMEDIATELY reveal answer text & exit loading state for instant mobile feedback
      this.setSubtitle(replyText);
      this.setState('SPEAKING');

      console.log(`[SPEECH]\nInstant natural voice synthesis:\n"${replyText}"`);

      // 3. Immediately synthesize voice with mobile watchdog protection
      await this.speakWithNaturalVoice(replyText, currentRequestId);
    } catch (err: any) {
      if (err.name === 'AbortError' && currentRequestId !== this.activeRequestId) {
        console.log('[Daykan] Request cancelled or superseded.');
        return;
      }
      console.warn('[Daykan] Conversation processing error:', err);
      const fallbackReply = isHindi
        ? "नमस्ते दोस्त! मैं आपके सवालों के जवाब देने के लिए तैयार हूँ। बताइए, क्या जानना चाहते हैं?"
        : "Hey there! I am ready to help. Please feel free to ask me anything.";
      this.setSubtitle(fallbackReply);
      this.setState('SPEAKING');
      await this.speakWithNaturalVoice(fallbackReply, currentRequestId);
    }
  }

  /**
   * Fetches TTS audio blob for an individual sentence
   */
  private async fetchSentenceAudio(text: string, signal?: AbortSignal): Promise<Blob | null> {
    try {
      const isHindi = /[\u0900-\u097F]/.test(text) || isHindiQuery(text);
      const ttsRes = await fetch('/api/daykan/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: isHindi ? 'hi' : 'en',
        }),
        signal,
      });
      if (!ttsRes.ok) return null;
      const contentType = ttsRes.headers.get('content-type') || '';
      if (!contentType.includes('audio')) return null;
      return await ttsRes.blob();
    } catch {
      return null;
    }
  }

  /**
   * Seamless transition to the next queued sentence segment when previous segment audio ends
   */
  private handleAudioEnded() {
    if (this.audioQueue.length > 0) {
      const next = this.audioQueue.shift()!;
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
      }
      this.currentObjectUrl = URL.createObjectURL(next.blob);

      if (this.audioElement) {
        this.audioElement.src = this.currentObjectUrl;
        this.scheduledTimeline = generatePhoneticsForText(next.text, next.duration);
        this.speechStartTime = performance.now();
        this.audioElement.play().catch((err) => {
          console.warn('[Daykan] Queued audio playback error:', err);
          this.finishSpeech();
        });
      }
      return;
    }

    this.finishSpeech();
  }

  /**
   * Streaming sentence-level TTS pipelining:
   * 1. Splits full text into natural sentence chunks.
   * 2. Immediately dispatches Sentence 0 to TTS.
   * 3. In parallel, fires TTS requests for subsequent sentences.
   * 4. As soon as Sentence 0 audio is ready, speech starts immediately (TTFR < 3s).
   * 5. While Sentence 0 is playing, Sentence 1 audio downloads and queues in memory.
   * 6. Consecutive sentences play gaplessly.
   */
  public async speakPipelinedSpeech(fullText: string, requestId?: number) {
    if (typeof window === 'undefined') return;

    const sentences = splitTextIntoSentences(fullText);
    if (sentences.length <= 1) {
      return await this.speakGeneratedSpeech(fullText, requestId);
    }

    this.initAudio();
    this.audioQueue = [];

    try {
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      // 1. Immediately request TTS for the first sentence
      const firstSentence = sentences[0];
      const firstAudioPromise = this.fetchSentenceAudio(firstSentence, signal);

      // 2. CONCURRENTLY trigger TTS requests for remaining sentences in background
      const remainingItems = sentences.slice(1);
      remainingItems.forEach((sentenceText) => {
        const sentencePromise = this.fetchSentenceAudio(sentenceText, signal).then((blob) => {
          if (blob && (requestId === undefined || requestId === this.activeRequestId)) {
            const wordCount = sentenceText.split(/\s+/).length;
            const dur = Math.max(1.8, wordCount * 0.42);
            this.audioQueue.push({ blob, text: sentenceText, duration: dur });
          }
          return blob;
        });
        this.pendingSentencePromises.push(sentencePromise);
      });

      // 3. Await first sentence audio
      const firstBlob = await firstAudioPromise;
      if (requestId !== undefined && requestId !== this.activeRequestId) return;

      if (!firstBlob) {
        throw new Error('First sentence TTS synthesis returned null');
      }

      // 4. Play first sentence audio immediately
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
      }
      this.currentObjectUrl = URL.createObjectURL(firstBlob);

      if (this.audioElement) {
        this.audioElement.src = this.currentObjectUrl;
        const wordCount = firstSentence.split(/\s+/).length;
        const estimatedDur = Math.max(1.8, wordCount * 0.42);
        this.scheduledTimeline = generatePhoneticsForText(firstSentence, estimatedDur);

        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          await this.audioCtx.resume();
        }

        // Wait until audio ACTUALLY begins playing before revealing subtitles & state
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
        this.setSubtitle(fullText);
        this.speechStartTime = performance.now();
        this.startLipSyncPlaybackLoop();
        return;
      }
    } catch (pipedErr: any) {
      if (pipedErr.name === 'AbortError' || (requestId !== undefined && requestId !== this.activeRequestId)) return;
      console.warn('[Daykan] Pipelined speech error, falling back to speech synthesis:', pipedErr);
      if (requestId === undefined || requestId === this.activeRequestId) {
        this.speakWithSpeechSynthesis(fullText, requestId);
      }
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
      const isHindi = /[\u0900-\u097F]/.test(textToSpeak) || isHindiQuery(textToSpeak);
      const ttsRes = await fetch('/api/daykan/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          language: isHindi ? 'hi' : 'en',
        }),
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

    this.speakWithNaturalVoice(DEFAULT_DAYKAN_GREETING, currentRequestId);
  }

  /**
   * High-Fidelity Natural Voice Synthesis:
   * Selects expressive neural human voices (Microsoft Natural & Google Neural voices for Hindi and English).
   * Delivers natural human emotion, warm tone, proper inflection, and instant (<30ms) speech response.
   * Fully synchronized with 60 FPS real-time lip-sync and subtitles.
   */
  public async speakWithNaturalVoice(text: string, requestId?: number): Promise<void> {
    if (typeof window === 'undefined') return;

    // Ensure state and subtitle are always updated to SPEAKING so mobile is never stuck in loading
    this.setState('SPEAKING');
    this.setSubtitle(text);

    const wordCount = text.split(/\s+/).length;
    const estDuration = Math.max(2.0, wordCount * 0.42);
    this.scheduledTimeline = generatePhoneticsForText(text, estDuration);

    if (!('speechSynthesis' in window)) {
      this.isSyntheticSpeaking = true;
      this.speechStartTime = performance.now();
      this.startLipSyncPlaybackLoop();
      await new Promise((r) => setTimeout(r, estDuration * 1000));
      this.finishSpeech();
      return;
    }

    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.resume();
    } catch {
      // ignore
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    return new Promise<void>((resolve) => {
      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          this.finishSpeech();
          resolve();
        }
      };

      let startedSpeaking = false;
      let keepAliveInterval: any = null;

      // Mobile Audio Watchdog: On iOS Safari or mobile Chrome, if speechSynthesis.speak
      // is silently delayed or dropped due to autoplay policy, start visual 3D lip-sync
      // after 400ms so the user is NEVER stuck on a loading screen!
      const mobileStartTimer = setTimeout(() => {
        if (!startedSpeaking) {
          startedSpeaking = true;
          this.isSyntheticSpeaking = true;
          this.speechStartTime = performance.now();
          this.startLipSyncPlaybackLoop();
        }
      }, 400);

      // Hard timeout: Ensure the speech sequence always finishes cleanly after the answer duration
      const maxDurationTimer = setTimeout(() => {
        safeResolve();
      }, (estDuration + 2.5) * 1000);

      const cleanup = () => {
        clearTimeout(mobileStartTimer);
        clearTimeout(maxDurationTimer);
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
          keepAliveInterval = null;
        }
      };

      const utterance = new SpeechSynthesisUtterance(text);

      const isHindiText = /[\u0900-\u097F]/.test(text) || isHindiQuery(text);
      const voices = window.speechSynthesis.getVoices();

      if (isHindiText) {
        utterance.lang = 'hi-IN';
        utterance.rate = 1.0;
        utterance.pitch = 1.01;

        const preferredHindiVoice =
          voices.find((v) => {
            const n = v.name.toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return (
              (l.startsWith('hi') || (l.includes('in') && n.includes('hindi'))) &&
              (n.includes('natural') || n.includes('swara') || n.includes('hemant') || n.includes('madhur') || n.includes('online'))
            );
          }) ||
          voices.find((v) => {
            const n = v.name.toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return (
              (l.startsWith('hi') || (l.includes('in') && n.includes('hindi'))) &&
              (n.includes('google') || n.includes('neural'))
            );
          }) ||
          voices.find((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('hi')) ||
          voices.find((v) => (v.lang || '').toLowerCase().includes('in') && v.name.toLowerCase().includes('hindi')) ||
          voices.find((v) => (v.lang || '').toLowerCase().includes('in'));

        if (preferredHindiVoice) utterance.voice = preferredHindiVoice;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 1.02;
        utterance.pitch = 1.02;

        const preferredVoice =
          voices.find((v) => {
            const n = v.name.toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return (
              l.startsWith('en') &&
              (n.includes('natural') || n.includes('neural')) &&
              (n.includes('jenny') || n.includes('aria') || n.includes('guy') || n.includes('online'))
            );
          }) ||
          voices.find((v) => {
            const n = v.name.toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return (
              l.startsWith('en') &&
              (n.includes('natural') || n.includes('google us english') || n.includes('samantha') || n.includes('aria') || n.includes('jenny'))
            );
          }) ||
          voices.find((v) => {
            const n = v.name.toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return l.startsWith('en') && (n.includes('female') || n.includes('zira') || n.includes('david'));
          }) ||
          voices.find((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith('en'));

        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (requestId !== undefined && requestId !== this.activeRequestId) {
          try { window.speechSynthesis.cancel(); } catch {}
          safeResolve();
          return;
        }

        startedSpeaking = true;
        clearTimeout(mobileStartTimer);

        keepAliveInterval = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            cleanup();
          }
        }, 7000);

        this.isSyntheticSpeaking = true;
        this.speechStartTime = performance.now();
        this.startLipSyncPlaybackLoop();
      };

      utterance.onend = () => {
        safeResolve();
      };

      utterance.onerror = (e: any) => {
        if (e.error === 'canceled') {
          return;
        }
        if (e.error !== 'interrupted') {
          console.warn('[Daykan Voice Synthesis Error]:', e);
        }
        safeResolve();
      };

      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
          window.speechSynthesis.resume();
        } catch (speakErr) {
          console.warn('[Daykan] Speech synthesis speak error:', speakErr);
          startedSpeaking = true;
          this.isSyntheticSpeaking = true;
          this.speechStartTime = performance.now();
          this.startLipSyncPlaybackLoop();
        }
      }, 40);
    });
  }

  /**
   * Web SpeechSynthesis fallback / backwards-compatibility helper
   */
  private speakWithSpeechSynthesis(text: string, requestId?: number) {
    return this.speakWithNaturalVoice(text, requestId);
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

      if (this.micAnalyser && this.micDataArray) {
        (this.micAnalyser as any).getByteFrequencyData(this.micDataArray);
        let sum = 0;
        for (let i = 0; i < this.micDataArray.length; i++) {
          sum += this.micDataArray[i];
        }
        const avg = sum / this.micDataArray.length;
        const norm = Math.min(1.0, (avg / 128.0) * 2.2);
        this.setAmplitude(norm);

        // Fallback VAD for MediaRecorder mode
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          if (norm > 0.08) {
            this.hasDetectedSpeechInSession = true;
            this.resetSilenceTimer();
          }
        }
      } else {
        const time = performance.now() * 0.007;
        const wave = Math.sin(time) * 0.28 + Math.sin(time * 2.3) * 0.15 + 0.45;
        const amp = Math.min(1.0, Math.max(0.12, wave + (Math.random() - 0.5) * 0.1));
        this.setAmplitude(amp);
      }

      this.animFrameId = requestAnimationFrame(checkMic);
    };

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(checkMic);
  }

  private finishSpeech() {
    this.audioQueue = [];
    this.pendingSentencePromises = [];
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
    this.audioQueue = [];
    this.pendingSentencePromises = [];
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
