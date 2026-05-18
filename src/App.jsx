import React, { createContext, useReducer, useEffect, useState, useContext } from 'react';

// ==========================================
// 1. CONTEXT & STATE (Der Daten-Tresor)
// ==========================================
const initialState = {
  appPhase: 'ONBOARDING',
  patient: { type: null, weight: null, age: null },
  medicalStats: { shocks: 0, totalJoule: 0, adrCount: 0, amioCount: 0 },
  logbook: []
};

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

// ==========================================
// 2. KOMPONENTEN (Die UI-Bausteine)
// ==========================================

const MedicalDisclaimer = () => {
  const { hasAcceptedDisclaimer, acceptDisclaimer } = useContext(CprContext);

  if (!hasAcceptedDisclaimer) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-red-600 font-black uppercase text-lg mb-2">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            Nur für Training
          </h2>
          <p className="text-slate-600 text-sm font-bold mb-6">
            Diese App dient ausschließlich der Überwachung von Trainingsszenarien. Sie ist für den klinischen Live-Einsatz nicht validiert oder zugelassen. Nutzung auf eigene Gefahr.
          </p>
          <button
            onClick={acceptDisclaimer}
            className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl font-black uppercase text-sm shadow-sm active:scale-95 transition-transform"
          >
            Ich verstehe & akzeptiere
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-0 right-0 w-full px-4 z-[65] pointer-events-none">
      <div className="w-full max-w-sm mx-auto bg-red-50/95 backdrop-blur-sm border-2 border-red-500 rounded-2xl p-2 shadow-sm text-center pointer-events-auto">
        <h2 className="text-red-700 font-black uppercase tracking-widest text-[10px] mb-0.5">
          <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>Nur für Training
        </h2>
        <p className="text-red-800 text-[9px] font-bold leading-tight">
          Assistenz- & Trainingswerkzeug. Nicht validiert.
        </p>
      </div>
    </div>
  );
};

const PatientSelection = () => {
  const { dispatch } = useContext(CprContext);

  const startAdult = () => {
    dispatch({ type: 'SET_PHASE', payload: 'CPR_RUNNING' });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <i className="fa-solid fa-user-doctor text-4xl text-slate-300 mb-4"></i>
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Patient wählen</h2>
      
      <div className="w-full space-y-3 px-2">
        <button
          onClick={startAdult}
          className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(30,41,59,0.3)] active:scale-95 transition-transform"
        >
          Erwachsener
        </button>
        
        <button
          className="w-full bg-indigo-50 text-indigo-600 border-2 border-indigo-100 py-3 rounded-2xl font-bold uppercase tracking-wide active:scale-95 transition-transform"
        >
          Kind (Pädiatrie)
        </button>
      </div>
    </div>
  );
};

const CenterDisplay = () => {
  const { state } = useContext(CprContext);

  return (
    <div className="w-64 h-64 sm:w-[330px] sm:h-[330px] rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center mx-auto my-auto relative overflow-hidden pointer-events-auto z-30 transition-all duration-500">
      
      {state.appPhase === 'ONBOARDING' && <PatientSelection />}
      
      {state.appPhase === 'CPR_RUNNING' && (
         <div className="text-center animate-pulse">
           <i className="fa-solid fa-heart-pulse text-[#E3000F] text-6xl mb-2 drop-shadow-md"></i>
           <h2 className="font-black text-slate-700 text-xl tracking-tight">CPR LÄUFT</h2>
         </div>
      )}
      
    </div>
  );
};

// ==========================================
// 3. MAIN APP (Der finale Zusammenbau)
// ==========================================

export default function App() {
  return (
    <CprProvider>
      <div className="max-w-md mx-auto h-[100dvh] overflow-hidden bg-slate-50 relative flex flex-col select-none">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm z-[70] relative shrink-0">
          <div className="flex items-center gap-3 p-1">
            <div className="w-10 h-10 flex items-center justify-center text-[#E3000F]">
              <i className="fa-solid fa-heart-pulse text-3xl"></i>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tight">CPR Assist</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">React Beta</span>
            </div>
          </div>
        </header>

        {/* Disclaimer */}
        <MedicalDisclaimer />

        {/* Interface */}
        <main className="flex-1 relative z-20 w-full flex items-center justify-center">
          <CenterDisplay />
        </main>

      </div>
    </CprProvider>
  );
}