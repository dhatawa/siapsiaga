import React from 'react';
import { KeyRound, LogOut } from 'lucide-react';

export default function ProfileDropdown({ isOpen, user, onLogout, onChangePassword }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in duration-150">
      
      {/* Menu Pilihan */}
      <div className="py-1">
        <button 
          type="button"
          onClick={onChangePassword} 
          className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-red-50/60 hover:text-red-700 flex items-center gap-2.5 transition cursor-pointer font-medium"
        >
          <KeyRound size={15} className="text-gray-400" />
          Ubah Password
        </button>
      </div>

      {/* Tombol Logout */}
      <div className="border-t border-gray-100 pt-1 mt-1">
        <button 
          type="button"
          onClick={onLogout || (() => alert('Logout diklik'))}
          className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition font-medium cursor-pointer"
        >
          <LogOut size={15} className="text-red-500" />
          Log Out
        </button>
      </div>
    </div>
  );
}