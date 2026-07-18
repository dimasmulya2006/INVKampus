"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, X } from "lucide-react";

type Item = {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  location: string;
  dateReceived: string;
  description: string;
};

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({});

  useEffect(() => {
    fetchItems();
  }, [searchQuery, categoryFilter]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);
      
      const res = await fetch(`/api/items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: "add" | "edit" | "view", item?: Item) => {
    setModalMode(mode);
    if (item) {
      setCurrentItem({
        ...item,
        dateReceived: new Date(item.dateReceived).toISOString().split('T')[0]
      });
    } else {
      setCurrentItem({
        code: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        condition: "BAIK"
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === "add" ? "/api/items" : `/api/items/${currentItem.id}`;
      const method = modalMode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentItem),
      });
      
      if (res.ok) {
        closeModal();
        fetchItems();
      } else {
        alert("Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      try {
        const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchItems();
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Data Barang</h1>
          <p className="text-text-muted text-sm">Kelola inventaris aset kampus Anda</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => openModal("add")}>
          <Plus size={18} />
          <span>Tambah Barang</span>
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-color flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan kode atau nama barang..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-color bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border-color bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary-color cursor-pointer text-text-main"
            >
              <option value="">Semua Kategori</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Furnitur">Furnitur</option>
              <option value="Fasilitas Kelas">Fasilitas Kelas</option>
            </select>
            
            <button className="btn btn-outline px-3 py-2 flex items-center gap-2">
              <Filter size={16} />
              <span className="hidden sm:inline text-sm">Filter Detail</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-text-muted uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-medium">Kode</th>
                <th className="px-6 py-4 font-medium">Informasi Barang</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Kondisi</th>
                <th className="px-6 py-4 font-medium">Lokasi</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Memuat data...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Data barang tidak ditemukan.</td>
                </tr>
              ) : items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary-color whitespace-nowrap">{item.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                    <div className="text-xs text-text-muted mt-1">Stok: {item.quantity} Unit</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-text-muted">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.condition === "BAIK" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      item.condition === "RUSAK_RINGAN" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.condition === "BAIK" ? "bg-emerald-500" :
                        item.condition === "RUSAK_RINGAN" ? "bg-amber-500" : "bg-red-500"
                      }`}></span>
                      {item.condition === "BAIK" ? "Baik" : item.condition === "RUSAK_RINGAN" ? "Rusak Ringan" : "Rusak Berat"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted whitespace-nowrap">{item.location}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal("view", item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" title="Lihat Detail">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => openModal("edit", item)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border-color flex items-center justify-between text-sm text-text-muted">
          <div>
            Menampilkan <span className="font-medium text-slate-800 dark:text-white">{items.length > 0 ? 1 : 0}</span> sampai <span className="font-medium text-slate-800 dark:text-white">{items.length}</span> dari <span className="font-medium text-slate-800 dark:text-white">{items.length}</span> data
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md border border-border-color hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Sebelumnya
            </button>
            <button className="px-3 py-1 rounded-md bg-primary-color text-white">1</button>
            <button className="px-3 py-1 rounded-md border border-border-color hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border-color">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {modalMode === "add" ? "Tambah Barang Baru" : modalMode === "edit" ? "Edit Data Barang" : "Detail Barang"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="itemForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="input-group">
                  <label className="input-label">Kode Barang</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={currentItem.code || ""} 
                    onChange={e => setCurrentItem({...currentItem, code: e.target.value})}
                    readOnly={modalMode === "view"}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Nama Barang</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={currentItem.name || ""} 
                    onChange={e => setCurrentItem({...currentItem, name: e.target.value})}
                    readOnly={modalMode === "view"}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Kategori</label>
                  <select 
                    className="input-field"
                    value={currentItem.category || ""} 
                    onChange={e => setCurrentItem({...currentItem, category: e.target.value})}
                    disabled={modalMode === "view"}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Furnitur">Furnitur</option>
                    <option value="Fasilitas Kelas">Fasilitas Kelas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Kondisi</label>
                  <select 
                    className="input-field"
                    value={currentItem.condition || "BAIK"} 
                    onChange={e => setCurrentItem({...currentItem, condition: e.target.value})}
                    disabled={modalMode === "view"}
                    required
                  >
                    <option value="BAIK">Baik</option>
                    <option value="RUSAK_RINGAN">Rusak Ringan</option>
                    <option value="RUSAK_BERAT">Rusak Berat</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Jumlah (Unit)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    min="1"
                    value={currentItem.quantity || 1} 
                    onChange={e => setCurrentItem({...currentItem, quantity: parseInt(e.target.value)})}
                    readOnly={modalMode === "view"}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Lokasi</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={currentItem.location || ""} 
                    onChange={e => setCurrentItem({...currentItem, location: e.target.value})}
                    readOnly={modalMode === "view"}
                    required 
                  />
                </div>
                
                <div className="input-group md:col-span-2">
                  <label className="input-label">Tanggal Masuk</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={currentItem.dateReceived || ""} 
                    onChange={e => setCurrentItem({...currentItem, dateReceived: e.target.value})}
                    readOnly={modalMode === "view"}
                    required 
                  />
                </div>
                
                <div className="input-group md:col-span-2">
                  <label className="input-label">Deskripsi Tambahan</label>
                  <textarea 
                    className="input-field min-h-[100px]" 
                    value={currentItem.description || ""} 
                    onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                    readOnly={modalMode === "view"}
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-border-color flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
              <button onClick={closeModal} className="btn btn-outline">
                {modalMode === "view" ? "Tutup" : "Batal"}
              </button>
              {modalMode !== "view" && (
                <button type="submit" form="itemForm" className="btn btn-primary">
                  Simpan Data
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
