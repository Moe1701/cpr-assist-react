// --- Datei: src/components/views/ViewZugang.jsx ---
import React, { useContext, useState, useEffect } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewZugang() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const [typ, setTyp] = useState('i.v.');
  const [groesse, setGroesse] = useState('Grün 18G');
  const [ort, setOrt] = useState('Handrücken');

  // Das smarte Auto-Mapping aus dem Vanilla-Code
  useEffect(() => {
    if (typ === 'i.o.') {
      setGroesse(state.isPediatric ? 'EZ-IO Pink' : 'EZ-IO Blau');
      setOrt('Tibia prox.');
    } else {
      setGroesse('Grün 18G');
      setOrt('Handrücken');
    }
  }, [typ, state.isPediatric]);

  const handleSave = () => {
    logEvent(CPR_CONFIG.EVENTS.ZUGANG, `Zugang ${typ} ${groesse} ${ort}`);
    dispatch({ type: 'SET_ZUGANG', payload: typ });
    dispatch({ type: 'SET_PHASE', payload: state.previousAppPhase || CPR_CONFIG.PHASES.RUNNING });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: state.previousAppPhase || CPR_CONFIG.PHASES.RUNNING });
  };

  const sizesIV = ['Grün 18G', 'Rosa 20G', 'Orange 14G', 'Grau 16G', 'Blau 22G', 'Gelb 24G'];
  const sizesIO = ['EZ-IO Blau', 'EZ-IO Pink'];
  const ortIV = ['Handrücken', 'Unterarm', 'Ellenbeuge', 'Hals', 'Bein'];
  const ortIO = ['Tibia prox.', 'Tibia dist.', 'Femur', 'Humerus'];

  const activeSizes = typ === 'i.v.' ? sizesIV : sizesIO;
  const activeOrte = typ === 'i.v.' ? ortIV : ortIO;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 animate-in zoom-in-95 duration-200">
      <button 
        onClick={handleBack} 
        className="absolute top-4 right-4 w-8 h-8 bg-slate-50 rounded-full text-slate-400 flex items-center justify-center active:scale-95 transition-transform z-10 hover:bg-slate-100 cursor-pointer"
      >
        <i className="fa-solid fa-xmark pointer-events-none"></i>
      </button>

      <h2 className="text-[12px] font-black text-slate-700 uppercase tracking-widest text-center mt-1 mb-4 pointer-events-none">
        Zugang legen
      </h2>

      <div className="w-[85%] max-w-[220px] flex flex-col gap-3 mb-5">
        
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block pointer-events-none">Typ</label>
          <select value={typ} onChange={(e) => setTyp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-2.5 text-center font-black text-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:bg-cyan-50">
            <option value="i.v.">Intravenös (i.v.)</option>
            <option value="i.o.">Intraossär (i.o.)</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block pointer-events-none">Größe</label>
          <select value={groesse} onChange={(e) => setGroesse(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-2.5 text-center font-black text-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:bg-cyan-50">
            {activeSizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block pointer-events-none">Ort</label>
          <select value={ort} onChange={(e) => setOrt(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-2.5 text-center font-black text-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:bg-cyan-50">
            {activeOrte.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

      </div>

      <button 
        onClick={handleSave} 
        className="w-[85%] max-w-[220px] py-3 rounded-full font-black uppercase tracking-widest text-[11px] bg-emerald-500 text-white shadow-sm hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <i className="fa-solid fa-check pointer-events-none"></i> 
        <span className="pointer-events-none">Speichern</span>
      </button>
    </div>
  );
}