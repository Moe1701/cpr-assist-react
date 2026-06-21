// --- Datei: src/components/views/ExportModal.jsx ---
import React, { useState, useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { generatePDFExport } from '../../utils/pdfExport.js';

export default function ExportModal({ onClose }) {
  const { state } = useContext(CprContext);
  
  // State ist strikt 'übergabe' oder 'debriefing'
  const [exportType, setExportType] = useState('übergabe'); 
  const [isCopied, setIsCopied] = useState(false);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCopyText = () => {
    const text = `--- REANIMATIONSPROTOKOLL ---\nModus: ${exportType.toUpperCase()}\nDauer: ${formatTime(state.missionSeconds)} Min\nCCF: ${state.currentCcfPercent}%\nSchocks: ${state.shockCount}\nAdrenalin: ${state.adrCount}x\nAmiodaron: ${state.amioCount}x\nAtemweg: ${state.airwayType || 'Nicht dok.'}\nZugang: ${state.zugang || 'Nicht dok.'}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handlePdfExport = () => {
    // Gibt exakt 'übergabe' oder 'debriefing' an die Engine weiter
    generatePDFExport(state, exportType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
      
      <div className="bg-white w-[90%] max-w-[340px] rounded-3xl p-6 shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
         <h2 className="text-lg font-black text-slate-800 tracking-wider mb-1">EXPORTIEREN</h2>
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-5">Protokoll-Umfang</span>

         {/* DER TOGGLE SWITCH */}
         <div className="flex w-full bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setExportType('übergabe')}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${exportType === 'übergabe' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Übergabe
            </button>
            <button 
              onClick={() => setExportType('debriefing')}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${exportType === 'debriefing' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Debriefing
            </button>
         </div>

         <button 
            onClick={handleCopyText}
            className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] mb-3 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${isCopied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'}`}
         >
            <i className={`fa-regular ${isCopied ? 'fa-circle-check' : 'fa-copy'}`}></i> 
            {isCopied ? 'Kopiert!' : 'Text Kopieren'}
         </button>

         <button 
            onClick={handlePdfExport}
            className="w-full bg-[#E3000F] text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] mb-4 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(227,0,15,0.3)] active:scale-95 transition-transform cursor-pointer hover:bg-red-700"
         >
            <i className="fa-solid fa-file-pdf"></i> PDF Speichern
         </button>

         <button 
            onClick={onClose}
            className="w-full bg-white border border-slate-200 text-slate-500 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] active:scale-95 transition-transform hover:bg-slate-50 cursor-pointer"
         >
            Abbrechen
         </button>
      </div>

    </div>
  );
}
