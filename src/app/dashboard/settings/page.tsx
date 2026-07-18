"use client";

import { Save, User, Shield, Bell, Moon, Database } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Pengaturan Sistem</h1>
        <p className="text-text-muted text-sm">Kelola profil dan preferensi aplikasi Anda</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex flex-col gap-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={<User size={18} />} 
            label="Profil Saya" 
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
            icon={<Shield size={18} />} 
            label="Keamanan" 
          />
          <TabButton 
            active={activeTab === "appearance"} 
            onClick={() => setActiveTab("appearance")} 
            icon={<Moon size={18} />} 
            label="Tampilan" 
          />
          {session?.user?.role === "ADMIN" && (
            <TabButton 
              active={activeTab === "system"} 
              onClick={() => setActiveTab("system")} 
              icon={<Database size={18} />} 
              label="Sistem" 
            />
          )}
        </div>

        <div className="flex-1 glass-panel p-6 min-h-[400px]">
          {activeTab === "profile" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-border-color pb-4">
                Informasi Profil
              </h2>
              <form className="flex flex-col gap-5 max-w-md">
                <div className="input-group">
                  <label className="input-label">Nama Lengkap</label>
                  <input type="text" className="input-field" defaultValue={session?.user?.name || ""} />
                </div>
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <input type="text" className="input-field" defaultValue={session?.user?.username || ""} readOnly disabled />
                  <span className="text-xs text-text-muted mt-1">Username tidak dapat diubah</span>
                </div>
                <div className="input-group">
                  <label className="input-label">Peran Sistem</label>
                  <input type="text" className="input-field capitalize" defaultValue={session?.user?.role?.toLowerCase() || ""} readOnly disabled />
                </div>
                <div className="pt-4 border-t border-border-color mt-2">
                  <button type="button" className="btn btn-primary" onClick={() => alert('Fitur demonstrasi (dummy)')}>
                    <Save size={18} /> Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-border-color pb-4">
                Ubah Password
              </h2>
              <form className="flex flex-col gap-5 max-w-md">
                <div className="input-group">
                  <label className="input-label">Password Saat Ini</label>
                  <input type="password" className="input-field" />
                </div>
                <div className="input-group">
                  <label className="input-label">Password Baru</label>
                  <input type="password" className="input-field" />
                </div>
                <div className="input-group">
                  <label className="input-label">Konfirmasi Password Baru</label>
                  <input type="password" className="input-field" />
                </div>
                <div className="pt-4 border-t border-border-color mt-2">
                  <button type="button" className="btn btn-primary" onClick={() => alert('Fitur demonstrasi (dummy)')}>
                    <Shield size={18} /> Perbarui Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-border-color pb-4">
                Preferensi Tampilan
              </h2>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Tema Aplikasi</h3>
                  <div className="flex gap-4">
                    <button className="flex-1 p-4 border-2 border-primary-color rounded-xl bg-white text-center hover:bg-slate-50 transition-colors">
                      <div className="w-full h-20 bg-slate-100 rounded-md mb-2 border border-slate-200"></div>
                      <span className="font-medium text-slate-800">Light Mode</span>
                    </button>
                    <button className="flex-1 p-4 border-2 border-transparent rounded-xl bg-slate-900 text-center hover:bg-slate-800 transition-colors">
                      <div className="w-full h-20 bg-slate-800 rounded-md mb-2 border border-slate-700"></div>
                      <span className="font-medium text-white">Dark Mode</span>
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-3">
                    Catatan: Fitur tema diatur berdasarkan preferensi sistem secara otomatis pada versi ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-border-color pb-4">
                Pengaturan Sistem
              </h2>
              <div className="flex flex-col gap-6">
                <div className="p-4 border border-border-color rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Backup Database</h3>
                  <p className="text-sm text-text-muted mb-4">Unduh salinan data inventaris untuk keperluan pencadangan.</p>
                  <button className="btn btn-outline" onClick={() => alert('Fitur demonstrasi (dummy)')}>
                    Mulai Backup
                  </button>
                </div>
                <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Reset Data Inventaris</h3>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">Peringatan: Tindakan ini akan menghapus semua data barang permanen.</p>
                  <button className="btn btn-outline border-red-200 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30" onClick={() => alert('Fitur demonstrasi (dummy)')}>
                    Reset Sistem
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
        active 
          ? 'bg-primary-color text-white shadow-md shadow-primary-color/20 font-medium' 
          : 'text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
