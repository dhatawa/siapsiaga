import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Crosshair,
  Layers,
  Radio,
  Droplets,
  Flame,
  Mountain,
  Wind,
  Waves,
  Activity,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Info,
  Thermometer,
  CloudRain,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { adminStations } from '../data/adminData';

// SVG Icons generator untuk Leaflet DivIcon
const DISASTER_COLORS = {
  banjir: { bg: '#2563EB', light: '#EFF6FF', border: '#93C5FD', label: 'Banjir' },
  gempa_bumi: { bg: '#DC2626', light: '#FEF2F2', border: '#FCA5A5', label: 'Gempa Bumi' },
  tsunami: { bg: '#4F46E5', light: '#EEF2FF', border: '#C7D2FE', label: 'Tsunami' },
  kebakaran: { bg: '#EA580C', light: '#FFF7ED', border: '#FDBA74', label: 'Kebakaran' },
  longsor: { bg: '#B45309', light: '#FEF3C7', border: '#FDE68A', label: 'Longsor' },
  angin_kencang: { bg: '#0891B2', light: '#ECFEFF', border: '#A5F3FC', label: 'Angin Kencang' },
  lainnya: { bg: '#C81E2C', light: '#FEF2F2', border: '#FECACA', label: 'Darurat Lain' },
};

function getDisasterSvg(type) {
  switch (type) {
    case 'banjir':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    case 'gempa_bumi':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
    case 'tsunami':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`;
    case 'kebakaran':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
    case 'longsor':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
    case 'angin_kencang':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  }
}

// Haversine distance calculator
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function DisasterMap({
  mode = 'user', // 'user' | 'admin'
  height = '340px',
  onSelectReport = null,
  focusLocation = null,
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // States
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [showReports, setShowReports] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [nearestStation, setNearestStation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Cekungan Bandung / Jabar
      const defaultCenter = [-6.9175, 107.6191];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager tiles (clean, sharp, modern aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CartoDB &copy; OpenStreetMap'
      }).addTo(map);

      // Custom Zoom Control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch Reports
  const loadReports = async () => {
    try {
      if (mode === 'admin') {
        const res = await reportService.getAdminReports();
        setReports(res.items || []);
      } else {
        const res = await reportService.getPublicReports();
        setReports(res || []);
      }
    } catch (err) {
      console.error('Failed to load reports for map:', err);
    }
  };

  useEffect(() => {
    loadReports();
  }, [mode]);

  // Request User Location GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung fitur GPS.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userPos = [latitude, longitude];
        setUserLocation(userPos);
        setGpsLoading(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(userPos, 14, { duration: 1.2 });
        }
      },
      (error) => {
        console.warn('GPS location error:', error);
        setGpsLoading(false);
        setGpsError('Akses lokasi GPS ditolak/tidak aktif.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Otomatis minta lokasi saat komponen pertama kali terpasang
  useEffect(() => {
    handleGetLocation();
  }, []);

  // Calculate Nearest Station when User Location or Stations Change
  useEffect(() => {
    if (!userLocation || adminStations.length === 0) return;

    let closest = null;
    let minDistance = Infinity;

    adminStations.forEach((st) => {
      const dist = calculateDistanceKm(
        userLocation[0],
        userLocation[1],
        parseFloat(st.lat),
        parseFloat(st.lng)
      );
      if (dist && parseFloat(dist) < minDistance) {
        minDistance = parseFloat(dist);
        closest = { ...st, distanceKm: dist };
      }
    });

    setNearestStation(closest);
  }, [userLocation]);

  // Render Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Render User GPS Marker
    if (userLocation) {
      const userBeaconHtml = `
        <div class="user-gps-beacon">
          <div class="user-gps-ring"></div>
          <div class="user-gps-dot"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userBeaconHtml,
        className: 'custom-user-beacon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker(userLocation, { icon: userIcon });
      userMarker.bindPopup(`
        <div class="p-3 text-xs">
          <p class="font-bold text-blue-600 flex items-center gap-1.5 mb-1">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span> Lokasi Anda Saat Ini
          </p>
          <p class="text-gray-500 font-mono text-[11px]">${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}</p>
          ${nearestStation ? `<p class="mt-2 pt-2 border-t text-[11px] text-gray-700">Sensor Terdekat: <strong>${nearestStation.name}</strong> (${nearestStation.distanceKm} km)</p>` : ''}
        </div>
      `, { className: 'custom-leaflet-popup' });

      layer.addLayer(userMarker);
    }

    // 2. Render Incident Report Markers
    if (showReports) {
      reports.forEach((r) => {
        if (!r.latitude || !r.longitude) return;

        const dType = r.disaster_type || 'lainnya';
        const colorConfig = DISASTER_COLORS[dType] || DISASTER_COLORS.lainnya;
        const iconSvg = getDisasterSvg(dType);

        const markerHtml = `
          <button class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform hover:scale-125 focus:outline-none" style="background-color: ${colorConfig.bg}; border: 2.5px solid #ffffff;">
            ${iconSvg}
            ${mode === 'admin' && r.status === 'menunggu' ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full animate-pulse"></span>' : ''}
          </button>
        `;

        const reportIcon = L.divIcon({
          html: markerHtml,
          className: 'incident-marker-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([parseFloat(r.latitude), parseFloat(r.longitude)], { icon: reportIcon });

        const formattedDate = new Date(r.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3.5 text-xs max-w-xs';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style="background-color: ${colorConfig.light}; color: ${colorConfig.bg}; border: 1px solid ${colorConfig.border};">
              ${colorConfig.label}
            </span>
            <span class="text-[10px] text-gray-400">${formattedDate}</span>
          </div>

          <p class="font-bold text-gray-900 text-sm leading-snug mb-1">${r.location_text}</p>
          
          ${r.photo_url ? `<div class="my-2 rounded-lg overflow-hidden h-24 bg-gray-100"><img src="${r.photo_url}" class="w-full h-full object-cover" /></div>` : ''}

          <p class="text-gray-600 text-xs line-clamp-2 leading-relaxed mb-3">${r.description || 'Laporan insiden masyarakat.'}</p>
          
          <div class="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span class="text-[10px] font-mono text-gray-400">${parseFloat(r.latitude).toFixed(4)}, ${parseFloat(r.longitude).toFixed(4)}</span>
            <button id="btn-view-report-${r.id}" class="text-xs font-bold text-brand-red hover:underline flex items-center gap-1">
              Lihat Detail →
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, { className: 'custom-leaflet-popup', minWidth: 240 });

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-report-${r.id}`);
          if (btn && onSelectReport) {
            btn.onclick = () => onSelectReport(r);
          }
        });

        layer.addLayer(marker);
      });
    }

    // 3. Render IoT Sensor Stations Markers
    if (showStations) {
      adminStations.forEach((st) => {
        if (!st.lat || !st.lng) return;

        const isCritical = st.status.includes('Kritis') || st.statusColor === 'red';
        const isWarning = st.status.includes('Siaga') || st.statusColor === 'yellow';
        const stationBg = isCritical ? '#DC2626' : isWarning ? '#D97706' : '#059669';

        const stationHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 rounded-lg shadow-md bg-white border-2 hover:scale-110 transition-transform" style="border-color: ${stationBg};">
            <span class="w-3 h-3 rounded-full" style="background-color: ${stationBg};"></span>
          </div>
        `;

        const stationIcon = L.divIcon({
          html: stationHtml,
          className: 'station-marker-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([parseFloat(st.lat), parseFloat(st.lng)], { icon: stationIcon });

        const distText = userLocation
          ? calculateDistanceKm(userLocation[0], userLocation[1], parseFloat(st.lat), parseFloat(st.lng))
          : null;

        marker.bindPopup(`
          <div class="p-3.5 text-xs max-w-xs">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Stasiun Pemantau IoT</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded text-white" style="background-color: ${stationBg};">
                ${st.status}
              </span>
            </div>

            <p class="font-bold text-gray-900 text-sm leading-snug">${st.name}</p>
            <p class="text-[11px] text-gray-500 mt-0.5">${st.area}</p>

            <div class="grid grid-cols-2 gap-2 my-2.5 p-2 rounded-lg bg-gray-50 text-[11px]">
              <div>
                <p class="text-gray-400">Status Sensor</p>
                <p class="font-semibold text-gray-800">${st.status}</p>
              </div>
              <div>
                <p class="text-gray-400">Sinkronisasi</p>
                <p class="font-semibold text-gray-800">${st.lastSync}</p>
              </div>
            </div>

            ${distText ? `<p class="text-[11px] text-primary-700 font-medium pt-1 border-t">Jarak dari lokasi Anda: <strong>${distText} km</strong></p>` : ''}
          </div>
        `, { className: 'custom-leaflet-popup', minWidth: 220 });

        layer.addLayer(marker);
      });
    }
  }, [reports, showReports, showStations, userLocation, nearestStation, mode]);

  // Focus to specific station if prop changes
  useEffect(() => {
    if (focusLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([focusLocation.lat, focusLocation.lng], 15, { duration: 1 });
    }
  }, [focusLocation]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`} style={{ height }}>
      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Left Overlay: Nearest Sensor Info or GPS Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 max-w-[280px] sm:max-w-xs">
        {nearestStation ? (
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <p className="font-bold text-gray-900 truncate text-[11px]">
                Sensor Terdekat: {nearestStation.name}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {nearestStation.distanceKm} km • {nearestStation.status}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-700 shrink-0" />
            <span className="font-semibold text-gray-800 text-[11px]">Peta Pemantauan Bencana</span>
          </div>
        )}
      </div>

      {/* Top-Right Map Controls: Location Button & Layer Toggles */}
      <div className="absolute top-3 right-12 z-10 flex items-center gap-1.5">
        {/* GPS Locate Me Button */}
        <button
          onClick={handleGetLocation}
          disabled={gpsLoading}
          className="bg-white/95 hover:bg-white text-gray-700 px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-md text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          title="Pusatkan ke Posisi Saya"
        >
          {gpsLoading ? (
            <Loader2 size={13} className="animate-spin text-brand-red" />
          ) : (
            <Crosshair size={13} className={userLocation ? 'text-blue-600' : 'text-gray-500'} />
          )}
          <span className="hidden sm:inline">{userLocation ? 'Lokasi Saya' : 'Cari GPS'}</span>
        </button>

        {/* Toggle Reports Layer */}
        <button
          onClick={() => setShowReports(!showReports)}
          className={`px-2.5 py-1.5 rounded-xl border shadow-md text-xs font-semibold flex items-center gap-1.5 transition ${
            showReports
              ? 'bg-brand-red text-white border-brand-red'
              : 'bg-white/95 text-gray-600 border-gray-200'
          }`}
          title="Tampilkan/Sembunyikan Laporan Warga"
        >
          <Droplets size={13} />
          <span className="hidden sm:inline">Laporan</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {reports.length}
          </span>
        </button>

        {/* Toggle Stations Layer */}
        <button
          onClick={() => setShowStations(!showStations)}
          className={`px-2.5 py-1.5 rounded-xl border shadow-md text-xs font-semibold flex items-center gap-1.5 transition ${
            showStations
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white/95 text-gray-600 border-gray-200'
          }`}
          title="Tampilkan/Sembunyikan Stasiun IoT"
        >
          <Radio size={13} />
          <span className="hidden sm:inline">Sensor</span>
        </button>
      </div>

      {/* Bottom-Right Legend Overlay */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-2 rounded-xl shadow-md flex items-center gap-3 text-[10px] text-gray-600 hidden sm:flex">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Banjir
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Kebakaran
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Gempa
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Longsor
        </span>
        <span className="flex items-center gap-1 font-semibold text-gray-800">
          <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> IoT
        </span>
      </div>
    </div>
  );
}
