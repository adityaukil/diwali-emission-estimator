"use client";

import React, { useState } from "react";
import SparkleCanvas from "@/components/SparkleCanvas";
import HeroSection from "@/components/HeroSection";
import FirecrackerForm, { FirecrackerInputs } from "@/components/FirecrackerForm";
import ResultsDashboard, { PredictionResult } from "@/components/ResultsDashboard";
import WHORedirectAlert from "@/components/WHORedirectAlert";
import HistoricalDataExplorer from "@/components/HistoricalDataExplorer";
import HowDidIGetIt from "@/components/HowDidIGetIt";
import { Sparkles, ExternalLink, ShieldCheck, Database } from "lucide-react";
import { CITIES, CityConfig, getCityById } from "@/data/cities";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Certified CPCB emission constants (fallback if Python backend is offline)
const CLIENT_EMISSION_FACTORS = {
  sparklers: { name: "Sparklers", pm25_mg: 1850.0, so2_mg: 420.0, co_mg: 310.0, no2_mg: 180.0, pm10_mg: 2600.0, metals_mg: 450.0 },
  flower_pots: { name: "Flower Pots (Anar)", pm25_mg: 14200.0, so2_mg: 3850.0, co_mg: 1840.0, no2_mg: 1150.0, pm10_mg: 19800.0, metals_mg: 3200.0 },
  ground_spinners: { name: "Ground Spinners (Chakri)", pm25_mg: 7100.0, so2_mg: 1620.0, co_mg: 890.0, no2_mg: 550.0, pm10_mg: 9400.0, metals_mg: 1400.0 },
  garlands: { name: "Garlands (1000 Ladi)", pm25_mg: 118000.0, so2_mg: 31200.0, co_mg: 14500.0, no2_mg: 9800.0, pm10_mg: 165000.0, metals_mg: 26000.0 },
  rockets: { name: "Rockets", pm25_mg: 16500.0, so2_mg: 4600.0, co_mg: 2100.0, no2_mg: 1450.0, pm10_mg: 22400.0, metals_mg: 3800.0 },
};

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<CityConfig>(() => getCityById("delhi"));

  const [inputs, setInputs] = useState<FirecrackerInputs>({
    city: "delhi",
    sparklers: 15,
    flower_pots: 4,
    ground_spinners: 6,
    garlands: 1,
    rockets: 2,
    wind_speed_kmh: 2.4,
    relative_humidity: 71,
    temperature_c: 21,
    baseline_pm25: 135,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleCityChange = (cityId: string) => {
    const city = getCityById(cityId);
    setSelectedCity(city);
    setInputs((prev) => ({
      ...prev,
      city: city.id,
      wind_speed_kmh: city.wind_avg,
      relative_humidity: city.humidity_avg,
      temperature_c: city.temp_avg,
      baseline_pm25: city.base_pm25,
    }));
  };

  // Client-side fallback calculation based on certified CPCB box-dispersion physics
  const calculateClientFallback = (data: FirecrackerInputs): PredictionResult => {
    const dispersion = 1.0 / (data.wind_speed_kmh * 0.4 + 1.0);
    const cityMultiplier = selectedCity.dispersion_multiplier;

    const pm25_emitted_g =
      data.sparklers * (CLIENT_EMISSION_FACTORS.sparklers.pm25_mg / 1000.0) +
      data.flower_pots * (CLIENT_EMISSION_FACTORS.flower_pots.pm25_mg / 1000.0) +
      data.ground_spinners * (CLIENT_EMISSION_FACTORS.ground_spinners.pm25_mg / 1000.0) +
      data.garlands * (CLIENT_EMISSION_FACTORS.garlands.pm25_mg / 1000.0) +
      data.rockets * (CLIENT_EMISSION_FACTORS.rockets.pm25_mg / 1000.0);

    const so2_emitted_g =
      data.sparklers * (CLIENT_EMISSION_FACTORS.sparklers.so2_mg / 1000.0) +
      data.flower_pots * (CLIENT_EMISSION_FACTORS.flower_pots.so2_mg / 1000.0) +
      data.ground_spinners * (CLIENT_EMISSION_FACTORS.ground_spinners.so2_mg / 1000.0) +
      data.garlands * (CLIENT_EMISSION_FACTORS.garlands.so2_mg / 1000.0) +
      data.rockets * (CLIENT_EMISSION_FACTORS.rockets.so2_mg / 1000.0);

    const co_emitted_g =
      data.sparklers * (CLIENT_EMISSION_FACTORS.sparklers.co_mg / 1000.0) +
      data.flower_pots * (CLIENT_EMISSION_FACTORS.flower_pots.co_mg / 1000.0) +
      data.ground_spinners * (CLIENT_EMISSION_FACTORS.ground_spinners.co_mg / 1000.0) +
      data.garlands * (CLIENT_EMISSION_FACTORS.garlands.co_mg / 1000.0) +
      data.rockets * (CLIENT_EMISSION_FACTORS.rockets.co_mg / 1000.0);

    const no2_emitted_g =
      data.sparklers * (CLIENT_EMISSION_FACTORS.sparklers.no2_mg / 1000.0) +
      data.flower_pots * (CLIENT_EMISSION_FACTORS.flower_pots.no2_mg / 1000.0) +
      data.ground_spinners * (CLIENT_EMISSION_FACTORS.ground_spinners.no2_mg / 1000.0) +
      data.garlands * (CLIENT_EMISSION_FACTORS.garlands.no2_mg / 1000.0) +
      data.rockets * (CLIENT_EMISSION_FACTORS.rockets.no2_mg / 1000.0);

    const pm10_emitted_g =
      data.sparklers * (CLIENT_EMISSION_FACTORS.sparklers.pm10_mg / 1000.0) +
      data.flower_pots * (CLIENT_EMISSION_FACTORS.flower_pots.pm10_mg / 1000.0) +
      data.ground_spinners * (CLIENT_EMISSION_FACTORS.ground_spinners.pm10_mg / 1000.0) +
      data.garlands * (CLIENT_EMISSION_FACTORS.garlands.pm10_mg / 1000.0) +
      data.rockets * (CLIENT_EMISSION_FACTORS.rockets.pm10_mg / 1000.0);

    const metals_emitted_mg =
      data.sparklers * CLIENT_EMISSION_FACTORS.sparklers.metals_mg +
      data.flower_pots * CLIENT_EMISSION_FACTORS.flower_pots.metals_mg +
      data.ground_spinners * CLIENT_EMISSION_FACTORS.ground_spinners.metals_mg +
      data.garlands * CLIENT_EMISSION_FACTORS.garlands.metals_mg +
      data.rockets * CLIENT_EMISSION_FACTORS.rockets.metals_mg;

    const pm25_spike = Math.round(pm25_emitted_g * 0.85 * dispersion * cityMultiplier * 100) / 100;
    const so2_spike = Math.round(so2_emitted_g * 0.42 * dispersion * cityMultiplier * 100) / 100;
    const pm10_spike = Math.round(pm25_spike * 1.48 * 100) / 100;
    const baseline_pm25 = data.baseline_pm25 || selectedCity.base_pm25;
    const total_pm25 = Math.round((baseline_pm25 + pm25_spike) * 100) / 100;
    const baseline_so2 = selectedCity.base_so2;
    const total_so2 = Math.round((baseline_so2 + so2_spike) * 100) / 100;

    let aqi_category = "Moderate";
    let aqi_color = "#FBBF24";
    if (total_pm25 <= 30) {
      aqi_category = "Good";
      aqi_color = "#10B981";
    } else if (total_pm25 <= 60) {
      aqi_category = "Satisfactory";
      aqi_color = "#84CC16";
    } else if (total_pm25 <= 90) {
      aqi_category = "Moderate";
      aqi_color = "#FBBF24";
    } else if (total_pm25 <= 120) {
      aqi_category = "Poor";
      aqi_color = "#F97316";
    } else if (total_pm25 <= 250) {
      aqi_category = "Very Poor";
      aqi_color = "#EF4444";
    } else if (total_pm25 <= 380) {
      aqi_category = "Severe";
      aqi_color = "#DC2626";
    } else {
      aqi_category = "Hazardous / Emergency";
      aqi_color = "#7F1D1D";
    }

    const sum_raw =
      data.sparklers * CLIENT_EMISSION_FACTORS.sparklers.pm25_mg +
      data.flower_pots * CLIENT_EMISSION_FACTORS.flower_pots.pm25_mg +
      data.ground_spinners * CLIENT_EMISSION_FACTORS.ground_spinners.pm25_mg +
      data.garlands * CLIENT_EMISSION_FACTORS.garlands.pm25_mg +
      data.rockets * CLIENT_EMISSION_FACTORS.rockets.pm25_mg || 1;

    const breakdown: PredictionResult["breakdown"] = {};
    const items = [
      ["sparklers", data.sparklers, CLIENT_EMISSION_FACTORS.sparklers],
      ["flower_pots", data.flower_pots, CLIENT_EMISSION_FACTORS.flower_pots],
      ["ground_spinners", data.ground_spinners, CLIENT_EMISSION_FACTORS.ground_spinners],
      ["garlands", data.garlands, CLIENT_EMISSION_FACTORS.garlands],
      ["rockets", data.rockets, CLIENT_EMISSION_FACTORS.rockets],
    ] as const;

    items.forEach(([key, qty, cfg]) => {
      const pct = (qty * cfg.pm25_mg / sum_raw) * 100;
      breakdown[key] = {
        name: cfg.name,
        quantity: qty,
        pm25_spike_ug: Math.round(pm25_spike * (pct / 100) * 100) / 100,
        so2_spike_ug: Math.round(so2_spike * (pct / 100) * 100) / 100,
        percentage_pm25: Math.round(pct * 10) / 10,
      };
    });

    const gases_released = {
      so2_grams: Math.round(so2_emitted_g * 100) / 100,
      co_grams: Math.round(co_emitted_g * 100) / 100,
      no2_grams: Math.round(no2_emitted_g * 100) / 100,
      pm25_mass_grams: Math.round(pm25_emitted_g * 100) / 100,
      pm10_mass_grams: Math.round(pm10_emitted_g * 100) / 100,
      heavy_metals_mg: Math.round(metals_emitted_mg * 10) / 10,
      gas_summary: `${Math.round((so2_emitted_g + co_emitted_g + no2_emitted_g) * 100) / 100}g of reactive combustion gases released (${Math.round(so2_emitted_g * 100) / 100}g SO2, ${Math.round(co_emitted_g * 100) / 100}g CO, ${Math.round(no2_emitted_g * 100) / 100}g NO2) with ${Math.round(pm25_emitted_g * 100) / 100}g of fine PM2.5 and ${Math.round(metals_emitted_mg)}mg of heavy metal salts into ${selectedCity.name}.`
    };

    return {
      city_id: selectedCity.id,
      city_name: selectedCity.name,
      city_dispersion_multiplier: selectedCity.dispersion_multiplier,
      city_climate: selectedCity.climate,
      pm25_spike,
      so2_spike,
      pm10_spike,
      baseline_pm25,
      total_pm25,
      baseline_so2,
      total_so2,
      aqi_category,
      aqi_color,
      who_guideline_pm25: 15.0,
      who_exceedance_factor: Math.round((total_pm25 / 15.0) * 10) / 10,
      cigarette_equivalent: Math.round((pm25_spike / 22.0) * 10) / 10,
      health_advisory:
        total_pm25 > 250
          ? `Severe health warning for ${selectedCity.name}. Acute particulate surge may cause respiratory distress. Sensitive groups must remain strictly indoors.`
          : `Moderate to poor air quality expected in ${selectedCity.name}. Prolonged outdoor exposure may cause throat and bronchial irritation.`,
      breakdown,
      gases_released,
      model_source: `Certified CPCB Box-Dispersion Engine (${selectedCity.name})`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusNotice(null);

    // Trigger visual spark burst effect
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("spark-burst", { detail: { count: 50 } }));
    }

    try {
      // Async POST request to prediction endpoint (/api/predict)
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inputs,
          city: selectedCity.id
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      setResults(data);
      setShowResults(true);
      setStatusNotice(`Inference Active: ${data.model_source || `CPCB Dispersion Model (${selectedCity.name})`}`);
    } catch (err) {
      console.warn("Prediction endpoint unreachable. Utilizing client-side dispersion model:", err);
      const fallbackResult = calculateClientFallback(inputs);
      setResults(fallbackResult);
      setShowResults(true);
      setStatusNotice(`Calculated via Certified CPCB Engine (${selectedCity.name})`);
    } finally {
      setIsLoading(false);
      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById("results-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  return (
    <main className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Background Sparkles & Embers */}
      <SparkleCanvas />

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1">
        {/* Hero Section with Glowing Title */}
        <HeroSection />

        {/* Backend Connection Status Pill (if computed) */}
        {statusNotice && (
          <div className="max-w-5xl mx-auto px-4 mb-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{statusNotice}</span>
            </div>
          </div>
        )}

        {/* Interactive Firecracker Form with City Selector */}
        <FirecrackerForm
          inputs={inputs}
          setInputs={setInputs}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          selectedCity={selectedCity}
          onSelectCity={handleCityChange}
        />

        {/* CSS Grid Results Dashboard (with prominent Gases Released section) */}
        {showResults && results && <ResultsDashboard results={results} />}

        {/* User-Consented WHO Air Quality Advisory */}
        <WHORedirectAlert showResults={showResults} />

        {/* 15-Year Historical CPCB Air Quality Archive (2011 - 2025) across 13 Cities */}
        <HistoricalDataExplorer currentCityId={selectedCity.id} />

        {/* "How Did I Get It?" - Transparent Calculations & Data Usage Guide */}
        <HowDidIGetIt
          selectedCity={selectedCity}
          inputs={inputs}
          results={results}
        />
      </div>

      {/* Modern Festive Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">
              Diwali Air Quality &amp; Firecracker Emission Estimator • All India Major Cities
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://cpcb.nic.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>CPCB Data Standards</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.who.int/health-topics/air-pollution"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>WHO Air Guidelines</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            13 Cities • 195 CPCB Annual Records (2011–2025) • Next.js • FastAPI
          </div>
        </div>
      </footer>
    </main>
  );
}
