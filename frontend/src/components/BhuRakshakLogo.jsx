import React from 'react';

export default function BhuRakshakLogo({ size = 38, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Tech Geological Mountain & Radar Emblem */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-[#1b2a22] to-[#0a120e] p-2 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-transform hover:scale-105"
        style={{ width: size + 6, height: size + 6 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="peakGrad" x1="24" y1="6" x2="24" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.6" stopColor="#059669" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="beamGrad" x1="24" y1="4" x2="42" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Radar Mesh Rings */}
          <circle cx="24" cy="26" r="18" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
          <circle cx="24" cy="26" r="12" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" />

          {/* Himalayan Mountain Peak Silhouette with Strata Lines */}
          <path
            d="M24 8L38 34H10L24 8Z"
            fill="url(#peakGrad)"
            stroke="#6ee7b7"
            strokeWidth="1.6"
            strokeLinejoin="round"
            filter="url(#emeraldGlow)"
          />
          
          {/* Internal Geological Fault & Strata Lines */}
          <path d="M17 24L24 16L31 27" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
          <path d="M14 29L24 23L34 32" stroke="#a7f3d0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M20 31L24 28L28 32" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

          {/* Sweeping Radar Beam */}
          <path d="M24 26L42 12A20 20 0 0 0 24 6Z" fill="url(#beamGrad)" opacity="0.55" />

          {/* Focal Active Telemetry Dot */}
          <circle cx="24" cy="16" r="2.5" fill="#ffffff" className="animate-ping" opacity="0.85" />
          <circle cx="24" cy="16" r="2" fill="#34d399" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-wider text-on-surface uppercase font-display leading-tight drop-shadow-sm truncate">
              BHU<span className="text-emerald-400 font-black">RAKSHAK</span>
            </span>
            <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold tracking-widest shrink-0">
              EWS v3.8
            </span>
          </div>
          <span className="hidden sm:flex text-[10px] font-mono text-gray-400 tracking-widest uppercase items-center gap-1.5 leading-tight shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            GEOLOGICAL TELEMETRY · NER INDIA
          </span>
        </div>
      )}
    </div>
  );
}
