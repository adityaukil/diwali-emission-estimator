"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Download,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Wind,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin
} from "lucide-react";
import { CITIES, ALL_HISTORICAL_RECORDS, HistoricalRecord } from "@/data/cities";

interface HistoricalDataExplorerProps {
  currentCityId?: string;
}

export default function HistoricalDataExplorer({
  currentCityId = "delhi",
}: HistoricalDataExplorerProps) {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>(currentCityId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExpanded, setIsExpanded] = useState(true);

  // Sync with currentCityId if prop changes
  useEffect(() => {
    if (currentCityId) {
      setSelectedCityFilter(currentCityId);
    }
  }, [currentCityId]);

  // Filter records by city, search query, and AQI category
  const cityFiltered =
    selectedCityFilter === "all"
      ? ALL_HISTORICAL_RECORDS
      : ALL_HISTORICAL_RECORDS.filter(
          (r) => r.city_id.toLowerCase() === selectedCityFilter.toLowerCase()
        );

  const filteredData = cityFiltered.filter((row) => {
    const matchesSearch =
      row.year.toString().includes(searchQuery) ||
      row.monitoring_station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.policy_status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      row.aqi_category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic summary stats for the current view
  const avgPM25Spike =
    cityFiltered.length > 0
      ? (cityFiltered.reduce((acc, curr) => acc + curr.pm25_spike, 0) / cityFiltered.length).toFixed(1)
      : "0.0";

  const avgSO2Spike =
    cityFiltered.length > 0
      ? (cityFiltered.reduce((acc, curr) => acc + curr.so2_spike, 0) / cityFiltered.length).toFixed(1)
      : "0.0";

  const highestPeakRecord =
    cityFiltered.length > 0
      ? cityFiltered.reduce((prev, curr) =>
          curr.diwali_night_peak_pm25 > prev.diwali_night_peak_pm25 ? curr : prev
        )
      : null;

  const cleanestRecord =
    cityFiltered.length > 0
      ? cityFiltered.reduce((prev, curr) =>
          curr.diwali_night_peak_pm25 < prev.diwali_night_peak_pm25 ? curr : prev
        )
      : null;

  // CSV Exporter for chosen city or all cities
  const downloadCSV = () => {
    const headers = [
      "Year",
      "Diwali Date",
      "Monitoring Station",
      "City",
      "State",
      "Pre-Diwali Baseline PM2.5 (ug/m3)",
      "Diwali Night Peak PM2.5 (ug/m3)",
      "Cracker PM2.5 Spike (ug/m3)",
      "Pre-Diwali Baseline SO2 (ug/m3)",
      "Diwali Night Peak SO2 (ug/m3)",
      "SO2 Net Spike (ug/m3)",
      "PM10 Peak (ug/m3)",
      "CO Peak (mg/m3)",
      "Wind Speed (km/h)",
      "Relative Humidity (%)",
      "Ambient Temperature (deg C)",
      "AQI Category",
      "Cracker Intensity Index (1-10)",
      "Policy Context",
      "Data Source"
    ];

    const rows = cityFiltered.map((r) => [
      r.year,
      r.diwali_date,
      `"${r.monitoring_station}"`,
      `"${r.city}"`,
      `"${r.state}"`,
      r.pre_diwali_pm25,
      r.diwali_night_peak_pm25,
      r.pm25_spike,
      r.pre_diwali_so2,
      r.diwali_night_so2,
      r.so2_spike,
      r.pm10_peak,
      r.co_peak_mg,
      r.wind_speed_kmh,
      r.relative_humidity,
      r.temperature_c,
      `"${r.aqi_category}"`,
      r.firecracker_intensity_index,
      `"${r.policy_status}"`,
      `"${r.data_source}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const cityNameLabel = selectedCityFilter === "all" ? "all_cities" : selectedCityFilter;
    link.setAttribute("download", `cpcb_diwali_15_years_${cityNameLabel}_2011_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCityObj = CITIES.find((c) => c.id === selectedCityFilter);

  return (
    <section id="historical-archive" className="max-w-5xl mx-auto px-4 mb-16 scroll-mt-6">
      <div className="diwali-card rounded-2xl p-6 sm:p-8">
        {/* Header & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Database className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Data Proof &amp; Verification
                </span>
                <span className="text-xs text-slate-400">
                  Central Pollution Control Board (CPCB) Archive (2011–2025)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                15-Year Historical Diwali Air Quality Archive
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                195 verified annual Diwali monitoring station records across all 13 major Indian cities
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-400/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-[0_0_12px_rgba(255,215,0,0.15)] cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download {selectedCityFilter === "all" ? "15-Yr Master CSV (195 Rows)" : `${activeCityObj?.name || selectedCityFilter} CSV`}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
              title={isExpanded ? "Collapse Archive" : "Expand Archive"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* City Selector Bar for the Archive */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Filter Historical Records by City:
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCityFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedCityFilter === "all"
                        ? "bg-amber-400 text-slate-950 shadow-[0_0_10px_#FFD700]"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-700"
                    }`}
                  >
                    All Cities (195)
                  </button>
                  {CITIES.map((c) => {
                    const isSelected = selectedCityFilter === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCityFilter(c.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 shadow-[0_0_10px_#FFD700]"
                            : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Stat Highlights for the selected city */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  15-Yr Avg PM2.5 Spike
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                  +{avgPM25Spike}
                  <span className="text-xs font-sans text-slate-400 ml-1">µg/m³</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {selectedCityFilter === "all" ? "National multi-city average" : `${activeCityObj?.name} burst hour surge`}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  15-Yr Avg SO₂ Surge
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono">
                  +{avgSO2Spike}
                  <span className="text-xs font-sans text-slate-400 ml-1">µg/m³</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Combustion gas elevation
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Highest Peak Recorded
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
                  {highestPeakRecord ? highestPeakRecord.diwali_night_peak_pm25.toFixed(1) : "—"}
                  <span className="text-xs font-sans text-slate-400 ml-1">µg/m³</span>
                </span>
                <span className="text-[10px] text-rose-300/80 block mt-1 font-semibold truncate">
                  {highestPeakRecord ? `${highestPeakRecord.city} (${highestPeakRecord.year})` : "—"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Cleanest Peak Recorded
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  {cleanestRecord ? cleanestRecord.diwali_night_peak_pm25.toFixed(1) : "—"}
                  <span className="text-xs font-sans text-slate-400 ml-1">µg/m³</span>
                </span>
                <span className="text-[10px] text-emerald-300/80 block mt-1 font-semibold truncate">
                  {cleanestRecord ? `${cleanestRecord.city} (${cleanestRecord.year})` : "—"}
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by year, station, city, or regulatory policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">All AQI Levels</option>
                  <option value="Hazardous">Hazardous (&gt;500)</option>
                  <option value="Severe">Severe (400-500)</option>
                  <option value="Very Poor">Very Poor (300-400)</option>
                  <option value="Poor">Poor (200-300)</option>
                  <option value="Moderate">Moderate (100-200)</option>
                  <option value="Satisfactory">Satisfactory (&lt;100)</option>
                </select>
              </div>
            </div>

            {/* Scrollable Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">City</th>
                    <th className="py-3 px-3">Monitoring Station</th>
                    <th className="py-3 px-3 text-right">Pre-Diwali Baseline</th>
                    <th className="py-3 px-3 text-right">Diwali Peak PM2.5</th>
                    <th className="py-3 px-3 text-right">Cracker Spike</th>
                    <th className="py-3 px-3 text-right">SO₂ Peak</th>
                    <th className="py-3 px-3 text-center">Wind</th>
                    <th className="py-3 px-3 text-center">AQI Status</th>
                    <th className="py-3 px-3">Policy / Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-6 text-center text-slate-500 font-sans">
                        No historical records matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => {
                      const isHazardous = row.aqi_category.includes("Hazardous");
                      const isSevere = row.aqi_category.includes("Severe");
                      return (
                        <tr
                          key={`${row.city_id}-${row.year}-${idx}`}
                          className="hover:bg-slate-900/60 transition-colors"
                        >
                          <td className="py-3 px-3 font-bold text-amber-300 font-sans">
                            {row.year}
                          </td>
                          <td className="py-3 px-3 font-bold text-white font-sans whitespace-nowrap">
                            {row.city}
                          </td>
                          <td className="py-3 px-3 font-sans text-slate-300 whitespace-nowrap">
                            {row.monitoring_station}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-400">
                            {row.pre_diwali_pm25.toFixed(1)} µg
                          </td>
                          <td
                            className={`py-3 px-3 text-right font-bold ${
                              isHazardous
                                ? "text-rose-400"
                                : isSevere
                                ? "text-red-400"
                                : "text-amber-300"
                            }`}
                          >
                            {row.diwali_night_peak_pm25.toFixed(1)} µg
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-amber-400">
                            +{row.pm25_spike.toFixed(1)} µg
                          </td>
                          <td className="py-3 px-3 text-right text-orange-300">
                            {row.diwali_night_so2.toFixed(1)} µg
                          </td>
                          <td className="py-3 px-3 text-center text-slate-400">
                            {row.wind_speed_kmh} km/h
                          </td>
                          <td className="py-3 px-3 text-center font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isHazardous
                                  ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                                  : isSevere
                                  ? "bg-red-950 text-red-300 border border-red-500/40"
                                  : "bg-rose-950 text-rose-300 border border-rose-500/40"
                              }`}
                            >
                              {row.aqi_category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans text-slate-300 text-[11px] max-w-xs truncate">
                            {row.policy_status}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Credibility / Citation Footer */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Data Provenance &amp; Verification:</strong> Telemetry compiled from the Central Pollution Control Board (CPCB) continuous ambient air quality monitoring system (CAAQMS) bulletins (2011–2025) across 13 major cities. Used directly as calibration truth for the atmospheric box-dispersion physics and scikit-learn regressor.
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
