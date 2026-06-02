import React, { createContext, useReducer } from 'react';
import { useGlobalTimer } from '../hooks/useGlobalTimer.js';

export const CprContext = createContext();

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

const initialState = {
  appPhase: 'ONBOARDING',
  isPatientModalOpen: false,
  hasAcceptedDisclaimer: localStorage.getItem('cpr_disclaimer_accepted') === 'true',
  
  isPediatric: false,
  patientWeight: null,
  broselowData: broselowData,
  
  isRunning: false,
  isCompressing: false,
  cprMode: 'continuous',
  
  totalSeconds: 0,
  arrestSeconds: 0,
  compressingSeconds: 0,
  handsOffSeconds: 0,
  
  lastAdrenalineTime: null,
  lastShockTime: null,
  shockCount: 0,
};

function cprReducer(state, action) {
  switch (action.type) {
    case 'ACCEPT_DISCLAIMER':
      localStorage.setItem('cpr_disclaimer_accepted', 'true');
      return { ...state, hasAcceptedDisclaimer: true };
      
    case 'SET_PHASE':
      return { ...state, appPhase: action.payload };
      
    case 'TOGGLE_PATIENT_MODAL':
      return { ...state, isPatientModalOpen: action.payload };

    case 'SET_PEDIATRIC_DATA':
      return {
        ...state,
        isPediatric: action.payload.isPediatric,
        patientWeight: action.payload.patientWeight,
        cprMode: 'continuous' 
      };

    case 'START_REA_LOGIC':
      return { ...state, isRunning: true, isCompressing: true };

    case 'TOGGLE_COMPRESSION':
      return {
        ...state,
        isCompressing: !state.isCompressing,
        handsOffSeconds: !state.isCompressing ? 0 : state.handsOffSeconds
      };

    case 'TICK':
      const passedSecs = action.payload;
      const isCurrentlyHandsOff = state.isRunning && !state.isCompressing;
      return {
        ...state,
        totalSeconds: state.totalSeconds + passedSecs,
        arrestSeconds: state.arrestSeconds + passedSecs,
        compressingSeconds: state.isCompressing ? state.compressingSeconds + passedSecs : state.compressingSeconds,
        handsOffSeconds: isCurrentlyHandsOff ? state.handsOffSeconds + passedSecs : 0
      };

    case 'LOG_ADRENALINE':
      return { ...state, lastAdrenalineTime: state.totalSeconds };
      
    case 'LOG_SHOCK':
      return { ...state, shockCount: state.shockCount + 1, lastShockTime: state.totalSeconds };

    default:
      return state;
  }
}

export function CprProvider({ children }) {
  const [state, dispatch] = useReducer(cprReducer, initialState);
  useGlobalTimer(state, dispatch);

  const acceptDisclaimer = () => dispatch({ type: 'ACCEPT_DISCLAIMER' });
  const hasAcceptedDisclaimer = state.hasAcceptedDisclaimer;

  return (
    <CprContext.Provider value={{ state, dispatch, hasAcceptedDisclaimer, acceptDisclaimer }}>
      {children}
    </CprContext.Provider>
  );
}