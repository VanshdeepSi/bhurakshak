import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Map as MapIcon, Settings, AlertTriangle, Layers, Zap, BookOpen, ShieldAlert, FileText } from 'lucide-react';
import BhuRakshakLogo from './BhuRakshakLogo';

export default function Sidebar() {
  const location = useLocation();
  const isDistrictPage = location.pathname.startsWith('/district/');
  const districtName = isDistrictPage ? decodeURIComponent(location.pathname.replace('/district/', '')) : '';

  const navItems = [
    { to: '/', label: 'Map', fullLabel: 'Main Map', icon: Activity, end: true },
    { to: '/alerts', label: 'Alerts', fullLabel: 'Alerts Center', icon: AlertTriangle },
    { to: '/telemetry', label: 'Sensors', fullLabel: 'Geotechnical Telemetry', icon: Layers },
    { to: '/mlops', label: 'MLOps', fullLabel: 'MLOps & System Health', icon: Zap },
    { to: '/public', label: 'Citizen', fullLabel: 'Citizen Public View', icon: ShieldAlert },
    { to: '/settings', label: 'Settings', fullLabel: 'Observatory Settings', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on md+ screens) */}
      <nav className="hidden md:flex w-20 bg-surface-container-low flex-col items-center py-6 border-r border-outline-variant z-50 shrink-0 select-none">
        {/* Brand Icon with Custom Radar Logo */}
        <NavLink to="/" className="mb-8" title="BhuRakshak EWS Home">
          <BhuRakshakLogo size={32} showText={false} />
        </NavLink>
        
        {/* Navigation Links with Glowing Active Indicator */}
        <div className="flex flex-col gap-4 flex-1 w-full items-center">
          {navItems.filter(item => item.to !== '/settings').map(({ to, fullLabel, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={fullLabel}
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

      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed 6 items max, perfectly balanced) */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#101713]/95 backdrop-blur-xl border-t border-outline-variant/70 z-[1100] px-1 py-1 items-center justify-around select-none shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
        {(isDistrictPage ? [
          { to: '/', label: 'Map', icon: Activity, end: true },
          { to: location.pathname, label: 'Sector', icon: FileText },
          { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
          { to: '/telemetry', label: 'Sensors', icon: Layers },
          { to: '/public', label: 'Citizen', icon: ShieldAlert },
          { to: '/settings', label: 'Settings', icon: Settings },
        ] : navItems).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/15 font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon
                    size={20}
                    className={`transition-transform duration-200 ${
                      isActive
                        ? 'stroke-[2.4] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110'
                        : 'stroke-[1.8]'
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse"></span>
                  )}
                </div>
                <span className="text-[10px] font-mono tracking-tight mt-1 leading-none">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
