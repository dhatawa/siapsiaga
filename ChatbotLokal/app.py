"""SiagaBot Lokal — antarmuka web (Streamlit).

Jalankan:  streamlit run app.py
"""
import streamlit as st

from siaga_core import MODEL, available_models, explain_error, stream_reply

EXAMPLES = [
    "Apa saja isi tas siaga bencana?",
    "Apa yang harus saya lakukan saat gempa terjadi di dalam rumah?",
    "Bagaimana tanda-tanda awal tanah longsor?",
    "Air mulai masuk ke rumah, langkah pertama apa?",
]

st.set_page_config(page_title="SiagaBot Lokal", page_icon="🛟", layout="centered")
st.title("🛟 SiagaBot Lokal")
st.caption("Asisten kesiapsiagaan bencana yang berjalan offline di komputer Anda melalui Ollama.")

if "messages" not in st.session_state:
    st.session_state.messages = []

# ---------- Sidebar ----------
with st.sidebar:
    st.header("Pengaturan")
    models = available_models()
    if models:
        default_index = models.index(MODEL) if MODEL in models else 0
        model = st.selectbox("Model", models, index=default_index)
    else:
        model = MODEL
        st.warning(
            "Ollama belum berjalan atau belum ada model yang diunduh.\n\n"
            f"Jalankan di terminal:\n\n`ollama pull {MODEL}`"
        )

    if st.button("🔄 Percakapan baru"):
        st.session_state.messages = []
        st.rerun()

    st.divider()
    st.markdown("**Nomor darurat**\n\n112 Darurat · 115 Basarnas · 117 BNPB · 119 Ambulans")

# ---------- Riwayat chat ----------
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Tombol contoh pertanyaan saat percakapan masih kosong
clicked = None
if not st.session_state.messages:
    st.markdown("**Coba tanyakan:**")
    cols = st.columns(2)
    for i, example in enumerate(EXAMPLES):
        if cols[i % 2].button(example, key=f"ex-{i}"):
            clicked = example

prompt = st.chat_input("Tanyakan soal banjir, gempa, longsor, tsunami...") or clicked

if prompt:
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        try:
            answer = st.write_stream(stream_reply(st.session_state.messages, model))
        except Exception as err:
            st.error(explain_error(err, model))
            st.session_state.messages.pop()  # buang pertanyaan yang gagal dijawab
        else:
            st.session_state.messages.append({"role": "assistant", "content": answer})
            if clicked:
                st.rerun()  # sembunyikan tombol contoh setelah dipakai
