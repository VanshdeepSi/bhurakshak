import { API_BASE } from '../config/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { emergencyAudio } from '../utils/emergencyAudio';
import DirectDangerAlertModal from '../components/DirectDangerAlertModal';

const AlertContext = createContext(null);

export const DANGER_ZONE_DISTRICTS = ['Darjeeling', 'Churachandpur', 'Mangan'];

export function AlertProvider({ children }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [dispatchedEmailRecord, setDispatchedEmailRecord] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync user state from localStorage
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('bhurakshak_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
        } catch (_) {}
      } else {
        setCurrentUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Directly trigger an emergency alert with audio siren, modal, and email dispatch
  const triggerDirectAlert = async (alertData = {}, autoDispatch = true) => {
    const districtName = alertData.district || currentUser?.district || 'Darjeeling';
    const stateName = alertData.state || 'West Bengal';
    const probability = alertData.probability || 0.94;
    const rainfall = alertData.rainfall_72h || 242.6;
    const fos = alertData.factor_of_safety || 0.84;

    const fullAlert = {
      district: districtName,
      state: stateName,
      tier: 4,
      probability,
      rainfall_72h: rainfall,
      factor_of_safety: fos,
      message: alertData.message || `CRITICAL SIGNAL RED: Landslide probability ${Math.round(probability * 100)}% threshold exceeded.`
    };

    setActiveAlert(fullAlert);
    setIsAlertModalOpen(true);

    // 1. Play emergency audio alert siren
    emergencyAudio.playSiren(2.5);

    // 2. Custom dismissible alert banner toast with explicit ✕ cross button
    toast((t) => (
      <div className="flex items-center justify-between gap-3 w-full py-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">🚨</span>
          <div className="text-left">
            <span className="block text-xs font-bold text-white uppercase tracking-wider font-mono">
              CRITICAL DANGER ALERT: {districtName}
            </span>
            <span className="block text-[11px] text-red-200">
              Tier 4 Red Alert! Hydro-geotechnical threshold exceeded.
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            emergencyAudio.stop();
          }}
          className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    ), {
      id: 'emergency-danger-toast',
      duration: 8000,
      style: {
        background: '#7f1d1d',
        color: '#fff',
        border: '1px solid #ef4444',
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
        padding: '10px 14px',
        maxWidth: '480px'
      }
    });

    // 3. Automated email dispatch via backend SMTP if recipient known
    const targetEmail = currentUser?.email || alertData.email;
    if (autoDispatch && targetEmail) {
      try {
        const res = await axios.post(`${API_BASE}/notifications/send-alert-email`, {
          email: targetEmail,
          district: districtName,
          force: true
        });

        const delivery = res.data.smtp_delivery;
        setDeliveryStatus(delivery);
        setDispatchedEmailRecord(res.data.dispatched_email);

        if (delivery?.real_sent) {
          toast.success(`Real emergency email transmitted to ${targetEmail} via SMTP!`, { duration: 6000 });
        }
      } catch (err) {
        console.error('Failed auto email dispatch on alert trigger:', err);
      }
    }
  };

  // Check if a district is in danger zone and trigger alert immediately if so
  const checkAndAlertIfDangerZone = (districtName, force = false) => {
    if (!districtName) return;
    const cleanName = districtName.trim().toLowerCase();
    const isDanger = DANGER_ZONE_DISTRICTS.some(d => d.toLowerCase() === cleanName);

    if (isDanger) {
      const sessionKey = `bhurakshak_alerted_${cleanName}`;
      const alreadyAlerted = sessionStorage.getItem(sessionKey);

      if (!alreadyAlerted || force) {
        sessionStorage.setItem(sessionKey, 'true');
        triggerDirectAlert({
          district: districtName,
          state: cleanName.includes('darjeeling') ? 'West Bengal' : cleanName.includes('churachandpur') ? 'Manipur' : 'Sikkim',
          tier: 4,
          probability: cleanName.includes('darjeeling') ? 0.94 : 0.91,
          rainfall_72h: 242.6,
          factor_of_safety: 0.84
        }, true);
      }
    }
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    emergencyAudio.stop();
  };

  return (
    <AlertContext.Provider value={{
      activeAlert,
      isAlertModalOpen,
      deliveryStatus,
      dispatchedEmailRecord,
      triggerDirectAlert,
      checkAndAlertIfDangerZone,
      closeAlertModal
    }}>
      {children}
      {isAlertModalOpen && (
        <DirectDangerAlertModal 
          alertData={activeAlert}
          user={currentUser}
          deliveryStatus={deliveryStatus}
          onClose={closeAlertModal}
          onEmailDispatched={(emailRecord, delivery) => {
            setDispatchedEmailRecord(emailRecord);
            setDeliveryStatus(delivery);
          }}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return ctx;
}
