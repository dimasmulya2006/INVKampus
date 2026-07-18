"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="page-container bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 min-h-screen">
      <div className="glass-panel w-full max-w-md p-8 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-primary-color rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        
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
            <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali!</h2>
            <p className="text-text-muted text-sm">Masuk untuk mengelola aset kampus</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="input-group mb-0">
              <label className="input-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                name="username"
                className="input-field" 
                placeholder="Masukkan username Anda" 
                required 
              />
            </div>
            
            <div className="input-group mb-0">
              <div className="flex justify-between items-center">
                <label className="input-label" htmlFor="password">Password</label>
              </div>
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
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-text-muted">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-primary-color font-medium hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
