"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Flame,
  Leaf,
  Heart,
  RotateCcw,
  Volume2,
  Flower2,
  CheckCircle2,
  Sun
} from "lucide-react";

interface GreenDiwaliGuideProps {
  cityName: string;
}

const GREEN_DIWALI_TEXT =
  "Diwali at its sacred core is Deepavali—the triumph of pure inner light over darkness and ignorance, never meant to be masked by suffocating plumes of toxic smoke. To honor this venerable heritage without poisoning the air our children and elders breathe, we can illuminate our homes with traditional handmade clay diyas fueled by mustard or sesame oil, craft vibrant doorstep rangolis using fragrant marigold petals, rice flour, and natural turmeric rather than synthetic chemicals, gift thriving indigenous air-purifying saplings like Tulsi and Sansevieria to loved ones, and gather our communities for synchronized earthen lantern lighting, musical celebrations, and low-voltage artistic LED spectacles that kindle collective joy, protect stray animals from deafening acoustic trauma, and leave our midnight sky as pristine, luminous, and filled with reverence as the gods intended.";

export default function GreenDiwaliGuide({ cityName }: GreenDiwaliGuideProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect logic
  const startTypewriter = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText("");
    setIsTyping(true);
    setIsComplete(false);
    indexRef.current = 0;

    timerRef.current = setInterval(() => {
      if (indexRef.current < GREEN_DIWALI_TEXT.length) {
        setDisplayedText(GREEN_DIWALI_TEXT.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
        setIsComplete(true);
      }
    }, 22);
  };

  useEffect(() => {
    startTypewriter();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cityName]);

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(GREEN_DIWALI_TEXT);
    setIsTyping(false);
    setIsComplete(true);
  };

  return (
    <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-950 to-emerald-950/80 border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.18)] animate-slide-up-6">
      {/* Designer Header with Illuminated Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/30 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-amber-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Flame className="w-6 h-6 text-amber-400 flame-animated" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-400" />
                <span>Sacred Environmental Harmony</span>
              </span>
              <span className="text-xs text-amber-300/90 font-medium">
                Conscious Celebration in {cityName}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-200 bg-clip-text text-transparent">
                How We Can Celebrate a Green Diwali
              </span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
            </h3>
          </div>
        </div>

        {/* Animation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isTyping && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
            >
              Skip to Full Text
            </button>
          )}

          <button
            type="button"
            onClick={startTypewriter}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/30 to-amber-600/30 hover:from-emerald-600/50 hover:to-amber-600/50 text-emerald-200 border border-emerald-500/40 font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
            title="Replay Typewriter Effect"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Replay Typing</span>
          </button>
        </div>
      </div>

      {/* Main Designer Typewriter Paragraph */}
      <div className="relative p-6 sm:p-7 rounded-xl bg-slate-950/80 border border-emerald-500/30 shadow-inner">
        {/* Subtle decorative quotation mark */}
        <span className="absolute top-2 left-4 text-5xl font-serif text-emerald-500/15 select-none pointer-events-none">
          “
        </span>

        <p className="green-diwali-designer text-base sm:text-lg text-emerald-50/95 leading-relaxed relative z-10 italic">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2.5 h-5 ml-1 bg-gradient-to-t from-emerald-400 to-amber-300 typewriter-cursor align-middle shadow-[0_0_10px_#34D399]" />
          )}
        </p>

        {isComplete && (
          <div className="mt-4 pt-4 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deepavali Heritage Philosophy • Pure Air &amp; Compassion</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400/60">
              100% Zero-Carbon Alternatives
            </span>
          </div>
        )}
      </div>

      {/* 4 Elegant Green Diwali Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0 mt-0.5">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-200">Terracotta Earthen Diyas</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Pure mustard or sesame oil lamps that naturally illuminate without toxic fumes.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0 mt-0.5">
            <Flower2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-200">Botanical Floral Rangoli</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Fragrant marigold petals, rice flour &amp; turmeric replacing chemical powders.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0 mt-0.5">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-200">Air-Purifying Green Gifting</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Gifting Tulsi, Peace Lily, and Sansevieria plants to nurture clean indoor air.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 flex-shrink-0 mt-0.5">
            <Sun className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-200">Community Light Shows</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Synchronized LED drone &amp; music festivals protecting pets and infants from noise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
