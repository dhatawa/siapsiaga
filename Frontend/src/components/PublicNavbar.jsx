import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', target: 'dashboard' },
  { label: 'Fitur Utama', target: 'fitur' },
  { label: 'Cara Kerja', target: 'cara-kerja' },
  { label: 'Status', target: 'status' },
];

export default function PublicNavbar() {
  const scrollTo = (event, target) => {
    event.preventDefault();
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${target}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-red">
          Siap Siaga
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          {navLinks.map(({ label, target }) => (
            <a
              key={target}
              href={`#${target}`}
              onClick={(event) => scrollTo(event, target)}
              className="hover:text-gray-900 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          to="/login"
          className="button-scale inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
