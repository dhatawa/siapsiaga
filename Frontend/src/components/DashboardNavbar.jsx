import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Megaphone, ChevronDown, Bell, Menu, X, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import ChatbotPopup, { ChatbotToggleButton } from './ChatbotPopup';
import LaporModal from './LaporModal';
import { useAuth } from '../context/AuthContext';

export default function DashboardNavbar({ user: propUser }) {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Prioritaskan user dari AuthContext, kemudian prop, kemudian fallback
  const currentUser = authUser || propUser || { name: 'Tamu', email: 'tamu@siapsiaga.id' };

  // State untuk kontrol Popup & Dropdown
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLaporModalOpen, setIsLaporModalOpen] = useState(false);

  // Toggle helpers agar hanya 1 dropdown yang terbuka dalam 1 waktu
  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);

    const result = await Swal.fire({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin keluar dari akun Anda?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Keluar',
        text: 'Anda telah keluar dari sesi.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      navigate('/login', { replace: true });
    }
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

  const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

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
            <NavLink to="/dashboard" className="text-lg font-bold text-red-700">
              Siap Siaga
            </NavLink>
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
              onClick={() => setIsLaporModalOpen(true)}
              title="Laporkan Kejadian Bencana"
            >
              <Megaphone size={18} />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleNotif}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition relative"
                title="Notifikasi"
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
                className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 text-primary-700 flex items-center justify-center text-xs font-bold shadow-sm">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="hidden sm:block max-w-[120px] truncate">
                  <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-400 leading-tight truncate">{currentUser.email}</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              {/* Dropdown Profile User */}
              <ProfileDropdown 
                isOpen={isProfileOpen} 
                user={currentUser}
                onLogout={handleLogout} 
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
                setIsChatOpen(true);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-red-700 flex items-center gap-2"
            >
              <Plus size={16} /> Buka Chatbot
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-left py-2 text-sm font-medium text-red-600 border-t border-gray-100 pt-2"
            >
              Keluar (Logout)
            </button>
          </div>
        )}
      </header>

      <LaporModal
        isOpen={isLaporModalOpen}
        onClose={() => setIsLaporModalOpen(false)}
      />

      {/* FLOATING ACTION BUTTON (Tombol Utama Lapor Merah di Pojok Kanan Bawah Sesuai Figma) */}
      <ChatbotToggleButton onClick={() => setIsChatOpen(true)} />
      <ChatbotPopup open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}