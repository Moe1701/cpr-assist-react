// --- Datei: src/context/CprContext.jsx ---
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { CPR_CONFIG } from '../config/cprConfig.js';

const initialState = {
  appPhase: CPR_CONFIG.PHASES.ONBOARDING,
  isPediatric: false,
  patientWeight: null,
  cprMode: 'continuous', 
  
  startTime: null,         
  isGridVisible: false,    
  isPatientModalOpen: false, 
  
  // Timer & Einsatz-Zeiten
  missionSeconds: 0, 
  cprSeconds: 0, // Für das große Center-Display (reine CPR-Dauer)
  cycleSeconds: 0, // 120s Rhythmuscheck-Loop
  
  // Ping-Pong & CCF State
  isCompressing: false,
  isVentilationPhase: false,
  compressionCount: 0,
  airwayEstablished: null,
  compressingSeconds: 0, // Zähler für CCF
  arrestSeconds: 0,      // Nenner für CCF
  currentCcfPercent: 100,
  
  events: [],      
  reminders: [],
  
  broselowData: [
    {color:'grau', minKg:3, maxKg:5, avgKg:4, cm:55, ageStr: '< 1 J.', airway:{tubus:'3.0-3.5', tiefe:'9-10', sga:'1', guedel:'000', wendel:'12 CH'}},
    {color:'rosa', minKg:6, maxKg:7, avgKg:6.5, cm:65, ageStr: '< 1 J.', airway:{tubus:'3.5', tiefe:'10-11', sga:'1.5', guedel:'00', wendel:'14 CH'}},
    {color:'rot', minKg:8, maxKg:9, avgKg:8.5, cm:70, ageStr: '< 1 J.', airway:{tubus:'3.5-4.0', tiefe:'11-12', sga:'1.5', guedel:'0', wendel:'16 CH'}},
    {color:'lila', minKg:10, maxKg:11, avgKg:10.5, cm:80, ageStr: '1-2 J.', airway:{tubus:'4.0', tiefe:'12', sga:'1.5-2.0', guedel:'1', wendel:'18 CH'}},
    {color:'gelb', minKg:12, maxKg:14, avgKg:13, cm:90, ageStr: '2-3 J.', airway:{tubus:'4.0-4.5', tiefe:'13', sga:'2.0', guedel:'1', wendel:'20 CH'}},
    {color:'weiss', minKg:15, maxKg:18, avgKg:16.5, cm:100, ageStr: '4-5 J.', airway:{tubus:'4.5', tiefe:'14', sga:'2.0', guedel:'2', wendel:'22 CH'}},
    {color:'blau', minKg:19, maxKg:23, avgKg:21, cm:110, ageStr: '6-7 J.', airway:{tubus:'5.0', tiefe:'15', sga:'2.0-2.5', guedel:'2', wendel:'24 CH'}},
    {color:'orange', minKg:24, maxKg:29, avgKg:26.5, cm:120, ageStr: '8-9 J.', airway:{tubus:'5.5', tiefe:'16-17', sga:'2.5', guedel:'2-3', wendel:'26 CH'}},
    {color:'gruen', minKg:30, maxKg:36, avgKg:33, cm:135, ageStr: '10-12 J.', airway:{tubus:'6.0', tiefe:'18', sga:'3.0', guedel:'3', wendel:'28 CH'}}
  ]
};

const loadState = () => {
  try {
    const saved = localStorage.getItem('cprAssist_db');
    if (saved) {
       const parsed = JSON.parse(saved);
       if (parsed.appPhase === 'SETUP') parsed.appPhase = CPR_CONFIG.PHASES.ONBOARDING;
       if (!parsed.broselowData) parsed.broselowData = initialState.broselowData;
       parsed.isGridVisible = false;
       parsed.isPatientModalOpen = false;
       return parsed;
    }
    return initialState;
  } catch (e) {
    return initialState;
  }
};

function cprReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, appPhase: action.payload };

    case 'SET_PEDIATRIC_DATA':
      return { 
        ...state, 
        isPediatric: action.payload.isPediatric,
        patientWeight: action.payload.patientWeight,
        cprMode: 'continuous', 
        startTime: state.startTime || new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };

    case 'SET_CPR_MODE':
      return { ...state, cprMode: action.payload };

    case 'TOGGLE_PATIENT_MODAL':
      return { ...state, isPatientModalOpen: action.payload };

    case 'TOGGLE_GRID':
      return { ...state, isGridVisible: !state.isGridVisible };

    case 'LOG_EVENT':
      return { ...state, events: [...state.events, action.payload] };

    // --- Ping-Pong & Steuerungs-Aktionen ---
    case 'TOGGLE_COMPRESSION':
      return { ...state, isCompressing: action.payload };
      
    case 'SET_COMPRESSION_COUNT':
      return { ...state, compressionCount: action.payload };
      
    case 'SET_VENTILATION_PHASE':
      return { ...state, isVentilationPhase: action.payload };
      
    case 'SET_AIRWAY':
      return { ...state, airwayEstablished: action.payload };

    // --- Timer Ticks ---
    case 'TICK_MISSION':
      return { ...state, missionSeconds: state.missionSeconds + 1 };
      
    case 'TICK_CYCLE':
      return { ...state, cycleSeconds: state.cycleSeconds + 1 };

    case 'TICK_CCF_ARREST': {
      // Nenner: Läuft unerbittlich jede Sekunde (CCF sinkt in Pausen)
      const newArrest = state.arrestSeconds + 1;
      const rawCcf = (state.compressingSeconds / newArrest) * 100;
      return { 
        ...state, 
        arrestSeconds: newArrest,
        currentCcfPercent: Math.min(100, Math.round(rawCcf))
      };
    }
      
    case 'TICK_CCF_COMPRESSING':
      // Zähler: Läuft nur, wenn Hände auf dem Thorax sind (isCompressing === true)
      return { 
        ...state, 
        compressingSeconds: state.compressingSeconds + 1,
        cprSeconds: state.cprSeconds + 1 
      };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

export const CprContext = createContext();

export function CprProvider({ children }) {
  const [state, dispatch] = useReducer(cprReducer, initialState, loadState);

  useEffect(() => {
    const stateToSave = {
      appPhase: state.appPhase,
      isPediatric: state.isPediatric,
      patientWeight: state.patientWeight,
      cprMode: state.cprMode,
      startTime: state.startTime,
      missionSeconds: state.missionSeconds,
      cprSeconds: state.cprSeconds,
      cycleSeconds: state.cycleSeconds,
      isCompressing: state.isCompressing,
      events: state.events,
      reminders: state.reminders,
      broselowData: state.broselowData,
      currentCcfPercent: state.currentCcfPercent,
      compressingSeconds: state.compressingSeconds,
      arrestSeconds: state.arrestSeconds
    };
    localStorage.setItem('cprAssist_db', JSON.stringify(stateToSave));
  }, [state]);

  const logEvent = useCallback((type, detail = "") => {
    const newEvent = {
      id: crypto.randomUUID(),
      realTime: new Date().toLocaleTimeString('de-DE', { hour12: false }),
      missionTime: state.missionSeconds,
      type: type,
      detail: detail
    };
    dispatch({ type: 'LOG_EVENT', payload: newEvent });
  }, [state.missionSeconds]);

  return (
    <CprContext.Provider value={{ state, dispatch, logEvent }}>
      {children}
    </CprContext.Provider>
  );
}