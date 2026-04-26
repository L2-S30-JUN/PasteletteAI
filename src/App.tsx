import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Loader2, Palette } from "lucide-react";
import confetti from "canvas-confetti";
import { generatePalette, PaletteResponse } from "./services/gemini";
import { PaletteCard } from "./components/PaletteCard";

const SUGGESTIONS = [
  "forest", "ocean", "sunset", "그리움", "봄", "winter", 
  "cozy", "마음", "midnight", "가을", "lavender", "rain"
];

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState<PaletteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || loading) return;

    setLoading(true);
    setError(null);
    setInput(finalInput);
    
    try {
      const result = await generatePalette(finalInput);
      setPalette(result);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: result.colors.map(c => c.hex)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4 sm:p-8 overflow-hidden relative font-sans">
      {/* Background Layer */}
      <div className="bg-layer" aria-hidden="true">
        <div className="bg-watermark">
          {input.toUpperCase() || "PASTELETTE"}
        </div>
        
        {/* Ribbon Curves */}
        <svg className="deco-ribbon deco-ribbon--blue h-[400px]" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path className="ribbon-path" d="M -50 80 C 200 60, 400 200, 600 180 C 800 160, 1000 80, 1250 120" stroke="rgba(140,170,220,0.5)" strokeWidth="1.2" fill="none" />
        </svg>
        <svg className="deco-ribbon deco-ribbon--pink h-[300px]" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path className="ribbon-path" d="M -50 250 C 200 270, 500 150, 700 200 C 900 250, 1100 180, 1250 220" stroke="rgba(230,160,160,0.4)" strokeWidth="1.2" fill="none" />
        </svg>

        {/* Ornaments */}
        <div className="absolute top-[12%] left-[32%] deco-cross" />
        <div className="absolute top-[48%] right-[10%] deco-cross" />
        <div className="absolute top-[82%] left-[18%] deco-cross" />
        <div className="absolute top-[35%] right-[32%] deco-cross" />
        
        {/* Sparkles */}
        {[
          { t: "20%", l: "19%", s: "md", d: "0s" },
          { t: "42%", r: "14%", s: "sm", d: "-1.1s" },
          { t: "76%", l: "29%", s: "xs", d: "-2.2s" },
          { t: "56%", r: "24%", s: "lg", d: "-3.3s" },
          { t: "31%", l: "44%", s: "sm", d: "-1.7s" },
        ].map((item, idx) => (
          <svg key={idx} className={`deco-sparkle deco-sparkle--${item.s}`} 
               style={{ top: item.t, left: item.l, right: item.r, animationDelay: item.d }}
               viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C8 0 8.3 4 8 8C7.7 4 8 0 8 0Z" />
            <path d="M16 8C16 8 12 7.7 8 8C12 8.3 16 8 16 8Z" />
            <path d="M8 16C8 16 7.7 12 8 8C8.3 12 8 16 8 16Z" />
            <path d="M0 8C0 8 4 8.3 8 8C4 7.7 0 8 0 8Z" />
          </svg>
        ))}
        
        {/* Snowflakes */}
        {[
          { t: "8%", l: "6%", s: "lg", d: "0s" },
          { t: "66%", l: "4%", s: "md", d: "-3.2s" },
          { t: "14%", r: "8%", s: "sm", d: "-1.6s" },
          { t: "73%", r: "5%", s: "md", d: "-5.2s" },
        ].map((item, idx) => (
          <svg key={idx} className={`deco-snowflake deco-snowflake--${item.s}`}
               style={{ top: item.t, left: item.l, right: item.r, animationDelay: item.d }}
               viewBox="0 0 40 40" fill="none" stroke="currentColor">
            <line x1="20" y1="2" x2="20" y2="38" strokeWidth="1" />
            <line x1="2" y1="11" x2="38" y2="29" strokeWidth="1" />
            <line x1="2" y1="29" x2="38" y2="11" strokeWidth="1" />
            <circle cx="20" cy="20" r="2.5" strokeWidth="0.8" />
          </svg>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-container flex h-full max-h-[840px] w-full max-w-[1040px] flex-col rounded-[2px] p-8 sm:p-12 overflow-hidden relative z-10"
      >
        {/* Corner Ornaments */}
        <div className="corner-ornament corner-ornament--tl" />
        <div className="corner-ornament corner-ornament--tr" />
        <div className="corner-ornament corner-ornament--bl" />
        <div className="corner-ornament corner-ornament--br" />

        {/* Header */}
        <header className="mb-12 flex flex-col items-center text-center">
          <h1 className="font-serif text-5xl sm:text-6xl font-light italic tracking-[0.25em] text-text-primary">
            Pastelette
          </h1>
          <p className="mt-4 text-xs sm:text-sm font-serif font-light text-text-muted tracking-[0.2em] uppercase">
            단어가 색채로 번역되는 순간
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary backdrop-blur-sm">
            AI ANALYSIS · FREE
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Search Area */}
          <section className="mx-auto mb-14 max-w-lg px-4">
            <form onSubmit={handleGenerate} className="relative mb-8">
              <div className="group flex items-center rounded-full border border-text-muted/30 bg-white/40 px-6 py-2 shadow-sm focus-within:ring-2 focus-within:ring-accent-primary/20 transition-all hover:bg-white/60 backdrop-blur-md">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="단어를 입력하세요 — forest, 그리움..."
                  className="flex-1 border-none bg-transparent py-2 text-base font-serif font-light italic text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="ml-4 flex h-10 w-10 items-center justify-center rounded-full border border-text-muted/30 bg-white/30 text-accent-primary shadow-sm transition-all hover:bg-accent-primary hover:text-white disabled:opacity-30"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9H15M10 4L15 9L10 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Suggestion Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              {SUGGESTIONS.map((tag, idx) => (
                <button
                  key={tag}
                  onClick={() => handleGenerate(undefined, tag)}
                  className="rounded-full border border-slate-200/40 bg-white/20 px-4 py-1.5 text-[10px] font-medium text-text-secondary tracking-widest uppercase hover:bg-accent-primary/10 hover:text-text-primary transition-all cursor-pointer backdrop-blur-sm"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 rounded-lg border border-red-200/30 bg-red-50/10 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-sm font-serif italic text-red-400">{error}</p>
              </motion.div>
            )}
          </section>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {palette && !loading ? (
              <motion.section
                key={palette.theme}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-16 pb-12"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 px-4">
                  {palette.colors.map((color, idx) => (
                    <PaletteCard key={color.hex + idx} color={color} index={idx} />
                  ))}
                </div>
                
                <div className="text-center px-6">
                  <h2 className="font-serif text-3xl sm:text-4xl font-light italic text-text-primary tracking-widest lowercase border-b border-text-muted/10 inline-block pb-3 px-8">
                    {palette.theme}
                  </h2>
                  <p className="mx-auto mt-8 max-w-3xl text-sm sm:text-base leading-relaxed text-text-secondary font-serif italic opacity-80 font-light">
                    {palette.explanation}
                  </p>
                </div>
              </motion.section>
            ) : !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-text-muted/40"
              >
                <div className="relative mb-8">
                  <svg className="h-14 w-14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C8 0 8.4 5 8 8C7.6 5 8 0 8 0Z" fill="currentColor"/>
                    <path d="M16 8C16 8 11 7.6 8 8C11 8.4 16 8 16 8Z" fill="currentColor"/>
                    <path d="M8 16C8 16 7.6 11 8 8C8.4 11 8 16 8 16Z" fill="currentColor"/>
                    <path d="M0 8C0 8 5 8.4 8 8C5 7.6 0 8 0 8Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-xl font-serif italic text-text-secondary/60 tracking-wider">단어 하나가 색채 세계로 번역됩니다</p>
                <p className="text-[10px] mt-4 text-text-muted/50 tracking-[0.3em] uppercase font-bold">AI가 의미를 분석해 어울리는 색을 찾아드립니다</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-6 flex items-center justify-center border-t border-black/[0.03] pt-8">
          <p className="text-[9px] uppercase tracking-[0.4em] font-medium text-text-muted/60">
            © 2026 Pastelette. Luxury Minimal AI.
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
