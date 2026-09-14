import json
import urllib.request
import urllib.error

DAYKAN_API = "http://localhost:5000/api/daykan/chat"
TTS_API = "http://127.0.0.1:8880/v1/audio/speech"

def ask_daykan(message: str, history=None):
    if history is None:
        history = []
    payload = json.dumps({"message": message, "history": history}).encode("utf-8")
    req = urllib.request.Request(
        DAYKAN_API,
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data
    except Exception as e:
        return {"error": str(e)}

def test_tts(text: str):
    payload = json.dumps({
        "model": "kokoro",
        "input": text,
        "voice": "af_bella",
        "response_format": "mp3"
    }).encode("utf-8")
    req = urllib.request.Request(
        TTS_API,
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            audio_bytes = resp.read()
            return len(audio_bytes)
    except Exception as e:
        return f"TTS Error: {e}"

def run_tests():
    print("==================================================")
    print("DAYKAN <-> JARVIS INTEGRATION TEST SUITE")
    print("==================================================")

    # Test 1: React definition
    print("\n--- Test 1: Technical Knowledge ('What is React?') ---")
    r1 = ask_daykan("What is React?")
    print(f"Reply: {r1.get('reply', r1)}")
    assert "react" in str(r1).lower() or "javascript" in str(r1).lower() or "library" in str(r1).lower()

    # Test 2: General Knowledge ('What is the longest road in the world?')
    print("\n--- Test 2: General Knowledge ('What is the longest road in the world?') ---")
    r2 = ask_daykan("What is the longest road in the world?")
    print(f"Reply: {r2.get('reply', r2)}")
    assert "pan-american" in str(r2).lower() or "highway" in str(r2).lower()

    # Test 3: AI explanation in simple words
    print("\n--- Test 3: Simple Explanation ('Explain artificial intelligence in simple words.') ---")
    r3 = ask_daykan("Explain artificial intelligence in simple words.")
    print(f"Reply: {r3.get('reply', r3)}")

    # Test 4: Joke
    print("\n--- Test 4: Joke ('Tell me a joke.') ---")
    r4 = ask_daykan("Tell me a joke.")
    print(f"Reply: {r4.get('reply', r4)}")

    # Test 5: Who are you?
    print("\n--- Test 5: Identity ('Who are you?') ---")
    r5 = ask_daykan("Who are you?")
    print(f"Reply: {r5.get('reply', r5)}")

    # Test 6: Conversation Continuity / History
    print("\n--- Test 6: Memory & Continuity ---")
    history = [
        {"role": "user", "content": "My favorite color is neon purple."},
        {"role": "assistant", "content": "Got it! Neon purple is a striking color."}
    ]
    r6 = ask_daykan("What is my favorite color?", history)
    print(f"Reply: {r6.get('reply', r6)}")
    assert "purple" in str(r6).lower()

    # Test 7: System Monitoring Workflow / Action execution
    print("\n--- Test 7: Action Execution ('Check my system status') ---")
    r7 = ask_daykan("Check my system status")
    print(f"Reply: {r7.get('reply', r7)}")
    print(f"Actions executed: {r7.get('actions_executed')}")

    # Test 8: Weather Report Action execution
    print("\n--- Test 8: Weather Action Execution ('What is the weather in Tokyo?') ---")
    r8 = ask_daykan("What is the weather in Tokyo?")
    print(f"Reply: {r8.get('reply', r8)}")
    print(f"Actions executed: {r8.get('actions_executed')}")

    # Test 9: Kokoro TTS Audio Generation
    print("\n--- Test 9: Kokoro TTS Audio Generation on :8880 ---")
    sample_text = r1.get('reply', 'React is a popular frontend library.')[:100]
    audio_size = test_tts(sample_text)
    print(f"Generated audio size: {audio_size} bytes")
    assert isinstance(audio_size, int) and audio_size > 1000

    print("\n==================================================")
    print("ALL INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
