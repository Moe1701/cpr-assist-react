// --- Datei: src/context/CprContext.jsx ---
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { CPR_CONFIG } from '../config/cprConfig.js';

const initialState = {
  appPhase: CPR_CONFIG.PHASES.ONBOARDING, // <-- Nutzt jetzt die saubere Konstante
  isPediatric: false,
  patientWeight: null,
  cprMode: '30:2',
  
  startTime: null,         
  isGridVisible: false,    // UI Flag
  
  missionSeconds: 0, 
  cprSeconds: 0,     
  isCompressing: false,
  isPatientModalOpen: false, // UI Flag
  
  events: [],      
  reminders: [],
  
  broselowData: [
    {color:'grau', minKg:3, maxKg:5, avgKg:4, ageStr: '< 1 J.'},
    {color:'rosa', minKg:6, maxKg:7, avgKg:6.5, ageStr: '< 1 J.'},
    {color:'rot', minKg:8, maxKg:9, avgKg:8.5, ageStr: '< 1 J.'},
    {color:'lila', minKg:10, maxKg:11, avgKg:10.5, ageStr: '1-2 J.'},
    {color:'gelb', minKg:12, maxKg:14, avgKg:13, ageStr: '2-3 J.'},
    {color:'weiss', minKg:15, maxKg:18, avgKg:16.5, ageStr: '4-5 J.'},
    {color:'blau', minKg:19, maxKg:23, avgKg:21, ageStr: '6-7 J.'},
    {color:'orange', minKg:24, maxKg:29, avgKg:26.5, ageStr: '8-9 J.'},
    {color:'gruen', minKg:30, maxKg:36, avgKg:33, ageStr: '10-12 J.'}
  ]
};

const loadState = () => {
  try {
    const saved = localStorage.getItem('cprAssist_db');
    if (saved) {
       const parsed = JSON.parse(saved);
       
       // Fallback für ganz alte Versionen
       if (parsed.appPhase === 'SETUP') parsed.appPhase = CPR_CONFIG.PHASES.ONBOARDING;
       if (!parsed.broselowData) parsed.broselowData = initialState.broselowData;
       
       // UI-FLAGS ZWANGSWEISE ZURÜCKSETZEN BEIM LADEN
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
        cprMode: action.payload.isPediatric ? '15:2' : '30:2',
        startTime: state.startTime || new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };

    case 'TOGGLE_PATIENT_MODAL':
      return { ...state, isPatientModalOpen: action.payload };

    case 'TOGGLE_GRID':
      return { ...state, isGridVisible: !state.isGridVisible };

    case 'START_REA_LOGIC':
      return { ...state, appPhase: CPR_CONFIG.PHASES.RUNNING };

    case 'LOG_EVENT':
      return { ...state, events: [...state.events, action.payload] };

    case 'TOGGLE_COMPRESSION':
      return { ...state, isCompressing: action.payload };

    case 'TICK_MISSION':
      return { ...state, missionSeconds: state.missionSeconds + 1 };

    case 'TICK_CPR':
      return { ...state, cprSeconds: state.cprSeconds + 1 };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

export const CprContext = createContext();

export function CprProvider({ children }) {
  const [state, dispatch] = useReducer(cprReducer, initialState, loadState);

  // NEU: SMARTER SPEICHER (Filtert UI-Flags aus!)
  useEffect(() => {
    const stateToSave = {
      appPhase: state.appPhase,
      isPediatric: state.isPediatric,
      patientWeight: state.patientWeight,
      cprMode: state.cprMode,
      startTime: state.startTime,
      missionSeconds: state.missionSeconds,
      cprSeconds: state.cprSeconds,
      isCompressing: state.isCompressing,
      events: state.events,
      reminders: state.reminders,
      broselowData: state.broselowData
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