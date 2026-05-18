import React, { createContext, useReducer, useEffect, useState } from 'react';

// Unser initialer App-Zustand (Der Master-State)
const initialState = {
  appPhase: 'ONBOARDING', // Hier startet die App immer
  patient: { type: null, weight: null, age: null },
  medicalStats: { shocks: 0, totalJoule: 0, adrCount: 0, amioCount: 0 },
  logbook: []
};

// Der "Reducer" ändert den Zustand basierend auf Aktionen
function cprReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, appPhase: action.payload };
    default:
      return state;
  }
}

export const CprContext = createContext();

export const CprProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cprReducer, initialState);
  
  // Disclaimer Logik
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cprDisclaimerAccepted');
    if (accepted === 'true') {
      setHasAcceptedDisclaimer(true);
    }
  }, []);

  const acceptDisclaimer = () => {
    localStorage.setItem('cprDisclaimerAccepted', 'true');
    setHasAcceptedDisclaimer(true);
  };

  return (
    <CprContext.Provider value={{ state, dispatch, hasAcceptedDisclaimer, acceptDisclaimer }}>
      {children}
    </CprContext.Provider>
  );
};