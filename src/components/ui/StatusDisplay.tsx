"use client";

import { motion } from "framer-motion";
import { Mic, Zap, Settings, CheckCircle2 } from "lucide-react";

const services = [
  { name: "Deepgram", icon: Mic, status: "Healthy" },
  { name: "Sarvam AI", icon: Zap, status: "Healthy" },
  { name: "Twilio", icon: Settings, status: "Healthy" },
];

export function StatusDisplay() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {services.map((service, idx) => (
        <motion.div
          key={service.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + idx * 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 glass rounded-full"
        >
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            {service.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
