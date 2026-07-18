import Link from "next/link";
import { Layers, ShieldCheck, BarChart3, Users, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between selection:bg-brand-primary selection:text-bg-base">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Navigation */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3">
          <div className="bg-brand-primary text-bg-base p-2.5 rounded-xl shadow-lg">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Inv<span className="text-text-tertiary">Kampus.</span>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
            Log in
          </Link>
          <Link href="/auth/register" className="btn btn-primary text-sm px-6 py-2">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-bg-surface mb-8 text-sm font-medium shadow-sm">
          <Zap size={16} className="text-warning" />
          <span>Campus Inventory System 2.0 is here</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight max-w-4xl leading-[1.1]">
          Manage campus assets with <br className="hidden md:block"/>
          <span className="text-gradient">precision & elegance.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
          A premium, intelligent system designed to streamline your institution's inventory. Track, manage, and report with unparalleled efficiency.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <Link href="/auth/login" className="btn btn-primary text-lg px-8 py-4">
            Enter Workspace <ArrowRight size={20} />
          </Link>
          <a href="#features" className="btn btn-outline text-lg px-8 py-4 bg-bg-surface/50 backdrop-blur-md">
            Explore Features
          </a>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl pb-20">
          <FeatureCard 
            icon={<ShieldCheck size={28} className="text-success" />}
            title="Secure Access"
            desc="Multi-role authentication ensuring data integrity and authorized access control."
          />
          <FeatureCard 
            icon={<BarChart3 size={28} className="text-brand-accent" />}
            title="Automated Reports"
            desc="Generate comprehensive, beautiful PDF and Excel reports with a single click."
          />
          <FeatureCard 
            icon={<Users size={28} className="text-[#8b5cf6]" />}
            title="Team Management"
            desc="Intuitive role delegation and seamless team collaboration across departments."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-text-tertiary text-sm font-medium border-t border-border-subtle/50 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Sistem Inventaris Kampus. Crafted with precision.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel p-8 flex flex-col text-left hover:-translate-y-2 transition-all duration-300 rounded-2xl group cursor-default">
      <div className="mb-6 w-14 h-14 rounded-2xl bg-bg-surface flex items-center justify-center border border-border-subtle shadow-sm group-hover:shadow-md transition-shadow">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-text-secondary leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

