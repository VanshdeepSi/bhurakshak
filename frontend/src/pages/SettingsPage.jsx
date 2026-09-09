import { API_BASE } from '../config/api';
import React, { useState, useEffect } from 'react';
import { 
  Settings, Moon, Sun, Shield, MapPin, Compass, Bell, Volume2, 
  VolumeX, RefreshCw, Database, Radio, Mail, Key, CheckCircle2, 
  AlertTriangle, Trash2, Download, ExternalLink, Loader2, Send,
  HelpCircle, Server, Check, Lock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { requestDeviceLocation } from '../utils/geolocation';
import EmergencyEmailModal from '../components/EmergencyEmailModal';

const SMTP_PRESETS = {
  gmail: { host: 'smtp.gmail.com', port: 587, name: 'Google Gmail (App Password)' },
  outlook: { host: 'smtp.office365.com', port: 587, name: 'Microsoft Outlook / Office 365' },
  custom: { host: '', port: 587, name: 'Custom SMTP Server' }
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { triggerDirectAlert } = useAlert();
  const [user, setUser] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [autoDetectGps, setAutoDetectGps] = useState(() => {
    return localStorage.getItem('bhurakshak_auto_gps') === 'true';
  });
  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem('google_client_id') || '';
  });
  const [audioSiren, setAudioSiren] = useState(() => {
    return localStorage.getItem('bhurakshak_audio_siren') !== 'false';
  });
  const [refreshInterval, setRefreshInterval] = useState(() => {
    return localStorage.getItem('bhurakshak_refresh_rate') || '8s';
  });
  const [satelliteLink, setSatelliteLink] = useState('INSAT-3DR');
  const [dispatchedEmail, setDispatchedEmail] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // Real SMTP Dispatch Settings State
  const [smtpConfig, setSmtpConfig] = useState({
    configured: false,
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: '',
    has_password: false,
    smtp_from_name: 'NDMA BhuRakshak Automated Mesh'
  });
  const [smtpPreset, setSmtpPreset] = useState('gmail');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [testRecipient, setTestRecipient] = useState('');
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [showAppPasswordGuide, setShowAppPasswordGuide] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('bhurakshak_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setTestRecipient(parsed.email || '');
      } catch (e) {
        console.error(e);
      }
    }
    fetchSmtpConfig();
  }, []);

  const fetchSmtpConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE}/settings/smtp`);
      if (res.data) {
        setSmtpConfig(res.data);
        setSmtpHost(res.data.smtp_host || 'smtp.gmail.com');
        setSmtpPort(res.data.smtp_port || 587);
        setSmtpUser(res.data.smtp_user || '');
      }
    } catch (err) {
      console.warn('Could not fetch SMTP settings:', err);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme switched to ${newTheme.toUpperCase()} mode.`, { icon: newTheme === 'light' ? '☀️' : '🌙' });
  };

  const handleGpsDetect = async () => {
    try {
      setDetectingGps(true);
      const loc = await requestDeviceLocation();
      setGpsData(loc);
      toast.success(`Device GPS detected: ${loc.latitude.toFixed(4)}° N, ${loc.longitude.toFixed(4)}° E`, { icon: '📍' });

      if (user) {
        const res = await axios.post(`${API_BASE}/user/subscription`, {
          email: user.email,
          district: loc.closestDistrict,
          notify_email: 1
        });
        const updated = { ...user, district: loc.closestDistrict };
        setUser(updated);
        localStorage.setItem('bhurakshak_user', JSON.stringify(updated));
        if (res.data.dispatched_email) {
          setDispatchedEmail(res.data.dispatched_email);
          toast.error(`🚨 RED ALERT EVACUATION NOTICE dispatched for ${loc.closestDistrict}!`, { duration: 6000 });
        }
      }
    } catch (err) {
      toast.error(err.message || 'GPS location request failed.');
    } finally {
      setDetectingGps(false);
    }
  };

  const handleSaveGoogleClientId = () => {
    localStorage.setItem('google_client_id', googleClientId.trim());
    toast.success('Google OAuth Client ID saved.');
  };

  const handleToggleAutoGps = (e) => {
    const checked = e.target.checked;
    setAutoDetectGps(checked);
    localStorage.setItem('bhurakshak_auto_gps', checked.toString());
    toast(checked ? 'GPS auto-detection on startup enabled.' : 'GPS auto-detection disabled.', { icon: '🧭' });
  };

  const handleToggleAudioSiren = (e) => {
    const checked = e.target.checked;
    setAudioSiren(checked);
    localStorage.setItem('bhurakshak_audio_siren', checked.toString());
    toast(checked ? 'Emergency audio sirens enabled.' : 'Emergency audio sirens muted.', { icon: checked ? '🔊' : '🔇' });
  };

  const handleRefreshRateChange = (rate) => {
    setRefreshInterval(rate);
    localStorage.setItem('bhurakshak_refresh_rate', rate);
    toast.success(`Telemetry refresh interval updated to ${rate}.`);
  };

  // Preset Selection
  const handlePresetSelect = (presetKey) => {
    setSmtpPreset(presetKey);
    const preset = SMTP_PRESETS[presetKey];
    if (preset) {
      if (preset.host) setSmtpHost(preset.host);
      setSmtpPort(preset.port);
    }
  };

  // Save SMTP Settings
  const handleSaveSmtp = async (triggerTest = false) => {
    if (!smtpUser.trim()) {
      toast.error('Please enter your sender email address (e.g. yourname@gmail.com)');
      return;
    }

    try {
      if (triggerTest) setTestingSmtp(true);
      else setSavingSmtp(true);

      const payload = {
        smtp_host: smtpHost.trim(),
        smtp_port: parseInt(smtpPort) || 587,
        smtp_user: smtpUser.trim(),
        smtp_password: smtpPassword.trim(),
        smtp_from_name: 'NDMA BhuRakshak Automated Mesh',
        test_recipient: triggerTest ? (testRecipient.trim() || smtpUser.trim()) : null
      };

      const res = await axios.post(`${API_BASE}/settings/smtp`, payload);

      if (res.data.success) {
        toast.success('SMTP configuration saved successfully!');
        await fetchSmtpConfig();

        if (triggerTest) {
          const testRes = res.data.test_delivery;
          if (testRes?.real_sent) {
            toast.success(`✅ Real email delivered to ${testRes.recipient} via SMTP!`, { duration: 6000 });
          } else {
            toast.error(testRes?.message || 'SMTP connection failed. Check your password or port.');
          }
        }
      } else {
        toast.error(res.data.error || 'Failed to save SMTP settings');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error while saving SMTP settings.');
    } finally {
      setSavingSmtp(false);
      setTestingSmtp(false);
    }
  };

  // Test Dispatched Emergency Advisory
  const handleTestEmailDispatch = async () => {
    const targetEmail = user?.email || testRecipient.trim() || 'resident.alert@gmail.com';
    const targetDistrict = user?.district || 'Darjeeling';
    try {
      setSendingTestEmail(true);
      const res = await axios.post(`${API_BASE}/notifications/send-alert-email`, {
        email: targetEmail,
        district: targetDistrict,
        force: true
      });

      const delivery = res.data.smtp_delivery;
      if (delivery?.real_sent) {
        toast.success(`✅ Real emergency email delivered to ${targetEmail} via SMTP!`, { duration: 6000 });
      } else if (delivery?.status === 'UNCONFIGURED') {
        toast('Advisory generated. Configure Gmail App Password below to send real emails to your personal inbox.', { 
          icon: '📧', 
          duration: 6000 
        });
      } else {
        toast.error(delivery?.message || 'SMTP transmission issue.');
      }

      setDispatchedEmail(res.data.dispatched_email);
      setShowEmailModal(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to trigger email notification.');
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success('Local preferences & cache cleared. Reloading...', { icon: '🧹' });
    setTimeout(() => window.location.reload(), 1200);
  };

  const handleExportTelemetryLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/telemetry`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BhuRakshak_Telemetry_Export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Telemetry logs exported as JSON file.');
    } catch (e) {
      toast.error('Failed to export telemetry.');
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between bg-background">
      <main className="flex-1 w-full">
        <div className="w-full px-6 lg:px-8 py-8 max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Settings size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">System &amp; User Settings</h1>
                <p className="text-xs text-on-surface-variant font-mono">BhuRakshak Observatory Configuration · Real Email Delivery &amp; Telemetry Mesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportTelemetryLogs}
                className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high border border-white/[0.08] text-xs font-mono text-on-surface rounded-xl flex items-center gap-2 transition-all active:scale-95"
              >
                <Download size={15} />
                <span>Export Telemetry JSON</span>
              </button>
              <button
                onClick={handleClearCache}
                className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-xs font-mono text-red-300 rounded-xl flex items-center gap-2 transition-all active:scale-95"
              >
                <Trash2 size={15} />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>

          {/* Bento Settings Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. Real Email Dispatch & SMTP Server Configuration (CORE USER FEATURE) */}
            <div className="md:col-span-2 bg-surface-container-low border border-emerald-500/30 rounded-2xl p-6 flex flex-col gap-5 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Real Email Dispatch Relay (SMTP)</h2>
                    <p className="text-xs text-on-surface-variant">Transmit actual life-safety evacuation notices directly to citizen personal inboxes</p>
                  </div>
                </div>

                {smtpConfig.configured ? (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 self-start sm:self-auto">
                    <CheckCircle2 size={13} /> Real SMTP Active ({smtpConfig.smtp_host})
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 self-start sm:self-auto">
                    <AlertTriangle size={13} /> SMTP Setup Required For Real Inbox Delivery
                  </span>
                )}
              </div>

              {/* Step-by-Step Helper Notice */}
              <div className="bg-[#0b130f] border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                    <Key size={15} /> How to send real emails to your Gmail inbox:
                  </span>
                  <button
                    onClick={() => setShowAppPasswordGuide(!showAppPasswordGuide)}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <HelpCircle size={13} />
                    <span>{showAppPasswordGuide ? 'Hide Guide' : '60-Second Setup Guide'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  To allow BhuRakshak to send real emails to your inbox for free using Gmail, use a <strong>16-character Google App Password</strong> instead of your regular password.
                </p>

                {showAppPasswordGuide && (
                  <div className="mt-2 pt-3 border-t border-white/[0.08] text-xs font-mono text-gray-300 space-y-1.5 bg-black/40 p-3 rounded-lg">
                    <div>1. Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Google Account Security</a>.</div>
                    <div>2. Make sure <strong>2-Step Verification</strong> is ON.</div>
                    <div>3. Scroll to <strong>App passwords</strong> (search "App passwords" in top bar if needed).</div>
                    <div>4. Create an app named <strong>BhuRakshak</strong> and copy the generated 16-letter password.</div>
                    <div>5. Paste it in the <strong>App Password</strong> field below and click <strong>Send Real Test Email</strong>.</div>
                  </div>
                )}
              </div>

              {/* Provider Presets */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-gray-400 mr-2">Quick Preset:</span>
                {['gmail', 'outlook', 'custom'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePresetSelect(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      smtpPreset === key
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-surface-container border-white/[0.08] text-gray-400 hover:text-white'
                    }`}
                  >
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* SMTP Credentials Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    SMTP Server Host
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full bg-[#0a0f0d] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587"
                    className="w-full bg-[#0a0f0d] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    Sender Gmail / Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#0a0f0d] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1 flex items-center justify-between">
                    <span>Google App Password (16 Letters) <span className="text-red-400">*</span></span>
                    {smtpConfig.has_password && !smtpPassword && (
                      <span className="text-[10px] text-emerald-400 font-mono">Password Saved</span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    placeholder={smtpConfig.has_password ? '•••••••••••••••• (Leave blank to keep)' : 'Enter 16-character App Password'}
                    className="w-full bg-[#0a0f0d] border border-white/[0.12] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Action Buttons & Real Test Dispatch */}
              <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="email"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="Test recipient email (e.g. your@gmail.com)"
                    className="flex-1 bg-[#0a0f0d] border border-white/[0.12] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSaveSmtp(false)}
                    disabled={savingSmtp}
                    className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-xs font-mono font-bold text-white rounded-lg transition-all border border-white/[0.1] disabled:opacity-50"
                  >
                    {savingSmtp ? 'Saving...' : 'Save Settings'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveSmtp(true)}
                    disabled={testingSmtp || savingSmtp}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-xs font-mono font-bold text-gray-950 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {testingSmtp ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Sending via SMTP...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Real Test Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Appearance & Theme Selection */}
            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sun className="text-emerald-400" size={20} />
                  <h2 className="text-base font-bold text-on-surface">Console Display Theme</h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  {theme} Active
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Toggle interface contrast mode optimized for low-light command centers or daytime field operations.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'dark', label: 'Dark Obsidian', icon: Moon, desc: 'OLED Black (#090e0b)' },
                  { id: 'light', label: 'Light Clean', icon: Sun, desc: 'High Visibility (#f8faf9)' },
                  { id: 'tactical', label: 'Tactical Night', icon: Radio, desc: 'Amber HUD (#0b0c08)' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleThemeChange(item.id)}
                      className={`p-3.5 rounded-xl border flex flex-col items-start gap-2 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : 'border-white/[0.08] bg-surface-container hover:border-white/[0.16]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon size={18} className={isSelected ? 'text-emerald-400' : 'text-on-surface-variant'} />
                        {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-on-surface'}`}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Device Geolocation & GPS Tracking */}
            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Compass className="text-emerald-400" size={20} />
                  <h2 className="text-base font-bold text-on-surface">Device GPS Location Permissions</h2>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase">W3C Geolocation</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Connect your device's live GPS receiver to calculate distance to landslide fault lines and trigger evacuation notices automatically.
              </p>

              <div className="bg-surface-container p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="text-emerald-400 shrink-0" size={20} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">
                      {gpsData ? `${gpsData.closestDistrict} (${gpsData.distanceKm} km away)` : (user?.district || 'Not configured')}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {gpsData ? `${gpsData.latitude.toFixed(4)}° N, ${gpsData.longitude.toFixed(4)}° E (±${gpsData.accuracy}m)` : 'GPS telemetry idle'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGpsDetect}
                  disabled={detectingGps}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  {detectingGps ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      <Compass size={14} />
                      <span>Request GPS</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-on-surface">Auto-detect GPS on Startup</span>
                  <span className="text-[10px] text-on-surface-variant">Request browser coordinates on dashboard launch</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDetectGps}
                    onChange={handleToggleAutoGps}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            {/* 4. Google Account & Direct Red Alert Test */}
            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="text-emerald-400" size={20} />
                  <h2 className="text-base font-bold text-on-surface">Active Citizen Session &amp; Test</h2>
                </div>
                {user ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-gray-400">Guest Session</span>
                )}
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=bhurakshak'}
                    alt="avatar"
                    className="w-9 h-9 rounded-lg bg-black/40 border border-white/[0.1]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">{user?.name || 'Guest User'}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{user?.email || 'No email linked'}</span>
                  </div>
                </div>

                <button
                  onClick={handleTestEmailDispatch}
                  disabled={sendingTestEmail}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <Mail size={13} />
                  <span>{sendingTestEmail ? 'Dispatching...' : 'Test Evacuation Notice'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1.5">
                  Custom Google OAuth Client ID (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    placeholder="Enter Google Cloud Console Client ID"
                    className="flex-1 bg-surface-container border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-on-surface font-mono focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={handleSaveGoogleClientId}
                    className="px-3 py-2 bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-on-surface rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Audio Sirens & Telemetry Cadence */}
            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="text-emerald-400" size={20} />
                  <h2 className="text-base font-bold text-on-surface">Emergency Sirens &amp; Cadence</h2>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase">NDMA Protocols</span>
              </div>

              {/* Audio Alarm Toggle */}
              <div className="flex items-center justify-between bg-surface-container p-3.5 rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  {audioSiren ? <Volume2 className="text-emerald-400" size={20} /> : <VolumeX className="text-gray-500" size={20} />}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-on-surface">Audible Red Alert Sirens</span>
                    <span className="text-[10px] text-on-surface-variant">Play acoustic warning when risk exceeds 80% P(F)</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioSiren}
                    onChange={handleToggleAudioSiren}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Stream Refresh Rate */}
              <div>
                <label className="block text-xs font-mono uppercase text-on-surface-variant mb-2">
                  Sensor Telemetry Polling Rate
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['5s', '8s', '30s'].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRefreshRateChange(rate)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                        refreshInterval === rate
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-surface-container border-white/[0.06] text-on-surface-variant hover:border-white/[0.12]'
                      }`}
                    >
                      {rate} Interval
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Docked Footer */}
      <footer className="w-full mt-auto py-4 px-6 border-t border-white/[0.08] bg-surface-container-lowest/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-gray-400 uppercase">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-semibold">BHURAKSHAK GEOLOGICAL HAZARD OBSERVATORY</span>
            <span className="text-gray-600">·</span>
            <span>SYSTEM CONFIGURATION CONSOLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-semibold tracking-wider">ALL MESH NODES OPERATIONAL</span>
          </div>
        </div>
      </footer>

      {/* Dispatched Emergency Email Preview */}
      {showEmailModal && (
        <EmergencyEmailModal
          emailData={dispatchedEmail}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}
