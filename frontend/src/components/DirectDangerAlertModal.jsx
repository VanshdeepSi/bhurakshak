import { API_BASE } from '../config/api';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, Volume2, VolumeX, X, ShieldAlert, Mail, 
  CheckCircle2, Compass, ArrowRight, ExternalLink, Settings, Send, Flame
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { emergencyAudio } from '../utils/emergencyAudio';

export default function DirectDangerAlertModal({ 
  alertData, 
  onClose, 
  user, 
  deliveryStatus, 
  onEmailDispatched 
}) {
  if (!alertData) return null;

  const [customEmail, setCustomEmail] = useState(user?.email || '');
  const [dispatching, setDispatching] = useState(false);
  const [localDelivery, setLocalDelivery] = useState(deliveryStatus || null);
  const [isMuted, setIsMuted] = useState(false);

  const district = alertData.district || user?.district || 'Darjeeling';
  const state = alertData.state || 'West Bengal';
  const probability = alertData.probability ? Math.round(alertData.probability * 100) : 94;
  const rainfall = alertData.rainfall_72h || 242.6;
  const fos = alertData.factor_of_safety || 0.84;

  const handleToggleSound = () => {
    if (isMuted) {
      emergencyAudio.playSiren(2.5);
      setIsMuted(false);
    } else {
      emergencyAudio.stop();
      setIsMuted(true);
    }
  };

  const handleManualDispatch = async (e) => {
    if (e) e.preventDefault();
    const emailToUse = customEmail.trim() || user?.email;
    if (!emailToUse || !emailToUse.includes('@')) {
      toast.error('Please enter a valid email address to receive alert dispatch.');
      return;
    }

    try {
      setDispatching(true);
      const res = await axios.post(`${API_BASE}/notifications/send-alert-email`, {
        email: emailToUse,
        district: district,
        force: true
      });

      const delivery = res.data.smtp_delivery;
      setLocalDelivery(delivery);
      if (onEmailDispatched) {
        onEmailDispatched(res.data.dispatched_email, delivery);
      }

      if (delivery?.real_sent) {
        toast.success(`✅ Real emergency email dispatched to ${emailToUse} via SMTP!`, { duration: 6000 });
      } else if (delivery?.status === 'UNCONFIGURED') {
        toast('Notice generated & logged. Configure Gmail App Password in Settings for real inbox delivery.', {
          icon: '⚠️',
          duration: 6000
        });
      } else {
        toast.error(delivery?.message || 'SMTP transmission error.');
      }
    } catch (err) {
      console.error('Manual alert dispatch failed:', err);
      toast.error('Failed to trigger emergency dispatch.');
    } finally {
      setDispatching(false);
    }
  };

  const isRealDelivered = localDelivery?.real_sent || localDelivery?.status === 'DELIVERED';
  const isUnconfigured = localDelivery?.status === 'UNCONFIGURED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#101713] border-2 border-red-500 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(239,68,68,0.45)] overflow-hidden">
        
        {/* Urgent Pulsing Alert Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 px-5 sm:px-6 py-4 border-b border-red-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse">
              <Flame size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wider uppercase">
                  CRITICAL DANGER ZONE ALERT
                </span>
                <span className="bg-white text-red-700 font-extrabold text-[10px] font-mono uppercase px-2 py-0.5 rounded shadow">
                  SIGNAL RED
                </span>
              </div>
              <p className="text-xs text-red-200 font-mono">
                Hydro-Geotechnical Slope Instability Exceeded Safety Threshold
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button 
              onClick={handleToggleSound}
              className={`p-2 rounded-lg border transition-all ${
                isMuted 
                  ? 'bg-black/40 border-white/20 text-gray-400 hover:text-white' 
                  : 'bg-red-600/60 border-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
              }`}
              title={isMuted ? 'Play Emergency Siren' : 'Mute Emergency Siren'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 text-red-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Acknowledge and Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Real-time SMTP Status Pill */}
        {localDelivery && (
          <div className={`px-5 sm:px-6 py-2 border-b flex items-center justify-between text-xs font-mono ${
            isRealDelivered 
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' 
              : isUnconfigured 
                ? 'bg-amber-950/70 border-amber-500/40 text-amber-300' 
                : 'bg-red-950/70 border-red-500/40 text-red-300'
          }`}>
            <span className="flex items-center gap-1.5 font-semibold">
              {isRealDelivered ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  Emergency Advisory Transmitted to Inbox via SMTP Relay
                </>
              ) : isUnconfigured ? (
                <>
                  <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                  Advisory Logged · Configure Gmail SMTP in Settings to receive in real inbox
                </>
              ) : (
                <>
                  <AlertTriangle size={14} className="text-red-400 shrink-0" />
                  SMTP Transmission Issue: Check credentials in Settings
                </>
              )}
            </span>
            {isUnconfigured && (
              <Link 
                to="/settings" 
                onClick={onClose}
                className="text-[11px] text-white bg-amber-600 hover:bg-amber-500 px-2 py-0.5 rounded font-bold transition-colors flex items-center gap-1 shrink-0 ml-2"
              >
                <Settings size={11} /> Settings
              </Link>
            )}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-white">
          
          {/* Danger Zone Location & Real-Time Strain Card */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-red-300 uppercase tracking-wider block mb-1">
                Affected High-Risk Sector
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{district}</span>
                <span className="text-sm font-normal text-gray-300">({state})</span>
              </h3>
              <p className="text-xs text-red-300/80 mt-0.5 font-mono">
                Factor of Safety: <strong className="text-red-400">{fos}</strong> (Critical &lt; 1.0)
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-black/50 border border-red-500/30 px-3 py-2 rounded-lg text-center">
                <span className="block text-[10px] font-mono text-gray-400">P(Failure)</span>
                <span className="text-lg font-black text-red-400">{probability}%</span>
              </div>
              <div className="bg-black/50 border border-red-500/30 px-3 py-2 rounded-lg text-center">
                <span className="block text-[10px] font-mono text-gray-400">Rainfall (72h)</span>
                <span className="text-lg font-black text-red-400">{rainfall}mm</span>
              </div>
            </div>
          </div>

          {/* Life-Safety Directives (Immediate Actions) */}
          <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold font-mono uppercase text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert size={14} /> Immediate Evacuation Directives
            </h4>
            
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-red-500/40">
                  1
                </span>
                <p>
                  <strong className="text-white">Evacuate Slopes & Runout Zones: </strong>
                  Move perpendicular to drainage ravines, tea garden terraces, and steep embankments immediately.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-red-500/40">
                  2
                </span>
                <p>
                  <strong className="text-white">Proceed to High Ground Shelters: </strong>
                  Follow designated uphill arterial corridors. Avoid riverbeds, valley bottoms, and road culverts.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-red-500/40">
                  3
                </span>
                <p>
                  <strong className="text-white">Emergency Broadcast Monitoring: </strong>
                  Tune battery radios to All India Radio (FM 100.1 MHz) or contact District Emergency Operations (DEOC: 1077).
                </p>
              </div>
            </div>
          </div>

          {/* Email Dispatch Action Card */}
          <div className="bg-black/60 border border-white/[0.1] rounded-xl p-4">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
              Citizen Emergency Email Relay Dispatch
            </span>

            {user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-gray-400">Recipient Email: </span>
                  <strong className="text-emerald-400 font-mono">{user.email}</strong>
                  <span className="block text-[11px] text-gray-400 font-mono mt-0.5">
                    (Registered citizen for {user.district})
                  </span>
                </div>

                <button
                  onClick={() => handleManualDispatch()}
                  disabled={dispatching}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={13} />
                  <span>{dispatching ? 'Dispatching...' : 'Re-Send Alert to My Email'}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleManualDispatch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail size={15} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter email to receive real alert (e.g. resident@gmail.com)"
                    className="w-full bg-surface-container border border-white/[0.14] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono placeholder:text-gray-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  <Send size={13} />
                  <span>{dispatching ? 'Dispatching...' : 'Send Live Alert Now'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-[#0b100d] px-5 sm:px-6 py-3.5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <Link 
            to={`/district/${encodeURIComponent(district)}`}
            onClick={onClose}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 no-underline"
          >
            <span>View Full District Telemetry Report</span>
            <ArrowRight size={13} />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              onClick={onClose}
              className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-gray-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors no-underline"
            >
              <Settings size={13} className="text-emerald-400" />
              <span>SMTP Settings</span>
            </Link>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
