import { API_BASE } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import axios from 'axios';
import { Radio, AlertTriangle, Bell, X, CheckCircle2, RefreshCw, Layers, ChevronRight, FilterX, Activity, ShieldAlert } from 'lucide-react';

const JURISDICTIONS = [
  { id: 'ALL', label: 'All NE States' },
  { id: 'Sikkim', label: 'Sikkim' },
  { id: 'Assam', label: 'Assam' },
  { id: 'Arunachal', label: 'Arunachal' },
  { id: 'Meghalaya', label: 'Meghalaya' },
  { id: 'Mizoram', label: 'Mizoram' },
  { id: 'Nagaland', label: 'Nagaland' },
  { id: 'Manipur', label: 'Manipur' },
  { id: 'West Bengal', label: 'West Bengal' },
];

export default function AlertsCenter() {
  const { triggerDirectAlert } = useAlert();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [windowFilter, setWindowFilter] = useState('24h');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dispatchNotice, setDispatchNotice] = useState(null);
  const [currentTime, setCurrentTime] = useState({
    utc: new Date().toUTCString().slice(17, 25),
    ist: new Date().toLocaleTimeString('en-GB')
  });

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/alerts`);
      setAlerts(res.data || []);
      setLoading(false);
    } catch(e) {
      console.error('Failed to fetch alerts:', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime({
        utc: now.toUTCString().slice(17, 25),
        ist: now.toLocaleTimeString('en-GB')
      });
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const getTierColor = (tier) => {
    if (tier === 4) return "#C63D3D";
    if (tier === 3) return "#e07a2c"; // burnt orange
    if (tier === 2) return "#d4a017"; // ochre / yellow watch
    return "#10b981"; // nominal green
  };

  const getTierName = (tier) => {
    if (tier === 4) return "Signal Red (Tier 4)";
    if (tier === 3) return "Burnt Orange (Tier 3)";
    if (tier === 2) return "Ochre Watch (Tier 2)";
    return "Nominal (Tier 1)";
  };

  // Dynamic tallies from alert data
  const activeCritical = alerts.filter(a => a.tier === 4).length;
  const highEscalation = alerts.filter(a => a.tier === 3).length;
  const watchStatus = alerts.filter(a => a.tier === 2).length;
  const nominalBasin = alerts.filter(a => a.tier === 1).length || Math.max(0, 24 - (activeCritical + highEscalation + watchStatus));

  // Find top critical alert for banner
  const topCriticalAlert = alerts.find(a => a.tier === 4) || (alerts.length > 0 ? alerts[0] : null);

  // Filter alerts by tier and jurisdiction
  const filteredAlerts = alerts.filter(alert => {
    if (tierFilter !== 'ALL') {
      if (alert.tier !== tierFilter) return false;
    }
    if (stateFilter !== 'ALL') {
      const alertState = (alert.state || '').toLowerCase();
      const targetState = stateFilter.toLowerCase();
      if (!alertState.includes(targetState)) return false;
    }
    return true;
  });

    const handleDispatchProtocol = (e, alertItem) => {
    e.stopPropagation();
    const target = alertItem || topCriticalAlert;
    const district = target ? target.district : 'Darjeeling';
    const state = target ? target.state : 'West Bengal';
    const tier = target ? target.tier : 4;
    const probability = target ? target.probability : 0.94;
    
    triggerDirectAlert({
      district,
      state,
      tier,
      probability,
      rainfall_72h: 242.6,
      factor_of_safety: 0.84,
      message: target?.message || `CRITICAL SIGNAL RED: Landslide hazard detected in ${district}!`
    }, true);
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between bg-[#0c120f] text-gray-100">
      {/* Sub Telemetry Header */}
      <div className="w-full bg-[#121815]/90 border-b border-white/[0.08] shadow-sm">
        <div className="min-h-12 py-2 sm:py-0 sm:h-14 w-full px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-inherit">
                <Radio className="text-emerald-400 animate-pulse shrink-0" size={20} />
                <span className="font-headline-sm text-base text-white font-bold tracking-wider uppercase">BHURAKSHAK ALERTS CENTER</span>
              </div>
              <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest pl-[28px]">NE REGION TELEMETRY · LIVE STREAM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono text-xs text-gray-200 tracking-wider uppercase">SENSORS NOMINAL · 4,821 NODES</span>
            </div>

            <div className="hidden md:flex items-center gap-4 font-mono text-xs text-gray-400">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 uppercase">UTC</span>
                <span className="text-gray-200 font-semibold">{currentTime.utc}</span>
              </div>
              <div className="h-6 w-px bg-white/[0.1]"></div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 uppercase">IST</span>
                <span className="text-emerald-400 font-semibold">{currentTime.ist}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <a href="/mlops" title="MLOps Dashboard" className="px-2.5 py-1 text-xs font-mono bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 rounded border border-white/[0.08] transition-colors">
                MLOps
              </a>
              <a href="/" title="Risk GIS Map" className="px-2.5 py-1 text-xs font-mono bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 rounded border border-white/[0.08] transition-colors">
                GIS Map
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full bg-[#0c120f] text-gray-100">
        <div className="flex flex-col w-full">

          {/* Dispatch Notice Toast */}
          {dispatchNotice && (
            <div className="fixed top-20 right-6 z-50 max-w-md bg-emerald-950 border border-emerald-500/50 text-emerald-100 px-4 py-3 rounded-lg shadow-2xl flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />
              <div className="text-xs">
                <p className="font-semibold">{dispatchNotice}</p>
              </div>
              <button onClick={() => setDispatchNotice(null)} className="text-emerald-400 hover:text-white ml-auto">
                <X className="text-emerald-400" size={16} />
              </button>
            </div>
          )}

          {/* Critical Dispatch Alert Banner */}
          {!bannerDismissed && topCriticalAlert && (
            <div className="w-full bg-[#93000a] text-[#ffdad6] border-b border-red-500/30 shadow-xl relative overflow-hidden transition-all duration-300">
              <div className="max-w-[1720px] mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 shrink-0 animate-pulse">
                    <AlertTriangle className="text-white" size={18} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 min-w-0">
                    <span className="font-mono text-xs uppercase tracking-widest text-red-200 font-bold shrink-0">
                      CRITICAL DISPATCH NOTICE
                    </span>
                    <span className="hidden sm:inline text-white/40">·</span>
                    <p className="font-sans text-sm font-semibold tracking-tight truncate text-white">
                      ACTIVE TIER {topCriticalAlert.tier} ALERT · {topCriticalAlert.district.toUpperCase()} ({topCriticalAlert.state.toUpperCase()}) — FAILURE PROBABILITY {Math.round(topCriticalAlert.probability * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={(e) => handleDispatchProtocol(e, topCriticalAlert)}
                    className="px-3 py-1.5 bg-white text-[#93000a] hover:bg-red-100 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Bell className="text-red-700" size={15} />
                    Dispatch Protocol
                  </button>
                  <button 
                    onClick={() => setBannerDismissed(true)}
                    className="px-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors" 
                    title="Acknowledge & Dismiss"
                  >
                    <X className="text-white" size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Operational Filter Deck & Global Metrics */}
          <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 pt-4 sm:pt-8 pb-4">
            {/* Context Header & High-Level Telemetry */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div className="flex flex-col gap-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">SUB-SURFACE KINEMATICS &amp; PROBABILISTIC FORECASTING</span>
                  <span className="text-gray-600">/</span>
                  <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase">REGIONAL DISASTER COORDINATION</span>
                </div>
                <h1 className="text-2xl lg:text-3xl text-white font-bold tracking-tight mt-1">
                  Northeast Regional Hazard Stream
                </h1>
                <p className="text-sm text-gray-400 max-w-2xl mt-1">
                  Automated multi-spectral telemetry synthesized from 4,821 geotechnical nodes, real-time rainfall thresholds, and acoustic emission shear arrays across seven states.
                </p>
              </div>

              {/* Quick Tally Badges (Responsive 2x2 grid on mobile, 4-inline on sm+) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 bg-white/[0.03] border border-white/[0.06] p-3 sm:px-5 sm:py-3 rounded-xl w-full lg:w-auto">
                <div className="flex flex-col cursor-pointer" onClick={() => setTierFilter(tierFilter === 4 ? 'ALL' : 4)} title="Click to toggle filter">
                  <span className="font-mono text-[10px] text-gray-400 uppercase">Active Critical</span>
                  <span className="font-mono text-xl sm:text-2xl text-[#C63D3D] font-bold">{String(activeCritical).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => setTierFilter(tierFilter === 3 ? 'ALL' : 3)} title="Click to toggle filter">
                  <span className="font-mono text-[10px] text-gray-400 uppercase">High Escalation</span>
                  <span className="font-mono text-xl sm:text-2xl text-[#e07a2c] font-bold">{String(highEscalation).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => setTierFilter(tierFilter === 2 ? 'ALL' : 2)} title="Click to toggle filter">
                  <span className="font-mono text-[10px] text-gray-400 uppercase">Watch Status</span>
                  <span className="font-mono text-xl sm:text-2xl text-[#d4a017] font-bold">{String(watchStatus).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => setTierFilter(tierFilter === 1 ? 'ALL' : 1)} title="Click to toggle filter">
                  <span className="font-mono text-[10px] text-gray-400 uppercase">Nominal Basin</span>
                  <span className="font-mono text-xl sm:text-2xl text-emerald-400 font-bold">{String(nominalBasin).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col gap-4 pt-4">
              {/* Tier Filter Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <span className="font-mono text-gray-400 uppercase tracking-wider w-28">Severity Tier:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button 
                    onClick={() => setTierFilter('ALL')}
                    className={`px-3 py-1 rounded-lg font-mono text-xs tracking-wider transition-all ${
                      tierFilter === 'ALL'
                        ? 'bg-white/20 text-white font-bold ring-1 ring-white/30 shadow-sm'
                        : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    ALL TIERS ({alerts.length})
                  </button>

                  <button 
                    onClick={() => setTierFilter(tierFilter === 4 ? 'ALL' : 4)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                      tierFilter === 4
                        ? 'bg-[#C63D3D]/30 text-red-200 font-bold ring-1 ring-[#C63D3D] shadow-sm'
                        : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C63D3D]"></span>
                    CRITICAL / RED ({activeCritical})
                  </button>

                  <button 
                    onClick={() => setTierFilter(tierFilter === 3 ? 'ALL' : 3)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                      tierFilter === 3
                        ? 'bg-[#e07a2c]/30 text-orange-200 font-bold ring-1 ring-[#e07a2c] shadow-sm'
                        : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#e07a2c]"></span>
                    WARNING / BURNT ORANGE ({highEscalation})
                  </button>

                  <button 
                    onClick={() => setTierFilter(tierFilter === 2 ? 'ALL' : 2)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                      tierFilter === 2
                        ? 'bg-[#d4a017]/30 text-yellow-200 font-bold ring-1 ring-[#d4a017] shadow-sm'
                        : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#d4a017]"></span>
                    WATCH / OCHRE ({watchStatus})
                  </button>

                  <button 
                    onClick={() => setTierFilter(tierFilter === 1 ? 'ALL' : 1)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                      tierFilter === 1
                        ? 'bg-emerald-700/30 text-emerald-200 font-bold ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    NOMINAL / GREEN ({nominalBasin})
                  </button>
                </div>
              </div>

              {/* State & Temporal Row */}
              <div className="flex flex-wrap items-center justify-between gap-y-3 border-t border-white/[0.04] pt-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-mono text-gray-400 uppercase tracking-wider w-28">Jurisdiction:</span>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    {JURISDICTIONS.map((j, idx) => {
                      const isActive = stateFilter === j.id;
                      return (
                        <React.Fragment key={j.id}>
                          {idx > 0 && <span className="text-gray-700">/</span>}
                          <button
                            onClick={() => setStateFilter(j.id)}
                            className={`px-2 py-0.5 uppercase tracking-wider rounded transition-colors ${
                              isActive
                                ? 'text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-400 bg-emerald-950/40'
                                : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.05]'
                            }`}
                          >
                            {j.label}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Temporal Window Selection */}
                <div className="flex items-center gap-2 font-mono text-xs uppercase">
                  <span className="text-gray-500 mr-1">Window:</span>
                  <button 
                    onClick={() => setWindowFilter('24h')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      windowFilter === '24h' 
                        ? 'bg-white/20 text-white font-bold' 
                        : 'bg-white/[0.04] text-gray-400 hover:text-white'
                    }`}
                  >
                    Last 24h
                  </button>
                  <button 
                    onClick={() => setWindowFilter('48h')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      windowFilter === '48h' 
                        ? 'bg-white/20 text-white font-bold' 
                        : 'bg-white/[0.04] text-gray-400 hover:text-white'
                    }`}
                  >
                    48h Forecast
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Alerts Stream */}
          <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 pb-16 flex-1">
            {/* Stream Column Meta Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 font-mono text-xs text-gray-400 uppercase tracking-wider border-b border-white/[0.08] select-none">
              <div className="col-span-12 md:col-span-4 lg:col-span-4">Hazard Zone / Sector</div>
              <div className="col-span-4 md:col-span-2 lg:col-span-2">Alert Level</div>
              <div className="col-span-4 md:col-span-2 lg:col-span-2 text-right md:text-left">Failure Probability</div>
              <div className="hidden lg:block lg:col-span-2">Telemetry Status</div>
              <div className="col-span-4 md:col-span-2 lg:col-span-2 text-right">Issuance Timestamp</div>
            </div>

            {/* Alert Items List */}
            <div className="flex flex-col divide-y divide-white/[0.06]" id="alerts-container">
              {loading ? (
                <div className="py-12 text-center text-gray-400 font-mono text-sm flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin text-emerald-400" size={18} />
                  Synthesizing telemetry and active alerts...
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="py-16 text-center text-gray-400 font-mono text-sm bg-white/[0.01] rounded-lg mt-2 border border-white/[0.04]">
                  <FilterX className="text-gray-500 mx-auto mb-2" size={32} />
                  <p className="font-semibold text-gray-300">No alerts match the selected criteria.</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Try changing your Severity Tier ({tierFilter}) or Jurisdiction filter ({stateFilter}).
                  </p>
                  <button
                    onClick={() => { setTierFilter('ALL'); setStateFilter('ALL'); }}
                    className="mt-4 px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs uppercase font-mono tracking-wider transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredAlerts.map(alert => (
                  <div 
                    key={alert.id} 
                    onClick={() => setSelectedAlert(alert)}
                    className="group py-4 hover:bg-white/[0.03] transition-colors rounded-lg px-2 cursor-pointer border-l-4"
                    style={{ borderLeftColor: getTierColor(alert.tier) }}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-base text-white font-bold group-hover:text-emerald-400 transition-colors truncate">
                            {alert.district}, {alert.state}
                          </span>
                          {alert.tier === 4 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] tracking-widest uppercase bg-[#C63D3D]/30 text-red-300 font-bold border border-[#C63D3D]/60 animate-pulse">
                              EVAC REQ
                            </span>
                          )}
                          {alert.tier === 3 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] tracking-widest uppercase bg-orange-900/30 text-orange-300 font-semibold border border-orange-500/40">
                              HIGH RISK
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 truncate mt-1">
                          {alert.message}
                        </span>
                      </div>

                      <div className="col-span-4 md:col-span-2 lg:col-span-2 flex items-center gap-2">
                        <div className="relative flex h-2.5 w-2.5">
                          {alert.tier === 4 && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C63D3D] opacity-75"></span>
                          )}
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{backgroundColor: getTierColor(alert.tier)}}></span>
                        </div>
                        <span className="font-mono text-xs uppercase tracking-wider font-semibold" style={{color: getTierColor(alert.tier)}}>
                          {getTierName(alert.tier)}
                        </span>
                      </div>

                      <div className="col-span-4 md:col-span-2 lg:col-span-2 flex flex-col md:items-start text-right md:text-left">
                        <div className="flex items-baseline gap-1">
                          <span className="font-mono text-base text-white font-bold">{Math.round(alert.probability * 100)}%</span>
                          <span className="font-mono text-[10px] text-gray-500">P(F)</span>
                        </div>
                        <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1 hidden md:block">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(alert.probability * 100)}%`, backgroundColor: getTierColor(alert.tier) }}></div>
                        </div>
                      </div>

                      <div className="hidden lg:flex lg:col-span-2 items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{color: getTierColor(alert.tier)}}>
                          {alert.tier >= 3 ? <AlertTriangle size={15} className="shrink-0" /> : <Activity size={15} className="shrink-0" />}
                          <span>{alert.tier >= 3 ? 'Active Threat' : 'Monitoring'}</span>
                        </div>
                      </div>

                      <div className="col-span-4 md:col-span-2 lg:col-span-2 flex items-center justify-end gap-3">
                        <div className="flex flex-col text-right">
                          <span className="font-mono text-xs text-gray-200 font-semibold">Live Stream</span>
                          <span className="font-mono text-[10px] text-gray-500 uppercase">
                            {alert.issued_at ? new Date(alert.issued_at).toLocaleTimeString() : 'Recent'}
                          </span>
                        </div>
                        <ChevronRight className="text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1 shrink-0" size={18} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Alert Inspection Modal Drawer */}
            {selectedAlert && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
                <div className="bg-[#141c18] border border-white/20 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col p-4 sm:p-6 shadow-2xl animate-scale-up overflow-hidden">
                  <div className="flex items-start justify-between pb-4 border-b border-white/10">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getTierColor(selectedAlert.tier) }}></span>
                        <h3 className="text-xl font-bold text-white">
                          {selectedAlert.district}, {selectedAlert.state}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-gray-400 mt-1 uppercase">
                        {getTierName(selectedAlert.tier)} · ID: #{selectedAlert.id}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedAlert(null)}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
                    >
                      <X className="text-gray-400 hover:text-white" size={20} />
                    </button>
                  </div>

                  <div className="py-4 space-y-4 overflow-y-auto flex-1">
                    <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Automated Advisory Message</span>
                      <p className="text-sm text-gray-200 font-medium mt-1">{selectedAlert.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                        <span className="text-gray-400 block text-[10px] uppercase">Failure Probability P(F)</span>
                        <span className="text-lg font-bold text-white mt-1 block">
                          {(selectedAlert.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                        <span className="text-gray-400 block text-[10px] uppercase">Telemetry Timestamp</span>
                        <span className="text-sm font-semibold text-gray-200 mt-1 block">
                          {new Date(selectedAlert.issued_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] space-y-2">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">Recommended SOP Actions</span>
                      <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4">
                        {selectedAlert.tier === 4 && (
                          <>
                            <li className="text-red-300 font-semibold">Initiate Stage-3 community evacuation for vulnerable slope bases.</li>
                            <li>Divert NH transit through bypass corridors; notify Border Roads Organisation (BRO).</li>
                            <li>Alert local SDRF battalion and District Disaster Management Authority (DDMA).</li>
                          </>
                        )}
                        {selectedAlert.tier === 3 && (
                          <>
                            <li className="text-orange-300 font-semibold">Issue pre-warning alert to sub-divisional magistrates and road stations.</li>
                            <li>Increase acoustic strain array polling frequency to 15-second cycles.</li>
                            <li>Inspect culvert blockages and surface runoff discharge channels.</li>
                          </>
                        )}
                        {selectedAlert.tier <= 2 && (
                          <>
                            <li>Maintain standard sensor surveillance; autonomous node mesh nominal.</li>
                            <li>Log precipitation thresholds against antecedent rainfall index (ARI).</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg font-mono text-xs uppercase"
                    >
                      Close
                    </button>
                    <button
                      onClick={(e) => {
                        handleDispatchProtocol(e, selectedAlert);
                        setSelectedAlert(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow-lg"
                    >
                      <Bell className="text-red-700" size={15} />
                      Issue Protocol Notice
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* System Telemetry Verification Strip */}
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 font-mono text-xs uppercase">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={16} />
                  INCLINOMETER DATA SYNCED VIA GSAT-11
                </span>
                <span className="text-gray-700">/</span>
                <span>LATENCY: 420MS</span>
              </div>
              <div>
                <span>REFRESH RATE: AUTONOMOUS 8S STREAM ({filteredAlerts.length} OF {alerts.length} ALERTS)</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-auto bg-[#080d0a] border-t border-white/[0.08] py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-gray-400 uppercase">
          <div className="flex items-center gap-4">
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
