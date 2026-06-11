// --- Datei: src/hooks/usePatientLogic.js ---
import { useContext, useCallback } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';
import { BROSELOW_DATA } from '../config/broselowData.js'; 

export function usePatientLogic() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const setAdult = useCallback(() => {
    dispatch({ type: 'SET_PEDIATRIC_DATA', payload: { isPediatric: false, patientWeight: null } });
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.OB_COMPRESSIONS });
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, "Einsatz Start: Erwachsener | Modus: KONT");
  }, [dispatch, logEvent]);

  const setChild = useCallback((weight) => {
    dispatch({ type: 'SET_PEDIATRIC_DATA', payload: { isPediatric: true, patientWeight: weight } });
    dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: false });
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.OB_INITIAL_BREATHS });
    
    const weightInfo = weight ? `${weight}kg` : 'Gewicht später ermitteln';
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Einsatz Start: Kind (${weightInfo}) | Modus: KONT`);
  }, [dispatch, logEvent]);

  const calculateVitals = useCallback((source, value) => {
    let age, kg, cm;
    const numVal = parseFloat(value);
    
    if (source === 'age') {
        age = numVal;
        kg = age === 0 ? 6 : 2 * (age + 4);
        cm = Math.round((age * 6) + 77); 
    } else if (source === 'kg') {
        kg = numVal;
        age = kg < 10 ? 0 : Math.max(1, Math.round((kg / 2) - 4));
        cm = Math.round((age * 6) + 77); 
    } else if (source === 'cm') {
        cm = numVal;
        age = Math.max(0, Math.round((cm - 77) / 6));
        kg = age === 0 ? 6 : 2 * (age + 4);
    }
    return { age, kg, cm };
  }, []);

  const getBroselowZone = useCallback((kg) => {
    if (!BROSELOW_DATA || BROSELOW_DATA.length === 0) return null;
    return BROSELOW_DATA.find(z => kg >= z.minKg && kg <= z.maxKg) || BROSELOW_DATA[BROSELOW_DATA.length - 1];
  }, []);

  const toggleCprMode = useCallback(() => {
    const newMode = state.cprMode === 'continuous' 
        ? (state.isPediatric ? '15:2' : '30:2') 
        : 'continuous';
    dispatch({ type: 'SET_CPR_MODE', payload: newMode });
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus gewechselt auf: ${newMode}`);
  }, [state.cprMode, state.isPediatric, dispatch, logEvent]);

  return { setAdult, setChild, calculateVitals, getBroselowZone, toggleCprMode };
}