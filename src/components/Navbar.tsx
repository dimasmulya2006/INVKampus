"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  
  // Extract initials
  const initials = session?.user?.name 
    ? session.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-20 bg-bg-base/70 backdrop-blur-xl border-b border-border-subtle flex items-center justify-between px-8 sticky top-0 z-20 transition-all duration-300">
      <div className="flex items-center gap-6">
        <button className="lg:hidden text-text-tertiary hover:text-text-primary transition-colors p-2 -ml-2">
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-bg-surface px-4 py-2.5 rounded-full border border-border-subtle focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all w-72 shadow-sm">
          <Search size={16} strokeWidth={2.5} className="text-text-tertiary mr-3" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium text-text-primary placeholder:text-text-tertiary"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-text-tertiary hover:text-text-primary transition-colors rounded-full hover:bg-bg-surface-hover">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-danger rounded-full border-2 border-bg-base"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-border-subtle cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-bg-base flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-text-primary leading-tight group-hover:text-brand-accent transition-colors">
              {session?.user?.name || "Guest User"}
            </p>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mt-0.5">
              {((session?.user as any)?.role || "Admin").toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
