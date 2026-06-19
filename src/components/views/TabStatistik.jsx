// --- Datei: src/components/views/TabStatistik.jsx ---
import React, { useContext, useMemo } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function TabStatistik() {
  const { state } = useContext(CprContext);

  const format = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "--:--";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- KPI ENGINE (Rendert nur neu, wenn Events sich ändern) ---
  const stats = useMemo(() => {
    const data = state.events || [];
    let firstCPR = null, firstShock = null, firstAdr = null, firstAccess = null;
    let firstAirway = null, timeToRosc = null;
    let adrTimes = [], amioTimes = [];
    
    data.forEach(d => {
      const t = d.fullEntry.toLowerCase();
      const sec = d.missionTime;

      // Reaktionszeiten
      if (!firstCPR && (t.includes('cpr') || t.includes('kompression'))) firstCPR = sec;
      if (!firstShock && t.includes('schock')) firstShock = sec;
      if (!firstAdr && t.includes('adrenalin')) firstAdr = sec;
      if (!firstAccess && t.includes('zugang')) firstAccess = sec;
      
      // ROSC & Atemweg
      if (t.includes('rosc') && timeToRosc === null) timeToRosc = sec;
      if (t.includes('atemweg') && !firstAirway) firstAirway = { time: sec, type: d.detail || 'Erfasst' };

      // Intervalle sammeln
      if (t.includes('adrenalin')) adrTimes.push(sec);
      if (t.includes('amiodaron')) amioTimes.push(sec);
    });

    // Mathematik für Intervalle
    let adrInt = []; for (let i = 1; i < adrTimes.length; i++) adrInt.push(adrTimes[i] - adrTimes[i-1]);
    const avgAdr = adrInt.length > 0 ? Math.round(adrInt.reduce((a, b) => a + b, 0) / adrInt.length) : null;

    let amioInt = []; for (let i = 1; i < amioTimes.length; i++) amioInt.push(amioTimes[i] - amioTimes[i-1]);
    const avgAmio = amioInt.length > 0 ? Math.round(amioInt.reduce((a, b) => a + b, 0) / amioInt.length) : null;

    return { firstCPR, firstShock, firstAdr, firstAccess, firstAirway, timeToRosc, avgAdr, avgAmio };
  }, [state.events]);

  const totalHandsOff = Math.max(0, state.arrestSeconds - state.compressingSeconds);
  const ccfColor = state.currentCcfPercent >= 80 ? 'text-emerald-500' : 'text-[#E3000F]';

  const Row = ({ label, val, icon, colorClass = 'text-slate-400' }) => (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <i className={`fa-solid ${icon} ${colorClass} text-base w-5 text-center`}></i>
        <span className="text-[11px] font-bold text-slate-600 leading-tight">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-800 tracking-wide">{val}</span>
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-4 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* 1. CPR PERFORMANCE */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center border-b border-slate-50 pb-2">CPR Performance</h3>
          <div className="flex items-center justify-between">
              <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">CCF (CPR-Anteil)</span>
                  <span className={`text-4xl font-black tracking-tighter ${ccfColor}`}>{state.currentCcfPercent || 100}%</span>
              </div>
              <div className="w-px h-10 bg-slate-100 mx-2"></div>
              <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hands-Off Gesamt</span>
                  <span className="text-xl font-black text-slate-700 tracking-tight">{format(totalHandsOff)} <span className="text-xs text-slate-400">Min</span></span>
              </div>
          </div>
      </div>

      {/* 2. SCHOCK & MEDIKAMENTE */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Therapie & Intervalle</h3>
        <div className="flex flex-col gap-1.5">
          <Row label="Defibrillationen" val={`${state.shockCount}x`} icon="fa-bolt" colorClass="text-amber-500" />
          <Row label="Ø Adrenalin-Intervall" val={stats.avgAdr ? format(stats.avgAdr) : '--:--'} icon="fa-syringe" colorClass="text-[#E3000F]" />
          <Row label="Ø Amiodaron-Intervall" val={stats.avgAmio ? format(stats.avgAmio) : '--:--'} icon="fa-pills" colorClass="text-purple-500" />
          <Row label="Zeit bis ROSC" val={stats.timeToRosc !== null ? format(stats.timeToRosc) : '--:--'} icon="fa-heart" colorClass="text-emerald-500" />
        </div>
      </div>

      {/* 3. ATEMWEG */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Atemwegs-Management</h3>
        <div className="flex flex-col gap-1.5">
          <Row label={`1. Maßnahme (${stats.firstAirway ? stats.firstAirway.type : '-'})`} val={stats.firstAirway ? format(stats.firstAirway.time) : '--:--'} icon="fa-lungs" colorClass="text-cyan-500" />
          <Row label={`Sicherung (${state.airwayType || '-'})`} val={state.airwayType ? 'Erfolgt' : '--:--'} icon="fa-check-double" colorClass="text-emerald-500" />
        </div>
      </div>

      {/* 4. REAKTIONSZEITEN */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2">Reaktionszeiten (ab Start)</h3>
        <div className="grid grid-cols-2 gap-1.5">
          <Row label="1. Komp." val={stats.firstCPR !== null ? format(stats.firstCPR) : '--:--'} icon="fa-hands-asl-interpreting" colorClass="text-emerald-500" />
          <Row label="1. Schock" val={stats.firstShock !== null ? format(stats.firstShock) : '--:--'} icon="fa-bolt" colorClass="text-amber-500" />
          <Row label="1. Supra" val={stats.firstAdr !== null ? format(stats.firstAdr) : '--:--'} icon="fa-syringe" colorClass="text-[#E3000F]" />
          <Row label="1. Zugang" val={stats.firstAccess !== null ? format(stats.firstAccess) : '--:--'} icon="fa-droplet" colorClass="text-indigo-500" />
        </div>
      </div>

    </div>
  );
}