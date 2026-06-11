import { useEffect, useContext, useRef } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export function useGlobalTimer() {
  const { state, dispatch } = useContext(CprContext);
  
  const phaseRef = useRef(state.appPhase);
  const compressingRef = useRef(state.isCompressing);

  useEffect(() => {
    phaseRef.current = state.appPhase;
    compressingRef.current = state.isCompressing;
  }, [state.appPhase, state.isCompressing]);

  useEffect(() => {
    const masterTick = setInterval(() => {
      // Die Uhr tickt, sobald wir das Setup (Onboarding) verlassen haben
      if (phaseRef.current !== 'ONBOARDING' && phaseRef.current !== 'OB_INITIAL_BREATHS') {
        dispatch({ type: 'TICK_MISSION' });
      }

      if (compressingRef.current === true) {
        dispatch({ type: 'TICK_CPR' });
      }

    }, 1000);

    return () => clearInterval(masterTick);
  }, [dispatch]);
}