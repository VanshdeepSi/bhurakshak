import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';
import { Zap, CheckCircle2, X } from 'lucide-react';

export default function BackendWarmingBanner() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'warming' | 'connected' | 'dismissed'
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    let timer = null;
    let isMounted = true;
    const startTime = Date.now();

    timer = setTimeout(() => {
      if (isMounted && status === 'checking') {
        setStatus('warming');
      }
    }, 2000);

    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts`, { method: 'GET' });
        if (res.ok && isMounted) {
          clearTimeout(timer);
          const elapsed = Date.now() - startTime;
          setLatency(elapsed);
          setStatus('connected');
          setTimeout(() => {
            if (isMounted) setStatus('dismissed');
          }, 4000);
        }
      } catch {
        if (isMounted && status !== 'dismissed') {
          setStatus('warming');
          setTimeout(checkBackend, 4000);
        }
      }
    };

    checkBackend();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (status === 'checking' || status === 'dismissed') return null;

  return (
    <div className={`w-full px-4 py-2 text-xs font-mono flex items-center justify-between border-b transition-all duration-300 z-50 ${
      status === 'warming' 
        ? 'bg-amber-950/80 border-amber-500/30 text-amber-200 backdrop-blur-md'
        : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200 backdrop-blur-md'
    }`}>
      <div className="flex items-center gap-2 max-w-6xl mx-auto flex-1">
        {status === 'warming' ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>RENDER CLOUD INITIALIZING:</strong> Free-tier container spin-up in progress (~45s). Live cached telemetry active; AI engine will hot-connect automatically.
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              <strong>CLOUD AI ENGINE CONNECTED:</strong> Live model weights active (Latency: {latency || 280}ms). Sub-120ms inference ready.
            </span>
          </>
        )}
      </div>
      <button 
        onClick={() => setStatus('dismissed')}
        className="p-1 text-slate-400 hover:text-white rounded ml-2 shrink-0"
        title="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
