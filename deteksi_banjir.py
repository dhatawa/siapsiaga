import math

# --- 1. FUNGSI OTAK (MENGHITUNG JARAK) ---
def hitung_jarak_km(lat1, lon1, lat2, lon2):
    # Ini adalah rumus Haversine untuk menghitung jarak di bola bumi
    R = 6371.0 # Jari-jari bumi dalam KM

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2)**2 + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon / 2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

# --- 2. DATA INPUT (SIMULASI) ---

# Ceritanya ini data dari BPBD: Banjir di Pasteur (Depan BTC)
titik_banjir_lat = -6.893114
titik_banjir_lon = 107.587245
nama_bencana = "Banjir Pasteur"
radius_bahaya_km = 1.0  # Jika jarak < 1 KM, bunyikan alarm

# Ceritanya ini lokasi HP Pengguna: Sedang di Univ. Maranatha (Dekat Pasteur)
user_lat = -6.886367
user_lon = 107.580665

# --- 3. EKSEKUSI PROGRAM ---
print(f"--- SISTEM SATU BANDUNG SIAGA ---")
print(f"Mengecek jarak user ke {nama_bencana}...")

jarak_sekarang = hitung_jarak_km(titik_banjir_lat, titik_banjir_lon, user_lat, user_lon)

print(f"Jarak terhitung: {jarak_sekarang:.2f} KM")

# Logika Penentuan Bahaya
if jarak_sekarang < radius_bahaya_km:
    print("------------------------------------------------")
    print("⚠️ [PERINGATAN DINI] ⚠️")
    print("ANDA MEMASUKI ZONA RAWAN BANJIR!")
    print("Sistem mengirim sinyal GETAR ke HP...")
    print("------------------------------------------------")
else:
    print("✅ Status: AMAN. Anda berada di luar zona bahaya.")