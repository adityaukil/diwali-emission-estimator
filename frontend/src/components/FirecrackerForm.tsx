"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  Layers,
  Rocket,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  RotateCw
} from "lucide-react";
import CitySelector from "./CitySelector";
import { CityConfig } from "@/data/cities";

export interface FirecrackerInputs {
  city: string;
  sparklers: number;
  flower_pots: number;
  ground_spinners: number;
  garlands: number;
  rockets: number;
  wind_speed_kmh: number;
  relative_humidity: number;
  temperature_c: number;
  baseline_pm25: number;
}

interface FirecrackerFormProps {
  inputs: FirecrackerInputs;
  setInputs: React.Dispatch<React.SetStateAction<FirecrackerInputs>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  selectedCity: CityConfig;
  onSelectCity: (cityId: string) => void;
}

interface CrackerConfig {
  key: keyof Pick<
    FirecrackerInputs,
    "sparklers" | "flower_pots" | "ground_spinners" | "garlands" | "rockets"
  >;
  name: string;
  hindiName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultStep: number;
  max: number;
  pm25PerUnit: string;
  category: string;
}

const CRACKERS: CrackerConfig[] = [
  {
    key: "sparklers",
    name: "Sparklers",
    hindiName: "Phuljhadi",
    description: "Handheld incandescent sparks containing barium & aluminum nitrates",
    icon: Sparkles,
    defaultStep: 5,
    max: 200,
    pm25PerUnit: "~1.85g PM2.5/unit",
    category: "Spark Fountain",
  },
  {
    key: "flower_pots",
    name: "Flower Pots",
    hindiName: "Anar",
    description: "High-temperature conical volcanic fountains with intense sulfur dioxide fumes",
    icon: Flame,
    defaultStep: 2,
    max: 50,
    pm25PerUnit: "~14.2g PM2.5/unit",
    category: "Conical Flame",
  },
  {
    key: "ground_spinners",
    name: "Ground Spinners",
    hindiName: "Chakri / Zamin Chakkar",
    description: "Rapid rotating wheels generating dense ground-level particulate plumes",
    icon: RotateCw,
    defaultStep: 4,
    max: 80,
    pm25PerUnit: "~7.1g PM2.5/unit",
    category: "Spinning Wheel",
  },
  {
    key: "garlands",
    name: "Garlands (Ladi)",
    hindiName: "1000 Burst Chain",
    description: "Rapid explosive burst strings with deafening decibels and dense black carbon smoke",
    icon: Layers,
    defaultStep: 1,
    max: 20,
    pm25PerUnit: "~118g PM2.5/string",
    category: "Chained Burst",
  },
  {
    key: "rockets",
    name: "Aerial Rockets",
    hindiName: "Aasmani Rocket",
    description: "Skyward projectiles disseminating copper, strontium & particulate fallout across the canopy",
    icon: Rocket,
    defaultStep: 2,
    max: 40,
    pm25PerUnit: "~16.5g PM2.5/unit",
    category: "Aerial Projectile",
  },
];

export default function FirecrackerForm({
  inputs,
  setInputs,
  onSubmit,
  isLoading,
  selectedCity,
  onSelectCity,
}: FirecrackerFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateQuantity = (
    key: keyof FirecrackerInputs,
    delta: number,
    min: number = 0,
    max: number = 999
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, (prev[key] as number) + delta)),
    }));
  };

  const handleInputChange = (
    key: keyof FirecrackerInputs,
    value: string,
    min: number = 0,
    max: number = 999
  ) => {
    const num = parseInt(value, 10);
    setInputs((prev) => ({
      ...prev,
      [key]: isNaN(num) ? 0 : Math.max(min, Math.min(max, num)),
    }));
  };

  const applyPreset = (preset: "eco" | "family" | "gala") => {
    if (preset === "eco") {
      setInputs((prev) => ({
        ...prev,
        sparklers: 6,
        flower_pots: 1,
        ground_spinners: 2,
        garlands: 0,
        rockets: 0,
      }));
    } else if (preset === "family") {
      setInputs((prev) => ({
        ...prev,
        sparklers: 25,
        flower_pots: 6,
        ground_spinners: 8,
        garlands: 1,
        rockets: 4,
      }));
    } else if (preset === "gala") {
      setInputs((prev) => ({
        ...prev,
        sparklers: 70,
        flower_pots: 20,
        ground_spinners: 25,
        garlands: 5,
        rockets: 15,
      }));
    }
  };

  const resetAll = () => {
    setInputs((prev) => ({
      ...prev,
      sparklers: 0,
      flower_pots: 0,
      ground_spinners: 0,
      garlands: 0,
      rockets: 0,
      wind_speed_kmh: selectedCity.wind_avg,
      relative_humidity: selectedCity.humidity_avg,
      temperature_c: selectedCity.temp_avg,
      baseline_pm25: selectedCity.base_pm25,
    }));
  };

  const resetToCityDefaults = () => {
    setInputs((prev) => ({
      ...prev,
      wind_speed_kmh: selectedCity.wind_avg,
      relative_humidity: selectedCity.humidity_avg,
      temperature_c: selectedCity.temp_avg,
      baseline_pm25: selectedCity.base_pm25,
    }));
  };

  const totalCrackers =
    inputs.sparklers +
    inputs.flower_pots +
    inputs.ground_spinners +
    inputs.garlands +
    inputs.rockets;

  return (
    <section className="max-w-5xl mx-auto px-4 mb-12">
      {/* 1. Dedicated City Selector */}
      <CitySelector
        selectedCityId={selectedCity.id}
        onSelectCity={onSelectCity}
      />

      <form onSubmit={onSubmit} className="diwali-card rounded-2xl p-6 sm:p-8">
        {/* Header & Preset Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FFD700]"></span>
              Step 2: Select Firecracker Inventory for {selectedCity.name}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Input units to calculate anticipated atmospheric mass loading in {selectedCity.name}
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-medium text-slate-400 hidden lg:inline mr-1">
              Presets:
            </span>
            <button
              type="button"
              onClick={() => applyPreset("eco")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              🌱 Minimal / Green
            </button>
            <button
              type="button"
              onClick={() => applyPreset("family")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 transition-colors cursor-pointer"
            >
              🪔 Family Festive
            </button>
            <button
              type="button"
              onClick={() => applyPreset("gala")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 transition-colors cursor-pointer"
            >
              💥 Block Gala
            </button>
            <button
              type="button"
              onClick={resetAll}
              title="Reset Cracker Counts"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-700/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Firecracker Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CRACKERS.map((cracker) => {
            const Icon = cracker.icon;
            const currentQty = inputs[cracker.key] as number;
            const isSelected = currentQty > 0;

            return (
              <div
                key={cracker.key}
                className={`rounded-xl p-4 transition-all duration-200 border ${
                  isSelected
                    ? "bg-slate-900/90 border-amber-400/60 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-800/60 text-slate-400 border border-slate-700/40"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base leading-tight">
                        {cracker.name}
                      </h3>
                      <span className="text-xs text-amber-400/90 font-medium">
                        {cracker.hindiName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {cracker.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mb-3">
                  {cracker.description}
                </p>

                {/* Input Stepper */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    {cracker.pm25PerUnit}
                  </span>

                  <div className="flex items-center bg-slate-950 rounded-lg border border-slate-700 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      aria-label={`Decrease ${cracker.name} quantity by 1`}
                      onClick={() =>
                        updateQuantity(cracker.key, -1, 0, cracker.max)
                      }
                      disabled={currentQty === 0}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-bold text-lg cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      id={`input-${cracker.key}`}
                      type="number"
                      aria-label={`${cracker.name} quantity`}
                      min="0"
                      max={cracker.max}
                      value={currentQty}
                      onChange={(e) =>
                        handleInputChange(cracker.key, e.target.value, 0, cracker.max)
                      }
                      className="w-14 h-8 bg-transparent text-center font-semibold text-amber-300 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      aria-label={`Increase ${cracker.name} quantity by 1`}
                      onClick={() =>
                        updateQuantity(cracker.key, 1, 0, cracker.max)
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-bold text-lg cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible Advanced Atmospheric Parameters */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>
                {showAdvanced
                  ? `Hide Weather Parameters for ${selectedCity.name}`
                  : `Customize Weather & Baseline (Wind, Humidity, Temp) for ${selectedCity.name}`}
              </span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showAdvanced && (
              <button
                type="button"
                onClick={resetToCityDefaults}
                className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Reset to {selectedCity.name} Historical Averages</span>
              </button>
            )}
          </div>

          {showAdvanced && (
            <div className="mt-4 p-5 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
              {/* Wind Speed */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-2 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-sky-400" />
                    Wind Speed
                  </span>
                  <span className="font-mono text-amber-300">
                    {inputs.wind_speed_kmh} km/h
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={inputs.wind_speed_kmh}
                  onChange={(e) =>
                    setInputs((p) => ({
                      ...p,
                      wind_speed_kmh: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Typical Diwali night wind in {selectedCity.name}: {selectedCity.wind_avg} km/h
                </span>
              </div>

              {/* Baseline PM2.5 */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-2 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    Pre-Diwali Baseline PM2.5
                  </span>
                  <span className="font-mono text-amber-300">
                    {inputs.baseline_pm25} µg/m³
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="350"
                  step="5"
                  value={inputs.baseline_pm25}
                  onChange={(e) =>
                    setInputs((p) => ({
                      ...p,
                      baseline_pm25: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  15-Yr CPCB average for {selectedCity.name}: {selectedCity.base_pm25} µg/m³
                </span>
              </div>

              {/* Relative Humidity */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-2 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    Relative Humidity
                  </span>
                  <span className="font-mono text-amber-300">
                    {inputs.relative_humidity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="5"
                  value={inputs.relative_humidity}
                  onChange={(e) =>
                    setInputs((p) => ({
                      ...p,
                      relative_humidity: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  {selectedCity.name} typical Diwali humidity: {selectedCity.humidity_avg}%
                </span>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-2 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    Ambient Temperature
                  </span>
                  <span className="font-mono text-amber-300">
                    {inputs.temperature_c}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="38"
                  step="1"
                  value={inputs.temperature_c}
                  onChange={(e) =>
                    setInputs((p) => ({
                      ...p,
                      temperature_c: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Diwali night average: {selectedCity.temp_avg}°C
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              Total Units Selected:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono font-bold">
              {totalCrackers} firecrackers
            </span>
            <span className="text-slate-500">• In {selectedCity.name}</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 transition-all duration-300 diwali-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,215,0,0.35)]"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running City Model for {selectedCity.name}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Calculate Emission Impact for {selectedCity.name}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
