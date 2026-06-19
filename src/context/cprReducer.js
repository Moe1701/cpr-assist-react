// --- Datei: src/context/cprReducer.js ---
import { CPR_CONFIG } from '../config/cprConfig.js';

export const initialState = {
  appPhase: CPR_CONFIG.PHASES.ONBOARDING,
  previousAppPhase: null,
  isPediatric: false,
  patientWeight: null,
  cprMode: 'continuous', 
  
  bpm: 110,         
  isMuted: false,   
  shockCount: 0, 
  lastJoule: null,  
  
  startTime: null,         
  isGridVisible: false,    
  isPatientModalOpen: false, 
  isAirwayModalOpen: false, 
  
  missionSeconds: 0, 
  cprSeconds: 0, 
  cycleSeconds: 0, 
  
  isCompressing: false,
  pauseSeconds: 0, 
  isVentilationPhase: false,
  compressionCount: 0,
  
  airwayEstablished: false,
  airwayType: null,         
  airwaySize: null,         
  airwayDepth: null,        
  zugang: null, 
  
  adrSeconds: 0,
  adrCount: 0,
  
  compressingSeconds: 0, 
  arrestSeconds: 0,      
  currentCcfPercent: 100,
  events: [],      
  reminders: []
};

export function cprReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE': {
      const isGoingToOverlay = action.payload === CPR_CONFIG.PHASES.AIRWAY_MENU || action.payload === CPR_CONFIG.PHASES.AIRWAY_DOC || action.payload === CPR_CONFIG.PHASES.ZUGANG;
      const isComingFromOverlay = state.appPhase === CPR_CONFIG.PHASES.AIRWAY_MENU || state.appPhase === CPR_CONFIG.PHASES.AIRWAY_DOC || state.appPhase === CPR_CONFIG.PHASES.ZUGANG;
      
      let prevPhase = state.previousAppPhase;
      if (isGoingToOverlay && !isComingFromOverlay) {
        prevPhase = state.appPhase;
      }
      return { ...state, appPhase: action.payload, previousAppPhase: prevPhase };
    }

    case 'SET_BPM': return { ...state, bpm: action.payload };
    case 'TOGGLE_MUTE': return { ...state, isMuted: !state.isMuted };
    case 'RECORD_SHOCK': return { ...state, shockCount: state.shockCount + 1, lastJoule: action.payload }; 
    
    case 'SET_PEDIATRIC_DATA': return { 
        ...state, 
        isPediatric: action.payload.isPediatric,
        patientWeight: action.payload.patientWeight,
        cprMode: 'continuous', 
        startTime: state.startTime || new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };
      
    case 'SET_CPR_MODE': return { ...state, cprMode: action.payload };
    case 'TOGGLE_PATIENT_MODAL': return { ...state, isPatientModalOpen: action.payload };
    case 'TOGGLE_AIRWAY_MODAL': return { ...state, isAirwayModalOpen: action.payload }; 
    case 'TOGGLE_GRID': return { ...state, isGridVisible: !state.isGridVisible };
    case 'LOG_EVENT': return { ...state, events: [...state.events, action.payload] };
    
    case 'TOGGLE_COMPRESSION': return { ...state, isCompressing: action.payload, pauseSeconds: action.payload ? 0 : state.pauseSeconds };
    case 'SET_COMPRESSION_COUNT': return { ...state, compressionCount: action.payload };
    case 'SET_VENTILATION_PHASE': return { ...state, isVentilationPhase: action.payload };
    
    case 'SET_AIRWAY': 
      if (typeof action.payload === 'boolean') return { ...state, airwayEstablished: action.payload };
      return { 
        ...state, airwayEstablished: action.payload.established,
        airwayType: action.payload.type || null, airwaySize: action.payload.size || null, airwayDepth: action.payload.depth || null
      };
      
    case 'SET_AIRWAY_TYPE': return { ...state, airwayType: action.payload }; 
    case 'SET_ZUGANG': return { ...state, zugang: action.payload };
    
    case 'GIVE_ADRENALIN': return { ...state, adrCount: state.adrCount + 1, adrSeconds: 1 };
    case 'TICK_ADR': {
      if (state.adrSeconds > 0) {
        const nextAdr = state.adrSeconds + 1;
        if (nextAdr >= 240) return { ...state, adrSeconds: 0 };
        return { ...state, adrSeconds: nextAdr };
      }
      return state;
    }
    
    case 'TICK_MISSION': return { ...state, missionSeconds: state.missionSeconds + 1 };
    case 'TICK_CYCLE': return { ...state, cycleSeconds: state.cycleSeconds + 1 };
    case 'RESET_CYCLE': return { ...state, cycleSeconds: 0 };
    case 'TICK_PAUSE': return { ...state, pauseSeconds: state.pauseSeconds + 1 };
    
    case 'TICK_CCF_ARREST': {
      const newArrest = state.arrestSeconds + 1;
      const rawCcf = (state.compressingSeconds / newArrest) * 100;
      return { ...state, arrestSeconds: newArrest, currentCcfPercent: Math.min(100, Math.round(rawCcf)) };
    }
    case 'TICK_CCF_COMPRESSING': 
      return { ...state, compressingSeconds: state.compressingSeconds + 1, cprSeconds: state.cprSeconds + 1 };
    
    case 'RESET_ALL': return initialState;
    default: return state;
  }
}