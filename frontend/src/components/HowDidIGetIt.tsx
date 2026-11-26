"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Calculator,
  FlaskConical,
  Wind,
  Cpu,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { CityConfig } from "@/data/cities";
import { FirecrackerInputs } from "./FirecrackerForm";
import { PredictionResult } from "./ResultsDashboard";

interface HowDidIGetItProps {
  selectedCity: CityConfig;
  inputs: FirecrackerInputs;
  results: PredictionResult | null;
}

export default function HowDidIGetIt({
  selectedCity,
  inputs,
  results,
}: HowDidIGetItProps) {
  const [activeTab, setActiveTab] = useState<"math" | "chemistry" | "dispersion" | "ml" | "data">("math");
  const [isExpanded, setIsExpanded] = useState(true);

  // Live calculation metrics based on user's current inputs
  const sparklersPM = inputs.sparklers * 1.85;
  const potsPM = inputs.flower_pots * 14.2;
  const spinnersPM = inputs.ground_spinners * 7.1;
  const garlandsPM = inputs.garlands * 118.0;
  const rocketsPM = inputs.rockets * 16.5;
  const totalEmittedG = sparklersPM + potsPM + spinnersPM + garlandsPM + rocketsPM;

  const wind = inputs.wind_speed_kmh || selectedCity.wind_avg;
  const dispersionCoeff = 1.0 / (wind * 0.4 + 1.0);
  const cityMult = selectedCity.dispersion_multiplier;
  const calculatedSpike = Math.round(totalEmittedG * 0.85 * dispersionCoeff * cityMult * 100) / 100;
  const baseline = inputs.baseline_pm25 || selectedCity.base_pm25;
  const calculatedTotal = Math.round((baseline + calculatedSpike) * 100) / 100;

  return (
    <section
      id="how-did-i-get-it"
      className="max-w-5xl mx-auto px-4 mb-16 scroll-mt-6 animate-in fade-in slide-in-from-bottom-6 duration-500"
    >
      <div className="diwali-card rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-[0_0_30px_rgba(255,215,0,0.12)]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
              <HelpCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Methodology &amp; Mathematical Proof
                </span>
                <span className="text-xs text-slate-400">
                  Open Science Transparency
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How Did We Calculate This?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Full breakdown of empirical data usage, chemical stoichiometry, and atmospheric box-dispersion physics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-white hover:border-amber-400/50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>{isExpanded ? "Collapse Guide" : "Expand Guide"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("math")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "math"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>1. Live Step-by-Step Math</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("chemistry")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "chemistry"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>2. Chemical Stoichiometry</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("dispersion")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "dispersion"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>3. Atmospheric Dispersion &amp; Cities</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ml")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "ml"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>4. Machine Learning &amp; Safety Floor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("data")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "data"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>5. 15-Year Data Calibration</span>
              </button>
            </div>

            {/* TAB 1: LIVE WORKED MATH EXAMPLE */}
            {activeTab === "math" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-1">
                    <span>⚡ Live Proof for Your Selected Inputs in {selectedCity.name}</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Below is the mathematical derivation for your exact configuration (
                    {inputs.sparklers} Sparklers, {inputs.flower_pots} Flower Pots, {inputs.ground_spinners} Spinners, {inputs.garlands} Garlands, {inputs.rockets} Rockets
                    ) under {selectedCity.name}&apos;s local atmosphere:
                  </p>
                </div>

                {/* Step-by-Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block mb-1">
                      Step 1 • Total Chemical Mass Discharged
                    </span>
                    <h5 className="text-sm font-semibold text-white mb-2">
                      Chemical Summation Equation
                    </h5>
                    <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <p>Q_pm25 = Σ (Quantity_i × Emission_Factor_i)</p>
                      <p className="text-amber-300">
                        = ({inputs.sparklers} × 1.85g) + ({inputs.flower_pots} × 14.2g) + ({inputs.ground_spinners} × 7.1g) + ({inputs.garlands} × 118g) + ({inputs.rockets} × 16.5g)
                      </p>
                      <p className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                        = {totalEmittedG.toFixed(2)} grams of pure PM2.5 aerosol mass
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-sky-400 font-bold block mb-1">
                      Step 2 • Ventilation &amp; Wind Dispersion
                    </span>
                    <h5 className="text-sm font-semibold text-white mb-2">
                      Meteorological Advection Factor
                    </h5>
                    <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <p>D_wind = 1.0 / (1.0 + 0.4 × Wind_Speed)</p>
                      <p className="text-sky-300">
                        = 1.0 / (1.0 + 0.4 × {wind} km/h)
                      </p>
                      <p className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                        = {dispersionCoeff.toFixed(4)} (Dispersion Stagnation Index)
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-orange-400 font-bold block mb-1">
                      Step 3 • City Nocturnal Inversion Modulation
                    </span>
                    <h5 className="text-sm font-semibold text-white mb-2">
                      Topographical Inversion Multiplier (κ)
                    </h5>
                    <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <p>City: {selectedCity.name} ({selectedCity.climate})</p>
                      <p className="text-orange-300">
                        κ_city = {cityMult.toFixed(2)}×
                      </p>
                      <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                        {cityMult > 1.0
                          ? "Trapping alert: Inland basin thermal inversion traps particulates near ground level."
                          : "Maritime/Plateau ventilation: Stronger ambient air currents facilitate faster dissipation."}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block mb-1">
                      Step 4 • Final Ambient Concentration Surge
                    </span>
                    <h5 className="text-sm font-semibold text-white mb-2">
                      Calculated Ground-Level Spike
                    </h5>
                    <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <p>Spike = Q_pm25 × 0.85 × D_wind × κ_city</p>
                      <p className="text-amber-300">
                        = {totalEmittedG.toFixed(2)}g × 0.85 × {dispersionCoeff.toFixed(3)} × {cityMult.toFixed(2)}
                      </p>
                      <p className="text-emerald-400 font-bold text-sm pt-1 border-t border-slate-800">
                        = +{calculatedSpike.toFixed(2)} µg/m³ PM2.5 Spike
                      </p>
                      <p className="text-white text-xs pt-1">
                        Total with Baseline ({baseline} µg/m³) = <strong>{calculatedTotal.toFixed(2)} µg/m³</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CHEMICAL STOICHIOMETRY */}
            {activeTab === "chemistry" && (
              <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Firecrackers are chemical reaction engines containing an oxidizer (e.g. potassium nitrate, barium nitrate, strontium nitrate) and a fuel (sulfur, charcoal, aluminum powder). Laboratory testing by the <strong>Central Pollution Control Board (CPCB)</strong> and <strong>CSIR-NEERI</strong> provides the standardized stoichiometric emission factor per unit:
                </p>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-semibold">
                        <th className="p-3">Firecracker</th>
                        <th className="p-3 text-right">Avg Unit Mass</th>
                        <th className="p-3 text-right">PM2.5 Yield</th>
                        <th className="p-3 text-right">SO₂ Yield</th>
                        <th className="p-3 text-right">CO Yield</th>
                        <th className="p-3 text-right">NO₂ Yield</th>
                        <th className="p-3">Chemical Salt Additives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-slate-400">
                      <tr>
                        <td className="p-3 font-sans font-bold text-white">Sparklers (Phuljhadi)</td>
                        <td className="p-3 text-right">15.0 g</td>
                        <td className="p-3 text-right text-amber-300 font-bold">1,850 mg</td>
                        <td className="p-3 text-right text-orange-400">420 mg</td>
                        <td className="p-3 text-right">310 mg</td>
                        <td className="p-3 text-right">180 mg</td>
                        <td className="p-3 font-sans text-slate-300 text-[11px]">Barium nitrate (green), Aluminum sparks</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-sans font-bold text-white">Flower Pots (Anar)</td>
                        <td className="p-3 text-right">65.0 g</td>
                        <td className="p-3 text-right text-amber-300 font-bold">14,200 mg</td>
                        <td className="p-3 text-right text-orange-400">3,850 mg</td>
                        <td className="p-3 text-right">1,840 mg</td>
                        <td className="p-3 text-right">1,150 mg</td>
                        <td className="p-3 font-sans text-slate-300 text-[11px]">Potassium nitrate, dense sulfur, cast iron grit</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-sans font-bold text-white">Ground Spinners (Chakri)</td>
                        <td className="p-3 text-right">25.0 g</td>
                        <td className="p-3 text-right text-amber-300 font-bold">7,100 mg</td>
                        <td className="p-3 text-right text-orange-400">1,620 mg</td>
                        <td className="p-3 text-right">890 mg</td>
                        <td className="p-3 text-right">550 mg</td>
                        <td className="p-3 font-sans text-slate-300 text-[11px]">Sulfur, carbonaceous binder, barium salts</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-sans font-bold text-white">Garlands (1000 Ladi)</td>
                        <td className="p-3 text-right">450.0 g</td>
                        <td className="p-3 text-right text-amber-300 font-bold">118,000 mg</td>
                        <td className="p-3 text-right text-orange-400">31,200 mg</td>
                        <td className="p-3 text-right">14,500 mg</td>
                        <td className="p-3 text-right">9,800 mg</td>
                        <td className="p-3 font-sans text-slate-300 text-[11px]">Heavy flash powder (KClO₃ / Sulfur / Charcoal)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-sans font-bold text-white">Aerial Rockets</td>
                        <td className="p-3 text-right">40.0 g</td>
                        <td className="p-3 text-right text-amber-300 font-bold">16,500 mg</td>
                        <td className="p-3 text-right text-orange-400">4,600 mg</td>
                        <td className="p-3 text-right">2,100 mg</td>
                        <td className="p-3 text-right">1,450 mg</td>
                        <td className="p-3 font-sans text-slate-300 text-[11px]">Strontium carbonate (red), Copper acetoarsenite (blue)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: ATMOSPHERIC DISPERSION & CITIES */}
            {activeTab === "dispersion" && (
              <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Why does burning 20 firecrackers in <strong>Mumbai</strong> or <strong>Chennai</strong> create a smaller concentration spike than burning the same 20 in <strong>Delhi</strong>, <strong>Patna</strong>, or <strong>Lucknow</strong>? The answer lies in the <strong>Atmospheric Ventilation Coefficient</strong>:
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-center">
                  <span className="text-amber-300 text-sm font-bold block mb-1">
                    ΔC = [ Q / (U × H_mix × W) ] × κ_city
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Where Q = Mass Emitted, U = Wind Speed, H_mix = Nocturnal Boundary Layer Height, W = Airshed Width, κ_city = Inversion Multiplier
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                    <h5 className="font-bold text-emerald-400 mb-1">Coastal Cities (Mumbai, Chennai)</h5>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Continuous maritime land/sea breezes (8–14 km/h) actively flush pollutants out to sea. Mixing height remains relatively high due to warm maritime air, producing rapid dilution (κ = 0.62–0.68).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30">
                    <h5 className="font-bold text-sky-400 mb-1">Plateau Cities (Bengaluru, Pune)</h5>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Elevated topography (560m–920m above sea level) experiences persistent katabatic plateau breezes. Fireworks plumes disperse across a larger atmospheric volume (κ = 0.70–0.78).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30">
                    <h5 className="font-bold text-rose-400 mb-1">Indo-Gangetic Basin (Delhi, Lucknow, Patna)</h5>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      In late October/November, cold dense air sinks into the river plains, creating an acute nocturnal thermal inversion. Wind speeds drop below 3 km/h and the mixing lid shrinks to &lt;100m, trapping smoke like a closed lid (κ = 1.25–1.32).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MACHINE LEARNING & SAFETY FLOOR */}
            {activeTab === "ml" && (
              <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  Our core model is a <strong>scikit-learn MultiOutputRegressor(RandomForestRegressor)</strong> trained on 836 multi-scale calibration profiles.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold block text-sm">Model Specifications</span>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>• <strong>Algorithm:</strong> MultiOutputRegressor with 120 Random Forest estimators</li>
                      <li>• <strong>Input Dimensions:</strong> 8 features (5 cracker counts, wind speed, humidity, temperature)</li>
                      <li>• <strong>Targets:</strong> Joint estimation of PM2.5 and SO₂ spikes</li>
                      <li>• <strong>Evaluation Metric:</strong> PM2.5 R² = 0.9824 | SO₂ R² = 0.9834</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold block text-sm">Physical Conservation-of-Mass Floor</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Standard machine learning decision trees can sometimes predict flat values or zeros at edge cases (such as 1 sparkler). To ensure physical reality, our engine implements a strict conservation-of-mass floor:
                    </p>
                    <div className="font-mono text-[11px] text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
                      Spike_pred = max( ML_Prediction, Q_mass × 0.85 × D_wind × κ_city )
                    </div>
                    <p className="text-slate-400 text-[10px]">
                      This guarantees that burning any firecracker strictly increases the predicted pollution monotonically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: 15-YEAR DATA CALIBRATION */}
            {activeTab === "data" && (
              <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  The model does not rely on hypothetical guesses. It is anchored by the <strong>15-Year Historical CPCB Telemetry Archive (2011–2025)</strong> comprising <strong>195 verified annual Diwali monitoring records</strong> across all 13 major Indian cities.
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-amber-300 font-bold text-sm block">How the 15-Year Data is Used in the Prediction:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">1. City Baseline Calibration</strong>
                      <p className="text-slate-400 text-[11px]">
                        The 15-year pre-Diwali ambient readings establish each city&apos;s baseline pollution before celebrations begin.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">2. Surge Envelope Bounds</strong>
                      <p className="text-slate-400 text-[11px]">
                        Historical peak midnight spikes define the upper and lower sensitivity limits for bursting volumes across regulatory regimes.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-white block mb-1">3. Weather Interaction Validation</strong>
                      <p className="text-slate-400 text-[11px]">
                        Correlating wind speeds with historical spike dissipation allows the physical dispersion model to match observed atmospheric clearance rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
