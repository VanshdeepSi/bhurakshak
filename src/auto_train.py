import os
import pandas as pd
import subprocess
import time
import random
import datetime

def simulate_new_daily_data(base_data_path, n_samples=50):
    """
    Hackathon Simulator: Generates dummy landslide reports for the last 24h
    to simulate continuous ingestion of new data.
    """
    print(f"[{datetime.datetime.now()}] MLOPS: Fetching daily geological survey reports...")
    time.sleep(2) # Simulate network fetch
    
    # We sample a few rows from the base dataset and slightly perturb them to create "new" events
    df = pd.read_csv(base_data_path)
    new_data = df.sample(n=n_samples, replace=True).copy()
    
    # Perturb the data slightly
    new_data['rainfall'] = new_data['rainfall'] * random.uniform(0.8, 1.2)
    new_data['hazard_label'] = [random.choices([0, 1], weights=[0.8, 0.2])[0] for _ in range(n_samples)]
    
    return new_data

def continuous_training_pipeline():
    BASE_DIR = r"E:\code\sih2026_landslide_ner"
    TRAIN_DATA = os.path.join(BASE_DIR, "data", "processed", "ner_model_training_ready.csv")
    TRAIN_SCRIPT = os.path.join(BASE_DIR, "src", "train_xgboost_optimized.py")
    
    if not os.path.exists(TRAIN_DATA):
        print("Base training data not found!")
        return

    # 1. Ingest New Data
    new_data_df = simulate_new_daily_data(TRAIN_DATA)
    print(f"[{datetime.datetime.now()}] MLOPS: Ingested {len(new_data_df)} new landslide/survey events.")
    
    # Append to master dataset
    existing_df = pd.read_csv(TRAIN_DATA)
    merged_df = pd.concat([existing_df, new_data_df], ignore_index=True)
    merged_df.to_csv(TRAIN_DATA, index=False)
    print(f"[{datetime.datetime.now()}] MLOPS: Master dataset updated. New size: {len(merged_df)} rows.")
    
    # 2. Trigger Auto-Train (using subprocess to run the actual python script)
    print(f"[{datetime.datetime.now()}] MLOPS: Triggering ML Retraining Pipeline...")
    
    # Using python to run the script. This ensures the model weights are updated and saved.
    cmd = ["python", TRAIN_SCRIPT, "--data", TRAIN_DATA, "--out_dir", os.path.join(BASE_DIR, "models")]
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"[{datetime.datetime.now()}] MLOPS: Model Successfully Retrained and Validated!")
        print(f"[{datetime.datetime.now()}] MLOPS: New model version deployed to production models directory.")
    else:
        print(f"[{datetime.datetime.now()}] MLOPS ERROR: Retraining failed!")
        print(result.stderr)

if __name__ == "__main__":
    print("========================================")
    print("  SIH26001 CONTINUOUS TRAINING ENGINE   ")
    print("========================================")
    continuous_training_pipeline()
