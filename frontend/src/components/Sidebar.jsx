import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Map as MapIcon, Settings, AlertTriangle, Layers, Zap, BookOpen, ShieldAlert, FileText } from 'lucide-react';
import BhuRakshakLogo from './BhuRakshakLogo';

export default function Sidebar() {
  const location = useLocation();
  const isDistrictPage = location.pathname.startsWith('/district/');
  const districtName = isDistrictPage ? decodeURIComponent(location.pathname.replace('/district/', '')) : '';

  const navItems = [
    { to: '/', label: 'Main Map', icon: Activity, end: true },
    { to: '/alerts', label: 'Alerts Center', icon: AlertTriangle },
    { to: '/telemetry', label: 'Geotechnical Telemetry', icon: Layers },
    { to: '/xai', label: 'XAI Insights', icon: BookOpen },
    { to: '/mlops', label: 'MLOps & System Health', icon: Zap },
    { to: '/public', label: 'Citizen Public View', icon: ShieldAlert },
  ];

  return (
    <nav className="w-20 bg-surface-container-low flex flex-col items-center py-6 border-r border-outline-variant z-50 shrink-0 select-none">
      {/* Brand Icon with Custom Radar Logo */}
      <NavLink to="/" className="mb-8" title="BhuRakshak EWS Home">
        <BhuRakshakLogo size={32} showText={false} />
      </NavLink>
      
      {/* Navigation Links with Glowing Active Indicator */}
      <div className="flex flex-col gap-4 flex-1 w-full items-center">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              `relative p-3 rounded-xl transition-all duration-300 ease-out flex items-center justify-center ${
                isActive && !isDistrictPage
                  ? 'text-emerald-300 bg-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.85)] ring-1 ring-emerald-400/80 scale-110 border border-emerald-400/50'
                  : 'text-on-surface-variant hover:text-emerald-400 hover:bg-white/[0.06] hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !isDistrictPage && (
                  <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full bg-emerald-400 shadow-[0_0_14px_#34d399] animate-pulse"></span>
                )}
                <Icon
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive && !isDistrictPage ? 'drop-shadow-[0_0_10px_rgba(52,211,153,0.9)] stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}

        {/* Dynamic Glowing Icon when on a District Sector Page */}
        {isDistrictPage && (
          <NavLink
            to={location.pathname}
            title={`District Sector: ${districtName}`}
            className="relative p-3 rounded-xl transition-all duration-300 ease-out flex items-center justify-center text-emerald-300 bg-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.85)] ring-1 ring-emerald-400/80 scale-110 border border-emerald-400/50 mt-1"
          >
            <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full bg-emerald-400 shadow-[0_0_14px_#34d399] animate-pulse"></span>
            <FileText size={24} className="drop-shadow-[0_0_10px_rgba(52,211,153,0.9)] stroke-[2.4]" />
          </NavLink>
        )}
      </div>
      
      {/* Settings NavLink with Glowing Active State */}
      <NavLink
        to="/settings"
        title="Observatory Settings"
        className={({ isActive }) =>
          `relative p-3 rounded-xl transition-all duration-300 ease-out mt-auto ${
            isActive
              ? 'text-emerald-300 bg-emerald-500/20 shadow-[0_0_24px_rgba(16,185,129,0.85)] ring-1 ring-emerald-400/80 scale-110 border border-emerald-400/50'
              : 'text-on-surface-variant hover:text-emerald-400 hover:bg-white/[0.06]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full bg-emerald-400 shadow-[0_0_14px_#34d399] animate-pulse"></span>
            )}
            <Settings
              size={22}
              className={`transition-all duration-300 ${
                isActive ? 'drop-shadow-[0_0_10px_rgba(52,211,153,0.9)] stroke-[2.4]' : 'stroke-[1.8]'
              }`}
            />
          </>
        )}
      </NavLink>
    </nav>
  );
}
