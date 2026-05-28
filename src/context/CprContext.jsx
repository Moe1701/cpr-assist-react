import React, { createContext, useReducer } from 'react';

// ==========================================
// 1. CONTEXT INITIALISIERUNG
// ==========================================
export const CprContext = createContext();

// ==========================================
// 2. STATISCHE DATEN (Broselow / PALS)
// ==========================================
const broselowData = [
  { color: 'grau',   minKg: 3,  maxKg: 5,  avgKg: 4,    cm: 55,  ageStr: '< 1 J.' },
  { color: 'rosa',   minKg: 6,  maxKg: 7,  avgKg: 6.5,  cm: 65,  ageStr: '< 1 J.' },
  { color: 'rot',    minKg: 8,  maxKg: 9,  avgKg: 8.5,  cm: 70,  ageStr: '< 1 J.' },
  { color: 'lila',   minKg: 10, maxKg: 11, avgKg: 10.5, cm: 80,  ageStr: '1-2 J.' },
  { color: 'gelb',   minKg: 12, maxKg: 14, avgKg: 13,   cm: 90,  ageStr: '2-3 J.' },
  { color: 'weiss',  minKg: 15, maxKg: 18, avgKg: 16.5, cm: 100, ageStr: '4-5 J.' },
  { color: 'blau',   minKg: 19, maxKg: 23, avgKg: 21,   cm: 110, ageStr: '6-7 J.' },
  { color: 'orange', minKg: 24, maxKg: 29, avgKg: 26.5, cm: 120, ageStr: '8-9 J.' },
  { color: 'gruen',  minKg: 30, maxKg: 36, avgKg: 33,   cm: 135, ageStr: '10-12 J.' }
];

// ==========================================
// 3. INITIALER STATE (Der Startzustand)
// ==========================================
const initialState = {
  // App Steuerung
  appPhase: 'ONBOARDING',
  isPatientModalOpen: false, // Steuert das Modal global
  hasAcceptedDisclaimer: localStorage.getItem('cpr_disclaimer_accepted') === 'true',
  
  // Patienten Daten
  isPediatric: false,
  patientWeight: null,
  broselowData: broselowData,
  
  // Timer & Logik
  totalSeconds: 0,
  isCompressing: false
};

// ==========================================
// 4. REDUCER (Die Logik-Zentrale)
// ==========================================
function cprReducer(state, action) {
  switch (action.type) {
    
    // --- System & UI ---
    case 'ACCEPT_DISCLAIMER':
      localStorage.setItem('cpr_disclaimer_accepted', 'true');
      return { 
        ...state, 
        hasAcceptedDisclaimer: true 
      };
      
    case 'SET_PHASE':
      return { 
        ...state, 
        appPhase: action.payload 
      };
      
    case 'TOGGLE_PATIENT_MODAL':
      return { 
        ...state, 
        isPatientModalOpen: action.payload 
      };

    // --- Patienten-Setup ---
    case 'SET_PEDIATRIC_DATA':
      return {
        ...state,
        isPediatric: action.payload.isPediatric,
        patientWeight: action.payload.patientWeight
      };

    // --- CPR Logik ---
    case 'START_REA_LOGIC':
      return { 
        ...state, 
        isCompressing: true 
      };

    // --- Fallback ---
    default:
      return state;
  }
}

// ==========================================
// 5. PROVIDER KOMPONENTE (Der Tresor selbst)
// ==========================================
export function CprProvider({ children }) {
  const [state, dispatch] = useReducer(cprReducer, initialState);

  // Kompatibilität für MedicalDisclaimer beibehalten
  const acceptDisclaimer = () => dispatch({ type: 'ACCEPT_DISCLAIMER' });
  const hasAcceptedDisclaimer = state.hasAcceptedDisclaimer;

  return (
    <CprContext.Provider value={{ 
      state, 
      dispatch, 
      hasAcceptedDisclaimer, 
      acceptDisclaimer 
    }}>
      {children}
    </CprContext.Provider>
  );
}