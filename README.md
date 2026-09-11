<div align="center">

# ⛰️ BhuRakshak (भू-रक्षक)
### Autonomous AI Geotechnical Intelligence & Multi-Tier Landslide Early Warning System

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-0f766e?style=for-the-badge&logo=target)](https://sih.gov.in/)
[![Live Frontend](https://img.shields.io/badge/Live_App-Vercel-black?style=for-the-badge&logo=vercel)](https://bhurakshak.vercel.app)
[![Cloud Backend](https://img.shields.io/badge/API-Render_Cloud-46e3b7?style=for-the-badge&logo=render)](https://bhurakshak-vjq5.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![XGBoost](https://img.shields.io/badge/Model-Calibrated_XGBoost-orange?style=for-the-badge)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>Transforming disaster response from reactive rescue to proactive prevention.</strong><br>
  Sub-120ms inference fusing in-situ geotechnical IoT telemetry with satellite geospatial intelligence, backed by a 24-hour self-healing MLOps pipeline with safety guardrails and multi-tier acoustic citizen warning relays.
</p>

[📄 **Read 8-Page Pitch Bible (PDF)**](BhuRakshak_Hackathon_Pitch_Bible.pdf) • [🌐 **Live Application**](https://bhurakshak.vercel.app) • [⚙️ **API Documentation**](https://bhurakshak-vjq5.onrender.com/docs) • [🛠️ **Deployment Guide**](DEPLOYMENT.md)

</div>

---

## 🚨 The Problem: Why Traditional Systems Fail

- **The Disaster Reality:** **12.6% of India's landmass** (~0.42 million sq km across 19 States/UTs in the Himalayas and Western Ghats) is vulnerable to catastrophic landslides. The **Wayanad 2024 disaster (400+ casualties)**, Chamoli flash floods, and Sikkim Teesta landslides underscore the extreme human and economic toll.
- **The Core Flaw:** Conventional Landslide Hazard Zonation (LHZ) maps produced by agencies are **static paper atlases** updated once every 3 to 5 years. They cannot predict instantaneous, rainfall-triggered slope liquefaction, have no real-time telemetry from hill slopes, and lack automated alert relays to at-risk citizens.

---

## 🛡️ The BhuRakshak Solution

BhuRakshak bridges this gap with an autonomous, end-to-end early warning and disaster command platform:

```
[ In-Situ IoT Sensors & Satellite Data ]
  ├── Piezometers (Pore Water Pressure in kPa)
  ├── Inclinometers (Slope Tilt Rate in mm/hr)
  ├── TDR Volumetric Soil Moisture Probes (%)
  └── NASA GPM / IMD Gridded Rainfall Radar (24h/72h mm)
                    │
                    ▼ (LoRaWAN / 4G Telemetry Stream @ 15-min Intervals)
[ FastAPI High-Throughput Ingestion Engine ]
  ├── Vectorized NumPy Preprocessing & Z-Score Normalization
  └── Feature Store Cache (<12ms execution)
                    │
                    ▼
[ Isotonic-Calibrated XGBoost AI Engine ]
  ├── 14 Geotechnical Vectors → Non-Parametric Calibration
  ├── Asymmetric Cost-Sensitive Cutoff (τ* = 0.470)
  └── Sub-120ms End-to-End Latency (Recall: 87.8%, F1: 86.4%, ROC-AUC: 0.923)
        │                               │
        ▼                               ▼
[ Self-Healing MLOps Governor ]   [ Disaster Command & Citizen Relay ]
  ├── 24h Autonomous AutoTrain      ├── Interactive MapLibre/Leaflet GIS
  ├── Covariate Drift Monitor (PSI) ├── Web Audio Acoustic Warning Sirens
  ├── Model Performance Ledger      ├── Automated Emergency Emails (Resend API)
  └── 1-Click Rollback (<5ms)       └── 4-Tier Hazard Warning Hierarchy
```

---

## ⚡ Core Technical Innovations & Highlights

### 1. High-Recall Machine Learning (Calibrated XGBoost)
- **Why XGBoost Over Deep Learning?** Geotechnical telemetry consists of tabular, heterogeneous measurements with disparate physical dimensions (kPa, mm, degrees, g). Tree-based gradient boosting handles disparate scales natively, resists overfitting on rare disaster events, evaluates in **<30ms**, and provides exact **SHAP interpretability** for field geologists.
- **Isotonic Probability Calibration:** Standard tree outputs suffer from sigmoid probability distortion. Using `CalibratedClassifierCV` with isotonic regression, BhuRakshak's predicted probabilities are empirically grounded (Brier score reduced from **0.124 to 0.068**).
- **Asymmetric Cost Matrix:** False Negatives (missed landslides) carry catastrophic human consequences. By weighting $C(FN) = 5 	imes C(FP)$, our model achieves **87.8% Recall** with **86.4% F1-Score**.

### 2. Self-Healing MLOps & Performance Ledger
- **24-Hour Autonomous Retraining:** Continuous background pipeline ingests new verified sensor telemetry and retrains candidate weights.
- **Covariate Drift Detection (PSI):** Tracks Population Stability Index across features to identify seasonal monsoon shifts before model failure.
- **Safety Governor Guardrail:** To prevent model degradation, candidates must pass strict rules:
  $$\text{Recall} \ge 85\% \quad \text{and} \quad F_{1,\text{candidate}} \ge F_{1,\text{champ}} - 0.005$$
  Failing models are permanently quarantined as `REJECTED_GUARDRAIL`.
- **Model Performance Ledger & 1-Click Rollback:** Audits every candidate run with comparative deltas ($\Delta\text{F1}, \Delta\text{Recall}$). Administrators can execute a **1-click rollback** in <5ms with zero downtime.

### 3. Citizen Alert Relay & Acoustic Sirens
- **Zero-Asset Web Siren:** HTML5 Web Audio API creates an emergency acoustic siren (440Hz–880Hz oscillator sweep) directly in the browser with prominent `✕` dismissal.
- **Cloud Email Dispatch:** Direct integration with Resend Cloud API delivers rich HTML emergency evacuation notices to registered citizens in under 2 seconds.
- **Multi-Tier Hazard Matrix:**
  - 🟢 **Level 1: Normal (<35%)** — Routine 15-min monitoring.
  - 🟡 **Level 2: Watch (35–65%)** — 3-min polling; SDMA officers notified.
  - 🟠 **Level 3: Warning (65–85%)** — Mountain road traffic transit restricted.
  - 🔴 **Level 4: Critical Evacuation (>85%)** — Emergency sirens triggered; immediate citizen evacuation dispatch.

---

## 📊 The 14 Geotechnical & Hydrometeorological Features

| # | Feature Identifier | Unit & Type | Geotechnical Mechanism & Limit Equilibrium | Critical Threshold |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `rainfall_24h` | mm (Float) | Immediate storm rainfall triggering surface runoff and pore water buildup | > 65 mm |
| 2 | `rainfall_72h_cumulative` | mm (Float) | Antecedent moisture saturation violating Caine's empirical curve ($I = \alpha D^{-\beta}$) | > 140 mm |
| 3 | `slope_angle` | Degrees (°) | Tangential gravity driving shear stress component ($\tau = \gamma h \sin \theta \cos \theta$) | > 35° |
| 4 | `soil_moisture_pct` | % Volumetric | Volumetric water content reducing soil matric suction | > 78% |
| 5 | `pore_water_pressure` | kPa (Float) | Positive pore pressure directly reducing effective normal stress ($\sigma' = \sigma - u$) | > 42.0 kPa |
| 6 | `vibration_amplitude` | g (Accel) | Micro-seismic tremors, vehicular vibrations, or rock blasting | > 0.08g |
| 7 | `displacement_rate` | mm/hr (Rate) | Tertiary creep velocity preceding catastrophic shear plane rupture | > 2.5 mm/hr |
| 8 | `distance_to_fault` | km (Float) | Proximity to tectonic fault shatter zones (MCT / MBT) | < 3.0 km |
| 9 | `lithology_strength` | 1–5 (Ordinal) | Rock competence: 1 = Weathered Phyllite/Schist; 5 = Competent Gneiss | Level 1–2 |
| 10 | `soil_cohesion` | kPa (Float) | Apparent internal cohesion ($c'$) resisting planar shear failure | < 12.0 kPa |
| 11 | `ndvi_vegetation` | -1.0 to +1.0 | Root network anchorage reinforcement (adds 3–5 kPa cohesion) | < 0.25 |
| 12 | `aspect_azimuth` | Degrees (0–360) | Slope facing relative to rain-bearing South-West monsoon winds | 180°–240° |
| 13 | `flow_accumulation` | Cells (Integer) | Topographic surface runoff catchment concentration and toe erosion | > 12,000 |
| 14 | `elevation_msl` | Meters (DEM) | Orographic precipitation uplift and periglacial weathering zone | 1,200m–3,200m |

---

## 📈 Benchmark & Performance Comparison

| Model Architecture | F1-Score | Recall (Safety Priority) | Precision | ROC-AUC | Brier Score | Latency |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🏆 **BhuRakshak Calibrated XGBoost** | **86.4%** | **87.8%** | **85.2%** | **0.923** | **0.068** | **28ms** |
| Raw Uncalibrated XGBoost | 84.8% | 83.5% | 86.1% | 0.915 | 0.124 | 27ms |
| Random Forest (100 Trees) | 81.2% | 79.4% | 83.1% | 0.884 | 0.098 | 64ms |
| Support Vector Machine (RBF) | 75.6% | 73.0% | 78.4% | 0.821 | 0.142 | 180ms |
| Logistic Regression (Baseline) | 71.5% | 68.2% | 75.1% | 0.768 | 0.165 | 5ms |

---

## 📂 Repository Structure

```
bhurakshak/
├── BhuRakshak_Hackathon_Pitch_Bible.pdf   # 8-Page Executive Pitch Bible & Q&A Defense
├── DEPLOYMENT.md                          # Production Cloud Deployment Guide
├── render.yaml                            # Render Cloud Infrastructure as Code Blueprint
├── run_pipeline.py                        # Path-agnostic end-to-end data/model pipeline runner
├── daily_cron.bat                         # Windows automated daily retraining batch script
├── backend/                               # FastAPI High-Performance Backend
│   ├── app/
│   │   ├── main.py                        # REST endpoints, AutoTrain engine, MLOps ledger
│   │   ├── models.py                      # SQLAlchemy ORM schemas (Ledger, Alerts, Telemetry)
│   │   ├── database.py                    # Database connection & session management
│   │   └── email_service.py               # Resend API & SMTP emergency dispatch relay
│   ├── requirements.txt                   # Production Python dependencies
│   ├── Dockerfile                         # Containerized microservice deployment
│   └── smtp_config.json                   # Sanitized email relay configuration template
├── frontend/                              # React 18 + Vite 6 Modern Web Application
│   ├── src/
│   │   ├── components/                    # UI Components (Sidebar, TopBar, Modals, Banners)
│   │   │   ├── BackendWarmingBanner.jsx   # Cloud cold-start detector & warming beacon
│   │   │   ├── DirectDangerAlertModal.jsx # Acoustic siren & danger evacuation modal
│   │   │   └── GoogleAuthModal.jsx        # Citizen Alert Relay authentication
│   │   ├── pages/                         # Command Center Pages
│   │   │   ├── MainDashboard.jsx          # Interactive MapLibre/Leaflet GIS Command Center
│   │   │   ├── SystemHealthMLOps.jsx      # Live Performance Ledger, convergence chart & rollback
│   │   │   ├── GeotechnicalTelemetry.jsx  # Multi-sensor telemetry streaming & gauges
│   │   │   ├── AlertsCenter.jsx           # Multi-tier alert audit log & inspection drawer
│   │   │   └── ModelXAIInsights.jsx       # SHAP geotechnical feature impact waterfall
│   │   ├── config/api.js                  # Environment-aware API resolution with auto-warmup
│   │   └── utils/emergencyAudio.js        # Native Web Audio API emergency siren oscillator
│   └── package.json                       # Client dependencies
├── models/                                # Serialized Model Checkpoints & Metrics
│   ├── calibrated_xgboost_ner_optimized.pkl # Production active champion model
│   └── metrics_optimized.json             # Evaluated metrics JSON
└── .github/workflows/
    └── keep_alive.yml                     # 24/7 automated GitHub Actions keep-alive pinger
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/VanshdeepSi/bhurakshak.git
cd bhurakshak
```

### 2. Run the Backend API (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend runs on `http://localhost:8000` (Swagger docs at `/docs`).*

### 3. Run the Frontend (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🛰️ Datasets & Scientific Citations

- **Geological Survey of India (GSI):** National Landslide Susceptibility Mapping (NLSM) database (1998–2024 historical landslide catalog).
- **NASA GPM & IMD:** Global Precipitation Measurement gridded radar precipitation records.
- **Copernicus & USGS:** 30m Digital Elevation Models (DEM) for slope, aspect, and flow accumulation.
- **ITU-T X.1303:** Formatted to the Common Alerting Protocol (CAP) standard matching the NDMA Sachet disaster portal.

---

## 👥 Hackathon Presentation Team

- **Team Lead & Pitch Presenter:** Executive narrative, disaster reality & live command center walkthrough.
- **AI & ML Specialist:** 14 geotechnical vectors, calibrated XGBoost, cost-sensitive thresholding & Recall optimization.
- **Backend & MLOps Engineer:** FastAPI async concurrency, 24h AutoTrain, Covariate Drift (PSI), Performance Ledger & 1-Click Rollback.
- **GIS & IoT Domain Lead:** Geotechnical sensor telemetry, Resend email relay, acoustic sirens & NDMA CAP compliance.

---

<div align="center">
  <sub>Built with ❤️ for Smart India Hackathon (SIH 2026) • Protecting Lives in the Himalayas & Western Ghats.</sub>
</div>
