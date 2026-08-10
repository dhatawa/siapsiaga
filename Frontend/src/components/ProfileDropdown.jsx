import React from 'react';
import { User, SlidersHorizontal, LogOut } from 'lucide-react';

export default function ProfileDropdown({ isOpen, user, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in duration-150">
      {/* Profil Singkat di Atas Dropdown */}
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-sm font-bold shrink-0">
          🙂
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Menu Pilihan */}
      <div className="py-1">
        <button 
          onClick={() => alert('Ke Halaman Account')} 
          className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition"
        >
          <User size={15} className="text-gray-400" />
          Account
        </button>

        <button 
          onClick={() => alert('Ke Halaman Options')} 
          className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition"
        >
          <SlidersHorizontal size={15} className="text-gray-400" />
          Options
        </button>
      </div>

      {/* Tombol Logout */}
      <div className="border-t border-gray-100 pt-1 mt-1">
        <button 
          onClick={onLogout || (() => alert('Logout diklik'))}
          className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition font-medium"
        >
          <LogOut size={15} className="text-red-500" />
          Log Out
        </button>
      </div>
    </div>
  );
}