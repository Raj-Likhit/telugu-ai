"use client";

import Image from "next/image";
import { 
  CheckCircle2, 
  MessageSquare, 
  Mic, 
  Settings, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

export default function Home() {
  const statusItems = [
    { name: "Deepgram STT", status: "Operational", icon: <Mic className="w-5 h-5" /> },
    { name: "Gemini 1.5 Flash", status: "Operational", icon: <Zap className="w-5 h-5" /> },
    { name: "Sarvam AI TTS", status: "Operational", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <main className="min-h-screen bg-[#050510] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-24 anim-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Telugu.AI
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-400">System Live</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Hero Content */}
          <section className="anim-slide-up">
            <h2 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
              Voice Assistant for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                Telugu Speakers.
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
              Experience natural voice-to-voice communication in Telugu. Powered by Deepgram, 
              Gemini 1.5, and Sarvam AI. Simple, fast, and accessible through WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {statusItems.map((item) => (
                <div 
                  key={item.name} 
                  className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm transition-all hover:bg-slate-900/60"
                >
                  <div className="text-indigo-400 mb-3">{item.icon}</div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{item.name}</p>
                  <p className="text-sm font-semibold text-slate-200">{item.status}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span>Enterprise-grade privacy and encryption.</span>
            </div>
          </section>

          {/* Right Column: QR Code / Interaction */}
          <section className="relative anim-fade-in-delayed">
            <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20 transition-opacity group-hover:opacity-40">
                <MessageSquare className="w-24 h-24 text-indigo-500 rotate-12" />
              </div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Join Sandbox</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Start Talking Now</h3>
                <p className="text-slate-400 mb-8 text-sm">Scan the QR code below to connect with Telugu.AI on WhatsApp Sandbox.</p>
                
                <div className="relative mx-auto w-64 h-64 bg-white p-4 rounded-[2rem] shadow-2xl shadow-indigo-500/10 mb-8 overflow-hidden group">
                  <Image 
                    src="/qr-code.png" 
                    alt="WhatsApp Sandbox QR Code" 
                    width={256} 
                    height={256}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-indigo-600/5 transition-opacity group-hover:opacity-0" />
                </div>

                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Sandbox Code</p>
                    <code className="text-lg font-mono text-indigo-400">join scale-around</code>
                  </div>
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-400">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-sm font-medium">© 2026 Telugu.AI. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="#" className="text-sm hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-indigo-400 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>

    </main>
  );
}
