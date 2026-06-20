// --- Datei: src/components/views/PediSafeLimits.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function PediSafeLimits() {
  const { state } = useContext(CprContext);

  if (!state.isPediatric || !state.patientWeight) return null;

  const kg = state.patientWeight;
  let age = 0; if (kg >= 10) age = Math.max(1, Math.round((kg / 2) - 4));
  let rr = "> 70 mmHg"; if (age >= 1 && age <= 10) rr = `> ${70 + (2 * age)} mmHg`; else if (age > 10) rr = "> 90 mmHg";
  let hr = "110 - 160 /min"; if (age >= 1 && age < 2) hr = "100 - 150 /min"; else if (age >= 2 && age < 5) hr = "90 - 140 /min"; else if (age >= 5 && age <= 12) hr = "80 - 120 /min"; else if (age > 12) hr = "60 - 100 /min";
  let vt = Math.round(kg * 6);

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 mb-3 shrink-0 shadow-sm">
      <h3 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest text-center mb-2">Pädiatrische Zielwerte (ROSC)</h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-indigo-50"><span className="text-[8px] font-bold text-slate-400 uppercase">Systole / MAP</span><span className="text-[11px] font-black text-indigo-600 mt-0.5">{rr}</span></div>
        <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-indigo-50"><span className="text-[8px] font-bold text-slate-400 uppercase">Herzfrequenz</span><span className="text-[11px] font-black text-indigo-600 mt-0.5">{hr}</span></div>
        <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-indigo-50"><span className="text-[8px] font-bold text-slate-400 uppercase">Tidalvolumen</span><span className="text-[11px] font-black text-indigo-600 mt-0.5">{vt} ml</span></div>
      </div>
    </div>
  );
}