export default function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <div>
          <p className="font-bold text-brand-red text-sm">Siap Siaga</p>
          <p>© 2026 Siap Siaga - Sistem Informasi Mitigasi Bencana Indonesia</p>
        </div>
        <div className="flex gap-5">
          <span>Kontak Darurat</span>
          <span>Peta Risiko</span>
          <span>Tentang Kami</span>
          <span>Kebijakan Privasi</span>
        </div>
      </div>
    </footer>
  );
}
