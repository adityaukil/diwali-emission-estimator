"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  Flame,
  Wind,
  ShieldAlert,
  Cigarette,
  HeartPulse,
  TrendingUp,
  Cpu,
  Info,
  Atom,
  FlaskConical,
  Sparkles,
  MapPin,
  HelpCircle,
  ArrowDown
} from "lucide-react";

export interface GasesReleased {
  so2_grams: number;
  co_grams: number;
  no2_grams: number;
  pm25_mass_grams: number;
  pm10_mass_grams: number;
  heavy_metals_mg: number;
  gas_summary: string;
}

export interface PredictionResult {
  city_id?: string;
  city_name?: string;
  city_dispersion_multiplier?: number;
  city_climate?: string;
  pm25_spike: number;
  so2_spike: number;
  pm10_spike: number;
  baseline_pm25: number;
  total_pm25: number;
  baseline_so2: number;
  total_so2: number;
  aqi_category: string;
  aqi_color: string;
  who_guideline_pm25: number;
  who_exceedance_factor: number;
  cigarette_equivalent: number;
  health_advisory: string;
  breakdown: Record<
    string,
    {
      name: string;
      quantity: number;
      pm25_spike_ug: number;
      so2_spike_ug: number;
      percentage_pm25: number;
    }
  >;
  gases_released?: GasesReleased;
  model_source: string;
}

interface ResultsDashboardProps {
  results: PredictionResult;
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case "Good":
        return "bg-emerald-950 text-emerald-300 border-emerald-500/40";
      case "Satisfactory":
        return "bg-lime-950 text-lime-300 border-lime-500/40";
      case "Moderate":
        return "bg-amber-950 text-amber-300 border-amber-500/40";
      case "Poor":
        return "bg-orange-950 text-orange-300 border-orange-500/40";
      case "Very Poor":
        return "bg-rose-950 text-rose-300 border-rose-500/40";
      case "Severe":
        return "bg-red-950 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
      default:
        return "bg-purple-950 text-purple-300 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]";
    }
  };

  const gases = results.gases_released || {
    so2_grams: Math.round(results.so2_spike * 0.45 * 10) / 10,
    co_grams: Math.round(results.pm25_spike * 0.22 * 10) / 10,
    no2_grams: Math.round(results.so2_spike * 0.3 * 10) / 10,
    pm25_mass_grams: Math.round(results.pm25_spike * 1.5 * 10) / 10,
    pm10_mass_grams: Math.round(results.pm10_spike * 1.5 * 10) / 10,
    heavy_metals_mg: Math.round(results.pm25_spike * 350 * 10) / 10,
    gas_summary: "Toxic combustion gases and heavy metal oxidizers released into the local breathing zone."
  };

  const formatVal = (num: number, minDecimals: number = 1) => {
    if (num <= 0) return "0.0";
    if (num < 10) return num.toFixed(2);
    return num.toFixed(minDecimals);
  };

  const scrollToExplanation = () => {
    const el = document.getElementById("how-did-i-get-it");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const cityName = results.city_name || "Delhi NCR";

  return (
    <section
      id="results-section"
      className="max-w-5xl mx-auto px-4 mb-8 scroll-mt-6 animate-in fade-in slide-in-from-bottom-6 duration-500"
    >
      <div className="diwali-card rounded-2xl p-6 sm:p-8">
        {/* Dashboard Title & Model Source Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-amber-500/20 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Emission Spike &amp; Atmospheric Loading Dashboard
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>City: {cityName}</span>
              </span>
              {results.city_climate && (
                <span className="text-xs text-slate-400">
                  • {results.city_climate}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={scrollToExplanation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)] cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>How did I get it?</span>
              <ArrowDown className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px]">{results.model_source}</span>
            </div>
          </div>
        </div>

        {/* CSS GRID: Main Metrics (4 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: PM2.5 Spike */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_15px_rgba(255,215,0,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                <span>PM2.5 Ambient Spike</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono my-1">
                +{formatVal(results.pm25_spike)}
                <span className="text-sm font-sans text-slate-400 font-normal ml-1">
                  µg/m³
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
              <span>{cityName} Baseline:</span>
              <strong className="text-amber-300 font-mono">
                {formatVal(results.total_pm25)} µg/m³ total
              </strong>
            </div>
          </div>

          {/* Card 2: SO2 Spike */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_15px_rgba(255,215,0,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                <span>SO₂ Sulfur Dioxide Spike</span>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono my-1">
                +{formatVal(results.so2_spike)}
                <span className="text-sm font-sans text-slate-400 font-normal ml-1">
                  µg/m³
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
              <span>Total with baseline:</span>
              <strong className="text-orange-300 font-mono">
                {formatVal(results.total_so2)} µg/m³
              </strong>
            </div>
          </div>

          {/* Card 3: PM10 Particulate Spike */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                <span>PM10 Coarse Ash</span>
                <Wind className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono my-1">
                +{formatVal(results.pm10_spike)}
                <span className="text-sm font-sans text-slate-400 font-normal ml-1">
                  µg/m³
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
              Respirable particulates &amp; ash in {cityName}
            </div>
          </div>

          {/* Card 4: AQI Impact Category */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                <span>AQI Category</span>
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: results.aqi_color }}
                />
              </div>
              <div className="mt-2 mb-1">
                <span
                  className={`inline-block px-3 py-1 rounded-md text-sm font-bold border ${getBadgeStyle(
                    results.aqi_category
                  )}`}
                >
                  {results.aqi_category}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
              National Air Quality Index ({cityName})
            </div>
          </div>
        </div>

        {/* PROMINENT GASES & CHEMICAL MASS RELEASED SECTION */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-slate-950 via-amber-950/30 to-slate-950 border border-amber-500/40 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Gaseous &amp; Chemical Emissions Released (Absolute Mass in {cityName})
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-medium border border-amber-500/30">
              Combustion Yield
            </span>
          </div>

          {/* Gas Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {/* SO2 Gas */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-orange-500/30">
              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider block">
                SO₂ Sulfur Dioxide
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block my-1">
                {gases.so2_grams}
                <span className="text-xs font-sans text-slate-400 font-normal ml-0.5">g</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                {Math.round(gases.so2_grams * 1000).toLocaleString()} mg gas
              </span>
            </div>

            {/* CO Gas */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                CO Carbon Monoxide
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block my-1">
                {gases.co_grams}
                <span className="text-xs font-sans text-slate-400 font-normal ml-0.5">g</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                {Math.round(gases.co_grams * 1000).toLocaleString()} mg gas
              </span>
            </div>

            {/* NO2 Gas */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                NO₂ Nitrogen Oxides
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block my-1">
                {gases.no2_grams}
                <span className="text-xs font-sans text-slate-400 font-normal ml-0.5">g</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                {Math.round(gases.no2_grams * 1000).toLocaleString()} mg gas
              </span>
            </div>

            {/* Total PM2.5 Mass */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-amber-500/40">
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                PM2.5 Mass Discharged
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono block my-1">
                {gases.pm25_mass_grams}
                <span className="text-xs font-sans text-slate-400 font-normal ml-0.5">g</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                Fine respirable soot
              </span>
            </div>

            {/* Total PM10 Mass */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                PM10 Total Dust
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-200 font-mono block my-1">
                {gases.pm10_mass_grams}
                <span className="text-xs font-sans text-slate-400 font-normal ml-0.5">g</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                Total coarse mass
              </span>
            </div>

            {/* Heavy Metals */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider block">
                Heavy Metals / Salts
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-rose-300 font-mono block my-1">
                {gases.heavy_metals_mg}
                <span className="text-xs font-sans text-slate-400 font-normal ml-0.5">mg</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                Barium, Strontium, Copper
              </span>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Atom className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-300">Chemical Summary:</strong> {gases.gas_summary}
            </p>
          </div>
        </div>

        {/* WHO Guideline Exceedance & Health Impact Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block">
                WHO Air Quality Threshold
              </span>
              <div className="text-xl font-bold text-white mt-1">
                <span className="text-2xl text-rose-400 font-mono">
                  {results.who_exceedance_factor}×
                </span>{" "}
                WHO Safe Daily Limit
              </div>
              <p className="text-xs text-slate-400 mt-1">
                WHO 24-hr guideline is <strong>15 µg/m³</strong>. Ambient air in {cityName} contains{" "}
                <strong className="text-white">{formatVal(results.total_pm25)} µg/m³</strong>.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
              <Cigarette className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                Toxic Equivalence (Inhalation Index)
              </span>
              <div className="text-xl font-bold text-white mt-1">
                ≈ <span className="text-2xl text-amber-300 font-mono">{results.cigarette_equivalent}</span>{" "}
                Passive Cigarettes
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Based on Berkeley Earth PM2.5 physiological toxic equivalence rule in {cityName}.
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Firecracker Source Breakdown */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            Firecracker Source Contribution Breakdown ({cityName})
          </h3>

          <div className="space-y-3">
            {Object.entries(results.breakdown).map(([key, item]) => {
              if (item.quantity === 0) return null;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-200 font-medium">
                      {item.name}{" "}
                      <span className="text-slate-400">({item.quantity} units)</span>
                    </span>
                    <span className="text-amber-300 font-mono">
                      +{formatVal(item.pm25_spike_ug)} µg/m³ ({item.percentage_pm25}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, item.percentage_pm25)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official CPCB & Health Advisory Box */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
          <HeartPulse className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="text-amber-200 block mb-0.5">
              Public Health Advisory for {cityName}:
            </strong>
            <p className="text-slate-300 leading-relaxed">
              {results.health_advisory}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
