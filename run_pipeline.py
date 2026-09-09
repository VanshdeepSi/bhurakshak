import os
import subprocess
import sys

def run_step(script_name, args):
    cmd = [sys.executable, script_name] + args
    print(f"\n{'='*50}\nRUNNING: {' '.join(cmd)}\n{'='*50}")
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"Error executing {script_name}!")
        sys.exit(1)

if __name__ == "__main__":
    BASE_DIR = r"E:\code\sih2026_landslide_ner"
    SRC_DIR = os.path.join(BASE_DIR, "src")
    
    RAW_DATA = os.path.join(BASE_DIR, "data", "raw", "lsm_training_set.csv")
    PROCESSED_DATA = os.path.join(BASE_DIR, "data", "processed", "ner_model_training_ready.csv")
    MODEL_DIR = os.path.join(BASE_DIR, "models")
    
    data_script = os.path.join(SRC_DIR, "data_processing.py")
    train_script = os.path.join(SRC_DIR, "train_xgboost.py")
    eval_script = os.path.join(SRC_DIR, "early_warning.py")
    
    # 1. Process Data
    run_step(data_script, ["--raw", RAW_DATA, "--out", PROCESSED_DATA])
    
    # 2. Train Model
    run_step(train_script, ["--data", PROCESSED_DATA, "--out_dir", MODEL_DIR])
    
    # 3. Test Early Warning System
    run_step(eval_script, [])
    
    print("\n" + "*"*50)
    print("PIPELINE EXECUTION COMPLETED SUCCESSFULLY!")
    print("*"*50)
