// --- Datei: src/utils/pdf/pdfDataParser.js ---
export const parseMissionData = (state) => {
    const data = state.events || []; const totalSec = state.missionSeconds || 0;
    const maxSec = data.length > 0 ? Math.max(totalSec, data[data.length - 1].missionTime) : totalSec;
    let endStatus = 'Laufende CPR';
    if (state.appPhase === 'rosc' || state.roscSeconds > 0) endStatus = 'ROSC'; if (state.abbruchReason) endStatus = 'Abbruch';
    let firstCPR = null, firstShock = null, firstAdr = null, firstAccess = null, firstAirway = null, definitiveAirway = null, timeToRosc = null;
    let adrTimes = [], amioTimes = [], analyses = [], anaToShockIntervals = []; let lastAnalysisTime = null; let totalJoule = 0;
    let pausesObj = []; let currentStart = null;
  
    data.forEach(d => {
      const t = d.fullEntry.toLowerCase(); const sec = d.missionTime;
      if (((t.includes('kompression') || t.includes('cpr')) && (t.includes('paus') || t.includes('stop') || t.includes('unterbroch'))) || t.includes('analyse') || t.includes('schockbar')) {
          if (currentStart === null) currentStart = sec;
      } else if ((t.includes('kompression') || t.includes('cpr')) && (t.includes('fortgesetzt') || t.includes('start') || t.includes('weiter'))) {
          if (currentStart !== null) { pausesObj.push({ start: currentStart, end: sec, duration: sec - currentStart }); currentStart = null; }
      }
      if (t.includes('rosc') && !t.includes('re-arrest')) { endStatus = 'ROSC'; if (timeToRosc === null) timeToRosc = sec; } 
      else if (t.includes('re-arrest') || t.includes('start rea')) { endStatus = 'Laufende CPR'; } else if (t.includes('abbruch') || t.includes('beendet')) { endStatus = 'Abbruch'; }
  
      if (!firstCPR && (t.includes('start rea') || t.includes('kompression gestartet'))) firstCPR = sec;
      if (!firstShock && t.includes('schock abgegeben')) firstShock = sec;
      if (!firstAdr && t.includes('adrenalin')) firstAdr = sec;
      if (!firstAccess && t.includes('zugang')) firstAccess = sec;
      if (t.includes('atemweg') && !t.includes('entfernt')) {
          const awType = d.detail || 'Erfasst'; if (!firstAirway) firstAirway = { time: sec, type: awType };
          if (!t.includes('beutel') && !definitiveAirway) definitiveAirway = { time: sec, type: awType };
      }
      if (t.includes('adrenalin')) adrTimes.push(sec); if (t.includes('amiodaron') || t.includes('amio')) amioTimes.push(sec);
      if (t.includes('analyse') || t.includes('schockbar') || t.includes('nicht schockbar')) { analyses.push(sec); lastAnalysisTime = sec; }
      if (t.includes('schock abgegeben')) {
          const match = t.match(/(\d+)\s*j/i); if (match) totalJoule += parseInt(match[1], 10);
          if (lastAnalysisTime !== null) { anaToShockIntervals.push(sec - lastAnalysisTime); lastAnalysisTime = null; }
      }
    });
    if (currentStart !== null) pausesObj.push({ start: currentStart, end: maxSec, duration: maxSec - currentStart });
    const maxPause = pausesObj.length > 0 ? Math.max(...pausesObj.map(p => p.duration)) : 0;
    const totalHandsOff = Math.max(0, state.arrestSeconds - state.compressingSeconds);
    let adrInt = []; for (let i = 1; i < adrTimes.length; i++) adrInt.push(adrTimes[i] - adrTimes[i-1]);
    const avgAdr = adrInt.length > 0 ? Math.round(adrInt.reduce((a, b) => a + b, 0) / adrInt.length) : 0;
    let amioInt = []; for (let i = 1; i < amioTimes.length; i++) amioInt.push(amioTimes[i] - amioTimes[i-1]);
    const avgAmio = amioInt.length > 0 ? Math.round(amioInt.reduce((a, b) => a + b, 0) / amioInt.length) : 0;
    let anaInt = []; for (let i = 1; i < analyses.length; i++) anaInt.push(analyses[i] - analyses[i-1]);
    const avgAna = anaInt.length > 0 ? Math.round(anaInt.reduce((a, b) => a + b, 0) / anaInt.length) : 0;
    const avgAnaToShock = anaToShockIntervals.length > 0 ? Math.round(anaToShockIntervals.reduce((a,b)=>a+b,0)/anaToShockIntervals.length) : 0;
    const minAnaToShock = anaToShockIntervals.length > 0 ? Math.min(...anaToShockIntervals) : 0;
    const maxAnaToShock = anaToShockIntervals.length > 0 ? Math.max(...anaToShockIntervals) : 0;
  
    return {
        maxSec, endStatus, firstCPR, firstShock, firstAdr, firstAccess, firstAirway, definitiveAirway, timeToRosc,
        totalJoule, pausesObj, maxPause, totalHandsOff, avgAdr, avgAmio, avgAna, avgAnaToShock, minAnaToShock, maxAnaToShock
    };
};