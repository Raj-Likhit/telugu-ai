"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  MessageSquare, 
  Mic, 
  Settings, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Copy,
  ChevronRight,
  Sparkles,
  Headphones
} from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { StatusDisplay } from "../components/ui/StatusDisplay";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";
import { cn } from "../../lib/utils";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText("join scale-around");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featureItems = [
    { 
      title: "Natural Voice STT", 
      desc: "Accurate Telugu speech transcription powered by Deepgram Nova-2.",
      icon: <Mic className="w-6 h-6" />,
      color: "text-indigo-400"
    },
    { 
      title: "Contextual LLM", 
      desc: "Sarvam-30B model fine-tuned for Telugu nuances and local context.",
      icon: <Zap className="w-6 h-6" />,
      color: "text-blue-400"
    },
    { 
      title: "Bulbul TTS", 
      desc: "Ultra-expressive Telugu voice synthesis with Sarvam Bulbul v3.",
      icon: <Settings className="w-6 h-6" />,
      color: "text-emerald-400"
    },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050510] font-sans">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TELUGU.AI
            </span>
          </motion.div>
          <StatusDisplay />
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* --- Hero Section --- */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-8">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">New: Bulbul V3 Voice Enabled</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-display font-black leading-[1] mb-8 tracking-tighter">
                Meet the Future of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 drop-shadow-sm">
                  Telugu Audio.
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-12 max-w-xl leading-relaxed font-medium">
                The first professional voice-to-voice assistant built specifically for the Telugu language. 
                Experience a level of natural interaction you never thought possible.
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <button 
                  onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Conversation <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 glass rounded-full flex items-center justify-center p-3 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30">
                    <Headphones className="w-full h-full" />
                  </div>
                  <span className="font-semibold">Hear Demo</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative p-2"
            >
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
              <GlassCard className="aspect-square flex items-center justify-center border-indigo-500/20 bg-indigo-500/5 relative z-10" hover={false}>
                <div className="w-full h-full relative rounded-2xl overflow-hidden group">
                  <Image 
                    src="/qr-code.png" 
                    alt="WhatsApp QR" 
                    fill 
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-60" />
                </div>
              </GlassCard>
              
              {/* Floating micro-interactions */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 glass rounded-3xl flex items-center justify-center p-6 shadow-2xl z-20"
              >
                <MessageSquare className="w-full h-full text-emerald-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {featureItems.map((item, i) => (
            <GlassCard key={item.title} delay={0.2 * i}>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 glass", item.color)}>
                {item.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* --- Instructions / Sandbox --- */}
        <section id="sandbox" className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black mb-4">Jump In the Sandbox</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Get connected in less than 60 seconds with these simple steps.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <GlassCard delay={0.1} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 font-display font-black text-xl text-indigo-400">1</div>
              <h4 className="font-bold mb-2">Save the Number</h4>
              <p className="text-sm text-slate-500 mb-6">Add our official sandbox assistant to your contacts.</p>
              <div className="px-4 py-3 glass rounded-xl font-mono text-indigo-300 text-sm select-all">
                +1 (415) 523-8886
              </div>
            </GlassCard>

            <GlassCard delay={0.2} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 font-display font-black text-xl text-indigo-400">2</div>
              <h4 className="font-bold mb-2">Join the Sandbox</h4>
              <p className="text-sm text-slate-500 mb-6">Send this exact code to trigger the connection.</p>
              <button 
                onClick={copyCode}
                className="w-full px-4 py-3 glass rounded-xl font-mono text-white text-sm flex items-center justify-between group hover:bg-white/10"
              >
                <span>join scale-around</span>
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />}
              </button>
            </GlassCard>

            <GlassCard delay={0.3} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 font-display font-black text-xl text-indigo-400">3</div>
              <h4 className="font-bold mb-2">Send Voice/Text</h4>
              <p className="text-sm text-slate-500 mb-6">Start speaking in Telugu and get instant audio replies.</p>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                Get Started <ChevronRight className="w-4 h-4" />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-slate-400">Telugu.AI</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
            <span className="text-xs text-slate-600 font-bold tracking-widest uppercase">Secured by Deepgram & Sarvam</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={className}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
    </motion.div>
  );
}
