import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* 1. DYNAMIC GRID BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* 2. ANIMATED ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[140px] animate-[pulse_8s_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[140px] animate-[pulse_10s_infinite]" />
      </div>

      {/* ULTRA-SLEEK NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-3 shadow-2xl" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
               <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="relative w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-[10deg]">
                 <span className="font-black text-2xl italic">P</span>
               </div>
            </div>
            <span className="text-2xl font-black tracking-tighter hover:tracking-normal transition-all duration-300">
              AURORA<span className="text-cyan-500">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <div className="flex gap-10 text-sm font-bold tracking-widest text-slate-400 uppercase">
              <Link to="/" className="hover:text-cyan-400 transition-all hover:scale-110">Market</Link>
              <Link to="/" className="hover:text-cyan-400 transition-all hover:scale-110">Neural</Link>
              <Link to="/" className="hover:text-cyan-400 transition-all hover:scale-110">Vault</Link>
            </div>
            <Link to="/register" className="relative group px-8 py-3 bg-white text-black rounded-full font-black overflow-hidden hover:text-white transition-colors duration-300">
              <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">REGISTER NOW</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-56 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900/50 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-[0.2em] mb-12 animate-[bounce_3s_infinite] backdrop-blur-md">
            SYSTEM STATUS: OPTIMIZED
          </div>
          
          <h1 className="text-7xl md:text-[130px] font-black tracking-tighter leading-[0.85] mb-12 select-none">
            FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
              OF PRODUCT.
            </span>
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto mb-16 font-light leading-relaxed">
            Harness the power of <span className="text-white font-bold">Neural Distribution</span>. 
            A design system that adapts to your workflow, not the other way around.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-8 items-center">
            <Link to="/dashboard" className="group relative px-14 py-6 bg-cyan-500 rounded-[2rem] font-black text-xl hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-2">
              GO TO DASHBOARD
            </Link>
            <button className="flex items-center gap-3 text-lg font-bold group">
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              WATCH INTERFACE
            </button>
          </div>
        </div>
      </main>

      {/* FEATURE SECTION - Floating Hybrid Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {[
            { title: "Quantum Sync", color: "from-cyan-500", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "Vault-Grade", color: "from-blue-600", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            { title: "Ghost Logic", color: "from-purple-600", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" }
          ].map((item, idx) => (
            <div key={idx} className="group relative pt-16">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br ${item.color} to-black border border-white/20 rounded-2xl flex items-center justify-center z-20 group-hover:-translate-y-4 transition-transform duration-500`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon}/></svg>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] text-center group-hover:bg-slate-800/60 transition-colors duration-500">
                <h3 className="text-3xl font-black mb-4 tracking-tighter">{item.title}</h3>
                <p className="text-slate-500 font-medium">Hyper-threaded performance architecture for the next generation of digital assets.</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* CSS For Custom Animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>

    </div>
  );
};

export default Home;