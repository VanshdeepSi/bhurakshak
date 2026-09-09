import pandas as pd
import numpy as np
import os
import json
import xgboost as xgb
from sklearn.model_selection import GroupKFold, GridSearchCV
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    roc_auc_score, average_precision_score, brier_score_loss, 
    classification_report, confusion_matrix
)
import joblib

def train_and_evaluate(data_path, model_out_dir):
    print(f"Loading processed data from {data_path}")
    df = pd.read_csv(data_path)
    
    # Define features and target
    drop_cols = ['object_id', 'hazard_label', 'slope_unit']
    features = [c for c in df.columns if c not in drop_cols]
    
    X = df[features]
    y = df['hazard_label']
    groups = df['slope_unit'] # Crucial for spatial cross-validation
    
    print(f"Training on {len(features)} features: {features}")
    
    # 1. Setup Spatial Cross-Validation (GroupKFold)
    gkf = GroupKFold(n_splits=5)
    
    pos_count = sum(y == 1)
    neg_count = sum(y == 0)
    spw = neg_count / pos_count if pos_count > 0 else 1.0
    
    base_xgb = xgb.XGBClassifier(
        objective='binary:logistic',
        eval_metric='aucpr',
        scale_pos_weight=spw,
        tree_method='hist',
        n_estimators=150,
        random_state=42
    )
    
    # 2. Hyperparameter Tuning using GridSearch with Spatial CV
    param_grid = {
        'max_depth': [5, 7],
        'learning_rate': [0.05, 0.1],
        'subsample': [0.8],
        'colsample_bytree': [0.8],
        'reg_alpha': [0.1],
        'reg_lambda': [1.0]
    }
    
    print("Running Hyperparameter Optimization with Spatial Group K-Fold CV...")
    grid_search = GridSearchCV(
        estimator=base_xgb,
        param_grid=param_grid,
        cv=gkf,
        scoring='average_precision',
        n_jobs=-1,
        verbose=1
    )
    
    # GridSearch naturally passes groups to cv.split
    grid_search.fit(X, y, groups=groups)
    best_model = grid_search.best_estimator_
    print(f"Best parameters: {grid_search.best_params_}")
    
    # 3. Probability Calibration
    # Note: Using prefit as we already found best model over the whole dataset
    print("Calibrating probabilities using Isotonic Regression...")
    calibrated_xgb = CalibratedClassifierCV(estimator=best_model, method='isotonic', cv=5)
    calibrated_xgb.fit(X, y)
    
    # 4. Full Dataset Evaluation
    y_pred_prob = calibrated_xgb.predict_proba(X)[:, 1]
    y_pred_class = (y_pred_prob >= 0.5).astype(int)
    
    roc_auc = roc_auc_score(y, y_pred_prob)
    pr_auc = average_precision_score(y, y_pred_prob)
    brier = brier_score_loss(y, y_pred_prob)
    
    print("\n" + "="*40)
    print("MODEL EVALUATION METRICS (OVERALL)")
    print("="*40)
    print(f"ROC-AUC:   {roc_auc:.4f}")
    print(f"PR-AUC:    {pr_auc:.4f}")
    print(f"Brier:     {brier:.4f}")
    print("\nClassification Report:")
    print(classification_report(y, y_pred_class))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y, y_pred_class))
    print("="*40)
    
    # 5. Save Model & Metrics
    os.makedirs(model_out_dir, exist_ok=True)
    model_path = os.path.join(model_out_dir, 'calibrated_xgboost_ner.pkl')
    joblib.dump(calibrated_xgb, model_path)
    
    metrics = {
        'roc_auc': roc_auc,
        'pr_auc': pr_auc,
        'brier_score': brier,
        'best_params': grid_search.best_params_,
        'features': features
    }
    with open(os.path.join(model_out_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print(f"Model and metrics saved to {model_out_dir}")
    return calibrated_xgb, features

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to processed dataset")
    parser.add_argument("--out_dir", required=True, help="Directory to save models")
    args = parser.parse_args()
    
    if os.path.exists(args.data):
        train_and_evaluate(args.data, args.out_dir)
    else:
        print(f"Processed data not found at {args.data}")
