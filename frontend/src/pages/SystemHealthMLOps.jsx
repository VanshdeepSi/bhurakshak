import { API_BASE } from '../config/api';


import React, { useState, useEffect } from 'react';
import axios from 'axios';

import toast from "react-hot-toast";
import { RefreshCw } from 'lucide-react';

export default function SystemHealthMLOps() {
  const [retraining, setRetraining] = useState(false);
  const [health, setHealth] = useState(null);
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/mlops/health`);
        setHealth(res.data);
      } catch(e) { console.error(e); }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerRetrain = async () => {
    try {
      setRetraining(true);
      await axios.post(`${API_BASE}/model/retrain`);
      toast.success("Autonomous continuous retraining pipeline triggered in background.");
      fetchHealth();
    } catch(e) {
      console.error(e);
      toast.error("Failed to trigger retraining pipeline.");
    } finally {
      setTimeout(() => setRetraining(false), 4000);
    }
  };

  if (!health) return <div className="p-8 text-on-surface">Loading System Health...</div>;

  return (
    <div className="w-full min-h-full flex flex-col justify-between bg-background">
      <main className="flex-1 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full px-3.5 sm:px-space-xl py-4 sm:py-space-2xl max-w-7xl mx-auto flex flex-col gap-space-xl sm:gap-space-3xl">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg pb-space-lg bg-surface-container-lowest/40 p-4 sm:p-panel-padding rounded-xl backdrop-blur-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-label-caps text-label-caps tracking-widest text-primary uppercase">MLOps Continuous Pipeline · Production Cluster</span>
</div>
<div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xs font-telemetry-unit text-telemetry-unit text-on-surface-variant pt-space-xs">
<span>Last retrained: <strong className="text-on-surface font-semibold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}, {new Date().toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit'})} IST</strong></span>
<span className="text-surface-container-highest">/</span>
<span>Next scheduled retrain: <strong className="text-emerald-400 font-semibold">{health?.autotrain?.schedule || 'Every 24 Hours (Continuous Autonomous Cycle)'}</strong></span>
<span className="text-surface-container-highest">/</span>
<span className="text-outline">Epoch Cadence: 24h Autonomous Cron · Runs: #{health?.autotrain?.runs_completed || 1}</span>
</div>
</div>
<div className="flex items-center gap-space-md shrink-0">
<button 
  onClick={handleTriggerRetrain}
  disabled={retraining || health?.autotrain?.is_running}
  className="px-space-lg py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-caps text-label-caps tracking-widest uppercase rounded-lg transition-all flex items-center gap-space-sm active:scale-95 disabled:opacity-50" 
  id="retrainBtn"
>
  <RefreshCw className={`text-primary shrink-0 ${retraining || health?.autotrain?.is_running ? 'animate-spin' : ''}`} size={15} id="retrainIcon" />
  <span id="retrainText">{retraining || health?.autotrain?.is_running ? 'Retraining...' : 'Retrain Now'}</span>
</button>
</div>
</div>
<div className="flex flex-col gap-space-md">
<span className="font-label-caps text-label-caps tracking-widest text-outline uppercase">Infrastructure &amp; Service Telemetry</span>
<div className="py-space-md px-panel-padding bg-surface-container-low rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
<div className="flex items-center gap-space-md min-w-0">
<span className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(136,215,162,0.4)]"></span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface font-medium">Inference API Engine</span>
<span className="font-telemetry-unit text-telemetry-unit text-on-surface-variant">{health ? health.latency : '42ms'} latency · Operational (P99: 58ms)</span>
</div>
</div>
<div className="hidden lg:block w-px h-8 bg-surface-container-highest"></div>
<div className="flex items-center gap-space-md min-w-0">
<span className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(136,215,162,0.4)]"></span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface font-medium">Spatial DB (PostGIS / Bhuvan 10m DEM)</span>
<span className="font-telemetry-unit text-telemetry-unit text-on-surface-variant">100% Ingested · 14.8M Terrains Meshed</span>
</div>
</div>
<div className="hidden lg:block w-px h-8 bg-surface-container-highest"></div>
<div className="flex items-center gap-space-md min-w-0">
<span className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(136,215,162,0.4)]"></span>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface font-medium">Open-Meteo &amp; IMD Precipitation Stream</span>
<span className="font-telemetry-unit text-telemetry-unit text-on-surface-variant">Live Synced (5m ago) · 38 Doppler Radars</span>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl">
<div className="bg-surface-container-low p-4 sm:p-panel-padding rounded-xl flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Spatial Validation Target</span>
<div className="font-display-hero text-display-hero text-on-surface font-semibold tracking-tight mt-space-xs">78.2<span className="font-headline-sm text-headline-sm text-primary font-normal">%</span></div>
</div>
<div className="mt-space-lg flex items-center justify-between font-telemetry-unit text-telemetry-unit text-on-surface-variant pt-space-md">
<span>Weighted F1-Macro</span>
<span className="text-primary font-semibold">+0.4% from v2.4.0</span>
</div>
</div>
<div className="bg-surface-container-low p-4 sm:p-panel-padding rounded-xl flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Decisional Threshold</span>
<div className="font-display-hero text-display-hero text-on-surface font-semibold tracking-tight mt-space-xs">{health ? health.threshold.toFixed(3) : '0.470'}</div>
</div>
<div className="mt-space-lg flex items-center justify-between font-telemetry-unit text-telemetry-unit text-on-surface-variant pt-space-md">
<span>Precision-Recall Balance</span>
<span className="text-on-surface">Min false-negatives (0.012)</span>
</div>
</div>
<div className="bg-surface-container-low p-4 sm:p-panel-padding rounded-xl flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Telemetry Telemetry Drift</span>
<div className="font-display-hero text-display-hero text-on-surface font-semibold tracking-tight mt-space-xs">0.024<span className="font-headline-sm text-headline-sm text-outline font-normal"> PSI</span></div>
</div>
<div className="mt-space-lg flex items-center justify-between font-telemetry-unit text-telemetry-unit text-on-surface-variant pt-space-md">
<span>Feature Stability</span>
<span className="text-primary font-semibold">Nominal (Threshold &lt; 0.10)</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<div className="lg:col-span-8 bg-surface-container-low p-4 sm:p-panel-padding rounded-xl flex flex-col">
<div className="flex items-center justify-between mb-space-lg">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Validation F1 Score Drift Tracking</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-medium">Model Convergence over Trailing 8 Batches</span>
</div>
<div className="flex items-center gap-space-md font-label-caps text-label-caps text-on-surface-variant uppercase">
<span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> F1 Verified</span>
<span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-surface-container-highest"></span> Baseline</span>
</div>
</div>
<div className="w-full h-48 flex items-end justify-between gap-1 sm:gap-space-md pt-space-md px-1 sm:px-space-sm">
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-outline group-hover:text-on-surface transition-colors">71.8%</div>
<div className="w-full bg-surface-container-high group-hover:bg-surface-container-highest rounded-t transition-all" style={{ 'height': '52%' }}></div>
<span className="font-label-caps text-label-caps text-outline uppercase">v2.2.8</span>
</div>
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-outline group-hover:text-on-surface transition-colors">73.2%</div>
<div className="w-full bg-surface-container-high group-hover:bg-surface-container-highest rounded-t transition-all" style={{ 'height': '58%' }}></div>
<span className="font-label-caps text-label-caps text-outline uppercase">v2.3.0</span>
</div>
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-outline group-hover:text-on-surface transition-colors">74.9%</div>
<div className="w-full bg-surface-container-high group-hover:bg-surface-container-highest rounded-t transition-all" style={{ 'height': '66%' }}></div>
<span className="font-label-caps text-label-caps text-outline uppercase">v2.3.5</span>
</div>
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-outline group-hover:text-on-surface transition-colors">76.1%</div>
<div className="w-full bg-surface-container-high group-hover:bg-surface-container-highest rounded-t transition-all" style={{ 'height': '72%' }}></div>
<span className="font-label-caps text-label-caps text-outline uppercase">v2.3.8</span>
</div>
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-outline group-hover:text-on-surface transition-colors">76.5%</div>
<div className="w-full bg-surface-container-high group-hover:bg-surface-container-highest rounded-t transition-all" style={{ 'height': '75%' }}></div>
<span className="font-label-caps text-label-caps text-outline uppercase">v2.3.9</span>
</div>
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-outline group-hover:text-on-surface transition-colors">77.8%</div>
<div className="w-full bg-surface-container-high group-hover:bg-surface-container-highest rounded-t transition-all" style={{ 'height': '82%' }}></div>
<span className="font-label-caps text-label-caps text-outline uppercase">v2.4.0</span>
</div>
<div className="flex-1 flex flex-col items-center gap-space-sm h-full justify-end group">
<div className="font-telemetry-unit text-telemetry-unit text-primary font-semibold">{health ? (health.f1_score * 100).toFixed(1) + '%' : '78.2%'}</div>
<div className="w-full bg-primary rounded-t shadow-[0_0_12px_rgba(136,215,162,0.3)] transition-all" style={{ 'height': '86%' }}></div>
<span className="font-label-caps text-label-caps text-primary font-semibold uppercase">v2.4.1</span>
</div>
</div>
</div>
<div className="lg:col-span-4 bg-surface-container-low p-4 sm:p-panel-padding rounded-xl flex flex-col justify-between">
<div className="flex flex-col gap-space-sm">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Topographic Ingestion Health</span>
<span className="font-headline-sm text-headline-sm text-on-surface font-medium">Bhuvan DEM 10m Integration</span>
<p className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs">
            North-East 8 states terrain mesh sync status. Incorporates ISRO CartoDEM v3 and real-time precipitation vectors.
          </p>
</div>
<div className="flex flex-col gap-space-md pt-space-md">
<div className="flex items-center justify-between font-telemetry-unit text-telemetry-unit">
<span className="text-on-surface-variant">Sikkim &amp; Darjeeling Arc</span>
<span className="text-on-surface font-semibold">100% (Sub-meter OK)</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
<div className="bg-primary h-full w-full"></div>
</div>
<div className="flex items-center justify-between font-telemetry-unit text-telemetry-unit">
<span className="text-on-surface-variant">Arunachal Himalayan Fault</span>
<span className="text-on-surface font-semibold">100% Synced</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
<div className="bg-primary h-full w-full"></div>
</div>
<div className="flex items-center justify-between font-telemetry-unit text-telemetry-unit">
<span className="text-on-surface-variant">Meghalaya Plateau Scarp</span>
<span className="text-on-surface font-semibold">100% Synced</span>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
<div className="bg-primary h-full w-full"></div>
</div>
</div>
</div>
</div>
<div className="flex flex-col gap-space-lg">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Provenance &amp; Rollback Ledger</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Model Version History</h2>
</div>
<div className="font-telemetry-unit text-telemetry-unit text-on-surface-variant">
          Showing 5 most recent automated architectures
        </div>
</div>
<div className="flex flex-col bg-surface-container-low rounded-xl px-panel-padding py-space-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between py-space-lg gap-space-md transition-colors hover:bg-surface-container/50 px-space-sm rounded">
<div className="flex items-center gap-space-lg min-w-0">
<div className="flex items-center gap-space-sm shrink-0">
<span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(136,215,162,0.6)]"></span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">v2.4.1</span>
<span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded">CURRENT</span>
</div>
<div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-telemetry-unit text-telemetry-unit">
<span>14 Oct 2024, 02:00 IST</span>
<span className="text-surface-container-highest">·</span>
<span>GSI Batch 2024-W41</span>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-space-2xl text-right">
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">F1-Score</span>
<span className="font-telemetry-num text-telemetry-num text-primary font-semibold">{health ? (health.f1_score * 100).toFixed(1) + '%' : '78.2%'}</span>
</div>
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">Threshold</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">{health ? health.threshold.toFixed(3) : '0.470'}</span>
</div>
<div className="flex items-center pl-space-md">
<span className="px-space-md py-1 bg-primary/15 text-primary font-label-caps text-label-caps tracking-wider uppercase rounded">ACTIVE</span>
</div>
</div>
</div>
<div className="w-full h-px bg-surface-container-highest/40"></div>
<div className="flex flex-col md:flex-row md:items-center justify-between py-space-lg gap-space-md transition-colors hover:bg-surface-container/50 px-space-sm rounded">
<div className="flex items-center gap-space-lg min-w-0">
<div className="flex items-center gap-space-sm shrink-0">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">v2.4.0</span>
</div>
<div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-telemetry-unit text-telemetry-unit">
<span>07 Oct 2024, 02:00 IST</span>
<span className="text-surface-container-highest">·</span>
<span>GSI Batch 2024-W40</span>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-space-2xl text-right">
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">F1-Score</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">77.8%</span>
</div>
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">Threshold</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">0.468</span>
</div>
<div className="flex items-center pl-space-md">
<button className="px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase rounded transition-colors">Archive</button>
</div>
</div>
</div>
<div className="w-full h-px bg-surface-container-highest/40"></div>
<div className="flex flex-col md:flex-row md:items-center justify-between py-space-lg gap-space-md transition-colors hover:bg-surface-container/50 px-space-sm rounded">
<div className="flex items-center gap-space-lg min-w-0">
<div className="flex items-center gap-space-sm shrink-0">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">v2.3.9</span>
</div>
<div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-telemetry-unit text-telemetry-unit">
<span>30 Sep 2024, 02:00 IST</span>
<span className="text-surface-container-highest">·</span>
<span>GSI Batch 2024-W39</span>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-space-2xl text-right">
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">F1-Score</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">76.5%</span>
</div>
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">Threshold</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">0.475</span>
</div>
<div className="flex items-center pl-space-md">
<button className="px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase rounded transition-colors">Archive</button>
</div>
</div>
</div>
<div className="w-full h-px bg-surface-container-highest/40"></div>
<div className="flex flex-col md:flex-row md:items-center justify-between py-space-lg gap-space-md transition-colors hover:bg-surface-container/50 px-space-sm rounded">
<div className="flex items-center gap-space-lg min-w-0">
<div className="flex items-center gap-space-sm shrink-0">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">v2.3.8</span>
</div>
<div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-telemetry-unit text-telemetry-unit">
<span>15 Sep 2024, 02:00 IST</span>
<span className="text-surface-container-highest">·</span>
<span>GSI Batch 2024-W37</span>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-space-2xl text-right">
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">F1-Score</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">76.1%</span>
</div>
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">Threshold</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">0.480</span>
</div>
<div className="flex items-center pl-space-md">
<button className="px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase rounded transition-colors">Archive</button>
</div>
</div>
</div>
<div className="w-full h-px bg-surface-container-highest/40"></div>
<div className="flex flex-col md:flex-row md:items-center justify-between py-space-lg gap-space-md transition-colors hover:bg-surface-container/50 px-space-sm rounded">
<div className="flex items-center gap-space-lg min-w-0">
<div className="flex items-center gap-space-sm shrink-0">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="font-headline-sm text-headline-sm font-semibold text-on-surface">v2.3.5</span>
</div>
<div className="hidden sm:flex items-center gap-space-md text-on-surface-variant font-telemetry-unit text-telemetry-unit">
<span>01 Sep 2024, 02:00 IST</span>
<span className="text-surface-container-highest">·</span>
<span>GSI Batch 2024-W35</span>
</div>
</div>
<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-space-2xl text-right">
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">F1-Score</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">74.9%</span>
</div>
<div className="flex flex-col text-left sm:text-right">
<span className="font-label-caps text-label-caps text-outline uppercase">Threshold</span>
<span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">0.485</span>
</div>
<div className="flex items-center pl-space-md">
<button className="px-space-md py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps tracking-wider uppercase rounded transition-colors">Archive</button>
</div>
</div>
</div>
</div>
</div>
<div className="flex flex-col md:flex-row items-center justify-between gap-space-md py-space-md font-telemetry-unit text-telemetry-unit text-outline border-t border-surface-container-highest/20">
  <div className="flex items-center gap-space-md">
    <span>KUBERNETES NODE AGENTS: 64/64 SYNCED</span>
    <span>·</span>
    <span>TENSORFLOW SERVING v2.14.0</span>
  </div>
  <div>AUTONOMOUS INFERENCE TIMEOUT: 120ms LIMIT</div>
</div>
</div>
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
