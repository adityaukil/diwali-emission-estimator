"use client";

import React, { useState } from "react";
import { CITIES, CityConfig } from "@/data/cities";
import { MapPin, Compass, Wind, Thermometer, ShieldAlert, Check } from "lucide-react";

interface CitySelectorProps {
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
}

export default function CitySelector({
  selectedCityId,
  onSelectCity,
}: CitySelectorProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const selectedCity = CITIES.find((c) => c.id === selectedCityId) || CITIES[0];

  const metros = CITIES.filter((c) => c.category.includes("Metropolitan"));
  const majorCities = CITIES.filter((c) => !c.category.includes("Metropolitan"));

  const filteredMetros = metros.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredMajor = majorCities.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-[0_0_25px_rgba(255,215,0,0.08)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              Step 1: Choose Your City for Calibrated Estimation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Baseline pollution, nocturnal thermal inversions, and meteorological dispersion dynamically adjust per city
          </p>
        </div>

        {/* Selected City Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs font-semibold text-amber-300 self-start sm:self-auto shadow-[0_0_12px_rgba(255,215,0,0.15)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Selected: {selectedCity.name}</span>
          <span className="text-[10px] text-slate-400 font-normal">({selectedCity.state})</span>
        </div>
      </div>

      {/* City Quick Pills: Tier-1 Metros */}
      <div className="mb-4">
        <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400/90 block mb-2">
          Tier-1 Metropolitan Cities
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {filteredMetros.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-[1.02]"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/70 hover:border-amber-400/50"
                }`}
              >
                <span>{city.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Major Regional & Cultural Hubs */}
      <div className="mb-5">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
          Major Regional &amp; Cultural Cities
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
          {filteredMajor.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-[1.02]"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span className="truncate">{city.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected City Environmental Profile Card */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {selectedCity.name} Micro-Climate Profile
              </span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {selectedCity.climate}
              </p>
            </div>
          </div>

          {/* Meteorological Metric Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 text-[11px]">
              Avg Baseline: <strong className="text-amber-300 font-mono">{selectedCity.base_pm25} µg/m³</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 text-[11px] flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-400" />
              <span>Diwali Wind: <strong className="text-sky-300 font-mono">{selectedCity.wind_avg} km/h</strong></span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 text-[11px]">
              Dispersion Index: <strong className="text-emerald-400 font-mono">{(1 / selectedCity.dispersion_multiplier).toFixed(2)}×</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
