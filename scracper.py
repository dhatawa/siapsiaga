import requests
from bs4 import BeautifulSoup

# --- 1. KONFIGURASI ---
# URL target (Bisa diganti ke web BPBD atau portal berita Bandung)
URL_TARGET = "https://diskar.bandung.go.id/" 

# Kata kunci lokasi yang kita pantau (Database Mini)
LOKASI_RAWAN = {
    "pasteur":   {"lat": -6.8931, "lon": 107.5872},
    "gedebage":  {"lat": -6.9456, "lon": 107.6934},
    "dayeuhkolot": {"lat": -6.9843, "lon": 107.6213},
    "pagarsih":  {"lat": -6.9246, "lon": 107.5954}
}

def cek_banjir_dari_web():
    print(f"🕵️ Sedang membaca berita dari: {URL_TARGET} ...")
    
    try:
        # Request ke website (Pura-pura jadi browser Chrome)
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(URL_TARGET, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Ambil semua teks yang ada di website
            soup = BeautifulSoup(response.text, 'html.parser')
            teks_halaman = soup.get_text().lower() # Ubah jadi huruf kecil semua
            
            hasil_deteksi = []

            # Cek apakah ada kata "banjir" ATAU "genangan"
            if "banjir" in teks_halaman or "genangan" in teks_halaman:
                print("⚠️ KATA KUNCI 'BANJIR' DITEMUKAN DI WEBSITE!")
                
                # Cek lokasi mana yang disebut?
                for nama_lokasi in LOKASI_RAWAN:
                    if nama_lokasi in teks_halaman:
                        print(f"📍 Terdeteksi lokasi: {nama_lokasi.upper()}")
                        data_lokasi = LOKASI_RAWAN[nama_lokasi]
                        hasil_deteksi.append({
                            "lokasi": nama_lokasi,
                            "lat": data_lokasi["lat"],
                            "lon": data_lokasi["lon"],
                            "status": "BAHAYA"
                        })
            
            if not hasil_deteksi:
                print("✅ Tidak ditemukan berita banjir spesifik saat ini.")
                return None
            else:
                return hasil_deteksi
                
        else:
            print("❌ Gagal membuka website.")
            return None

    except Exception as e:
        print(f"❌ Error koneksi: {e}")
        return None

# --- JALANKAN ---
if __name__ == "__main__":
    data = cek_banjir_dari_web()
    
    if data:
        print("\n--- HASIL UNTUK DIKIRIM KE APLIKASI ---")
        print(data)