// --- Datei: src/components/views/HitsModal.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import TabHits from './TabHits.jsx';
import TabSampler from './TabSampler.jsx';

export default function HitsModal() {
  const { state, dispatch } = useContext(CprContext);
  const [activeTab, setActiveTab] = useState('hits'); // 'hits' oder 'sampler'

  if (!state.isHitsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col justify-end pointer-events-none bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container, fährt von unten ein */}
      <div className="w-full h-[85vh] bg-slate-100 shadow-[0_-15px_50px_rgba(0,0,0,0.3)] flex flex-col rounded-t-3xl overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-full duration-300">
        
        {/* HEADER & TAB SWITCHER */}
        <div className="flex flex-col px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0 gap-3 z-20">
          <div className="flex justify-between items-center w-full">
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-lg">Zusatzinfos</h3>
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_HITS_MODAL', payload: false })}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm active:scale-95 transition-transform"
            >
              Schließen
            </button>
          </div>
          
          <div className="flex bg-slate-200 p-1 rounded-xl w-full">
            <button 
              onClick={() => setActiveTab('hits')}
              className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-black uppercase shadow-sm transition-all ${activeTab === 'hits' ? 'bg-white text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              HITS-Schema
            </button>
            <button 
              onClick={() => setActiveTab('sampler')}
              className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-black uppercase shadow-sm transition-all ${activeTab === 'sampler' ? 'bg-white text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              SAMPLER
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'hits' ? <TabHits /> : <TabSampler />}
        </div>
        
      </div>
    </div>
  );
}