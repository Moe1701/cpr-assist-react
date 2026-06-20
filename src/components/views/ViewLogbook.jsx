// --- Datei: src/components/views/ViewLogbook.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import TabList from './TabList.jsx';
import TabUebergabe from './TabUebergabe.jsx'; 
import TabStatistik from './TabStatistik.jsx'; 
import TabZeitlinie from './TabZeitlinie.jsx';
import ExportModal from './ExportModal.jsx'; // <--- EXPORT MODAL IMPORTIERT

export default function ViewLogbook() {
  const { state, dispatch } = useContext(CprContext);
  const [activeTab, setActiveTab] = useState('liste');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // <--- STATE FÜR EXPORT

  // Rendert nichts, wenn das Protokoll geschlossen ist
  if (!state.isLogModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end pointer-events-none bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* HAUPT-MODAL */}
      <div className="w-full h-[95dvh] bg-slate-50 shadow-[0_-15px_50px_rgba(0,0,0,0.3)] flex flex-col rounded-t-3xl overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-full duration-300">
        
        {/* HEADER */}
        <div className="flex flex-col px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0 gap-4 z-20">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-lg">Protokoll</h3>
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_LOG_MODAL', payload: false })}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              Schließen
            </button>
          </div>
          
          <div className="flex justify-between items-center w-full">
            <div className="flex bg-slate-200 p-1 rounded-xl">
              {['zeitlinie', 'liste', 'übergabe', 'statistik'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* ACTION BUTTONS (Undo & Export) */}
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch({ type: 'UNDO_LAST_EVENT' })}
                className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-[12px] active:scale-95 cursor-pointer hover:bg-red-100"
              >
                <i className="fa-solid fa-rotate-left pointer-events-none"></i>
              </button>
              
              {/* DER ROTE EXPORT BUTTON */}
              <button 
                onClick={() => setIsExportModalOpen(true)}
                className="bg-[#E3000F] text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer hover:bg-red-600"
              >
                <i className="fa-solid fa-download pointer-events-none"></i>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA (Die 4 Tabs) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {activeTab === 'liste' && <TabList />}
          {activeTab === 'übergabe' && <TabUebergabe />}
          {activeTab === 'statistik' && <TabStatistik />}
          {activeTab === 'zeitlinie' && <TabZeitlinie />}
        </div>
        
      </div>

      {/* EXPORT MODAL OVERLAY (Wird nur bei Klick auf den roten Button gerendert) */}
      {isExportModalOpen && (
        <ExportModal onClose={() => setIsExportModalOpen(false)} />
      )}
      
    </div>
  );
}