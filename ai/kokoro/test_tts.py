import os
import sys
import numpy as np
import soundfile as sf
from kokoro import KPipeline

def main():
    print("[Kokoro Test] Initializing KPipeline with lang_code='a' (American English)...")
    # 'a' = American English, 'b' = British English
    pipeline = KPipeline(lang_code='a')

    text = "Hello, I am Daykan. I was developed by Dharmik Rathod, who's known as D.R Developer. Today, how can I help you?"
    voice = 'af_heart' # High-quality natural female voice
    
    print(f"[Kokoro Test] Generating speech using voice: {voice}")
    print(f"[Kokoro Test] Text: \"{text}\"")
    
    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    os.makedirs(output_dir, exist_ok=True)
    out_file = os.path.join(output_dir, 'test.wav')

    # Kokoro generates (graphemes, phonemes, audio)
    generator = pipeline(text, voice=voice, speed=1.0, split_pattern=r'\n+')
    
    audio_chunks = []
    sample_rate = 24000 # Default Kokoro sample rate (24 kHz)
    
    for i, (gs, ps, audio) in enumerate(generator):
        print(f"  Chunk {i+1}: length {len(audio)} samples")
        audio_chunks.append(audio)

    if not audio_chunks:
        print("[Kokoro Test] Error: No audio was generated!")
        sys.exit(1)

    full_audio = np.concatenate(audio_chunks)
    sf.write(out_file, full_audio, sample_rate)
    
    file_size = os.path.getsize(out_file)
    print(f"[Kokoro Test] SUCCESS!")
    print(f"  Saved WAV: {out_file}")
    print(f"  Total samples: {len(full_audio)}")
    print(f"  Sample rate: {sample_rate} Hz")
    print(f"  Duration: {len(full_audio) / sample_rate:.2f} seconds")
    print(f"  File size: {file_size:,} bytes")

if __name__ == '__main__':
    main()
