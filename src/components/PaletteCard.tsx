import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { ColorInfo } from "../services/gemini";

interface PaletteCardProps {
  color: ColorInfo;
  index: number;
}

export const PaletteCard: React.FC<PaletteCardProps> = ({ color, index }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-4 rounded-[24px] bg-white/25 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-2 border border-white/50 backdrop-blur-xl"
    >
      <div
        className="relative h-[220px] w-full overflow-hidden rounded-[16px] transition-all duration-500 shadow-sm"
        style={{ backgroundColor: color.hex }}
      >
        <button
          onClick={copyToClipboard}
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-500 group-hover:bg-black/[0.02] group-hover:opacity-100"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-[10px] font-bold text-text-primary shadow-2xl backdrop-blur-xl scale-90 group-hover:scale-100 transition-transform">
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span className="uppercase tracking-widest text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-text-muted" />
                <span className="uppercase tracking-widest">{color.hex}</span>
              </>
            )}
          </div>
        </button>
      </div>
      
      <div className="flex flex-col gap-1.5 px-1 py-1 text-center">
        <div className="font-serif text-sm font-light text-text-primary tracking-tight italic">
          {color.name}
        </div>
        <div className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted opacity-80">
          {color.hex}
        </div>
      </div>
    </motion.div>
  );
}
