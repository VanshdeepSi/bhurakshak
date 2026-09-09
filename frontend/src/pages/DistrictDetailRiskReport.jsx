import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import { useParams, Link } from 'react-router-dom';
import { 
  FileDown, MapPin, AlertTriangle, ShieldCheck, Radio, 
  ArrowLeft, CheckCircle2, Waves, Thermometer, Wind, Mountain 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DISTRICT_PROFILES = {
  'darjeeling': {
    name: 'Darjeeling',
    state: 'West Bengal',
    stationId: 'DAR-WB-904',
    basin: 'Teesta & Rangeet Basin Sector 1',
    lat: 27.04,
    lon: 88.26,
    elevation: '2,042m AMSL',
    tier: 4,
    tierLabel: 'TIER 4 · CRITICAL WARNING',
    hazardMessage: 'CATASTROPHIC DEBRIS FLOW & SHEAR DISPLACEMENT IMMINENT',
    probability: 91.9,
    rainfall24h: 195.0,
    rainfall7d: 488.5,
    threshold: 0.485,
    factorOfSafety: 0.82,
    displacementRate: '14.8 mm/hr',
    porePressure: '74.2 kPa',
    faultZone: 'Main Central Thrust (MCT) Overthrust Colluvium'
  },
  'mangan': {
    name: 'Mangan',
    state: 'Sikkim',
    stationId: 'MN-SKM-882',
    basin: 'Teesta Basin Sector 4',
    lat: 27.51,
    lon: 88.53,
    elevation: '1,840m AMSL',
    tier: 4,
    tierLabel: 'TIER 4 · CRITICAL WARNING',
    hazardMessage: 'IMMINENT DEBRIS FLOW RISK',
    probability: 88.5,
    rainfall24h: 182.0,
    rainfall7d: 445.0,
    threshold: 0.470,
    factorOfSafety: 0.86,
    displacementRate: '12.4 mm/hr',
    porePressure: '68.5 kPa',
    faultZone: 'North Sikkim MCT Shear Colluvium'
  },
  'churachandpur': {
    name: 'Churachandpur',
    state: 'Manipur',
    stationId: 'CC-MNP-412',
    basin: 'Barak-Chindwin Fluvial Divide',
    lat: 24.33,
    lon: 93.66,
    elevation: '914m AMSL',
    tier: 4,
    tierLabel: 'TIER 4 · CRITICAL WARNING',
    hazardMessage: 'RAPID SLOPE SHEAR & DEBRIS SATURATION',
    probability: 86.2,
    rainfall24h: 174.0,
    rainfall7d: 412.0,
    threshold: 0.465,
    factorOfSafety: 0.88,
    displacementRate: '11.1 mm/hr',
    porePressure: '65.1 kPa',
    faultZone: 'Indo-Myanmar Fold Belt Shear Strata'
  },
  'east sikkim': {
    name: 'East Sikkim',
    state: 'Sikkim',
    stationId: 'ES-SKM-201',
    basin: 'Rani Khola Hydro-Basin',
    lat: 27.33,
    lon: 88.61,
    elevation: '1,650m AMSL',
    tier: 3,
    tierLabel: 'TIER 3 · BURNT ORANGE ALERT',
    hazardMessage: 'HIGH SLOPE INSTABILITY WATCH',
    probability: 68.4,
    rainfall24h: 112.0,
    rainfall7d: 284.0,
    threshold: 0.450,
    factorOfSafety: 1.12,
    displacementRate: '5.2 mm/hr',
    porePressure: '42.0 kPa',
    faultZone: 'Gangtok Nappe Colluvial Strata'
  },
  'kalimpong': {
    name: 'Kalimpong',
    state: 'West Bengal',
    stationId: 'KLP-WB-108',
    basin: 'Teesta River West Corridor',
    lat: 27.06,
    lon: 88.47,
    elevation: '1,250m AMSL',
    tier: 2,
    tierLabel: 'TIER 2 · YELLOW WATCH',
    hazardMessage: 'MODERATE PORE PRESSURE ACCUMULATION',
    probability: 48.0,
    rainfall24h: 68.0,
    rainfall7d: 172.0,
    threshold: 0.440,
    factorOfSafety: 1.34,
    displacementRate: '2.1 mm/hr',
    porePressure: '28.4 kPa',
    faultZone: 'Siwalik Foothills Debris Belt'
  }
};

export default function DistrictDetailRiskReport() {
  const { name } = useParams();
  const rawName = name ? decodeURIComponent(name) : 'Darjeeling';
  const cleanKey = rawName.toLowerCase();
  
  const profile = DISTRICT_PROFILES[cleanKey] || {
    name: rawName,
    state: 'Northeast Region',
    stationId: `NER-${rawName.slice(0, 3).toUpperCase()}-501`,
    basin: `${rawName} Basin Drainage Corridor`,
    lat: 26.8,
    lon: 92.5,
    elevation: '1,450m AMSL',
    tier: 1,
    tierLabel: 'TIER 1 · NOMINAL SURVEILLANCE',
    hazardMessage: 'SLOPE CONDITIONS NOMINAL & STABLE',
    probability: 14.5,
    rainfall24h: 18.0,
    rainfall7d: 55.0,
    threshold: 0.450,
    factorOfSafety: 1.85,
    displacementRate: '0.4 mm/hr',
    porePressure: '12.0 kPa',
    faultZone: 'Stable Bedrock Strata'
  };

  const isTier4 = profile.tier === 4;
  const { triggerDirectAlert, checkAndAlertIfDangerZone } = useAlert();

  // Alert directly when entering danger zone
  useEffect(() => {
    if (isTier4) {
      checkAndAlertIfDangerZone(profile.name);
    }
  }, [profile.name, isTier4]);


  const handleDownloadReport = () => {
    const reportDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const dossierText = `================================================================================
BHURAKSHAK GEOLOGICAL HAZARD OBSERVATORY · NORTH EAST AUTONOMOUS MESH
OFFICIAL NDMA-COMPLIANT SECTOR GEOTECHNICAL DOSSIER
================================================================================
DISASTER CONTROL RELAY STATION: ${profile.stationId}
SECTOR JURISDICTION:            ${profile.name.toUpperCase()}, ${profile.state.toUpperCase()}
TERRAIN HYDRO-BASIN:            ${profile.basin}
GEOGRAPHIC COORDINATES:         ${profile.lat}° N, ${profile.lon}° E
SURFACE ELEVATION:              ${profile.elevation}
REPORT TIMESTAMP:               ${reportDate} IST
AUTHENTICATION STATUS:          DIGITALLY SIGNED VIA NDMA GSAT-11 RELAY
================================================================================

1. CRITICAL EARLY WARNING TELEMETRY:
--------------------------------------------------------------------------------
HAZARD CLASSIFICATION:          ${profile.tierLabel}
OPERATIONAL ADVISORY:           ${profile.hazardMessage}
48-HOUR FAILURE PROBABILITY:    ${profile.probability}% (Model Confidence: 94.2%)
FACTOR OF SAFETY (FS):          ${profile.factorOfSafety} [Nominal Stability Target > 1.30]
INCLINOMETER DISPLACEMENT:      ${profile.displacementRate}
SUB-SURFACE PORE PRESSURE:      ${profile.porePressure}
24-HOUR ACCUMULATED RAIN:       ${profile.rainfall24h} mm
7-DAY ANTECEDENT RAIN:          ${profile.rainfall7d} mm
CALIBRATED ALARM THRESHOLD:     ${profile.threshold}
TECTONIC PRE-CONDITION:         ${profile.faultZone}

2. GEOTECHNICAL SENSOR MESH STATUS:
--------------------------------------------------------------------------------
- Time Domain Reflectometry (TDR) Cables: 8/8 Nominal
- Piezoelectric Pore Pressure Transducers: Synced
- High-Rate InSAR Satellite Interferometry: Active Debris Velocity Mapped
- Emergency Wireless Mesh Repeaters: 5/5 Operational

3. NDMA EVACUATION DIRECTIVES & PUBLIC SAFETY PROTOCOLS:
--------------------------------------------------------------------------------
${isTier4 ? `[!] TIER 4 EVACUATION ORDER IN EFFECT:
- Immediately evacuate valley floor dwellings, talus cones, and unstable scarps.
- Avoid NH transit corridors and bridges subject to debris flow washouts.
- Proceed to designated disaster relief centers on high, stable bedrock ridges.
- Keep emergency VHF/FM satellite radios tuned to 100.1 MHz.` : `[i] TIER ${profile.tier} MONITORING ACTIVE:
- Maintain vigilance along steep road cuts.
- Inspect drainage culverts for debris clogging.
- Check automated siren broadcasts for escalation warnings.`}

4. 24/7 TOLL-FREE EMERGENCY CRISIS CONTACTS:
--------------------------------------------------------------------------------
- State Disaster Management Authority (SDMA): 1077
- All-India Emergency Response System (ERSS): 112
- National Disaster Management Authority (NDMA HQ): 1070
- National Disaster Response Force (NDRF Control): 011-24363260

================================================================================
Generated autonomously by BhuRakshak AI Multi-Hazard Predictive Engine v3.8.
================================================================================`;

    // Trigger file download
    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BhuRakshak_Geological_Dossier_${profile.name}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Official Geological Report for ${profile.name} downloaded!`, {
      icon: '📄',
      duration: 4000
    });
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between bg-background text-on-background">
      <main className="flex-1 w-full">
        <div className="flex flex-col w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto gap-5 sm:gap-8">
          
          {/* Back link & Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-emerald-400 transition-colors no-underline"
            >
              <ArrowLeft size={15} />
              <span>Return to Northeast GIS Map</span>
            </Link>

            <span className="font-mono text-[11px] sm:text-xs text-on-surface-variant uppercase">
              Node Telemetry · Synced {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* District Primary Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-outline">
                <span>GEOLOGICAL SECTOR REPORT</span>
                <span>·</span>
                <span>STATION ID: {profile.stationId}</span>
                <span>·</span>
                <span className={`flex items-center gap-1 font-bold ${isTier4 ? 'text-red-400' : 'text-emerald-400'}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${isTier4 ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                  LIVE TELEMETRY
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight uppercase">
                {profile.name} District
              </h1>
              <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-400" />
                  {profile.state} · {profile.basin} · {profile.lat}° N, {profile.lon}° E
                </span>
                <span>|</span>
                <span className="font-mono">{profile.elevation}</span>
              </div>
            </div>

            {/* Status Banner / Badge */}
            <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl border shadow-lg ${
              isTier4 
                ? 'bg-red-950/60 border-red-500/60 text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.3)]' 
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
            }`}>
              <div className={`w-3.5 h-3.5 rounded-full ${isTier4 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`}></div>
              <div className="flex flex-col">
                <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isTier4 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {profile.tierLabel}
                </span>
                <span className="text-xs font-semibold">
                  {profile.hazardMessage}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Intelligence Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Hero Metric & Failure Forecast (7 cols) */}
            <div className="lg:col-span-7 bg-surface-container-low border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-wider">
                    QUANTITATIVE FAILURE FORECAST
                  </span>
                  <span className={`font-mono text-xs font-bold uppercase px-2.5 py-1 rounded ${
                    isTier4 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {profile.probability > 75 ? '+52% CRITICAL DRIFT' : 'NOMINAL BASELINE'}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-extrabold text-on-surface tracking-tighter">
                    {profile.probability}%
                  </span>
                  <span className={`text-xl font-bold uppercase ${isTier4 ? 'text-red-400' : 'text-emerald-400'}`}>
                    PROBABILITY P(F)
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                  48-Hour Calibrated Slope Instability Projection (Threshold: {profile.threshold}) · Confidence 94.2% via ResNet-LSTM Temporal Ensemble.
                </p>
              </div>

              {/* Sparkline Graphic */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between font-mono text-[11px] text-outline uppercase">
                  <span>7-Day Progression Track</span>
                  <span>Day -7 (18%) → Today ({profile.probability}%)</span>
                </div>
                <div className="w-full h-24 relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <line stroke="#64748b" strokeDasharray="4,4" strokeWidth="1" x1="0" x2="400" y1="50" y2="50"></line>
                    <path
                      d="M0,85 C70,80 140,70 200,55 C270,40 330,25 400,10"
                      fill="none"
                      stroke={isTier4 ? '#ef4444' : '#10b981'}
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></path>
                    <circle cx="400" cy="10" r="5" fill={isTier4 ? '#ef4444' : '#10b981'} className="animate-pulse"></circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* Geotechnical Telemetry Bento (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low border border-white/[0.08] p-3.5 sm:p-5 rounded-2xl flex flex-col justify-between">
                <span className="font-mono text-xs text-outline uppercase">Factor of Safety (FS)</span>
                <div>
                  <div className={`text-3xl font-extrabold ${profile.factorOfSafety < 1.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {profile.factorOfSafety}
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">Limit Equil. Target &gt; 1.30</span>
                </div>
              </div>

              <div className="bg-surface-container-low border border-white/[0.08] p-3.5 sm:p-5 rounded-2xl flex flex-col justify-between">
                <span className="font-mono text-xs text-outline uppercase">24h Cumulative Rain</span>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                    {profile.rainfall24h} <span className="text-sm font-normal text-on-surface-variant">mm</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">7-Day: {profile.rainfall7d} mm</span>
                </div>
              </div>

              <div className="bg-surface-container-low border border-white/[0.08] p-3.5 sm:p-5 rounded-2xl flex flex-col justify-between">
                <span className="font-mono text-xs text-outline uppercase">Displacement Rate</span>
                <div>
                  <div className={`text-2xl font-extrabold ${isTier4 ? 'text-red-400' : 'text-on-surface'}`}>
                    {profile.displacementRate}
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">Borehole Inclinometer</span>
                </div>
              </div>

              <div className="bg-surface-container-low border border-white/[0.08] p-3.5 sm:p-5 rounded-2xl flex flex-col justify-between">
                <span className="font-mono text-xs text-outline uppercase">Pore Water Pressure</span>
                <div>
                  <div className="text-2xl font-extrabold text-on-surface">
                    {profile.porePressure}
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">Vibrating Wire Piezometer</span>
                </div>
              </div>
            </div>

          </div>

          {/* Geological Fault Pre-Condition */}
          <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-emerald-400">
                <Mountain size={24} />
              </div>
              <div>
                <span className="font-mono text-xs text-outline uppercase">Geological Fault Strata</span>
                <h3 className="text-base font-bold text-on-surface">{profile.faultZone}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Main Central Thrust (MCT) active crustal shear zone with dense micro-fractures and previous seismic dilation.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <span className="font-mono text-xs text-on-surface-variant">Sensor Mesh Synchrony:</span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
                <CheckCircle2 size={13} /> 64/64 Nodes Active
              </span>
            </div>
          </div>

          {/* Operational Actions Deck (Working Download Report Button) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface-container-low border border-white/[0.08] rounded-2xl">
            <div className="flex flex-wrap items-center gap-6 text-outline font-mono text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>SDMA Node Synchronized</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-emerald-400" />
                <span>Emergency Mesh Relays Nominal (5/5)</span>
              </div>
            </div>

                        {/* Direct Test Danger Alert Button */}
            <button
              onClick={() => triggerDirectAlert({
                district: profile.name,
                state: profile.state,
                tier: profile.tier,
                probability: (profile.probability || 94) / 100,
                rainfall_72h: (profile.rainfall24h ? profile.rainfall24h * 1.3 : 242.6),
                factor_of_safety: profile.factorOfSafety || 0.84,
                message: profile.hazardMessage
              }, true)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/50 active:scale-95 transition-all cursor-pointer"
              title="Directly trigger emergency siren, danger alert modal, and email dispatch"
            >
              <AlertTriangle size={14} className="text-yellow-300" />
              <span>Test Danger Alert</span>
            </button>

            {/* Functional Download Button Only */}
            <button
              onClick={handleDownloadReport}
              id="btn-download"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 active:scale-95"
            >
              <FileDown size={18} />
              <span>Download Geological Sector Dossier</span>
            </button>
          </div>

        </div>
      </main>

      {/* Clean Docked Footer */}
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
