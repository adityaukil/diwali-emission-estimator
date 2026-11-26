import rawData from "./historical_15_years_multi_city.json";

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  category: string;
  stations: string[];
  base_pm25: number;
  base_so2: number;
  wind_avg: number;
  humidity_avg: number;
  temp_avg: number;
  dispersion_multiplier: number;
  climate: string;
}

export interface HistoricalRecord {
  year: number;
  diwali_date: string;
  monitoring_station: string;
  city: string;
  city_id: string;
  state: string;
  category: string;
  pre_diwali_pm25: number;
  diwali_night_peak_pm25: number;
  pm25_spike: number;
  pre_diwali_so2: number;
  diwali_night_so2: number;
  so2_spike: number;
  pm10_peak: number;
  co_peak_mg: number;
  wind_speed_kmh: number;
  relative_humidity: number;
  temperature_c: number;
  aqi_category: string;
  firecracker_intensity_index: number;
  policy_status: string;
  data_source: string;
}

export const CITIES: CityConfig[] = rawData.cities as CityConfig[];
export const ALL_HISTORICAL_RECORDS: HistoricalRecord[] = rawData.records as HistoricalRecord[];

export function getCityById(id: string): CityConfig {
  const found = CITIES.find((c) => c.id.toLowerCase() === id.toLowerCase());
  return found || CITIES[0]; // defaults to Delhi NCR
}

export function getCityRecords(cityId: string): HistoricalRecord[] {
  if (cityId === "all") return ALL_HISTORICAL_RECORDS;
  return ALL_HISTORICAL_RECORDS.filter(
    (r) => r.city_id.toLowerCase() === cityId.toLowerCase()
  );
}
