
import React from 'react';

export default function ModelXAIInsights() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between bg-background">
      <main className="flex-1 w-full">
        <div className="flex flex-col w-full">
          <section className="px-space-xl py-space-2xl max-w-7xl mx-auto w-full">
<div className="flex flex-col md:flex-row md:items-end justify-between pb-space-2xl">
<div className="space-y-space-xs">
<div className="flex items-center gap-space-sm text-outline font-label-caps text-label-caps tracking-widest uppercase">
<span>MODEL INFERENCE &amp; INTERPRETABILITY ENGINE</span>
<span>·</span>
<span className="text-primary flex items-center gap-1">
<span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            WEIGHTS ACTIVE (v3.8.4-RELEASE)
          </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Geotechnical Model &amp; XAI Telemetry</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Empirical-physical predictive pipeline tuned for slope stability across the Main Central Thrust (MCT) and high-permeability colluvium strata of Northeast India.
        </p>
</div>
<div className="mt-space-lg md:mt-0 flex items-center gap-space-md">
<div className="bg-surface-container-low px-space-md py-space-sm rounded-lg flex items-center gap-space-sm shadow-sm">
<span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
<span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">SHAP TreeExplainer Calibrated</span>
</div>
</div>
</div>
{/*  Hero Stat Row: Exactly 3 numbers side by side, clean typography, spacious  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-2xl py-space-2xl bg-surface-container-low/40 px-panel-padding rounded-xl shadow-md">
{/*  Metric 1: F1-Score  */}
<div className="flex flex-col space-y-space-xs">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Macro Validation Metric</span>
<div className="flex items-baseline gap-space-xs pt-space-xs">
<span className="font-display-hero text-display-hero text-on-surface tracking-tight">78</span>
<span className="font-headline-sm text-headline-sm text-primary font-semibold">%</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs leading-relaxed">
          Spatial Validation F1-Macro on NE Terrain Holdout
        </p>
</div>
{/*  Metric 2: Decision Threshold  */}
<div className="flex flex-col space-y-space-xs">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Operating Threshold</span>
<div className="flex items-baseline gap-space-xs pt-space-xs">
<span className="font-display-hero text-display-hero text-secondary tracking-tight">0.470</span>
<span className="font-telemetry-unit text-telemetry-unit text-outline">P(crit)</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs leading-relaxed">
          Calibrated Optimal Cost-Sensitive Cutoff
        </p>
</div>
{/*  Metric 3: Model Type  */}
<div className="flex flex-col space-y-space-xs">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Classifier Architecture</span>
<div className="pt-space-xs">
<span className="font-headline-lg text-headline-lg text-on-surface leading-tight block">
            Ensemble LightGBM + Geo-Prior
          </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs leading-relaxed">
          Physics-Guided Empirical GSI-ID Rule Engine
        </p>
</div>
</div>
{/*  Visualizations: 2 Calm, Spacious Instrument Decks  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl pt-space-3xl pb-space-2xl">
{/*  Chart 1: Feature Importance (Horizontal Bar Chart)  */}
<div className="lg:col-span-7 flex flex-col bg-surface-container-low/60 p-panel-padding rounded-xl shadow-lg">
<div className="flex items-start justify-between pb-space-xl">
<div className="space-y-space-xs">
<span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">Global Explainability (XAI)</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Mean Absolute SHAP Contributions</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Top geotechnical drivers governing localized mass-wasting probability</p>
</div>
<span className="material-symbols-outlined text-outline-variant text-[22px]">bar_chart</span>
</div>
<div className="space-y-space-lg flex-1 flex flex-col justify-around py-space-sm">
{/*  Feature 1  */}
<div className="group cursor-default">
<div className="flex justify-between items-baseline pb-1">
<span className="font-body-sm text-body-sm text-on-surface font-semibold">24h Cumulative Precipitation</span>
<span className="font-telemetry-unit text-telemetry-unit text-primary">0.34 SHAP</span>
</div>
<div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full transition-all duration-700 ease-out" style={{ 'width': '100%' }}></div>
</div>
</div>
{/*  Feature 2  */}
<div className="group cursor-default">
<div className="flex justify-between items-baseline pb-1">
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Slope Angle in Degrees</span>
<span className="font-telemetry-unit text-telemetry-unit text-primary-fixed-dim">0.26 SHAP</span>
</div>
<div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden">
<div className="bg-primary/80 h-full rounded-full transition-all duration-700 ease-out" style={{ 'width': '76.4%' }}></div>
</div>
</div>
{/*  Feature 3  */}
<div className="group cursor-default">
<div className="flex justify-between items-baseline pb-1">
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Distance to Fault / Thrust MCT</span>
<span className="font-telemetry-unit text-telemetry-unit text-secondary-fixed-dim">0.16 SHAP</span>
</div>
<div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden">
<div className="bg-secondary-fixed-dim h-full rounded-full transition-all duration-700 ease-out" style={{ 'width': '47.0%' }}></div>
</div>
</div>
{/*  Feature 4  */}
<div className="group cursor-default">
<div className="flex justify-between items-baseline pb-1">
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Soil / Colluvium Shear Profile</span>
<span className="font-telemetry-unit text-telemetry-unit text-secondary">0.13 SHAP</span>
</div>
<div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden">
<div className="bg-secondary/70 h-full rounded-full transition-all duration-700 ease-out" style={{ 'width': '38.2%' }}></div>
</div>
</div>
{/*  Feature 5  */}
<div className="group cursor-default">
<div className="flex justify-between items-baseline pb-1">
<span className="font-body-sm text-body-sm text-on-surface font-semibold">48h Weather Forecast (Open-Meteo)</span>
<span className="font-telemetry-unit text-telemetry-unit text-outline">0.07 SHAP</span>
</div>
<div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden">
<div className="bg-outline h-full rounded-full transition-all duration-700 ease-out" style={{ 'width': '20.5%' }}></div>
</div>
</div>
{/*  Feature 6  */}
<div className="group cursor-default">
<div className="flex justify-between items-baseline pb-1">
<span className="font-body-sm text-body-sm text-on-surface font-semibold">Distance to River Drainage</span>
<span className="font-telemetry-unit text-telemetry-unit text-outline">0.04 SHAP</span>
</div>
<div className="w-full bg-surface-container-highest/50 h-2.5 rounded-full overflow-hidden">
<div className="bg-outline-variant h-full rounded-full transition-all duration-700 ease-out" style={{ 'width': '11.7%' }}></div>
</div>
</div>
</div>
<div className="pt-space-lg flex items-center justify-between font-label-caps text-label-caps text-outline">
<span>NORMALIZED IMPACT SUM: 1.00</span>
<span>ESTIMATED ON 14,290 HISTORICAL EVENTS</span>
</div>
</div>
{/*  Chart 2: Calibration Curve / Reliability Diagram  */}
<div className="lg:col-span-5 flex flex-col bg-surface-container-low/60 p-panel-padding rounded-xl shadow-lg">
<div className="flex items-start justify-between pb-space-lg">
<div className="space-y-space-xs">
<span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Reliability Diagram</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Probability Calibration</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Predicted probability vs observed empirical slide frequency</p>
</div>
<span className="material-symbols-outlined text-outline-variant text-[22px]">show_chart</span>
</div>
{/*  Inline SVG Calibration Chart  */}
<div className="relative w-full aspect-square flex items-center justify-center py-space-sm">
<svg className="w-full h-full" fill="none" viewbox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
{/*  Grid Lines  */}
<line className="text-surface-container-highest" stroke="currentColor" strokeWidth="1" x1="40" x2="280" y1="280" y2="280"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="40" x2="280" y1="220" y2="220"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="40" x2="280" y1="160" y2="160"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="40" x2="280" y1="100" y2="100"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="40" x2="280" y1="40" y2="40"></line>
<line className="text-surface-container-highest" stroke="currentColor" strokeWidth="1" x1="40" x2="40" y1="280" y2="40"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="100" x2="100" y1="280" y2="40"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="160" x2="160" y1="280" y2="40"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="220" x2="220" y1="280" y2="40"></line>
<line className="text-surface-container-highest/40" stroke="currentColor" stroke-dasharray="3 3" strokeWidth="1" x1="280" x2="280" y1="280" y2="40"></line>
{/*  Perfectly Calibrated Reference Line (Diagonal)  */}
<line className="text-outline-variant" stroke="currentColor" stroke-dasharray="4 4" strokeWidth="1.5" x1="40" x2="280" y1="280" y2="40"></line>
{/*  Operating Threshold Guide at 0.470 (x ≈ 152.8)  */}
<line className="text-secondary/40" stroke="currentColor" stroke-dasharray="2 2" strokeWidth="1" x1="152.8" x2="152.8" y1="280" y2="40"></line>
{/*  Calibration Curve Area  */}
<path className="text-primary/5" d="M 40 280 L 68 258 L 102 222 L 152.8 167 L 208 112 L 246 72 L 280 43 L 280 280 Z" fill="currentColor"></path>
{/*  Empirical Model Curve  */}
<path className="text-primary" d="M 40 280 Q 80 248 102 222 T 152.8 167 T 208 112 T 246 72 T 280 43" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
{/*  Data Observation Knots  */}
<circle className="text-primary" cx="40" cy="280" fill="currentColor" r="3"></circle>
<circle className="text-primary" cx="68" cy="258" fill="currentColor" r="3.5"></circle>
<circle className="text-primary" cx="102" cy="222" fill="currentColor" r="3.5"></circle>
<circle className="text-secondary" cx="152.8" cy="167" fill="currentColor" r="5"></circle>
<circle className="text-secondary/40" cx="152.8" cy="167" r="9" stroke="currentColor" strokeWidth="1.5"></circle>
<circle className="text-primary" cx="208" cy="112" fill="currentColor" r="3.5"></circle>
<circle className="text-primary" cx="246" cy="72" fill="currentColor" r="3.5"></circle>
<circle className="text-primary" cx="280" cy="43" fill="currentColor" r="3.5"></circle>
{/*  Axis Ticks & Numerical Labels  */}
<text className="text-outline font-telemetry-unit" fill="currentColor" font-size="9" text-anchor="middle" x="35" y="295">0.0</text>
<text className="text-secondary font-telemetry-unit font-semibold" fill="currentColor" font-size="9" text-anchor="middle" x="152.8" y="295">0.470</text>
<text className="text-outline font-telemetry-unit" fill="currentColor" font-size="9" text-anchor="middle" x="280" y="295">1.0</text>
<text className="text-outline font-telemetry-unit" fill="currentColor" font-size="9" text-anchor="end" x="30" y="283">0.0</text>
<text className="text-secondary font-telemetry-unit" fill="currentColor" font-size="9" text-anchor="end" x="30" y="167">0.47</text>
<text className="text-outline font-telemetry-unit" fill="currentColor" font-size="9" text-anchor="end" x="30" y="44">1.0</text>
</svg>
</div>
<div className="pt-space-md space-y-space-xs">
<div className="flex items-center justify-between text-telemetry-unit font-telemetry-unit">
<span className="flex items-center gap-space-xs text-on-surface">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
              Threshold Calibration Pivot
            </span>
<span className="text-primary">Brier Score: 0.082</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Near-diagonal alignment across the 0.40–0.55 risk zone guarantees operational alert parity with actual slope-shear incidents.
          </p>
</div>
</div>
</div>
{/*  Geotechnical Field Validation Context Panel  */}
<div className="pt-space-xl pb-space-2xl">
<div className="bg-surface-container-low/40 p-panel-padding rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg shadow-sm">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary text-[22px]">terrain</span>
</div>
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider block">Terrain Sensor Mesh Synchrony</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Sub-surface Pore Pressure Piezometers Active in 8 Sectors</span>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0">
<span className="font-telemetry-unit text-telemetry-unit text-on-surface-variant">Last Full Retrain:</span>
<span className="font-telemetry-unit text-telemetry-unit text-on-surface font-semibold bg-surface-container px-2 py-1 rounded">2025-05-18 00:00 UTC</span>
</div>
</div>
</div>
          </section>
        </div>
      </main>
      <footer className="w-full mt-auto py-4 px-6 border-t border-white/[0.08] bg-surface-container-lowest/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-gray-400 uppercase">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-semibold">BHURAKSHAK GEOLOGICAL HAZARD OBSERVATORY</span>
            <span className="text-gray-600">·</span>
            <span>NORTH EAST AUTONOMOUS MESH V3.8</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-semibold tracking-wider">AUTONOMOUS SURVEILLANCE ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

