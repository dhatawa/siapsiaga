// script.js

// Inisialisasi Peta
var map = L.map('map').setView([-6.9147, 107.6098], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var userMarker = null;
var floodCircle = null;

// Fungsi Update Tampilan (UI)
function updateUI(data) {
    const box = document.getElementById('statusBox');
    const title = document.getElementById('statusTitle');
    const desc = document.getElementById('statusDesc');

    if (data.status === "BAHAYA") {
        box.className = "card card-status bg-gradient-danger p-4 text-center mb-4";
        title.innerHTML = `BAHAYA <i class="fa-solid fa-triangle-exclamation"></i>`;
        if(navigator.vibrate) navigator.vibrate([1000, 500]);
    } else if (data.status === "WASPADA") {
        box.className = "card card-status bg-gradient-warning p-4 text-center mb-4";
        title.innerHTML = `WASPADA <i class="fa-solid fa-circle-exclamation"></i>`;
    } else {
        box.className = "card card-status bg-gradient-success p-4 text-center mb-4";
        title.innerHTML = `AMAN`;
    }
    desc.innerHTML = data.pesan;

    // Info Sungai
    if (data.sungai) {
        document.getElementById('sungaiInfo').innerHTML = 
            `Tinggi: <b>${data.sungai.tinggi_air}</b> | Status: <b class="${data.sungai.status==='AMAN'?'text-success':'text-danger'}">${data.sungai.status}</b>`;
    }

    // Lingkaran Banjir
    if(floodCircle) map.removeLayer(floodCircle);
    if(data.lat) {
        floodCircle = L.circle([data.lat, data.lon], {
            color: 'red', fillColor: '#f03', fillOpacity: 0.4, radius: data.radius * 1000
        }).addTo(map);
    }
}

// Fungsi Ambil Data dari Python
async function fetchData(mode, lat, lon) {
    try {
        let url = `http://127.0.0.1:5000/update-status?mode=${mode}`;
        if(lat) url += `&user_lat=${lat}&user_lon=${lon}`;
        const res = await fetch(url);
        const data = await res.json();
        updateUI(data);
    } catch(e) { console.log(e); }
}

// --- FITUR GPS (DRAGGABLE) ---
function cariLokasi() {
    document.getElementById('statusTitle').innerHTML = "MENCARI...";
    if (navigator.geolocation) {
        // Opsi High Accuracy
        navigator.geolocation.getCurrentPosition(
            (p) => {
                const lat = p.coords.latitude; const lon = p.coords.longitude;
                setMarker(lat, lon);
                fetchData('real', lat, lon);
            },
            () => { alert("Gagal ambil GPS. Geser peta manual."); },
            { enableHighAccuracy: true } // Minta GPS akurat
        );
    }
}

function setMarker(lat, lon) {
    if (userMarker) map.removeLayer(userMarker);
    
    // Marker bisa digeser (draggable)
    userMarker = L.marker([lat, lon], {draggable: true}).addTo(map)
        .bindPopup("<b>Posisi Anda</b><br>Geser jika tidak akurat!").openPopup();
    
    map.setView([lat, lon], 13);

    // Jika marker digeser, update data otomatis
    userMarker.on('dragend', function(e) {
        var position = userMarker.getLatLng();
        fetchData('real', position.lat, position.lng);
    });
}

function modeDemo() {
    setMarker(-6.8900, 107.5800); // Set posisi dekat Pasteur
    fetchData('demo', -6.8900, 107.5800);
}

function bukaMaps() {
    const dest = document.getElementById('dest').value;
    if(!userMarker) return alert("Nyalakan GPS dulu!");
    const pos = userMarker.getLatLng();
    // Perbaikan sintaks string interpolation
    window.open(`https://www.google.com/maps/dir/$${pos.lat},${pos.lng}/${encodeURIComponent(dest)}`, '_blank');
}

// Cek status otomatis setiap 60 detik
setInterval(function() {
    // Hanya jalan jika user sudah pernah mengizinkan GPS (marker sudah ada)
    if (userMarker) { 
        const pos = userMarker.getLatLng();
        fetchData('real', pos.lat, pos.lng);
        console.log("Auto-refresh data...");
    }
}, 60000);