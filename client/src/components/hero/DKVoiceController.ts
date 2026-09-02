/**
 * DK Voice & Audio Controller
 * Analyzes audio amplitude in real time to drive Three.js particle vibrations
 * and coordinates speech synthesis / speech recognition for DK.
 */

export class DKVoiceController {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isSpeaking: boolean = false;
  private isListening: boolean = false;
  private mediaStream: MediaStream | null = null;
  private animationId: number | null = null;

  public currentAmplitude: number = 0;
  public onStateChange?: (state: 'IDLE' | 'SPEAKING' | 'LISTENING' | 'THINKING') => void;

  constructor() {
    // Lazy AudioContext on client
  }

  private initAudioContext() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }
    }
  }

  /**
   * Speaks the initial DK introduction and drives particle amplitude
   */
  public speakIntroduction(onComplete?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const text =
      "Hello, I am DIY KAN — DK for short. I'm Dr. Developer's AI assistant. How can I help you today? Do you have a message for Dr. Developer?";

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick modern natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Arthur')) &&
        v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange('SPEAKING');
      this.startSimulatedOrAudioAnalysis();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentAmplitude = 0;
      if (this.onStateChange) this.onStateChange('IDLE');
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentAmplitude = 0;
      if (this.onStateChange) this.onStateChange('IDLE');
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Speaks a custom response text
   */
  public speakResponse(text: string, onComplete?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    this.initAudioContext();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange('SPEAKING');
      this.startSimulatedOrAudioAnalysis();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentAmplitude = 0;
      if (this.onStateChange) this.onStateChange('IDLE');
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Speech analysis / Voice envelope simulation
   */
  private startSimulatedOrAudioAnalysis() {
    let phase = 0;
    const updateLoop = () => {
      if (!this.isSpeaking && !this.isListening) {
        this.currentAmplitude = 0;
        return;
      }

      if (this.analyser && this.dataArray && this.mediaStream) {
        // Real microphone input data
        (this.analyser as any).getByteFrequencyData(this.dataArray);
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
          sum += this.dataArray[i];
        }
        const avg = sum / this.dataArray.length;
        this.currentAmplitude = Math.min(1.0, avg / 128.0);
      } else {
        // Natural speech modulation wave (syllable cadences)
        phase += 0.22;
        const wave = Math.sin(phase) * Math.cos(phase * 1.7) * Math.sin(phase * 0.4);
        const cadence = Math.max(0.0, wave);
        this.currentAmplitude = cadence * (0.6 + Math.random() * 0.4);
      }

      this.animationId = requestAnimationFrame(updateLoop);
    };

    this.animationId = requestAnimationFrame(updateLoop);
  }

  /**
   * Start listening through user microphone
   */
  public async startListening(onTranscription?: (text: string) => void): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    this.initAudioContext();
    if (this.onStateChange) this.onStateChange('LISTENING');
    this.isListening = true;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (this.audioCtx && this.analyser) {
          const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
          source.connect(this.analyser);
        }
      }

      // Check for SpeechRecognition
      const SpeechRec = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.stopListening();
          if (onTranscription) onTranscription(transcript);
        };

        recognition.onerror = () => {
          this.stopListening();
        };

        recognition.onend = () => {
          this.stopListening();
        };

        recognition.start();
      } else {
        // Fallback timer if speech recognition is not supported in browser
        setTimeout(() => {
          this.stopListening();
          if (onTranscription) onTranscription("Hello DK, can you tell me more about Dr. Developer?");
        }, 3500);
      }

      this.startSimulatedOrAudioAnalysis();
      return true;
    } catch {
      this.stopListening();
      return false;
    }
  }

  /**
   * Stop listening
   */
  public stopListening() {
    this.isListening = false;
    this.currentAmplitude = 0;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.onStateChange) this.onStateChange('IDLE');
  }

  public dispose() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.stopListening();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
