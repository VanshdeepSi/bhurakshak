import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  '/': 'Dashboard',
  '/alerts': 'Alerts Center',
  '/telemetry': 'Sensor Telemetry',
  '/mlops': 'MLOps & System Health',
  '/xai': 'XAI Model Insights',
  '/public': 'Citizen Advisory',
  '/settings': 'Settings',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/') return null;

  const isDistrict = path.startsWith('/district/');
  const districtName = isDistrict ? decodeURIComponent(path.replace('/district/', '')) : '';

  const crumbs = [{ to: '/', label: 'Home' }];

  if (isDistrict) {
    crumbs.push({ to: path, label: districtName });
  } else {
    const label = ROUTE_LABELS[path] || path.replace('/', '');
    crumbs.push({ to: path, label });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant px-4 sm:px-6 pt-3 pb-1 select-none">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.to}>
          {i > 0 && <ChevronRight size={12} className="text-outline shrink-0" />}
          {i === crumbs.length - 1 ? (
            <span className="text-on-surface font-semibold truncate max-w-[200px]">{crumb.label}</span>
          ) : (
            <Link to={crumb.to} className="hover:text-primary transition-colors no-underline flex items-center gap-1">
              {i === 0 && <Home size={12} />}
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
