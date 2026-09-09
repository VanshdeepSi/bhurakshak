import { API_BASE } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  User, LogOut, Mail, Bell, Shield, AlertTriangle, MapPin, 
  ChevronDown, CheckCircle, Settings, Compass, Sun, Moon, Flame
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import GoogleAuthModal from './GoogleAuthModal';
import EmergencyEmailModal from './EmergencyEmailModal';
import BhuRakshakLogo from './BhuRakshakLogo';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { requestDeviceLocation } from '../utils/geolocation';

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { triggerDirectAlert, checkAndAlertIfDangerZone } = useAlert();
  const [time, setTime] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [dispatchedEmail, setDispatchedEmail] = useState(null);
  const [districtAlert, setDistrictAlert] = useState(null);
  const [locating, setLocating] = useState(false);

  const isDistrictPage = location.pathname.startsWith('/district/');
  const currentDistrictName = isDistrictPage ? decodeURIComponent(location.pathname.replace('/district/', '')) : '';

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Restore user session (with safety filter to ensure no personal/legacy handles appear)
  useEffect(() => {
    const storedUser = localStorage.getItem('bhurakshak_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const nameLower = (parsed?.name || '').toLowerCase();
        const emailLower = (parsed?.email || '').toLowerCase();
        if (nameLower.includes('bleeding') || emailLower.includes('bleeding') || nameLower.includes('vansh')) {
          localStorage.removeItem('bhurakshak_user');
          setUser(null);
          return;
        }
        setUser(parsed);
        checkUserDistrictAlert(parsed.district, parsed.email);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Automatically check if entering danger zone on page navigation
  useEffect(() => {
    if (isDistrictPage && currentDistrictName) {
      checkAndAlertIfDangerZone(currentDistrictName);
    }
  }, [isDistrictPage, currentDistrictName]);

  const checkUserDistrictAlert = async (districtName, userEmail) => {
    try {
      const res = await axios.get(`${API_BASE}/alerts`);
      const alerts = res.data || [];
      const match = alerts.find(a => a.district.toLowerCase() === (districtName || '').toLowerCase());
      setDistrictAlert(match || null);

      if (match && match.tier === 4) {
        checkAndAlertIfDangerZone(districtName);
        if (userEmail) {
          const emailRes = await axios.get(`${API_BASE}/user/notifications?email=${encodeURIComponent(userEmail)}`);
          if (emailRes.data && emailRes.data.length > 0) {
            setDispatchedEmail(emailRes.data[0]);
          }
        }
      }
    } catch (e) {
      console.error('Failed to check district alert:', e);
    }
  };

  const handleAuthSuccess = (data) => {
    setUser(data.user);
    setDistrictAlert(data.district_alert);
    if (data.dispatched_email) {
      setDispatchedEmail(data.dispatched_email);
    }
    localStorage.setItem('bhurakshak_user', JSON.stringify(data.user));

    if (data.district_alert?.tier === 4) {
      checkAndAlertIfDangerZone(data.user.district, true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('bhurakshak_user');
    setUser(null);
    setDispatchedEmail(null);
    setDistrictAlert(null);
    setShowUserDropdown(false);
    toast('Signed out from Citizen Alert Relay.', { icon: '👋' });
  };

  const handleDistrictChange = async (newDistrict) => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_BASE}/user/subscription`, {
        email: user.email,
        district: newDistrict,
        notify_email: 1
      });
      const updatedUser = { ...user, district: newDistrict };
      setUser(updatedUser);
      localStorage.setItem('bhurakshak_user', JSON.stringify(updatedUser));
      setDistrictAlert(res.data.district_alert);
      if (res.data.dispatched_email) {
        setDispatchedEmail(res.data.dispatched_email);
      }
      
      // If user switches to a danger zone, immediately alert directly!
      if (res.data.district_alert?.tier === 4) {
        checkAndAlertIfDangerZone(newDistrict, true);
      } else {
        toast.success(`Monitored location updated to ${newDistrict}.`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to update monitored location.');
    }
  };

  const handleTopGpsDetect = async () => {
    try {
      setLocating(true);
      const loc = await requestDeviceLocation();
      toast.success(`GPS detected: ${loc.closestDistrict} (${loc.distanceKm} km)`, { icon: '📍' });
      if (user) {
        handleDistrictChange(loc.closestDistrict);
      } else {
        checkAndAlertIfDangerZone(loc.closestDistrict, true);
        navigate(`/district/${encodeURIComponent(loc.closestDistrict)}`);
      }
    } catch (err) {
      toast.error(err.message || 'GPS location unavailable.');
    } finally {
      setLocating(false);
    }
  };

  const handleTriggerTestAlert = () => {
    const targetDistrict = isDistrictPage && currentDistrictName ? currentDistrictName : (user?.district || 'Darjeeling');
    triggerDirectAlert({
      district: targetDistrict,
      state: 'West Bengal',
      tier: 4,
      probability: 0.94,
      rainfall_72h: 242.6,
      factor_of_safety: 0.84,
      message: 'CRITICAL TIER 4: Direct red alert test initiated.'
    }, true);
  };

  const isRedAlert = districtAlert?.tier === 4;

  return (
    <>
      <header className="h-20 bg-background/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full z-40 border-b border-outline-variant/50 shrink-0 select-none">
        
        {/* Left: Custom Bespoke Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="no-underline">
            <BhuRakshakLogo size={36} showText={true} />
          </Link>

          {/* Breadcrumb if inside District Page */}
          {isDistrictPage && (
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/[0.1] text-xs font-mono">
              <span className="text-gray-400">Sector</span>
              <span className="text-gray-600">/</span>
              <span className="text-emerald-400 font-bold tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {currentDistrictName}
              </span>
            </div>
          )}
        </div>

        {/* Center: Red Alert Evacuation Banner if User is in Red Zone */}
        {user && isRedAlert && (
          <div className="hidden md:flex items-center gap-3 bg-red-950/60 border border-red-500/50 px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse">
            <AlertTriangle size={18} className="text-red-400 shrink-0" />
            <div className="text-xs text-red-200">
              <span className="font-bold text-red-400">RED ALERT: </span>
              <span>{user.district} is under Critical Risk. Evacuation advisory active!</span>
            </div>
            {dispatchedEmail && (
              <button
                onClick={() => setShowEmailModal(true)}
                className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                View Notice
              </button>
            )}
          </div>
        )}

        {/* Right: Test Red Alert Button, Quick Tools, Theme Toggle, Dynamic Clock & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* PROMINENT DIRECT "TEST RED ALERT" BUTTON */}
          <button
            onClick={handleTriggerTestAlert}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_18px_rgba(239,68,68,0.6)] border border-red-400/60 active:scale-95 transition-all animate-pulse cursor-pointer"
            title="Click to directly trigger emergency siren, screen alert overlay, and real email dispatch"
          >
            <Flame size={14} className="text-yellow-300" />
            <span>Test Red Alert</span>
          </button>

          {/* Quick GPS Geofence Detect Button */}
          <button
            onClick={handleTopGpsDetect}
            disabled={locating}
            title="Detect My Live Device Location"
            className="p-2 text-on-surface-variant hover:text-emerald-400 bg-surface-container hover:bg-surface-container-high rounded-xl border border-white/[0.06] transition-all flex items-center gap-1.5 active:scale-95 text-xs font-mono cursor-pointer"
          >
            <Compass size={16} className={locating ? 'animate-spin text-emerald-400' : 'text-emerald-400'} />
            <span className="hidden lg:inline">{locating ? 'Locating...' : 'GPS Geofence'}</span>
          </button>

          {/* Fast Theme Toggle Button (Dark / Light) */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 text-on-surface-variant hover:text-emerald-400 bg-surface-container hover:bg-surface-container-high rounded-xl border border-white/[0.06] transition-all cursor-pointer"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Dynamic Clock */}
          <div className="hidden lg:flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl font-mono text-xs text-emerald-400 font-bold border border-white/[0.06]">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {time}
          </div>

          {/* User Auth State */}
          {!user ? (
            /* Sign in with Google Button */
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-xs transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          ) : (
            /* Logged in User Badge & Dropdown */
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isRedAlert 
                    ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                    : 'bg-surface-container hover:bg-surface-container-high border-white/[0.08]'
                }`}
              >
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`} 
                  alt="avatar" 
                  className={`w-7 h-7 rounded-lg bg-black/40 border ${isRedAlert ? 'border-red-400' : 'border-emerald-400/60'}`}
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-on-surface leading-tight">{user.name || user.email.split('@')[0]}</span>
                  <span className={`text-[10px] font-mono leading-tight flex items-center gap-1 ${isRedAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                    <MapPin size={10} />
                    {user.district} {isRedAlert ? '(Red Alert!)' : ''}
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-low border border-white/[0.12] rounded-xl shadow-2xl p-3 z-50 animate-fade-in flex flex-col gap-3">
                  <div className="border-b border-white/[0.06] pb-2.5">
                    <p className="text-xs text-on-surface-variant font-mono">Logged in via Google</p>
                    <p className="text-xs font-semibold text-on-surface truncate">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-on-surface-variant mb-1">
                      Change Monitored District
                    </label>
                    <select
                      value={user.district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-surface-container border border-white/[0.12] rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Darjeeling">Darjeeling (Tier 4 - Red Alert)</option>
                      <option value="Churachandpur">Churachandpur (Tier 4 - Red Alert)</option>
                      <option value="Mangan">Mangan (Tier 4 - Red Alert)</option>
                      <option value="East Sikkim">East Sikkim (Tier 3 - Amber Alert)</option>
                      <option value="Kalimpong">Kalimpong (Tier 2 - Yellow Watch)</option>
                      <option value="Dima Hasao">Dima Hasao (Tier 1 - Nominal)</option>
                      <option value="Kohima">Kohima (Tier 1 - Nominal)</option>
                    </select>
                  </div>

                  {dispatchedEmail && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowEmailModal(true);
                      }}
                      className="w-full py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Mail size={14} className="text-red-400" />
                      <span>View Emergency Notice</span>
                    </button>
                  )}

                  <Link
                    to="/settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full py-1.5 px-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-on-surface rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-colors no-underline"
                  >
                    <Settings size={13} className="text-emerald-400" />
                    <span>Open Settings</span>
                  </Link>

                  <div className="border-t border-white/[0.06] pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-1.5 px-3 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </header>

      {/* Modals */}
      {showAuthModal && (
        <GoogleAuthModal 
          onClose={() => setShowAuthModal(false)} 
          onAuthSuccess={handleAuthSuccess} 
        />
      )}

      {showEmailModal && (
        <EmergencyEmailModal 
          emailData={dispatchedEmail} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}
    </>
  );
}
