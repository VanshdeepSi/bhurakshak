import React, { useState, useEffect } from 'react';
import { 
  Settings, Moon, Sun, Shield, MapPin, Compass, Bell, Volume2, 
  VolumeX, RefreshCw, Database, Radio, Mail, Key, CheckCircle2, 
  AlertTriangle, Trash2, Download, ExternalLink, Loader2, Send,
  HelpCircle, Server, Check, Lock, ChevronDown, ChevronUp, UserCheck, Flame
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { requestDeviceLocation } from '../utils/geolocation';
import { emergencyAudio } from '../utils/emergencyAudio';
import { API_BASE } from '../config/api';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { triggerDirectAlert } = useAlert();
  
  const [user, setUser] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [autoDetectGps, setAutoDetectGps] = useState(() => {
    return localStorage.getItem('bhurakshak_auto_gps') !== 'false';
  });

  // Citizen Notification Preferences
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [playingTestAudio, setPlayingTestAudio] = useState(false);
  const [sendingTestAdvisory, setSendingTestAdvisory] = useState(false);

  // Collapsed Admin Relay Section (for DEOC operations / advanced server settings)
  const [showAdminRelay, setShowAdminRelay] = useState(false);
  const [resendApiKey, setResendApiKey] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [savingAdminConfig, setSavingAdminConfig] = useState(false);

  // Restore authenticated citizen session
  useEffect(() => {
    const stored = localStorage.getItem('bhurakshak_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    fetchServerRelayStatus();
  }, []);

  const fetchServerRelayStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/settings/smtp`);
      if (res.data) {
        setSmtpConfigured(res.data.configured || false);
        setSmtpHost(res.data.smtp_host || 'smtp.gmail.com');
        setSmtpPort(res.data.smtp_port || 587);
        setSmtpUser(res.data.smtp_user || '');
      }
    } catch (_) {}
  };

  const handleDistrictChange = async (newDistrict) => {
    if (!user) {
      const guest = { email: 'citizen.alert@gmail.com', district: newDistrict, name: 'Resident Citizen' };
      setUser(guest);
      localStorage.setItem('bhurakshak_user', JSON.stringify(guest));
      toast.success(`Monitored sector updated to ${newDistrict}.`);
      return;
    }
    try {
      await axios.post(`${API_BASE}/user/subscription`, {
        email: user.email,
        district: newDistrict,
        notify_email: emailAlertsEnabled ? 1 : 0
      });
      const updated = { ...user, district: newDistrict };
      setUser(updated);
      localStorage.setItem('bhurakshak_user', JSON.stringify(updated));
      toast.success(`Monitored sector updated to ${newDistrict}.`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update monitored sector.');
    }
  };

  const handleGpsDetect = async () => {
    setDetectingGps(true);
    try {
      const loc = await requestDeviceLocation();
      setGpsData(loc);
      toast.success(`GPS locked: ${loc.closestDistrict} (${loc.distanceKm} km away)`);
      handleDistrictChange(loc.closestDistrict);
    } catch (err) {
      toast.error(err.message || 'GPS geofencing unavailable.');
    } finally {
      setDetectingGps(false);
    }
  };

  const handleToggleAutoGps = () => {
    const next = !autoDetectGps;
    setAutoDetectGps(next);
    localStorage.setItem('bhurakshak_auto_gps', String(next));
    toast(next ? 'Live GPS geofencing enabled.' : 'Live GPS geofencing disabled.', { icon: '📍' });
  };

  const handlePlaySampleSiren = () => {
    if (playingTestAudio) {
      emergencyAudio.stop();
      setPlayingTestAudio(false);
    } else {
      emergencyAudio.playSiren(1.8);
      setPlayingTestAudio(true);
      setTimeout(() => setPlayingTestAudio(false), 1900);
    }
  };

  const handleDirectTestAdvisory = async () => {
    const targetEmail = user?.email || 'citizen.alert@gmail.com';
    const targetDistrict = user?.district || 'Darjeeling';
    setSendingTestAdvisory(true);
    try {
      triggerDirectAlert({
        district: targetDistrict,
        email: targetEmail,
        state: 'West Bengal',
        tier: 4,
        probability: 0.94,
        rainfall_72h: 242.6,
        factor_of_safety: 0.84,
        message: 'Manual citizen test alert triggered from Citizen Settings Console.'
      }, true);
    } finally {
      setSendingTestAdvisory(false);
    }
  };

  const handleSaveAdminRelay = async (e) => {
    if (e) e.preventDefault();
    try {
      setSavingAdminConfig(true);
      const payload = {
        smtp_host: smtpHost.trim(),
        smtp_port: parseInt(smtpPort, 10) || 587,
        smtp_user: smtpUser.trim(),
        smtp_password: smtpPass.trim(),
        resend_api_key: resendApiKey.trim()
      };
      const res = await axios.post(`${API_BASE}/settings/smtp`, payload);
      if (res.data.success) {
        toast.success('Server relay configuration updated.');
        setSmtpConfigured(true);
      } else {
        toast.error(res.data.error || 'Failed to save server relay.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update server relay.');
    } finally {
      setSavingAdminConfig(false);
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Local preferences and cached telemetry cleared.');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="w-full min-h-full bg-background text-on-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              <Settings size={22} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-on-surface">Citizen Preferences & Safety Controls</h1>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                Manage personal notification channels, acoustic danger sirens, device GPS, and monitored sectors.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Test Red Alert Trigger */}
        <button
          onClick={handleDirectTestAdvisory}
          disabled={sendingTestAdvisory}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-400/50 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Flame size={15} className="text-yellow-300 animate-bounce" />
          <span>{sendingTestAdvisory ? 'Transmitting...' : 'Send Test Emergency Advisory'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. CITIZEN NOTIFICATION CHANNELS & EMERGENCY PROFILE */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Emergency Notification Channels</h2>
                <p className="text-xs text-on-surface-variant">Automated early warning dispatches for your area</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full font-bold uppercase">
              Cloud Active
            </span>
          </div>

          {/* Citizen Account Details */}
          <div className="bg-black/30 border border-white/[0.08] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <UserCheck size={16} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {user?.name || 'Resident Citizen'}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {user?.email || 'citizen.alert@gmail.com'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified
              </span>
            </div>

            {/* Email Dispatch Toggle */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-white block">Email Evacuation Advisories</span>
                <span className="text-[11px] text-gray-400 block">Deliver official NDMA life-safety warnings to your inbox</span>
              </div>
              <button
                onClick={() => {
                  const next = !emailAlertsEnabled;
                  setEmailAlertsEnabled(next);
                  toast.success(next ? 'Email evacuation advisories enabled.' : 'Email advisories disabled.');
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  emailAlertsEnabled ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Monitored Sector Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
              Monitored Home District (Early Warning Zone)
            </label>
            <select
              value={user?.district || 'Darjeeling'}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:border-emerald-400 font-mono"
            >
              <option value="Darjeeling">Darjeeling (West Bengal) — Tier 4 Signal Red Alert</option>
              <option value="Churachandpur">Churachandpur (Manipur) — Tier 4 Signal Red Alert</option>
              <option value="Mangan">Mangan (Sikkim) — Tier 4 Signal Red Alert</option>
              <option value="East Sikkim">East Sikkim (Sikkim) — Tier 3 Burnt Orange</option>
              <option value="West Tripura">West Tripura (Tripura) — Tier 3 Burnt Orange</option>
              <option value="South Tripura">South Tripura (Tripura) — Tier 3 Burnt Orange</option>
              <option value="Kalimpong">Kalimpong (West Bengal) — Tier 2 Ochre Watch</option>
              <option value="West Kameng">West Kameng (Arunachal Pradesh) — Tier 2 Ochre Watch</option>
              <option value="Lower Dibang Valley">Lower Dibang Valley (Arunachal Pradesh) — Tier 2 Ochre Watch</option>
              <option value="Dima Hasao">Dima Hasao (Assam) — Tier 1 Nominal Safe</option>
              <option value="Kohima">Kohima (Nagaland) — Tier 1 Nominal Safe</option>
            </select>
          </div>

        </div>

        {/* 2. ACOUSTIC SIRENS & AUDIO CONTROLS */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Volume2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Acoustic Siren & Audio Alarms</h2>
                <p className="text-xs text-on-surface-variant">Immediate audible alerts when entering danger zones</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-red-500/15 border border-red-500/30 text-red-400 rounded-full font-bold uppercase">
              Web Audio
            </span>
          </div>

          <div className="bg-black/30 border border-white/[0.08] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">Audible Danger Zone Siren</span>
                <span className="text-[11px] text-gray-400 block">
                  Plays an urgent dual-tone acoustic alarm when viewing or navigating to a Red Alert area
                </span>
              </div>
              <button
                onClick={() => {
                  const next = !soundAlertsEnabled;
                  setSoundAlertsEnabled(next);
                  toast(next ? 'Acoustic siren enabled.' : 'Acoustic siren muted.', { icon: next ? '🔊' : '🔇' });
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  soundAlertsEnabled ? 'bg-red-600' : 'bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Test Sample Siren Button */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Test Hardware Audio Output:</span>
              <button
                onClick={handlePlaySampleSiren}
                className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {playingTestAudio ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                <span>{playingTestAudio ? 'Stop Siren' : 'Play Sample Siren'}</span>
              </button>
            </div>
          </div>

          {/* Life-Safety Emergency Helplines Card */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-400 block">National Disaster Response Helplines</span>
              <span className="text-gray-400 text-[11px]">24/7 State Emergency Operations Center (SEOC)</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-300">
              <span className="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/30">📞 1077</span>
              <span className="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/30">🚨 112</span>
            </div>
          </div>

        </div>

        {/* 3. DEVICE GPS GEOFENCING & LOCATION SENSORS */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Compass size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Device GPS & Live Geofencing</h2>
                <p className="text-xs text-on-surface-variant">Synchronize live coordinates with geological fault mesh</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-full font-bold uppercase">
              W3C Geo
            </span>
          </div>

          <div className="bg-black/30 border border-white/[0.08] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">Auto-Geofence Live Hazard Scan</span>
                <span className="text-[11px] text-gray-400 block">
                  Automatically alert if device moves within 25 km of an active Tier 4 scarp
                </span>
              </div>
              <button
                onClick={handleToggleAutoGps}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  autoDetectGps ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoDetectGps ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {gpsData && (
              <div className="pt-2 border-t border-white/[0.06] text-xs font-mono space-y-1 text-gray-300">
                <div>Latitude / Longitude: <strong className="text-white">{gpsData.coords.latitude.toFixed(4)}° N, {gpsData.coords.longitude.toFixed(4)}° E</strong></div>
                <div>Closest Landslide Basin: <strong className="text-emerald-400">{gpsData.closestDistrict}</strong> ({gpsData.distanceKm} km)</div>
              </div>
            )}
          </div>

          <button
            onClick={handleGpsDetect}
            disabled={detectingGps}
            className="w-full py-2.5 px-4 bg-surface-container-high hover:bg-surface-bright border border-outline-variant rounded-xl text-xs font-mono text-on-surface flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
          >
            <Compass size={16} className={detectingGps ? 'animate-spin text-blue-400' : 'text-blue-400'} />
            <span>{detectingGps ? 'Querying Device Satellites...' : 'Scan My Live Device Location'}</span>
          </button>
        </div>

        {/* 4. CONSOLE THEME & DISPLAY PREFERENCES */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sun size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Console Display & Theme</h2>
                <p className="text-xs text-on-surface-variant">Optimize visual contrast for field and control room visibility</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-full font-bold uppercase">
              {theme.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-black/30 border-white/[0.08] text-gray-400 hover:text-white'
              }`}
            >
              <Moon size={18} className="text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="block text-white">Dark HUD</span>
                <span className="text-[10px] font-mono text-gray-400">Low-light field operations</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-black/30 border-white/[0.08] text-gray-400 hover:text-white'
              }`}
            >
              <Sun size={18} className="text-yellow-400 shrink-0" />
              <div className="text-left">
                <span className="block text-white">Light Mode</span>
                <span className="text-[10px] font-mono text-gray-400">Daylight ambient glare</span>
              </div>
            </button>
          </div>

          {/* Reset Cache */}
          <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
            <span>Reset stored local sessions & preferences:</span>
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear Session</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5. COLLAPSIBLE DEOC SYSTEM ADMINISTRATOR / SERVER RELAY (COLLAPSED BY DEFAULT) */}
      <div className="border border-white/[0.1] rounded-2xl overflow-hidden bg-black/40 shadow-sm mt-8">
        <button
          onClick={() => setShowAdminRelay(!showAdminRelay)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Server size={18} className="text-gray-400" />
            <div>
              <span className="text-xs font-bold font-mono text-gray-300 uppercase tracking-wider block">
                System Operations & Cloud Relay Backend
              </span>
              <span className="text-[11px] text-gray-500 block font-mono">
                Server-side email credentials (Resend API Key & SMTP Relay for platform admins)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1]">
              {showAdminRelay ? 'Hide Admin Console' : 'Show Admin Console'}
            </span>
            {showAdminRelay ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {/* Collapsible Content */}
        {showAdminRelay && (
          <div className="p-5 sm:p-6 border-t border-white/[0.08] bg-black/60 space-y-4 animate-fade-in">
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 font-mono flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Cloud Relay Active: Render backend is configured with Resend API for zero-port-block HTTPS delivery.</span>
            </div>

            <form onSubmit={handleSaveAdminRelay} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Resend API Key (Port 443 HTTPS)
                  </label>
                  <input
                    type="password"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    placeholder="re_xxxxxxxxxxxx (Set via Render Environment)"
                    className="w-full bg-surface-container border border-white/[0.14] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Direct SMTP Host & Port (Local Dev)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="flex-1 bg-surface-container border border-white/[0.14] rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                    <input
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-20 bg-surface-container border border-white/[0.14] rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingAdminConfig}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  {savingAdminConfig ? 'Saving Server Config...' : 'Save Server Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
