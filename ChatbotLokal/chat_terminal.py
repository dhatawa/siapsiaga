"""SiagaBot Lokal — antarmuka terminal.

Jalankan:  python chat_terminal.py            (pakai model default)
           python chat_terminal.py gemma2:2b  (pakai model lain)

Perintah:  /reset  = mulai percakapan baru
           /keluar = keluar
"""
import sys

from siaga_core import MODEL, explain_error, stream_reply

# Agar karakter Indonesia & simbol tampil benar di terminal Windows.
sys.stdout.reconfigure(encoding="utf-8")


def main():
    model = sys.argv[1] if len(sys.argv) > 1 else MODEL
    history = []

    print("=" * 60)
    print(f" SiagaBot Lokal  |  model: {model}")
    print(" Ketik pertanyaan Anda. /reset = percakapan baru, /keluar = keluar")
    print("=" * 60)

    while True:
        try:
            text = input("\nAnda     : ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nSampai jumpa, tetap siaga!")
            break

        if not text:
            continue
        if text.lower() in {"/keluar", "/exit", "/quit"}:
            print("Sampai jumpa, tetap siaga!")
            break
        if text.lower() == "/reset":
            history.clear()
            print("Percakapan direset.")
            continue

        history.append({"role": "user", "content": text})
        print("SiagaBot : ", end="", flush=True)

        answer = ""
        try:
            for part in stream_reply(history, model):
                print(part, end="", flush=True)
                answer += part
            print()
        except KeyboardInterrupt:
            print("\n[jawaban dihentikan]")
        except Exception as err:
            print("\n" + explain_error(err, model))
            history.pop()  # buang pertanyaan yang gagal dijawab
            continue

        history.append({"role": "assistant", "content": answer})


if __name__ == "__main__":
    main()
