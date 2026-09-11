import React, { useState } from 'react';
import usePageMeta from '../utils/usePageMeta';
import { 
  Search, X, Navigation, ShieldAlert, Info, PhoneCall, 
  Compass, BadgeCheck, Shield, Building2, AlertOctagon, 
  Headphones, Radio, ShieldCheck, ChevronDown, ChevronUp, 
  MapPin, ExternalLink, Clock, Footprints, Mountain, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { requestDeviceLocation } from '../utils/geolocation';

export default function CitizenPublicView() {
  usePageMeta(`Citizen Advisory`, `Public safety advisories, evacuation routes, and citizen registration for landslide early warning notifications.`);

  const [searchQuery, setSearchQuery] = useState('Mangan, North Sikkim');
  const [lang, setLang] = useState('en');
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [locating, setLocating] = useState(false);
  const [gpsLocation, setGpsLocation] = useState('Dzongu Subdivision, North Sikkim');

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleGpsDetect = async () => {
    setLocating(true);
    try {
      const coords = await requestDeviceLocation();
      const detected = `${coords.district || 'Mangan'}, ${coords.state || 'Sikkim'}`;
      setSearchQuery(detected);
      setGpsLocation(detected);
      toast.success(`Location detected: ${detected}`);
    } catch (err) {
      toast.error(err.message || 'GPS location unavailable.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <main className="flex flex-col relative w-full pt-4 pb-20 bg-background min-h-screen">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 gap-5">
        
        {/* Minimal Context Sub-bar & Language Quick Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h1 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-on-surface-variant font-bold">
              Citizen Advisory &bull; Live Hazard Status
            </h1>
          </div>
          <div className="inline-flex rounded-lg bg-surface-container p-0.5 border border-outline-variant/30">
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                lang === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => { setLang('as'); toast.success('Language switched to Assamese'); }} 
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                lang === 'as' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              অসমীয়া
            </button>
            <button 
              onClick={() => { setLang('ne'); toast.success('Language switched to Nepali'); }} 
              className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                lang === 'ne' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              नेपाली
            </button>
          </div>
        </div>

        {/* Prominent Citizen Search Bar */}
        <div className="relative w-full">
          <label className="sr-only" htmlFor="location-query">Search location safety</label>
          <div className="relative flex items-center bg-surface-container rounded-xl shadow-md border border-outline-variant/50 focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
            <Search size={20} className="absolute left-4 text-on-surface-variant pointer-events-none" />
            <input 
              className="w-full bg-transparent pl-12 pr-10 py-3.5 text-sm sm:text-base text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none font-body-sm" 
              id="location-query" 
              placeholder="Is my area safe? Search village, town, or pin code..." 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch} 
                aria-label="Clear location search" 
                className="absolute right-3 p-1 text-on-surface-variant hover:text-on-surface cursor-pointer rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 px-1 text-xs text-on-surface-variant">
            <button
              type="button"
              onClick={handleGpsDetect}
              className="font-mono flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
            >
              <Navigation size={13} className={locating ? 'animate-spin text-primary' : 'text-primary'} />
              <span>GPS Detected: <strong className="text-on-surface">{gpsLocation}</strong></span>
            </button>
            <span className="font-mono text-[11px] text-on-surface-variant">Updated 2 mins ago</span>
          </div>
        </div>

        {/* Large Answer State: Critical Alert Tier Banner */}
        <div className="flex flex-col bg-red-950/80 border border-red-500/50 text-red-100 rounded-2xl p-5 sm:p-6 shadow-xl gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm">
              <ShieldAlert size={18} className="text-white" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold">Critical Alert &bull; High Landslide Risk</span>
            </div>
            <span className="font-mono text-xs uppercase text-red-300 font-bold tracking-wider bg-red-900/60 px-2.5 py-1 rounded-md border border-red-500/30">
              Level 4
            </span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-snug">
            Evacuate immediately. Follow official instructions and move to designated high-ground shelters.
          </p>
          <div className="flex items-start gap-2 pt-1 text-red-200 text-xs sm:text-sm">
            <Info size={18} className="text-red-400 shrink-0 mt-0.5" />
            <span>Slope instability verified along Mangan Ridge by GSI telemetry units (FoS 0.86 &bull; Rainfall 182mm/24h).</span>
          </div>
        </div>

        {/* Emergency Actions (Two Large Touch Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Action 1: Call Emergency Helpline */}
          <a 
            href="tel:1077"
            className="min-h-[54px] w-full px-5 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-red-900/40 active:scale-[0.98] transition-all no-underline cursor-pointer border border-red-400/40"
          >
            <PhoneCall size={20} className="text-white shrink-0 animate-bounce" />
            <span>Call Helpline (1077)</span>
          </a>

          {/* Action 2: View Evacuation Route & Shelters (Near Me Button) */}
          <button 
            type="button"
            onClick={() => setShowRoutePanel(!showRoutePanel)} 
            className={`min-h-[54px] w-full px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-between gap-3 shadow-lg transition-all active:scale-[0.98] cursor-pointer border ${
              showRoutePanel 
                ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-200 shadow-emerald-950/50 ring-1 ring-emerald-400/40' 
                : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/60 text-on-surface'
            }`}
            id="view-route-btn"
          >
            <div className="flex items-center gap-2.5">
              <Navigation size={20} className="text-emerald-400 shrink-0" />
              <span className="text-left leading-tight">View Evacuation Route &amp; Shelters</span>
            </div>
            {showRoutePanel ? (
              <ChevronUp size={20} className="text-emerald-400 shrink-0" />
            ) : (
              <ChevronDown size={20} className="text-on-surface-variant shrink-0" />
            )}
          </button>
        </div>

        {/* Route Map View Contextual Drawer (Smoothly expand on click) */}
        {showRoutePanel && (
          <div className="flex flex-col bg-surface-container-low border border-emerald-500/40 rounded-2xl p-5 sm:p-6 gap-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Compass size={22} className="text-emerald-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-on-surface">Designated Safe Corridor: Upper Mangan Ridge</h3>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Cleared Route
              </span>
            </div>

            {/* Topographic Visual Map Card */}
            <div className="w-full bg-[#101914] border border-emerald-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Safe Corridor: Helipad Bypass Road (Elevation +180m)
                </div>
                <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  NDRF Sector 2 Clearance
                </span>
              </div>

              {/* Waypoint Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-surface-container/80 p-3 rounded-lg border border-outline-variant/40 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-red-950 text-red-300 border border-red-500/50 flex items-center justify-center font-mono text-xs font-bold shrink-0">1</div>
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-on-surface">Mangan Bazaar</span>
                    <span className="text-on-surface-variant">Evacuate valley basin immediately</span>
                  </div>
                </div>
                <div className="bg-surface-container/80 p-3 rounded-lg border border-outline-variant/40 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center justify-center font-mono text-xs font-bold shrink-0">2</div>
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-on-surface">Helipad Ridge Path</span>
                    <span className="text-on-surface-variant">Follow marked high ground ascent</span>
                  </div>
                </div>
                <div className="bg-surface-container/80 p-3 rounded-lg border border-outline-variant/40 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">3</div>
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-emerald-300">Sr. Secondary School</span>
                    <span className="text-on-surface-variant">Designated Reinforced Shelter</span>
                  </div>
                </div>
              </div>

              {/* Red warning bar inside evacuation route */}
              <div className="flex items-center gap-2 p-2.5 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200">
                <AlertOctagon size={16} className="text-red-400 shrink-0" />
                <span><strong>CRITICAL RESTRICTION:</strong> Avoid NH-10 and Teesta river valley floor roads due to active debris flow.</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-outline-variant/20">
                <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
                  <span className="flex items-center gap-1"><Footprints size={14} className="text-emerald-400" /> Distance: 800m uphill</span>
                  <span className="flex items-center gap-1"><Clock size={14} className="text-emerald-400" /> Est. walk time: 14 mins</span>
                  <span className="flex items-center gap-1"><Mountain size={14} className="text-emerald-400" /> Gain: +180m</span>
                </div>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=27.51,88.53" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors no-underline cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Open in GPS Navigation</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Reassuring Field Imagery Card */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-low shadow-md border border-outline-variant/40">
          <div 
            className="bg-cover bg-center w-full h-44 sm:h-52 relative" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4sd10E21r_9FgzUIaS8xhgPE7ccOEdgBMhhVGhOamH_w_SKftlkhsI3UqVSMoEAWR7Xq_BPh2dMF2pRA4md01rftCZv6eMgtSz7pIiwWiSkTKEuVUchd20Ks5lURqb330Aes--tzsc0qcO6j8IGOoSfkPsB2gKQgK8-zAMNQZbX4ue8JZ7EPJKCv0nloyHhOGGgUwi7tPE4VLxiwDjPmFeP6JBBBdv6iySi3FRQpk6JR6c-Acr4QF")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c120f] via-[#0c120f]/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BadgeCheck size={22} className="text-emerald-400 shrink-0" />
                <span className="font-mono text-xs sm:text-sm text-white font-bold tracking-wider uppercase drop-shadow">
                  Reinforced High Ground Shelter (Upper Mangan)
                </span>
              </div> 
              <span className="font-mono text-xs bg-black/70 backdrop-blur text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-semibold">
                Capacity: 450 &bull; 268 Available
              </span>
            </div>
          </div>
        </div>

        {/* Short, Plain-Language Safety Guide */}
        <div className="flex flex-col bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5 sm:p-6 gap-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-1 border-b border-outline-variant/30">
            <Shield size={22} className="text-amber-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-on-surface">Essential Actions for Your Family</h2>
          </div>
          <ul className="flex flex-col gap-4 list-none m-0 p-0 text-on-surface">
            
            {/* Action 1: Immediate Shelter */}
            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={20} className="text-emerald-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-on-surface">Immediate shelter</span>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  Government Senior Secondary School, Upper Mangan (800m north). Clean water, warm bedding, and first-aid medics are on site.
                </p>
              </div>
            </li>

            {/* Action 2: Avoid River Routes */}
            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <AlertOctagon size={20} className="text-red-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-on-surface">Avoid river routes</span>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  Avoid NH-10 and Teesta river valley roads due to active debris flow and flash accumulation. Use only marked ridge walkways.
                </p>
              </div>
            </li>

            {/* Action 3: Emergency Helplines */}
            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Headphones size={20} className="text-amber-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-on-surface">Emergency helplines</span>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  Call State Disaster Control at <a className="text-primary font-bold underline" href="tel:1077">1077</a> or nationwide emergency at <a className="text-primary font-bold underline" href="tel:112">112</a>. Lines remain functional on satellite relay.
                </p>
              </div>
            </li>

            {/* Action 4: Stay Tuned */}
            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Radio size={20} className="text-cyan-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-on-surface">Stay tuned</span>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  Battery-powered radio alerts broadcast every 15 minutes on All India Radio Gangtok (FM 100.1 MHz).
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Reassuring Verification Note */}
        <div className="flex items-center justify-center gap-2 py-2 text-on-surface-variant">
          <ShieldCheck size={16} className="text-primary shrink-0" />
          <span className="font-mono text-xs uppercase tracking-wider text-center">
            Issued by District Collector &amp; GSI Landslide Early Warning Cell
          </span>
        </div>

      </div>
    </main>
  );
}
