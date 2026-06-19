// --- Datei: src/context/CprContext.jsx ---
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { cprReducer, initialState } from './cprReducer.js'; 

export const CprContext = createContext();

const loadState = () => {
  try {
    const saved = localStorage.getItem('cprAssist_db');
    if (saved) {
       const parsed = JSON.parse(saved);
       parsed.isGridVisible = false;
       parsed.isPatientModalOpen = false;
       
       if (parsed.bpm === undefined) parsed.bpm = 110;
       if (parsed.isMuted === undefined) parsed.isMuted = false;
       if (parsed.shockCount === undefined) parsed.shockCount = 0;
       if (parsed.lastJoule === undefined) parsed.lastJoule = null; // <--- NEU
       if (parsed.airwayEstablished === undefined) parsed.airwayEstablished = false;
       
       return parsed;
    }
    return initialState;
  } catch (e) {
    return initialState;
  }
};

export function CprProvider({ children }) {
  const [state, dispatch] = useReducer(cprReducer, initialState, loadState);

  useEffect(() => {
    const stateToSave = {
      appPhase: state.appPhase,
      isPediatric: state.isPediatric,
      patientWeight: state.patientWeight,
      cprMode: state.cprMode,
      bpm: state.bpm,                 
      isMuted: state.isMuted,         
      shockCount: state.shockCount,   
      lastJoule: state.lastJoule,     // <--- NEU: Sichert den Joule-Wert!
      startTime: state.startTime,
      missionSeconds: state.missionSeconds,
      cprSeconds: state.cprSeconds,
      cycleSeconds: state.cycleSeconds,
      isCompressing: state.isCompressing,
      airwayEstablished: state.airwayEstablished,
      airwayType: state.airwayType,
      airwaySize: state.airwaySize,   
      airwayDepth: state.airwayDepth, 
      events: state.events,
      reminders: state.reminders,
      currentCcfPercent: state.currentCcfPercent,
      compressingSeconds: state.compressingSeconds,
      arrestSeconds: state.arrestSeconds
    };
    localStorage.setItem('cprAssist_db', JSON.stringify(stateToSave));
  }, [state]);

  const logEvent = useCallback((type, detail = "") => {
    const now = new Date();
    const realTimeStr = now.toLocaleTimeString('de-DE', { hour12: false });
    
    const formatMissionTime = (totalSeconds) => {
      const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    const formattedEntry = `[${realTimeStr}] (${formatMissionTime(state.missionSeconds)}) ${type}: ${detail}`;

    const newEvent = {
      id: crypto.randomUUID(),
      realTime: realTimeStr,
      missionTime: state.missionSeconds,
      type: type,
      detail: detail,
      fullEntry: formattedEntry
    };
    
    dispatch({ type: 'LOG_EVENT', payload: newEvent });
  }, [state.missionSeconds]);

  return (
    <CprContext.Provider value={{ state, dispatch, logEvent }}>
      {children}
    </CprContext.Provider>
  );
}
