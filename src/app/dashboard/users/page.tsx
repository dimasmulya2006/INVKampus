"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield, User } from "lucide-react";

type UserType = {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentUser, setCurrentUser] = useState<Partial<UserType> & { password?: string }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: "add" | "edit", user?: UserType) => {
    setModalMode(mode);
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser({ role: "PETUGAS" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === "add" ? "/api/users" : `/api/users/${currentUser.id}`;
      const method = modalMode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      });
      
      if (res.ok) {
        closeModal();
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchUsers();
        } else {
          alert("Gagal menghapus data");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Manajemen Pengguna</h1>
          <p className="text-text-muted text-sm">Kelola akses dan hak akses sistem</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => openModal("add")}>
          <Plus size={18} />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-text-muted uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-medium">Nama & Username</th>
                <th className="px-6 py-4 font-medium">Peran (Role)</th>
                <th className="px-6 py-4 font-medium">Tanggal Terdaftar</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">Memuat data...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">Tidak ada data pengguna.</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">{user.name}</div>
                        <div className="text-xs text-text-muted">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      <Shield size={14} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal("edit", user)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border-color">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {modalMode === "add" ? "Tambah Pengguna Baru" : "Edit Pengguna"}
              </h2>
            </div>
            
            <div className="p-6">
              <form id="userForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="input-group">
                  <label className="input-label">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={currentUser.name || ""} 
                    onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={currentUser.username || ""} 
                    onChange={e => setCurrentUser({...currentUser, username: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Password {modalMode === "edit" && <span className="text-xs font-normal text-slate-400">(Kosongkan jika tidak ingin mengubah)</span>}</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    value={currentUser.password || ""} 
                    onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                    required={modalMode === "add"}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Peran (Role)</label>
                  <select 
                    className="input-field"
                    value={currentUser.role || "PETUGAS"} 
                    onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                    required
                  >
                    <option value="PETUGAS">Petugas</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border-color flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={closeModal} className="btn btn-outline">
                Batal
              </button>
              <button type="submit" form="userForm" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
