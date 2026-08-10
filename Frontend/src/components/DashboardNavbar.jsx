import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Megaphone, RefreshCw, ChevronDown, Bell, Menu, X, MessageSquareText, Plus } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import LaporModal from './LaporModal';

export default function DashboardNavbar({ user = { name: 'Farid Annas', email: 'farid@mail.com' } }) {
  // State untuk kontrol Popup & Dropdown
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLaporOpen, setIsLaporOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle helpers agar hanya 1 dropdown yang terbuka dalam 1 waktu
  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive 
        ? 'text-red-700 border-b-2 border-red-700 pb-4 font-semibold' 
        : 'text-gray-500 hover:text-gray-800 pb-4'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block py-2 text-sm font-medium ${
      isActive ? 'text-red-700 font-bold' : 'text-gray-600'
    }`;

  return (
    <>
      {/* NAVBAR HEADER (Sticky saat scroll) */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Tombol Mobile Menu */}
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-lg font-bold text-red-700">Siap Siaga</span>
          </div>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-8 h-16 pt-4">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/edukasi" className={linkClass}>Edukasi & Tips</NavLink>
            <NavLink to="/berita" className={linkClass}>Berita</NavLink>
          </nav>

          {/* Area Kanan: Icon Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Megaphone / Sound Icon */}
            <button 
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 transition" 
            onClick={() => setIsLaporOpen(true)}>              
            <Megaphone size={18} />
            </button>


            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleNotif}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition relative"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>

              {/* Dropdown Notifikasi */}
              <NotificationDropdown isOpen={isNotifOpen} />
            </div>

            {/* User Profile Area (Klik untuk Buka Dropdown Account) */}
            <div className="relative">
              <button 
                onClick={toggleProfile}
                className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-sm shadow-sm">
                  🙂
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</p>
                  <p className="text-[11px] text-gray-400 leading-tight">{user.email}</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown Profile User */}
              <ProfileDropdown 
                isOpen={isProfileOpen} 
                user={user}
                onLogout={() => {
                  setIsProfileOpen(false);
                  alert('Logout Berhasil');
                }} 
              />
            </div>

          </div>
        </div>

        {/* Menu Tampilan Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 shadow-lg">
            <NavLink 
              to="/dashboard" 
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/edukasi" 
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Edukasi & Tips
            </NavLink>
            <NavLink 
              to="/berita" 
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Berita
            </NavLink>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLaporOpen(true);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-red-700 flex items-center gap-2"
            >
              <Plus size={16} /> Buat Laporan Bencana
            </button>
          </div>
        )}
      </header>

      {/* FLOATING ACTION BUTTON (Tombol Utama Lapor Merah di Pojok Kanan Bawah Sesuai Figma) */}
      <button
        onClick={() => setIsLaporOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-red-800 hover:bg-red-900 text-white p-3.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition duration-200 flex items-center justify-center"
        title="Laporkan Kejadian / Bencana"
      >
        <MessageSquareText size={22} />
      </button>

      {/* MODAL LAPOR */}
      <LaporModal 
        isOpen={isLaporOpen} 
        onClose={() => setIsLaporOpen(false)} 
      />
    </>
  );
}