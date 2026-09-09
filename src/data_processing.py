import pandas as pd
import numpy as np
import os

def load_and_preprocess_data(raw_data_path):
    print(f"Loading data from {raw_data_path}")
    # Read the dataset
    df = pd.read_csv(raw_data_path, encoding='utf-8-sig')
    
    # Rename columns from Chinese to English matching the known schema
    columns_map = {
        'OBJECTID': 'object_id',
        '坡度': 'slope',
        '剖面曲率': 'profile_curvature',
        '平面曲率': 'planar_curvature',
        '岩性': 'lithology',
        'TWI': 'twi',
        '降雨': 'rainfall',
        'NDVI': 'ndvi',
        '距河流距离': 'distance_to_river',
        '距断层距离': 'distance_to_fault',
        '斜坡单元': 'slope_unit',
        '斜坡结构': 'slope_structure',
        '灾害类别': 'hazard_label'
    }
    
    if '坡度' in df.columns:
        df.rename(columns=columns_map, inplace=True)
    elif 'slope' not in df.columns:
        # Fallback if already renamed but slightly different
        df.columns = list(columns_map.values())
        
    print("Performing feature engineering...")
    
    # Advanced Feature Engineering (Competitive Edge)
    # 1. Hydrometeorological interaction: rainfall * slope
    df['rainfall_slope_interaction'] = df['rainfall'] * df['slope']
    
    # 2. Topographic saturation: TWI * rainfall
    df['saturation_potential'] = df['twi'] * df['rainfall']
    
    # 3. Geological vulnerability: combining lithology with fault distance
    df['fault_vulnerability'] = df['lithology'] / (df['distance_to_fault'] + 1)
    
    # 4. Stream power approximation: TWI * slope
    df['stream_power_index_approx'] = df['twi'] * df['slope']

    # 5. Composite Disturbance Index
    df['disturbance_index'] = (6 - df['distance_to_river']) + (6 - df['distance_to_fault'])
    
    # 6. Hydrological stress (Rainfall relative to TWI)
    # Prevent division by zero
    df['hydro_stress'] = df['rainfall'] / (df['twi'] + 0.1)

    print(f"Dataset shape after feature engineering: {df.shape}")
    
    return df

def save_processed_data(df, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Processed data saved to {output_path}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", required=True, help="Path to raw dataset")
    parser.add_argument("--out", required=True, help="Path to save processed dataset")
    args = parser.parse_args()
    
    if os.path.exists(args.raw):
        df = load_and_preprocess_data(args.raw)
        save_processed_data(df, args.out)
    else:
        print(f"Raw data not found at {args.raw}")
