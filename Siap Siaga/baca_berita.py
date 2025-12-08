# --- KAMUS LOKASI BANDUNG (DATABASE MINI) ---
# Di aplikasi asli, ini biasanya disimpan di Database (MySQL/Firebase)
database_lokasi = {
    "dayeuhkolot": {"lat": -6.9843, "lon": 107.6213},
    "pasteur":     {"lat": -6.8931, "lon": 107.5872},
    "gedebage":    {"lat": -6.9456, "lon": 107.6934},
    "cileuncang":  {"lat": -6.9147, "lon": 107.6098}, # Misal di jalan Riau
    "lembang":     {"lat": -6.8152, "lon": 107.6186}
}

# --- FUNGSI AI SEDERHANA (TEXT PARSER) ---
def terjemahkan_berita_ke_koordinat(teks_berita):
    # 1. Kecilkan semua huruf agar tidak error (case insensitive)
    teks_kecil = teks_berita.lower()
    
    found_location = None
    found_coords = None

    # 2. Loop mencari kata kunci di dalam teks
    for lokasi in database_lokasi:
        if lokasi in teks_kecil:
            found_location = lokasi
            found_coords = database_lokasi[lokasi]
            break # Berhenti jika lokasi sudah ketemu
    
    return found_location, found_coords

# --- SIMULASI BERITA MASUK ---
print("--- SIMULASI PEMBACAAN BERITA OTOMATIS ---")

# Ceritanya ini judul berita yang di-copy paste dari Twitter BPBD/Detik.com
judul_berita_1 = "BREAKING NEWS: Hujan deras sebabkan banjir di kawasan Gedebage sore ini."
judul_berita_2 = "Lalu lintas macet total akibat genangan air di Pasteur."

# Kita tes Berita 1
print(f"\n📰 Berita Masuk: '{judul_berita_1}'")
lokasi, koordinat = terjemahkan_berita_ke_koordinat(judul_berita_1)

if koordinat:
    print(f"📍 AI Mendeteksi Lokasi: {lokasi.upper()}")
    print(f"   Koordinat Target: {koordinat}")
    print("   -> Kirim data ini ke fungsi hitung_jarak_km()!")
else:
    print("❌ Lokasi tidak dikenali di database.")