import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import usePageMeta from '../utils/usePageMeta';

export default function NotFoundPage() {
  usePageMeta(`Page Not Found`, `The page you are looking for does not exist.`);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Mountain silhouette decoration */}
      <div className="relative mb-8">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" className="text-emerald-600/30">
          <path d="M0 80L30 30L50 50L70 15L90 45L120 80H0Z" fill="currentColor" />
          <path d="M20 80L50 40L70 55L100 20L120 80H20Z" fill="currentColor" opacity="0.5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle size={40} className="text-amber-500/80" />
        </div>
      </div>

      <h1 className="text-6xl font-bold font-mono text-on-surface mb-3">404</h1>
      <p className="text-lg text-on-surface-variant font-medium mb-2">Sector Not Found</p>
      <p className="text-sm text-outline max-w-md mb-8 leading-relaxed">
        The geological sector you're looking for doesn't exist in the BhuRakshak monitoring network.
        It may have been relocated or the coordinates are incorrect.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors no-underline"
        >
          <Home size={16} />
          Return to Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg text-sm font-medium border border-outline-variant/50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    </div>
  );
}
