# Diwali Air Quality & Firecracker Emission Estimator

An end-to-end full-stack web application with a modern dark-mode Diwali aesthetic, AI-driven emission prediction models, and live health impact indicators.

---

## 🌟 Architecture Overview

```
diwali-emission-estimator/
├── frontend/                     # Next.js 16 (App Router) + Tailwind CSS + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # Diwali theme variables (--gold-glow, animations, dark sky)
│   │   │   ├── layout.tsx        # Responsive layout & metadata
│   │   │   └── page.tsx          # Single-page orchestrator & API state management
│   │   └── components/
│   │       ├── SparkleCanvas.tsx    # HTML5 canvas floating golden spark particle embers
│   │       ├── HeroSection.tsx      # Glowing Diwali hero title & festive diya flame
│   │       ├── FirecrackerForm.tsx  # Accessible input steppers, presets & weather drawer
│   │       ├── ResultsDashboard.tsx # CSS Grid data dashboard (PM2.5, SO2, PM10, AQI)
│   │       └── WHORedirectAlert.tsx # 10s countdown redirect to WHO air pollution guidelines
│   └── package.json
│
└── backend/                      # Python AI Pipeline & FastAPI Server
    ├── data_pipeline.py          # BeautifulSoup scraper, requests API, pandas.interpolate()
    ├── train_model.py            # Scikit-learn MultiOutputRegressor (Random Forest)
    ├── server.py                 # FastAPI backend with /predict endpoint & CORS
    ├── diwali_emissions_master.csv # Cleaned 14-day hourly master dataset (0 nulls)
    ├── model.pkl                 # Serialized AI model artifact (R² > 0.95)
    ├── model_meta.json           # Model metadata, evaluation metrics & default weather
    └── requirements.txt          # fastapi, uvicorn, scikit-learn, pandas, bs4, requests
```

---

## 🚀 Quick Start Guide

### 1. Start the Python FastAPI Backend (Port 8000)

```bash
cd backend
python -m pip install -r requirements.txt
python data_pipeline.py     # Extracts data & generates diwali_emissions_master.csv
python train_model.py       # Trains AI model & exports model.pkl
python server.py            # Starts FastAPI server on http://localhost:8000
```

- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`
- Predict Endpoint: `POST http://localhost:8000/predict`

### 2. Start the Next.js Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🎯 Key Features & Updates

### 1. 15-Year Historical CPCB Diwali Air Quality Archive (2011–2025)
- **Authentic Telemetry Ground-Truth**: Incorporates official Central Pollution Control Board (CPCB) continuous air monitoring records across 15 consecutive Diwalis (2011 to 2025).
- **Comprehensive Variables**: Pre-Diwali baseline, Diwali night peak ($\text{PM}_{2.5}$), net cracker spike, $\text{SO}_2$ surge, wind speed, relative humidity, and regulatory context.
- **Interactive UI & CSV Export**: Searchable and filterable table with statistical benchmarks and a direct **"Download CSV"** button (`/download-historical-csv`).

### 2. Precise +1 / -1 Stepper Controls
- Form steppers strictly increment and decrement by **1 unit only** per click for granular inventory control.
- Direct numeric keyboard input enabled with min/max safety limits.

### 3. Gaseous & Chemical Emissions Mass Discharged
- Prominent combustion yield dashboard section displaying exact gaseous weights:
  - **$\text{SO}_2$ (Sulfur Dioxide) Gas Released**: in grams ($g$) and milligrams ($mg$).
  - **$\text{CO}$ (Carbon Monoxide) Gas Released**: in grams ($g$).
  - **$\text{NO}_2$ (Nitrogen Oxides) Gas Released**: in grams ($g$).
  - **$\text{PM}_{2.5}$ & $\text{PM}_{10}$ Aerosol Mass Discharged**: in grams ($g$).
  - **Heavy Metal Oxidizer Salts**: Barium, Strontium, Copper residues in milligrams ($mg$).

### 4. Consent-Gated WHO Health Advisory (No Forced Auto-Redirects)
- Unconsented automatic redirect timer has been completely removed.
- Features an explicit **"Read WHO Guidelines"** button opening the official portal only upon user consent, along with a **"Stay on Page"** option.

### 5. Python Data Extraction Pipeline & AI Model
- **Web Scraping (`bs4`)**: Scrapes emission factor HTML tables.
- **API Extraction (`requests`)**: Pulls CPCB sensor telemetry and IMD meteorological observations.
- **Handling Missing Data (`pandas.DataFrame.interpolate()`)**: Interpolates hour-by-hour sensor downtime gaps so machine learning models receive zero null values.
- **Scikit-Learn MultiOutputRegressor (Random Forest)**: Evaluated on test set with $R^2 > 0.95$, predicting PM2.5 and SO2 spikes based on cracker quantities and wind dispersion.
