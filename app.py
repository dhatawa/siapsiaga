from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)
CORS(app)

# --- 1. KONFIGURASI ---
# ⚠️ GANTI DENGAN API KEY KAMU
API_KEY_CUACA = "MASUKKAN_API_KEY_DISINI" 

URL_DISKAR = "https://diskar.bandung.go.id/"
URL_TMA_CITARUM = "http://pdsda.sda.pu.go.id/home/pch/pda" 

# Database Lokasi Lengkap
LOKASI_RAWAN = {
    "pasteur":     {"lat": -6.8931, "lon": 107.5872, "radius_km": 0.8},
    "gedebage":    {"lat": -6.9456, "lon": 107.6934, "radius_km": 1.5},
    "dayeuhkolot": {"lat": -6.9843, "lon": 107.6213, "radius_km": 2.0},
    "baleendah":   {"lat": -7.0053, "lon": 107.6305, "radius_km": 2.0},
    "rancaekek":   {"lat": -6.9639, "lon": 107.7661, "radius_km": 2.0},
    "pagarsih":    {"lat": -6.9246, "lon": 107.5954, "radius_km": 0.5},
    "cileunyi":    {"lat": -6.9367, "lon": 107.7297, "radius_km": 1.0},
    "kopo":        {"lat": -6.9441, "lon": 107.5869, "radius_km": 1.0},
    "cimahi":      {"lat": -6.8970, "lon": 107.5404, "radius_km": 1.5},
    "ujungberung": {"lat": -6.9099, "lon": 107.7058, "radius_km": 1.0}
}

# --- 2. FUNGSI PENDUKUNG (Scraping & Rumus) ---
def cek_tma_citarum():
    info = {"lokasi": "Dayeuhkolot", "tinggi_air": "Normal", "status": "AMAN", "sumber": "BBWS (Offline)"}
    try:
        r = requests.get(URL_TMA_CITARUM, timeout=3)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, 'html.parser')
            for row in soup.find_all('tr'):
                if "dayeuhkolot" in row.get_text().lower():
                    cols = row.find_all('td')
                    info["tinggi_air"] = f"{cols[2].get_text().strip()} m"
                    info["sumber"] = "BBWS Citarum (Live)"
                    try:
                        val = float(cols[2].get_text().strip())
                        if val > 6.0: info["status"] = "AWAS"
                        elif val > 5.0: info["status"] = "SIAGA"
                    except: pass
                    break
    except: pass
    return info

def haversine(lat1, lon1, lat2, lon2):
    R = 6371 
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

def cek_cuaca_realtime(lat, lon):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY_CUACA}&units=metric"
        r = requests.get(url, timeout=2)
        return r.json().get('rain', {}).get('1h', 0)
    except: return 0

# --- 3. ROUTE UTAMA ---
@app.route('/')
def home(): return send_file('index.html')

@app.route('/update-status', methods=['GET'])
def update_status():
    # 1. Terima Input
    mode = request.args.get('mode')
    user_lat = request.args.get('user_lat', type=float)
    user_lon = request.args.get('user_lon', type=float)
    
    # 2. Ambil Data Eksternal (Sungai)
    data_sungai = cek_tma_citarum()

    # --- MODE DEMO ---
    if mode == 'demo':
        data = LOKASI_RAWAN['pasteur']
        pesan = "⚠️ SIMULASI: Hujan ekstrem di Pasteur."
        if user_lat: 
            jarak = haversine(user_lat, user_lon, data['lat'], data['lon'])
            pesan += f" Jarak Anda: {jarak:.2f} KM."
        data_sungai.update({"status": "SIAGA", "tinggi_air": "5.8 m"})
        return jsonify({
            "status": "BAHAYA", "lokasi": "PASTEUR (SIMULASI)", 
            "pesan": pesan, "sungai": data_sungai, **data
        })

    # --- MODE REAL-TIME (LOGIKA GEOFENCING OTOMATIS) ---
    status_final = "AMAN"
    pesan_final = "Anda berada di zona aman."
    lokasi_banjir_saat_ini = [] 
    data_lokasi_bahaya = {"lat": None, "lon": None, "radius_km": 0}

    # Loop cek semua wilayah
    for nama_wilayah, data_wilayah in LOKASI_RAWAN.items():
        # Cek kondisi banjir di wilayah ini (Hujan > 20mm atau Sungai Meluap)
        hujan = cek_cuaca_realtime(data_wilayah['lat'], data_wilayah['lon'])
        is_flooding = False
        
        if hujan > 20: 
            is_flooding = True
            lokasi_banjir_saat_ini.append(nama_wilayah.upper())
        elif nama_wilayah == "dayeuhkolot" and data_sungai['status'] in ["SIAGA", "AWAS"]:
            is_flooding = True
            lokasi_banjir_saat_ini.append("DAYEUHKOLOT (SUNGAI)")

        # LOGIKA DETEKSI JARAK (PERSONAL)
        if user_lat and user_lon:
            jarak_user = haversine(user_lat, user_lon, data_wilayah['lat'], data_wilayah['lon'])
            
            # Jika user masuk radius wilayah ini
            if jarak_user <= data_wilayah['radius_km']:
                if is_flooding:
                    # KASUS 1: User ada DI DALAM lokasi banjir -> BAHAYA
                    return jsonify({
                        "status": "BAHAYA",
                        "lokasi": nama_wilayah.upper(),
                        "pesan": f"🚨 BAHAYA! Anda berada di lokasi banjir {nama_wilayah.upper()}! Segera evakuasi!",
                        "sungai": data_sungai,
                        "lat": data_wilayah['lat'],
                        "lon": data_wilayah['lon'],
                        "radius": data_wilayah['radius_km']
                    })
                else:
                    # KASUS 2: User di wilayah rawan, tapi cuaca aman
                    pesan_final = f"Anda berada di {nama_wilayah.upper()}. Status aman."

    # KASUS 3: User aman, tapi ada banjir di tempat lain -> WASPADA
    if status_final == "AMAN" and len(lokasi_banjir_saat_ini) > 0:
        status_final = "WASPADA"
        daftar = ", ".join(lokasi_banjir_saat_ini)
        pesan_final = f"⚠️ Hati-hati! Banjir terdeteksi di: {daftar}."
        # Fokus peta ke lokasi banjir pertama
        nama_pertama = lokasi_banjir_saat_ini[0].split()[0].lower()
        if nama_pertama in LOKASI_RAWAN:
            data_lokasi_bahaya = LOKASI_RAWAN[nama_pertama]

    return jsonify({
        "status": status_final,
        "lokasi": "Bandung Raya",
        "pesan": pesan_final,
        "sungai": data_sungai,
        "lat": data_lokasi_bahaya['lat'],
        "lon": data_lokasi_bahaya['lon'],
        "radius": data_lokasi_bahaya['radius_km']
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)