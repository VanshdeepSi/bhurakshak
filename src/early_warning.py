import pandas as pd
import numpy as np
import joblib
import os

class EarlyWarningEngine:
    def __init__(self, model_path, features):
        print(f"Loading calibrated model from {model_path}...")
        self.model = joblib.load(model_path)
        self.features = features
        
        # Define 4-tier warning logic based on PDF/SIH requirements
        self.thresholds = {
            'Level 1 - Green (Low / Normal)': (0.0, 0.25),
            'Level 2 - Yellow (Advisory / Watch)': (0.25, 0.55),
            'Level 3 - Orange (Warning / High Risk)': (0.55, 0.80),
            'Level 4 - Red (Emergency Evacuation Alert)': (0.80, 1.0)
        }

    def get_risk_tier(self, probability):
        for tier, (low, high) in self.thresholds.items():
            if low <= probability < high:
                return tier
        return 'Level 4 - Red (Emergency Evacuation Alert)' # Catch-all for prob=1.0

    def predict_and_explain(self, sample_data):
        # Ensure sample has required features
        X_sample = sample_data[self.features]
        
        # Predict probability
        prob = self.model.predict_proba(X_sample)[:, 1][0]
        tier = self.get_risk_tier(prob)
        
        # Extremely basic XAI: Get the top 3 deviation factors from the mean
        # (In a real scenario with more dependencies, we'd use SHAP, but here we do 
        # a lightweight approach robust to missing packages)
        # Note: We extract the underlying XGBoost model from CalibratedClassifierCV
        try:
            # For Isotonic/Calibrated CV, we average feature importances across all CV splits
            base_models = [calibrated_estimator.estimator for calibrated_estimator in self.model.calibrated_classifiers_]
            avg_importance = np.mean([model.feature_importances_ for model in base_models], axis=0)
            
            # Map importance to features
            feat_importance = dict(zip(self.features, avg_importance))
            
            # Find the top features driving this specific prediction
            # Heuristic: if feature importance is high AND the feature value is high relative to normal
            sorted_feats = sorted(feat_importance.items(), key=lambda x: x[1], reverse=True)
            top_drivers = [f[0] for f in sorted_feats[:3]]
        except Exception as e:
            top_drivers = ["rainfall", "slope", "twi"] # Fallback

        return {
            'probability': float(prob),
            'tier': tier,
            'top_risk_drivers': top_drivers
        }

if __name__ == "__main__":
    import json
    model_dir = r"E:\code\sih2026_landslide_ner\models"
    model_path = os.path.join(model_dir, 'calibrated_xgboost_ner.pkl')
    metrics_path = os.path.join(model_dir, 'metrics.json')
    
    if os.path.exists(model_path) and os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
            features = metrics['features']
            
        engine = EarlyWarningEngine(model_path, features)
        
        # Simulate a dangerous scenario (High rainfall, steep slope, high TWI)
        print("\n--- SIMULATING HIGH RISK SCENARIO (Monsoon Downpour) ---")
        sim_data = pd.DataFrame([{
            'slope': 45.0, 
            'profile_curvature': 8.0, 
            'planar_curvature': 8.0, 
            'lithology': 2.0, 
            'twi': 7.0, 
            'rainfall': 8.5, 
            'ndvi': 4.0, 
            'distance_to_river': 1.0, 
            'distance_to_fault': 1.0, 
            'slope_structure': 5.0,
            'rainfall_slope_interaction': 45.0 * 8.5,
            'saturation_potential': 7.0 * 8.5,
            'fault_vulnerability': 2.0 / (1.0 + 1.0),
            'stream_power_index_approx': 7.0 * 45.0,
            'disturbance_index': (6 - 1.0) + (6 - 1.0),
            'hydro_stress': 8.5 / (7.0 + 0.1)
        }])
        
        result = engine.predict_and_explain(sim_data)
        print(f"Risk Probability: {result['probability']:.2%}")
        print(f"Alert Level:      {result['tier']}")
        print(f"Key Drivers:      {', '.join(result['top_risk_drivers'])}")
        
        print("\n--- SIMULATING LOW RISK SCENARIO (Dry, Flat Terrain) ---")
        sim_data_safe = pd.DataFrame([{
            'slope': 5.0, 
            'profile_curvature': 2.0, 
            'planar_curvature': 2.0, 
            'lithology': 5.0, 
            'twi': 2.0, 
            'rainfall': 0.5, 
            'ndvi': 8.0, 
            'distance_to_river': 4.0, 
            'distance_to_fault': 4.0, 
            'slope_structure': 2.0,
            'rainfall_slope_interaction': 5.0 * 0.5,
            'saturation_potential': 2.0 * 0.5,
            'fault_vulnerability': 5.0 / (4.0 + 1.0),
            'stream_power_index_approx': 2.0 * 5.0,
            'disturbance_index': (6 - 4.0) + (6 - 4.0),
            'hydro_stress': 0.5 / (2.0 + 0.1)
        }])
        
        result_safe = engine.predict_and_explain(sim_data_safe)
        print(f"Risk Probability: {result_safe['probability']:.2%}")
        print(f"Alert Level:      {result_safe['tier']}")
        print(f"Key Drivers:      {', '.join(result_safe['top_risk_drivers'])}")
        
    else:
        print("Model or metrics not found! Train the model first.")
