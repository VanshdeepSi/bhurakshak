
import React from 'react';
import toast from 'react-hot-toast';

export default function CitizenPublicView() {
  const handleFeatureClick = () => toast('Feature disabled in demo mode.', { icon: '🚧' });

  return (
    <>
      <main className="flex flex-col relative w-full pt-20 pb-20 bg-surface min-h-screen"><div className="flex flex-col w-full px-space-md py-space-md gap-space-lg">
{/*  Minimal Context Sub-bar & Language Quick Toggle  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">Citizen Advisory · Live Status</span>
</div>
<div className="inline-flex rounded bg-surface-container p-0.5">
<button onClick={handleFeatureClick} className="px-2.5 py-1 rounded font-label-caps text-label-caps bg-surface-bright text-on-surface transition-colors" id="lang-en">EN</button>
<button onClick={handleFeatureClick} className="px-2.5 py-1 rounded font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors" id="lang-as">অসমীয়া</button>
<button onClick={handleFeatureClick} className="px-2.5 py-1 rounded font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors" id="lang-ne">नेपाली</button>
</div>
</div>
{/*  Prominent Citizen Search Bar  */}
<div className="relative w-full">
<label className="sr-only" htmlFor="location-query">Search location safety</label>
<div className="relative flex items-center bg-surface-container rounded-lg shadow-md focus-within:bg-surface-container-high transition-all">
<span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">search</span>
<input className="w-full bg-transparent pl-12 pr-10 py-3.5 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none" id="location-query" placeholder="Is my area safe? Search village, town, or pin code..." type="text" value="Mangan, North Sikkim" onChange={() => {}}/>
<button onClick={handleFeatureClick} aria-label="Clear location search" className="absolute right-3 p-1 text-on-surface-variant hover:text-on-surface" id="clear-search">
<span className="material-symbols-outlined text-[20px]">cancel</span>
</button>
</div>
<div className="flex items-center justify-between mt-2 px-1">
<span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-primary">my_location</span> GPS Detected: Dzongu Subdivision
      </span>
<span className="font-label-caps text-label-caps text-on-surface-variant">Updated 2 mins ago</span>
</div>
</div>
{/*  Large Answer State: Critical Alert Tier Banner  */}
<div className="flex flex-col bg-error-container text-on-error-container rounded-xl p-space-md shadow-xl gap-space-sm relative overflow-hidden">
<div className="flex items-center justify-between">
<div className="inline-flex items-center gap-2 bg-error text-on-error px-2.5 py-1 rounded">
<span className="material-symbols-outlined text-[18px]">emergency_home</span>
<span className="font-label-caps text-label-caps tracking-widest uppercase font-bold">Critical Alert · High Landslide Risk</span>
</div>
<span className="font-label-caps text-label-caps uppercase text-on-error-container/80 tracking-wider">Level 4</span>
</div>
<p className="font-headline-sm text-headline-sm text-on-error-container font-semibold pt-1 leading-snug">
      Evacuate immediately. Follow official instructions and move to designated high-ground shelters.
    </p>
<div className="flex items-center gap-2 pt-1 text-on-error-container/90">
<span className="material-symbols-outlined text-[18px] shrink-0">info</span>
<span className="font-body-sm text-body-sm">Slope instability verified along Mangan Ridge by GSI monitoring units.</span>
</div>
</div>
{/*  Emergency Actions (Two Large Touch Buttons)  */}
<div className="flex flex-col gap-space-sm pt-1">
<a className="min-h-[52px] w-full px-space-md py-3 bg-error text-on-error rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform" href="tel:1077">
<span className="material-symbols-outlined text-[24px]">call</span>
<span>Call Emergency Helpline (1077)</span>
</a>
<button onClick={handleFeatureClick} className="min-h-[52px] w-full px-space-md py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-3 shadow active:scale-[0.98] transition-colors" id="view-route-btn">
<span className="material-symbols-outlined text-primary text-[24px]">near_me</span>
<span>View Evacuation Route &amp; Shelters</span>
</button>
</div>
{/*  Route Map View Contextual Drawer  */}
<div className="hidden flex-col bg-surface-container-low rounded-xl p-space-md gap-space-sm" id="route-panel">
<div className="flex items-center justify-between pb-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">explore</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Immediate Path: Upper Mangan</span>
</div>
<span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-primary-container text-on-primary-container">Cleared Path</span>
</div>
<div className="w-full h-44 bg-cover bg-center rounded-lg shadow-inner relative overflow-hidden flex items-end p-2.5" data-location="Mangan, North Sikkim, India" style={{  }}>
<div className="bg-surface-container-highest/90 backdrop-blur px-2.5 py-1 rounded text-on-surface font-label-caps text-label-caps flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-primary"></span> Safe Corridor: Helipad Bypass Road
      </div>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-1">
<span>Distance: 800 meters uphill</span>
<span>Est. walk time: 14 mins</span>
</div>
</div>
{/*  Reassuring Field Imagery Card  */}
<div className="relative w-full rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
<div className="bg-cover bg-center w-full h-36 relative" data-alt="Calm community shelter building nestled safely on a reinforced upper green plateau in Sikkim mountains with low monsoon mist and safety signage, overcast daylight, documentary realism." style={{ 'backgroundImage': 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4sd10E21r_9FgzUIaS8xhgPE7ccOEdgBMhhVGhOamH_w_SKftlkhsI3UqVSMoEAWR7Xq_BPh2dMF2pRA4md01rftCZv6eMgtSz7pIiwWiSkTKEuVUchd20Ks5lURqb330Aes--tzsc0qcO6j8IGOoSfkPsB2gKQgK8-zAMNQZbX4ue8JZ7EPJKCv0nloyHhOGGgUwi7tPE4VLxiwDjPmFeP6JBBBdv6iySi3FRQpk6JR6c-Acr4QF")' }}>
<div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent"></div>
<div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]">verified</span>
<span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">Reinforced High Ground Shelter</span>
</div>
<span className="font-label-caps text-label-caps bg-surface/80 text-on-surface px-2 py-0.5 rounded">Capacity: 450</span>
</div>
</div>
</div>
{/*  Short, Plain-Language Safety Guide  */}
<div className="flex flex-col bg-surface-container-low rounded-xl p-space-md gap-space-md">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">shield</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Essential Actions for Your Family</h2>
</div>
<ul className="flex flex-col gap-space-md list-none m-0 p-0 text-on-surface">
<li className="flex items-start gap-3">
<div className="w-8 h-8 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-primary text-[18px]">domain</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-body-lg text-body-lg text-on-surface font-semibold">Immediate shelter</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            Government Senior Secondary School, Upper Mangan (800m north). Clean water, warm bedding, and first-aid medics are on site.
          </p>
</div>
</li>
<li className="flex items-start gap-3">
<div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-error text-[18px]">no_crash</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-body-lg text-body-lg text-on-surface font-semibold">Avoid river routes</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            Avoid NH-10 and Teesta river valley roads due to active debris flow and flash accumulation. Use only marked ridge walkways.
          </p>
</div>
</li>
<li className="flex items-start gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-secondary text-[18px]">support_agent</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-body-lg text-body-lg text-on-surface font-semibold">Emergency helplines</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            Call State Disaster Control at <a className="text-primary font-semibold underline" href="tel:1077">1077</a> or nationwide emergency at <a className="text-primary font-semibold underline" href="tel:112">112</a>. Lines remain functional on satellite link.
          </p>
</div>
</li>
<li className="flex items-start gap-3">
<div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">radio</span>
</div>
<div className="flex flex-col min-w-0">
<span className="font-body-lg text-body-lg text-on-surface font-semibold">Stay tuned</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            Battery-powered radio alerts broadcast every 15 minutes on All India Radio Gangtok (FM 100.1 MHz).
          </p>
</div>
</li>
</ul>
</div>
{/*  Reassuring Verification Note  */}
<div className="flex items-center justify-center gap-2 py-space-sm text-on-surface-variant/80">
<span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
<span className="font-label-caps text-label-caps tracking-wider uppercase text-center">Issued by District Collector &amp; GSI Landslide Cell</span>
</div>
</div>
</main>
    </>
  );
}

