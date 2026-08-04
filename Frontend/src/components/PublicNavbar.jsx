import { Link } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-red">
          Siap Siaga
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#dashboard" className="hover:text-gray-900">Dashboard</a>
          <a href="#fitur" className="hover:text-gray-900">Fitur Utama</a>
          <a href="#cara-kerja" className="hover:text-gray-900">Cara Kerja</a>
          <a href="#status" className="hover:text-gray-900">Status</a>
        </nav>

        <Link
          to="/login"
          className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
