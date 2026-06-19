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
       parsed.isHitsModalOpen = false; 
       parsed.isLogModalOpen = false; // <--- NEU
       
       if (parsed.bpm === undefined) parsed.bpm = 110;
       if (parsed.isMuted === undefined) parsed.isMuted = false;
       if (parsed.shockCount === undefined) parsed.shockCount = 0;
       if (parsed.lastJoule === undefined) parsed.lastJoule = null; 
       if (parsed.airwayEstablished === undefined) parsed.airwayEstablished = false;
       if (parsed.zugang === undefined) parsed.zugang = null;
       if (parsed.adrSeconds === undefined) parsed.adrSeconds = 0;
       if (parsed.adrCount === undefined) parsed.adrCount = 0;
       if (parsed.amioCount === undefined) parsed.amioCount = 0; 
       if (parsed.hitsStatus === undefined) parsed.hitsStatus = {}; 
       if (parsed.anamneseData === undefined) parsed.anamneseData = initialState.anamneseData; 
       
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
      lastJoule: state.lastJoule,     
      startTime: state.startTime,
      missionSeconds: state.missionSeconds,
      cprSeconds: state.cprSeconds,
      cycleSeconds: state.cycleSeconds,
      isCompressing: state.isCompressing,
      airwayEstablished: state.airwayEstablished,
      airwayType: state.airwayType,
      airwaySize: state.airwaySize,   
      airwayDepth: state.airwayDepth, 
      zugang: state.zugang,           
      adrSeconds: state.adrSeconds,
      adrCount: state.adrCount,
      amioCount: state.amioCount, 
      hitsStatus: state.hitsStatus, 
      anamneseData: state.anamneseData, 
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