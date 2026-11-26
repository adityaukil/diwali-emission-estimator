import { NextRequest, NextResponse } from "next/server";
import { CITIES, getCityById } from "@/data/cities";

const PYTHON_BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";

const EMISSION_FACTORS = {
  sparklers: { name: "Sparklers", pm25_mg: 1850.0, so2_mg: 420.0, co_mg: 310.0, no2_mg: 180.0, pm10_mg: 2600.0, metals_mg: 450.0 },
  flower_pots: { name: "Flower Pots (Anar)", pm25_mg: 14200.0, so2_mg: 3850.0, co_mg: 1840.0, no2_mg: 1150.0, pm10_mg: 19800.0, metals_mg: 3200.0 },
  ground_spinners: { name: "Ground Spinners (Chakri)", pm25_mg: 7100.0, so2_mg: 1620.0, co_mg: 890.0, no2_mg: 550.0, pm10_mg: 9400.0, metals_mg: 1400.0 },
  garlands: { name: "Garlands (1000 Ladi)", pm25_mg: 118000.0, so2_mg: 31200.0, co_mg: 14500.0, no2_mg: 9800.0, pm10_mg: 165000.0, metals_mg: 26000.0 },
  rockets: { name: "Rockets", pm25_mg: 16500.0, so2_mg: 4600.0, co_mg: 2100.0, no2_mg: 1450.0, pm10_mg: 22400.0, metals_mg: 3800.0 },
};

function getAqiCategory(pm25Total: number): [string, string] {
  if (pm25Total <= 30) return ["Good", "#10B981"];
  if (pm25Total <= 60) return ["Satisfactory", "#84CC16"];
  if (pm25Total <= 90) return ["Moderate", "#FBBF24"];
  if (pm25Total <= 120) return ["Poor", "#F97316"];
  if (pm25Total <= 250) return ["Very Poor", "#EF4444"];
  if (pm25Total <= 380) return ["Severe", "#DC2626"];
  return ["Hazardous / Emergency", "#7F1D1D"];
}

function getHealthAdvisory(pm25Total: number, cityName: string): string {
  if (pm25Total <= 60) return `Air quality in ${cityName} is acceptable. Minimal health impact anticipated for healthy individuals.`;
  if (pm25Total <= 120) return `May cause breathing discomfort in ${cityName} to people with asthma and heart conditions on prolonged exposure.`;
  if (pm25Total <= 250) return `Respiratory illness on prolonged exposure in ${cityName}. Sensitive individuals should limit outdoor exposure.`;
  if (pm25Total <= 380) return `Severe health warning for ${cityName}. May cause acute respiratory distress. Use certified N95 masks.`;
  return `Emergency alert for ${cityName}. Toxic particulate surge. Entire population at severe risk of acute pulmonary irritation. Stay strictly indoors.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cityId = (body.city || "delhi").toLowerCase();
    const cityConfig = getCityById(cityId);

    const sparklers = Number(body.sparklers) || 0;
    const flower_pots = Number(body.flower_pots) || 0;
    const ground_spinners = Number(body.ground_spinners) || 0;
    const garlands = Number(body.garlands) || 0;
    const rockets = Number(body.rockets) || 0;

    const wind_speed_kmh = body.wind_speed_kmh !== undefined && body.wind_speed_kmh !== null ? Number(body.wind_speed_kmh) : cityConfig.wind_avg;
    const relative_humidity = body.relative_humidity !== undefined && body.relative_humidity !== null ? Number(body.relative_humidity) : cityConfig.humidity_avg;
    const temperature_c = body.temperature_c !== undefined && body.temperature_c !== null ? Number(body.temperature_c) : cityConfig.temp_avg;
    const baseline_pm25 = body.baseline_pm25 !== undefined && body.baseline_pm25 !== null ? Number(body.baseline_pm25) : cityConfig.base_pm25;

    const totalCount = sparklers + flower_pots + ground_spinners + garlands + rockets;

    // 1. Attempt to call Python FastAPI backend
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const pyRes = await fetch(`${PYTHON_BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityId,
          sparklers,
          flower_pots,
          ground_spinners,
          garlands,
          rockets,
          wind_speed_kmh,
          relative_humidity,
          temperature_c,
          baseline_pm25,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (pyRes.ok) {
        const pyData = await pyRes.json();
        if (totalCount === 0 || pyData.pm25_spike > 0) {
          return NextResponse.json(pyData);
        }
      }
    } catch (_) {
      // Backend offline or timeout -> proceed to continuous physics dispersion calculation
    }

    // 2. Continuous CPCB Box Dispersion Engine with City-Specific Topographical Modulation
    const dispersion = 1.0 / (wind_speed_kmh * 0.4 + 1.0);
    const cityMultiplier = cityConfig.dispersion_multiplier;

    const pm25_emitted_g =
      sparklers * (EMISSION_FACTORS.sparklers.pm25_mg / 1000.0) +
      flower_pots * (EMISSION_FACTORS.flower_pots.pm25_mg / 1000.0) +
      ground_spinners * (EMISSION_FACTORS.ground_spinners.pm25_mg / 1000.0) +
      garlands * (EMISSION_FACTORS.garlands.pm25_mg / 1000.0) +
      rockets * (EMISSION_FACTORS.rockets.pm25_mg / 1000.0);

    const so2_emitted_g =
      sparklers * (EMISSION_FACTORS.sparklers.so2_mg / 1000.0) +
      flower_pots * (EMISSION_FACTORS.flower_pots.so2_mg / 1000.0) +
      ground_spinners * (EMISSION_FACTORS.ground_spinners.so2_mg / 1000.0) +
      garlands * (EMISSION_FACTORS.garlands.so2_mg / 1000.0) +
      rockets * (EMISSION_FACTORS.rockets.so2_mg / 1000.0);

    const co_emitted_g =
      sparklers * (EMISSION_FACTORS.sparklers.co_mg / 1000.0) +
      flower_pots * (EMISSION_FACTORS.flower_pots.co_mg / 1000.0) +
      ground_spinners * (EMISSION_FACTORS.ground_spinners.co_mg / 1000.0) +
      garlands * (EMISSION_FACTORS.garlands.co_mg / 1000.0) +
      rockets * (EMISSION_FACTORS.rockets.co_mg / 1000.0);

    const no2_emitted_g =
      sparklers * (EMISSION_FACTORS.sparklers.no2_mg / 1000.0) +
      flower_pots * (EMISSION_FACTORS.flower_pots.no2_mg / 1000.0) +
      ground_spinners * (EMISSION_FACTORS.ground_spinners.no2_mg / 1000.0) +
      garlands * (EMISSION_FACTORS.garlands.no2_mg / 1000.0) +
      rockets * (EMISSION_FACTORS.rockets.no2_mg / 1000.0);

    const pm10_emitted_g =
      sparklers * (EMISSION_FACTORS.sparklers.pm10_mg / 1000.0) +
      flower_pots * (EMISSION_FACTORS.flower_pots.pm10_mg / 1000.0) +
      ground_spinners * (EMISSION_FACTORS.ground_spinners.pm10_mg / 1000.0) +
      garlands * (EMISSION_FACTORS.garlands.pm10_mg / 1000.0) +
      rockets * (EMISSION_FACTORS.rockets.pm10_mg / 1000.0);

    const metals_emitted_mg =
      sparklers * EMISSION_FACTORS.sparklers.metals_mg +
      flower_pots * EMISSION_FACTORS.flower_pots.metals_mg +
      ground_spinners * EMISSION_FACTORS.ground_spinners.metals_mg +
      garlands * EMISSION_FACTORS.garlands.metals_mg +
      rockets * EMISSION_FACTORS.rockets.metals_mg;

    let pm25_spike = 0.0;
    let so2_spike = 0.0;

    if (totalCount > 0) {
      pm25_spike = Math.round(pm25_emitted_g * 0.85 * dispersion * cityMultiplier * 100) / 100;
      so2_spike = Math.round(so2_emitted_g * 0.42 * dispersion * cityMultiplier * 100) / 100;
      pm25_spike = Math.max(0.2, pm25_spike);
      so2_spike = Math.max(0.04, so2_spike);
    }

    const pm10_spike = Math.round(pm25_spike * 1.48 * 100) / 100;
    const total_pm25 = Math.round((baseline_pm25 + pm25_spike) * 100) / 100;
    const baseline_so2 = cityConfig.base_so2;
    const total_so2 = Math.round((baseline_so2 + so2_spike) * 100) / 100;

    const [aqi_category, aqi_color] = getAqiCategory(total_pm25);

    const sum_raw =
      sparklers * EMISSION_FACTORS.sparklers.pm25_mg +
      flower_pots * EMISSION_FACTORS.flower_pots.pm25_mg +
      ground_spinners * EMISSION_FACTORS.ground_spinners.pm25_mg +
      garlands * EMISSION_FACTORS.garlands.pm25_mg +
      rockets * EMISSION_FACTORS.rockets.pm25_mg || 1;

    const breakdown: Record<string, any> = {};
    const items = [
      ["sparklers", sparklers, EMISSION_FACTORS.sparklers],
      ["flower_pots", flower_pots, EMISSION_FACTORS.flower_pots],
      ["ground_spinners", ground_spinners, EMISSION_FACTORS.ground_spinners],
      ["garlands", garlands, EMISSION_FACTORS.garlands],
      ["rockets", rockets, EMISSION_FACTORS.rockets],
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
      gas_summary: `${Math.round((so2_emitted_g + co_emitted_g + no2_emitted_g) * 100) / 100}g of reactive combustion gases released (${Math.round(so2_emitted_g * 100) / 100}g SO2, ${Math.round(co_emitted_g * 100) / 100}g CO, ${Math.round(no2_emitted_g * 100) / 100}g NO2) with ${Math.round(pm25_emitted_g * 100) / 100}g of fine PM2.5 and ${Math.round(metals_emitted_mg)}mg of heavy metal salts into ${cityConfig.name}.`,
    };

    const cigarette_equivalent = pm25_spike > 0 ? Math.round((pm25_spike / 22.0) * 10) / 10 : 0.0;

    return NextResponse.json({
      city_id: cityConfig.id,
      city_name: cityConfig.name,
      city_dispersion_multiplier: cityConfig.dispersion_multiplier,
      city_climate: cityConfig.climate,
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
      cigarette_equivalent,
      health_advisory: getHealthAdvisory(total_pm25, cityConfig.name),
      breakdown,
      gases_released,
      model_source: `Calibrated CPCB Atmospheric Dispersion Engine (${cityConfig.name})`,
    });
  } catch (error) {
    console.error("API /api/predict error:", error);
    return NextResponse.json(
      { error: "Failed to process emission prediction" },
      { status: 500 }
    );
  }
}
