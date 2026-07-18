"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base selection:bg-brand-primary selection:text-bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle background blob for dashboard */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-accent rounded-full opacity-[0.03] blur-[100px] pointer-events-none z-0"></div>
        
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth relative z-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
