// --- Datei: src/components/views/ViewMedsMenu.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';
import { MED_DATABASE } from '../../config/medsConfig.js';

export default function ViewMedsMenu() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  
  // State für die Navigation: null = Kategorieliste, String = Medikamentenliste der Kategorie
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const returnPhase = state.previousAppPhase || CPR_CONFIG.PHASES.RUNNING;

  const handleClose = () => {
    dispatch({ type: 'SET_PHASE', payload: returnPhase });
  };

  const handleBack = () => {
    // Wenn wir in einem Untermenü sind, gehe zurück zur Kategorien-Liste.
    // Wenn wir schon in der Kategorien-Liste sind, schließe das Menü komplett.
    if (activeCategoryId) {
      setActiveCategoryId(null);
    } else {
      handleClose();
    }
  };

  const activeCategory = MED_DATABASE.find(c => c.categoryId === activeCategoryId);

  const handleMedClick = (med) => {
    // Sicherheits-Check: Falls es ein Kind ist, aber das Gewicht noch nicht eingetragen wurde
    let doseToGive = med.adultDose;
    if (state.isPediatric) {
      if (state.patientWeight) {
        doseToGive = med.calcPedDose(state.patientWeight);
      } else {
         // Falls im Stress "Gewicht später" gewählt wurde, wird die Gabe mit einem Warnhinweis geloggt
        doseToGive = '?? (Gewicht fehlt)';
      }
    }

    logEvent(CPR_CONFIG.EVENTS.DRUG, `${med.label} ${doseToGive} gegeben`);
    dispatch({ type: 'SET_PHASE', payload: returnPhase });
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full pt-6 pb-4 px-5 animate-in zoom-in-95 duration-200 relative">
      
      {/* Smart Back-Button: Zeigt Pfeil, wenn im Untermenü, sonst X zum Schließen */}
      <button 
        onClick={handleBack} 
        className="absolute top-4 left-4 w-8 h-8 bg-slate-50 rounded-full text-slate-400 flex items-center justify-center active:scale-95 transition-transform z-10 hover:bg-slate-100 cursor-pointer"
      >
        <i className={`fa-solid ${activeCategoryId ? 'fa-arrow-left' : 'fa-xmark'} pointer-events-none`}></i>
      </button>

      <h2 className="text-[11px] font-black text-slate-700 uppercase tracking-widest text-center mt-0 mb-4 px-8 leading-tight pointer-events-none">
        {activeCategoryId ? activeCategory.categoryName : 'Medikamente'}
      </h2>

      {/* Scrollbarer Container für die Listen */}
      <div className="w-[90%] max-w-[240px] flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 pb-2">
        
        {!activeCategoryId ? (
          // ==========================================
          // ANSICHT 1: KATEGORIEN (UNTERMENÜS)
          // ==========================================
          MED_DATABASE.map(cat => (
            <button
              key={cat.categoryId}
              onClick={() => setActiveCategoryId(cat.categoryId)}
              className="w-full py-3.5 px-4 rounded-[16px] font-bold uppercase tracking-wider text-[10px] bg-white border-2 border-indigo-50 text-indigo-600 shadow-sm flex items-center justify-between active:scale-95 transition-all hover:bg-indigo-50/50 cursor-pointer"
            >
              <span className="text-left pointer-events-none leading-tight">{cat.categoryName}</span>
              <div className="flex items-center gap-2 pointer-events-none">
                <span className="text-[9px] text-indigo-300 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{cat.meds.length}</span>
                <i className="fa-solid fa-chevron-right text-indigo-300 text-xs"></i>
              </div>
            </button>
          ))
        ) : (
          // ==========================================
          // ANSICHT 2: MEDIKAMENTE IN DER KATEGORIE
          // ==========================================
          activeCategory.meds.length > 0 ? (
            activeCategory.meds.map(med => {
              let displayDose = med.adultDose;
              if (state.isPediatric) {
                displayDose = state.patientWeight ? med.calcPedDose(state.patientWeight) : 'Fehlt!';
              }

              return (
                <button
                  key={med.id}
                  onClick={() => handleMedClick(med)}
                  className="w-full py-3 px-3 rounded-[14px] bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider pointer-events-none">{med.label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md pointer-events-none ${displayDose === 'Fehlt!' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    {displayDose}
                  </span>
                </button>
              );
            })
          ) : (
            // Fallback, wenn eine Kategorie (z.B. Katecholamine) noch leer ist
            <div className="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest">
              Noch keine<br/>Einträge
            </div>
          )
        )}
      </div>
    </div>
  );
}