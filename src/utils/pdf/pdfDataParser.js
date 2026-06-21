// --- Datei: src/utils/pdf/pdfDataParser.js ---
export const parseMissionData = (state) => {
    const data = state.events || []; 
    const totalSec = state.missionSeconds || 0;
    const maxSec = data.length > 0 ? Math.max(totalSec, data[data.length - 1].missionTime) : totalSec;
    
    let endStatus = 'Laufende CPR';
    if (state.appPhase === 'rosc' || state.roscSeconds > 0) endStatus = 'ROSC'; 
    if (state.abbruchReason) endStatus = `ABBRUCH\nGrund: ${state.abbruchReason}`;
    
    let firstCPR = null, firstShock = null, firstAdr = null, firstAccess = null, firstAirway = null, timeToRosc = null;
    let adrTimes = [], amioTimes = [], preShockPauses = []; 
    let lastAnalysisTime = null; let totalJoule = 0;
    let pausesObj = []; let currentStart = null;
  
    data.forEach(d => {
      const t = d.fullEntry.toLowerCase(); const sec = d.missionTime;
      
      // Pausen Logik
      if (((t.includes('kompression') || t.includes('cpr')) && (t.includes('paus') || t.includes('stop') || t.includes('unterbroch'))) || t.includes('analyse') || t.includes('schockbar')) {
          if (currentStart === null) currentStart = sec;
      } else if ((t.includes('kompression') || t.includes('cpr')) && (t.includes('fortgesetzt') || t.includes('start') || t.includes('weiter'))) {
          if (currentStart !== null) { pausesObj.push({ start: currentStart, end: sec, duration: sec - currentStart }); currentStart = null; }
      }

      if (t.includes('rosc') && timeToRosc === null) timeToRosc = sec;
      if (!firstCPR && (t.includes('start rea') || t.includes('kompression gestartet'))) firstCPR = sec;
      if (!firstShock && t.includes('schock abgegeben')) firstShock = sec;
      if (!firstAdr && t.includes('adrenalin')) firstAdr = sec;
      if (!firstAccess && t.includes('zugang')) firstAccess = sec;
      if (t.includes('atemweg') && !firstAirway) firstAirway = { time: sec, type: d.detail || 'Erfasst' };
      
      if (t.includes('adrenalin')) adrTimes.push(sec); 
      if (t.includes('amiodaron') || t.includes('amio')) amioTimes.push(sec);
      
      // Pre-Shock Logik
      if (t.includes('analyse') || t.includes('schockbar') || t.includes('nicht schockbar')) lastAnalysisTime = sec; 
      if (t.includes('schock abgegeben')) {
          const match = t.match(/(\d+)\s*j/i); if (match) totalJoule += parseInt(match[1], 10);
          if (lastAnalysisTime !== null) { preShockPauses.push(sec - lastAnalysisTime); lastAnalysisTime = null; }
      }
    });
    
    if (currentStart !== null) pausesObj.push({ start: currentStart, end: maxSec, duration: maxSec - currentStart });
    
    const maxPause = pausesObj.length > 0 ? Math.max(...pausesObj.map(p => p.duration)) : 0;
    const totalHandsOff = Math.max(0, state.arrestSeconds - state.compressingSeconds);
    
    let adrInt = []; for (let i = 1; i < adrTimes.length; i++) adrInt.push(adrTimes[i] - adrTimes[i-1]);
    const avgAdr = adrInt.length > 0 ? Math.round(adrInt.reduce((a, b) => a + b, 0) / adrInt.length) : null;
    let amioInt = []; for (let i = 1; i < amioTimes.length; i++) amioInt.push(amioTimes[i] - amioTimes[i-1]);
    const avgAmio = amioInt.length > 0 ? Math.round(amioInt.reduce((a, b) => a + b, 0) / amioInt.length) : null;
    
    const minPreShock = preShockPauses.length > 0 ? Math.min(...preShockPauses) : 0;
    const maxPreShock = preShockPauses.length > 0 ? Math.max(...preShockPauses) : 0;
  
    return {
        maxSec, endStatus, firstCPR, firstShock, firstAdr, firstAccess, firstAirway, timeToRosc,
        totalJoule, pausesObj, maxPause, totalHandsOff, avgAdr, avgAmio, minPreShock, maxPreShock
    };
};
