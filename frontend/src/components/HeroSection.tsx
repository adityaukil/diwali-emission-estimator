"use client";

import React from "react";
import { Sparkles, Flame, Wind, Activity } from "lucide-react";

export default function HeroSection() {
  return (
    <header className="relative pt-12 pb-8 px-4 text-center max-w-5xl mx-auto">
      {/* Decorative Diwali Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-inner shadow-amber-500/10">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Diwali Festival Environmental Intelligence</span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span className="text-amber-200/80">CPCB & WHO Benchmarks</span>
      </div>

      {/* Hero Title with Glowing Gold Effect */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
        <span className="diwali-title-glow block">
          Diwali Air Quality &amp; Firecracker
        </span>
        <span className="text-white drop-shadow-[0_2px_15px_rgba(255,215,0,0.3)]">
          Emission Estimator
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
        Quantify the atmospheric impact of your festive bursts. Predict real-time{" "}
        <strong className="text-amber-300 font-semibold">PM2.5</strong> and{" "}
        <strong className="text-amber-300 font-semibold">SO₂</strong> pollution spikes
        using trained Machine Learning models trained on historical CPCB sensor telemetry.
      </p>

      {/* Festive Diya Decorative Icon */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500"></div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
          <div className="relative flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-400 flame-animated" />
            <div className="absolute inset-0 bg-amber-400/20 blur-sm rounded-full"></div>
          </div>
          <span className="text-xs font-medium text-amber-200 uppercase tracking-wider">
            Celebrate Responsibly
          </span>
        </div>
        <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500"></div>
      </div>
    </header>
  );
}
