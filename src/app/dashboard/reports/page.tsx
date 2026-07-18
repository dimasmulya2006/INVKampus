"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type Item = {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  location: string;
  dateReceived: string;
};

export default function ReportsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
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

  const getFilteredItems = () => {
    return items.filter(item => {
      const date = new Date(item.dateReceived);
      const itemMonth = (date.getMonth() + 1).toString();
      const itemYear = date.getFullYear().toString();
      
      let passMonth = true;
      let passYear = true;
      
      if (month) passMonth = itemMonth === month;
      if (year) passYear = itemYear === year;
      
      return passMonth && passYear;
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const data = getFilteredItems();
    
    doc.setFontSize(18);
    doc.text("Laporan Inventaris Kampus", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Periode: ${month ? month + '/' : ''}${year}`, 14, 30);
    doc.text(`Total Barang: ${data.length}`, 14, 36);

    const tableData = data.map((item, index) => [
      index + 1,
      item.code,
      item.name,
      item.category,
      item.quantity,
      item.condition,
      item.location,
      new Date(item.dateReceived).toLocaleDateString('id-ID')
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['No', 'Kode', 'Nama', 'Kategori', 'Qty', 'Kondisi', 'Lokasi', 'Tgl Masuk']],
      body: tableData,
    });

    doc.save(`Laporan_Inventaris_${year}${month ? `_${month}` : ''}.pdf`);
  };

  const exportExcel = () => {
    const data = getFilteredItems().map((item, index) => ({
      No: index + 1,
      Kode: item.code,
      'Nama Barang': item.name,
      Kategori: item.category,
      Jumlah: item.quantity,
      Kondisi: item.condition,
      Lokasi: item.location,
      'Tanggal Masuk': new Date(item.dateReceived).toLocaleDateString('id-ID'),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Inventaris");
    XLSX.writeFile(wb, `Laporan_Inventaris_${year}${month ? `_${month}` : ''}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Laporan Inventaris</h1>
        <p className="text-text-muted text-sm">Buat dan unduh laporan aset kampus Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 md:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-primary-color" /> Filter Laporan
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Bulan</label>
              <select className="input-field" value={month} onChange={e => setMonth(e.target.value)}>
                <option value="">Semua Bulan</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={(i+1).toString()}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label">Tahun</label>
              <select className="input-field" value={year} onChange={e => setYear(e.target.value)}>
                {[...Array(5)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y.toString()}>{y}</option>;
                })}
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-border-color flex flex-col gap-3">
              <button onClick={exportPDF} disabled={loading} className="btn btn-primary w-full justify-center">
                <FileText size={18} /> Download PDF
              </button>
              <button onClick={exportExcel} disabled={loading} className="btn btn-outline w-full justify-center bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:hover:bg-emerald-900/40">
                <Download size={18} /> Download Excel
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 md:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Preview Data Laporan</h2>
          
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-text-muted uppercase border-b border-border-color">
                <tr>
                  <th className="px-4 py-3 font-medium">Kode</th>
                  <th className="px-4 py-3 font-medium">Nama Barang</th>
                  <th className="px-4 py-3 font-medium">Kondisi</th>
                  <th className="px-4 py-3 font-medium">Tgl Masuk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted">Memuat preview...</td>
                  </tr>
                ) : getFilteredItems().length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted">Tidak ada data untuk periode ini.</td>
                  </tr>
                ) : getFilteredItems().slice(0, 10).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary-color">{item.code}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs">{item.condition}</span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{new Date(item.dateReceived).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && getFilteredItems().length > 10 && (
              <div className="text-center mt-4 text-xs text-text-muted">
                Menampilkan 10 dari {getFilteredItems().length} data. Download untuk melihat selengkapnya.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
