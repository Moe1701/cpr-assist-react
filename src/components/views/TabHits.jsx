// --- Datei: src/components/views/TabHits.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

const HITS_ITEMS = [
  { id: 'hypoxie', label: 'Hypoxie', type: 'H' },
  { id: 'hypovolaemie', label: 'Hypovolämie', type: 'H' },
  { id: 'hypo_hyperkali', label: 'Hypo- / Hyperkaliämie', type: 'H' },
  { id: 'hypothermie', label: 'Hypothermie', type: 'H' },
  { id: 'herzbeutel', label: 'Herzbeuteltamponade', type: 'T' },
  { id: 'toxine', label: 'Toxine (Intoxikation)', type: 'T' },
  { id: 'thrombose', label: 'Thrombose (LE / MI)', type: 'T' },
  { id: 'tension', label: 'Tension (Spannungspneu)', type: 'T' }
];

export default function TabHits() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const toggleItem = (item) => {
    const isCurrentlyActive = !!state.hitsStatus[item.id];
    const willBeActive = !isCurrentlyActive;
    
    if (navigator.vibrate) navigator.vibrate([20]);

    // Sofort ins Logbuch schreiben
    const logText = willBeActive 
        ? `HITS: ${item.label} gecheckt/behandelt` 
        : `HITS: ${item.label} offen`;
    logEvent(CPR_CONFIG.EVENTS.INFO, logText);

    // Globalen State aktualisieren, damit es abgehakt bleibt
    dispatch({ 
        type: 'TOGGLE_HITS_ITEM', 
        payload: { id: item.id, value: willBeActive } 
    });
  };

  return (
    <div className="p-4 gap-2.5 flex flex-col pb-10">
      {HITS_ITEMS.map(item => {
        const isActive = !!state.hitsStatus[item.id];
        const iconColor = item.type === 'H' ? 'text-indigo-500 bg-indigo-50 border-indigo-100' : 'text-red-500 bg-red-50 border-red-100';
        
        return (
          <button
            key={item.id}
            onClick={() => toggleItem(item)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border shadow-sm transition-all active:scale-[0.98] ${isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[12px] font-black ${iconColor}`}>
                {item.type}
              </div>
              <span className={`text-[13px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </div>
            
            {isActive && (
              <i className="fa-solid fa-check text-emerald-500 text-lg pr-2"></i>
            )}
          </button>
        );
      })}
    </div>
  );
}