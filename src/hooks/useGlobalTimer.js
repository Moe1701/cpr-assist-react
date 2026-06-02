import { useEffect, useRef } from 'react';

export function useGlobalTimer(state, dispatch) {
  const timerRef = useRef(null);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!state.isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      const deltaSeconds = Math.round(deltaMs / 1000);

      if (deltaSeconds >= 1) {
        lastTickRef.current = now;
        dispatch({ type: 'TICK', payload: deltaSeconds });
      }
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, dispatch]);
}