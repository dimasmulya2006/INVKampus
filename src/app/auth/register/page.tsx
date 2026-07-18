"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Terjadi kesalahan");
        setLoading(false);
      } else {
        router.push("/auth/login?registered=true");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
      setLoading(false);
    }
  };

  return (
    <div className="page-container bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 min-h-screen">
      <div className="glass-panel w-full max-w-md p-8 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 -mt-16 -ml-16 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 -mb-16 -mr-16 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary-color text-white p-2 rounded-lg">
                <Layers size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                InventarisKampus
              </h1>
            </Link>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Buat Akun Baru</h2>
            <p className="text-text-muted text-sm">Daftar untuk mulai menggunakan sistem</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="input-group mb-0">
              <label className="input-label" htmlFor="name">Nama Lengkap</label>
              <input 
                type="text" 
                id="name"
                name="name"
                className="input-field" 
                placeholder="John Doe" 
                required 
              />
            </div>

            <div className="input-group mb-0">
              <label className="input-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                name="username"
                className="input-field" 
                placeholder="johndoe" 
                required 
              />
            </div>
            
            <div className="input-group mb-0">
              <label className="input-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                name="password"
                className="input-field" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 mt-4" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-text-muted">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-primary-color font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
