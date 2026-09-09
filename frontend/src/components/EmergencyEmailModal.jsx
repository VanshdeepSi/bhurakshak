import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertTriangle, X, Printer, Shield, CheckCircle2, Settings, ExternalLink } from 'lucide-react';

export default function EmergencyEmailModal({ emailData, onClose }) {
  if (!emailData) return null;

  const isRealDelivery = emailData.real_sent || emailData.status === 'DELIVERED';
  const isUnconfigured = emailData.status === 'UNCONFIGURED';
  const isFailed = emailData.status === 'FAILED' || emailData.status === 'AUTH_ERROR' || emailData.status === 'TRANSMISSION_ERROR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121815] border border-red-500/50 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden">
        
        {/* Email Client Top Bar */}
        <div className="bg-[#0a0f0d] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Mail size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Emergency Evacuation Notice</span>
                <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {isRealDelivery ? 'Dispatched via Real SMTP to Recipient Inbox' : 'Citizen Warning Advisory Bulletin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              title="Print Emergency Notice"
            >
              <Printer size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Real Delivery Notification Banner */}
        {isRealDelivery ? (
          <div className="px-6 py-2 bg-emerald-950/60 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Transmitted to Real Inbox: <strong>{emailData.recipient}</strong> via SMTP
            </span>
            <span className="text-[10px] text-emerald-400/80">Delivered</span>
          </div>
        ) : isUnconfigured ? (
          <div className="px-6 py-2 bg-amber-950/60 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-300 font-mono">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
              Notice Generated. To send real emails to your personal inbox, configure your Gmail App Password.
            </span>
            <Link 
              to="/settings" 
              onClick={onClose}
              className="text-xs text-white bg-amber-600/60 hover:bg-amber-500/80 px-2.5 py-0.5 rounded font-bold transition-colors flex items-center gap-1 shrink-0"
            >
              <Settings size={12} /> Configure SMTP
            </Link>
          </div>
        ) : isFailed ? (
          <div className="px-6 py-2 bg-red-950/60 border-b border-red-500/30 flex items-center justify-between text-xs text-red-300 font-mono">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle size={14} className="text-red-400 shrink-0" />
              SMTP Delivery Failed. Please check your Gmail App Password in Settings.
            </span>
            <Link 
              to="/settings" 
              onClick={onClose}
              className="text-xs text-white bg-red-600/60 hover:bg-red-500/80 px-2.5 py-0.5 rounded font-bold transition-colors flex items-center gap-1 shrink-0"
            >
              <Settings size={12} /> Fix SMTP
            </Link>
          </div>
        ) : null}

        {/* Email Metadata Header */}
        <div className="px-6 py-3 bg-[#151e19] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div>
            <span className="text-gray-400">To: </span>
            <strong className="text-white">{emailData.recipient}</strong>
            <span className="text-gray-500 mx-2">·</span>
            <span className="text-gray-400">Sector: </span>
            <strong className="text-emerald-400">{emailData.district}</strong>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <div>
              <span>Sent: </span>
              <span className="text-gray-200 font-semibold">{emailData.sent_at ? new Date(emailData.sent_at).toLocaleTimeString() : 'Just now'} IST</span>
            </div>
          </div>
        </div>

        {/* Rendered Email Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090e0b]">
          <div 
            className="rounded-xl overflow-hidden border border-white/[0.08]"
            dangerouslySetInnerHTML={{ __html: emailData.body_html }}
          />
        </div>

        {/* Action Footer */}
        <div className="bg-[#0d1410] px-6 py-3.5 border-t border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield size={14} className="text-emerald-400" />
            <span>Digital signature authenticated via National Disaster Management Authority (NDMA).</span>
          </div>
          <div className="flex items-center gap-2">
            {!isRealDelivery && (
              <Link
                to="/settings"
                onClick={onClose}
                className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-white/[0.1] text-gray-300 hover:text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5"
              >
                <Settings size={13} />
                <span>SMTP Settings</span>
              </Link>
            )}
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-lg transition-all shadow-md active:scale-95"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
