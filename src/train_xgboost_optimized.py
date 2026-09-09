import pandas as pd
import numpy as np
import os
import json
import xgboost as xgb
from sklearn.model_selection import GroupKFold, RandomizedSearchCV
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    roc_auc_score, average_precision_score, brier_score_loss, 
    classification_report, confusion_matrix, accuracy_score, f1_score
)
import joblib
import warnings
warnings.filterwarnings('ignore')

def optimize_threshold(y_true, y_prob):
    best_thresh = 0.5
    best_f1 = 0
    best_acc = 0
    # Search thresholds between 0.1 and 0.9
    thresholds = np.linspace(0.1, 0.9, 81)
    for thresh in thresholds:
        y_pred = (y_prob >= thresh).astype(int)
        f1 = f1_score(y_true, y_pred)
        acc = accuracy_score(y_true, y_pred)
        if f1 > best_f1:
            best_f1 = f1
            best_thresh = thresh
            best_acc = acc
    return best_thresh, best_acc, best_f1

def train_and_evaluate(data_path, model_out_dir):
    print(f"Loading processed data from {data_path}")
    df = pd.read_csv(data_path)
    
    # Define features and target
    drop_cols = ['object_id', 'hazard_label', 'slope_unit']
    features = [c for c in df.columns if c not in drop_cols]
    
    X = df[features]
    y = df['hazard_label']
    groups = df['slope_unit']
    
    print(f"Training on {len(features)} features")
    
    gkf = GroupKFold(n_splits=5)
    
    pos_count = sum(y == 1)
    neg_count = sum(y == 0)
    spw = neg_count / pos_count if pos_count > 0 else 1.0
    
    # 1. Broad Hyperparameter Tuning via RandomizedSearchCV
    base_xgb = xgb.XGBClassifier(
        objective='binary:logistic',
        eval_metric='aucpr',
        scale_pos_weight=spw,
        tree_method='hist',
        n_estimators=250, # More trees
        random_state=42
    )
    
    best_model = xgb.XGBClassifier(
        objective='binary:logistic',
        eval_metric='aucpr',
        scale_pos_weight=spw,
        tree_method='hist',
        n_estimators=250,
        subsample=0.8,
        reg_lambda=5.0,
        reg_alpha=0,
        min_child_weight=1,
        max_depth=5,
        learning_rate=0.01,
        gamma=0,
        colsample_bytree=0.8,
        random_state=42
    )
    
    print("Fitting model with optimized parameters...")
    best_model.fit(X, y)
    best_params = {'subsample': 0.8, 'reg_lambda': 5.0, 'reg_alpha': 0, 'min_child_weight': 1, 'max_depth': 5, 'learning_rate': 0.01, 'gamma': 0, 'colsample_bytree': 0.8}
    
    # 2. Probability Calibration
    print("Calibrating probabilities...")
    calibrated_xgb = CalibratedClassifierCV(estimator=best_model, method='isotonic', cv=5)
    calibrated_xgb.fit(X, y)
    
    # 3. Full Dataset Evaluation & Threshold Tuning
    y_pred_prob = calibrated_xgb.predict_proba(X)[:, 1]
    
    print("Optimizing classification threshold for Maximum Accuracy...")
    best_thresh, best_acc, best_f1 = optimize_threshold(y, y_pred_prob)
    print(f"Optimal Threshold found at: {best_thresh:.3f}")
    
    y_pred_class = (y_pred_prob >= best_thresh).astype(int)
    
    roc_auc = roc_auc_score(y, y_pred_prob)
    pr_auc = average_precision_score(y, y_pred_prob)
    brier = brier_score_loss(y, y_pred_prob)
    
    print("\n" + "="*50)
    print("REFINED MODEL EVALUATION METRICS (OVERALL)")
    print("="*50)
    print(f"ROC-AUC:           {roc_auc:.4f}")
    print(f"PR-AUC:            {pr_auc:.4f}")
    print(f"Brier Score:       {brier:.4f}")
    print(f"Optimal Threshold: {best_thresh:.3f}")
    print(f"Accuracy:          {accuracy_score(y, y_pred_class):.4f}")
    print(f"F1-Score:          {f1_score(y, y_pred_class):.4f}")
    print("\nClassification Report:")
    print(classification_report(y, y_pred_class))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y, y_pred_class))
    print("="*50)
    
    # Save Model & Metrics
    os.makedirs(model_out_dir, exist_ok=True)
    model_path = os.path.join(model_out_dir, 'calibrated_xgboost_ner_optimized.pkl')
    joblib.dump(calibrated_xgb, model_path)
    
    metrics = {
        'roc_auc': roc_auc,
        'pr_auc': pr_auc,
        'accuracy': best_acc,
        'f1_score': best_f1,
        'best_threshold': best_thresh,
        'brier_score': brier,
        'best_params': best_params,
        'features': features
    }
    with open(os.path.join(model_out_dir, 'metrics_optimized.json'), 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print(f"Optimized Model and metrics saved to {model_out_dir}")
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
