import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MainDashboard from './pages/MainDashboard';
import AlertsCenter from './pages/AlertsCenter';
import GeotechnicalTelemetry from './pages/GeotechnicalTelemetry';
import DistrictDetailRiskReport from './pages/DistrictDetailRiskReport';
import ModelXAIInsights from './pages/ModelXAIInsights';
import SystemHealthMLOps from './pages/SystemHealthMLOps';
import CitizenPublicView from './pages/CitizenPublicView';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import 'leaflet/dist/leaflet.css';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AlertProvider>
          <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }} />
          <div className="flex h-screen bg-background text-on-background font-body-sm overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopBar />
              <div className="flex-1 flex flex-col overflow-y-auto w-full h-full relative">
                <Routes>
                  <Route path="/" element={<MainDashboard />} />
                  <Route path="/alerts" element={<AlertsCenter />} />
                  <Route path="/mlops" element={<SystemHealthMLOps />} />
                  <Route path="/telemetry" element={<GeotechnicalTelemetry />} />
                  <Route path="/district/:name" element={<DistrictDetailRiskReport />} />
                  <Route path="/xai" element={<ModelXAIInsights />} />
                  <Route path="/public" element={<CitizenPublicView />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </AlertProvider>
      </Router>
    </ThemeProvider>
  );
}
