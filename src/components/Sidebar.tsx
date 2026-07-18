"use client";

import { Layers, Package, BarChart3, Users, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} strokeWidth={2.5} />, path: "/dashboard" },
    { name: "Inventory", icon: <Package size={20} strokeWidth={2.5} />, path: "/dashboard/items" },
    { name: "Reports", icon: <BarChart3 size={20} strokeWidth={2.5} />, path: "/dashboard/reports" },
    { name: "Team", icon: <Users size={20} strokeWidth={2.5} />, path: "/dashboard/users" },
    { name: "Settings", icon: <Settings size={20} strokeWidth={2.5} />, path: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 bg-bg-base border-r border-border-subtle h-screen flex flex-col transition-colors duration-300 z-10 sticky top-0">
      <div className="h-20 flex items-center px-8">
        <Link href="/dashboard" className="flex items-center gap-3 text-brand-primary group">
          <div className="p-2 rounded-lg bg-brand-primary text-bg-base shadow-sm group-hover:scale-105 transition-transform">
            <Layers size={20} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Inv<span className="text-text-tertiary">Kampus.</span></span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        <div className="text-[0.65rem] font-bold text-text-tertiary mb-3 uppercase tracking-widest px-4">Main Menu</div>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-bg-surface text-brand-primary shadow-sm font-semibold border border-border-subtle' 
                  : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary font-medium border border-transparent'
              }`}
            >
              <div className={`${isActive ? 'text-brand-accent' : 'text-text-tertiary'}`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mb-4">
        <button 
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all w-full text-left font-semibold group border border-transparent hover:border-danger/20"
        >
          <LogOut size={20} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
