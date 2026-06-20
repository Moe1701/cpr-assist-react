// --- Datei: src/components/views/TabUebergabe.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function TabUebergabe() {
  const { state } = useContext(CprContext);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- SBAR DATEN AUFBEREITEN ---
  const aData = state.anamneseData;
  
  // Situation: Alter & Gewicht String
  let ageStr = state.isPediatric ? (state.patientWeight ? `Kind (${state.patientWeight} kg)` : 'Kind') : 'Erwachsener';
  if (aData.alter || aData.gewicht) {
      let zusatz = [];
      if (aData.alter) zusatz.push(`${aData.alter} J.`);
      if (aData.gewicht) zusatz.push(`${aData.gewicht} kg`);
      ageStr += ` (${zusatz.join(' | ')})`;
  }

  // Response: Medikamente berechnen
  let adrTotal = "0 mg";
  if (state.adrCount > 0) adrTotal = (state.isPediatric && state.patientWeight) ? (state.adrCount * Math.round(state.patientWeight * 10)) + " µg" : state.adrCount + " mg";
  
  let amioTotal = "0 mg";
  if (state.amioCount > 0) amioTotal = (state.isPediatric && state.patientWeight) ? (state.amioCount * Math.round(state.patientWeight * 5)) + " mg" : (state.amioCount === 1 ? '300 mg' : '450 mg');

  // HITS filtern
  const activeHits = Object.entries(state.hitsStatus)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => {
       const labels = { hypoxie: 'Hypoxie', hypovolaemie: 'Hypovolämie', hypo_hyperkali: 'Hypo- / Hyperkaliämie', hypothermie: 'Hypothermie', herzbeutel: 'Herzbeuteltamponade', toxine: 'Toxine', thrombose: 'Thrombose', tension: 'Spannungspneu' };
       return labels[key] || key;
    });

  // SAMPLER filtern
  const samplerItems = Object.entries(aData.sampler)
    .filter(([_, val]) => val && val.trim() !== '')
    .map(([key, val]) => ({ key: key.toUpperCase(), val }));

  return (
    <div className="p-4 flex flex-col gap-4 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* S - SITUATION */}
      <div className="bg-white rounded-xl border-l-4 border-[#E3000F] p-3 shadow-sm">
        <h4 className="text-[10px] font-black text-[#E3000F] uppercase tracking-widest mb-2">S - Situation</h4>
        <div className="grid grid-cols-2 gap-2">
            <div><span className="block text-[9px] font-bold text-slate-400 uppercase">Patient</span><span className="text-xs font-black text-slate-700">{ageStr}</span></div>
            <div><span className="block text-[9px] font-bold text-slate-400 uppercase">Dauer</span><span className="text-xs font-black text-slate-700">{formatTime(state.missionSeconds)} Min</span></div>
            <div className="col-span-2"><span className="block text-[9px] font-bold text-slate-400 uppercase">Letzter Rhythmus</span><span className="text-xs font-black text-slate-700">Unbekannt / Ausstehend</span></div>
        </div>
      </div>

      {/* B - BACKGROUND */}
      <div className="bg-white rounded-xl border-l-4 border-slate-400 p-3 shadow-sm">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">B - Background</h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[10px]">
            <div><span className="font-bold text-slate-400">Beobachtet:</span> <span className="font-black text-slate-700">{aData.beobachtet?.toUpperCase() || '?'}</span></div>
            <div><span className="font-bold text-slate-400">Laien-REA:</span> <span className="font-black text-slate-700">{aData.laienrea?.toUpperCase() || '?'}</span></div>
        </div>
        {samplerItems.length > 0 && (
          <div className="mt-2 text-[10px] leading-tight text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            {samplerItems.map(item => (
              <div key={item.key}><span className="font-black text-slate-700">{item.key}:</span> {item.val}</div>
            ))}
          </div>
        )}
      </div>

      {/* A - ASSESSMENT */}
      <div className="bg-white rounded-xl border-l-4 border-amber-400 p-3 shadow-sm">
        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">A - Assessment</h4>
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-500">CPR Qualität (CCF)</span>
            <span className={`text-sm font-black ${state.currentCcfPercent >= 80 ? 'text-emerald-500' : 'text-[#E3000F]'}`}>{state.currentCcfPercent || 100}%</span>
        </div>
        <div className="text-[10px] text-slate-600">
            <span className="font-bold text-slate-400 block mb-1">Erfasste Ursachen (HITS):</span>
            {activeHits.length > 0 ? activeHits.map(h => <div key={h} className="font-bold text-slate-700 truncate">- {h} gecheckt/behandelt</div>) : 'Keine HITS erfasst.'}
        </div>
      </div>

      {/* R - RESPONSE */}
      <div className="bg-white rounded-xl border-l-4 border-emerald-500 p-3 shadow-sm">
        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">R - Response</h4>
        <div className="grid grid-cols-1 gap-1.5 text-[10px]">
            <div className="flex justify-between"><span className="font-bold text-slate-400">Atemweg</span><span className="font-black text-slate-700">{state.airwayType || 'Nicht dok.'}</span></div>
            <div className="flex justify-between"><span className="font-bold text-slate-400">Zugang</span><span className="font-black text-slate-700">{state.zugang || 'Nicht dok.'}</span></div>
            <div className="flex justify-between"><span className="font-bold text-slate-400">Schocks</span><span className="font-black text-amber-500">{state.shockCount || 0}x abgegeben</span></div>
            <div className="flex justify-between"><span className="font-bold text-slate-400">Adrenalin</span><span className="font-black text-[#E3000F]">{adrTotal} ({state.adrCount}x)</span></div>
            <div className="flex justify-between"><span className="font-bold text-slate-400">Amiodaron</span><span className="font-black text-purple-600">{amioTotal} ({state.amioCount}x)</span></div>
        </div>
      </div>

    </div>
  );
}