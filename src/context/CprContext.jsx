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
       // Fallbacks für ältere Speicherstände
       if (parsed.bpm === undefined) parsed.bpm = 100;
       if (parsed.isMuted === undefined) parsed.isMuted = false;
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
      startTime: state.startTime,
      missionSeconds: state.missionSeconds,
      cprSeconds: state.cprSeconds,
      cycleSeconds: state.cycleSeconds,
      isCompressing: state.isCompressing,
      events: state.events,
      reminders: state.reminders,
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