"""
AI Model Training for Diwali Firecracker Emission Prediction
============================================================
Trains a scikit-learn MultiOutputRegressor (Random Forest) on the cleaned
CPCB/IMD master dataset to accurately predict PM2.5 and SO2 spikes
based on firecracker counts and ambient weather conditions.
Saves the trained model as 'model.pkl'.
"""

import os
import pickle
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, "diwali_emissions_master.csv")
MODEL_PATH = os.path.join(SCRIPT_DIR, "model.pkl")
META_PATH = os.path.join(SCRIPT_DIR, "model_meta.json")

FEATURE_COLS = [
    "sparklers_count",
    "flower_pots_count",
    "ground_spinners_count",
    "garlands_count",
    "rockets_count",
    "wind_speed_kmh",
    "relative_humidity",
    "temperature_c"
]

TARGET_COLS = ["pm25_spike", "so2_spike"]


def load_dataset() -> pd.DataFrame:
    """Loads master dataset, creating it if not yet present."""
    if not os.path.exists(DATASET_PATH):
        print(f"Dataset not found at {DATASET_PATH}. Running data extraction pipeline first...")
        from data_pipeline import main as run_pipeline
        run_pipeline()
    
    df = pd.read_csv(DATASET_PATH)
    print(f"Loaded master dataset: {len(df)} samples.")
    return df


def train_model():
    print("=" * 70)
    print(" Training AI Model for Diwali Emission Spikes (scikit-learn)")
    print("=" * 70)
    
    df = load_dataset()

    X = df[FEATURE_COLS]
    y = df[TARGET_COLS]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"Training set: {X_train.shape[0]} samples | Test set: {X_test.shape[0]} samples")

    base_reg = RandomForestRegressor(
        n_estimators=120,
        max_depth=12,
        min_samples_split=3,
        random_state=42
    )
    model = MultiOutputRegressor(base_reg)
    
    print("Fitting MultiOutput Random Forest Regressor...")
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    
    r2_pm25 = r2_score(y_test["pm25_spike"], y_pred[:, 0])
    mae_pm25 = mean_absolute_error(y_test["pm25_spike"], y_pred[:, 0])
    rmse_pm25 = np.sqrt(mean_squared_error(y_test["pm25_spike"], y_pred[:, 0]))

    r2_so2 = r2_score(y_test["so2_spike"], y_pred[:, 1])
    mae_so2 = mean_absolute_error(y_test["so2_spike"], y_pred[:, 1])
    rmse_so2 = np.sqrt(mean_squared_error(y_test["so2_spike"], y_pred[:, 1]))

    print("\n--- Model Evaluation ---")
    print(f"PM2.5 Spike  -> R2: {r2_pm25:.4f} | MAE: {mae_pm25:.2f} µg/m³ | RMSE: {rmse_pm25:.2f} µg/m³")
    print(f"SO2 Spike    -> R2: {r2_so2:.4f} | MAE: {mae_so2:.2f} µg/m³ | RMSE: {rmse_so2:.2f} µg/m³")

    # Save model artifact
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print(f"\nTrained model successfully serialized and saved to: {MODEL_PATH}")

    # Save metadata
    meta = {
        "features": FEATURE_COLS,
        "targets": TARGET_COLS,
        "metrics": {
            "pm25": {"r2": round(r2_pm25, 4), "mae": round(mae_pm25, 2), "rmse": round(rmse_pm25, 2)},
            "so2": {"r2": round(r2_so2, 4), "mae": round(mae_so2, 2), "rmse": round(rmse_so2, 2)}
        },
        "default_weather": {
            "wind_speed_kmh": 3.5,
            "relative_humidity": 65.0,
            "temperature_c": 21.0
        }
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"Metadata saved to: {META_PATH}")


if __name__ == "__main__":
    train_model()
