import { CPR_CONFIG } from '../config/cprConfig.js';

export const initialState = {
  appPhase: CPR_CONFIG.PHASES.ONBOARDING,
  isPediatric: false,
  patientWeight: null,
  cprMode: 'continuous', 
  
  bpm: 100,         // <--- NEU: Das Gehirn kennt jetzt die Geschwindigkeit
  isMuted: false,   // <--- NEU: Das Gehirn weiß, ob Ton an oder aus ist
  
  startTime: null,         
  isGridVisible: false,    
  isPatientModalOpen: false, 
  
  missionSeconds: 0, 
  cprSeconds: 0, 
  cycleSeconds: 0, 
  
  isCompressing: false,
  pauseSeconds: 0, 
  isVentilationPhase: false,
  compressionCount: 0,
  
  airwayEstablished: false,
  
  compressingSeconds: 0, 
  arrestSeconds: 0,      
  currentCcfPercent: 100,
  events: [],      
  reminders: []
};

export function cprReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE': return { ...state, appPhase: action.payload };
    case 'SET_BPM': return { ...state, bpm: action.payload };       // <--- NEU: Ändert die BPM
    case 'TOGGLE_MUTE': return { ...state, isMuted: !state.isMuted }; // <--- NEU: Schaltet stumm
    
    case 'SET_PEDIATRIC_DATA': return { 
        ...state, 
        isPediatric: action.payload.isPediatric,
        patientWeight: action.payload.patientWeight,
        cprMode: 'continuous', 
        startTime: state.startTime || new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };
      
    case 'SET_CPR_MODE': return { ...state, cprMode: action.payload };
    case 'TOGGLE_PATIENT_MODAL': return { ...state, isPatientModalOpen: action.payload };
    case 'TOGGLE_GRID': return { ...state, isGridVisible: !state.isGridVisible };
    case 'LOG_EVENT': return { ...state, events: [...state.events, action.payload] };
    
    case 'TOGGLE_COMPRESSION': 
      return { 
        ...state, 
        isCompressing: action.payload, 
        pauseSeconds: action.payload ? 0 : state.pauseSeconds 
      };
      
    case 'SET_COMPRESSION_COUNT': return { ...state, compressionCount: action.payload };
    case 'SET_VENTILATION_PHASE': return { ...state, isVentilationPhase: action.payload };
    case 'SET_AIRWAY': return { ...state, airwayEstablished: action.payload };
    
    case 'TICK_MISSION': return { ...state, missionSeconds: state.missionSeconds + 1 };
    case 'TICK_CYCLE': return { ...state, cycleSeconds: state.cycleSeconds + 1 };
    case 'TICK_PAUSE': return { ...state, pauseSeconds: state.pauseSeconds + 1 };
    
    case 'TICK_CCF_ARREST': {
      const newArrest = state.arrestSeconds + 1;
      const rawCcf = (state.compressingSeconds / newArrest) * 100;
      return { ...state, arrestSeconds: newArrest, currentCcfPercent: Math.min(100, Math.round(rawCcf)) };
    }
    case 'TICK_CCF_COMPRESSING': 
      return { 
        ...state, 
        compressingSeconds: state.compressingSeconds + 1, 
        cprSeconds: state.cprSeconds + 1 
      };
    
    case 'RESET_ALL': return initialState;
    default: return state;
  }
}