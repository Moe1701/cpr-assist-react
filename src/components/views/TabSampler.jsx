// --- Datei: src/components/views/TabSampler.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

// Hilfs-Komponente für die JA/NEIN/? Toggles
const ToggleGroup = ({ value, options, onChange }) => (
  <div className="flex bg-slate-100 p-1 rounded-xl w-full">
    {options.map(opt => (
      <button 
        key={opt.val}
        onClick={() => onChange(opt.val)}
        className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-colors ${value === opt.val ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default function TabSampler() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  
  // Lokaler State für flüssiges Tippen, initialisiert aus dem globalen Gedächtnis
  const [formData, setFormData] = useState(state.anamneseData);

  const handleChange = (field, value, isSampler = false) => {
    if (isSampler) {
      setFormData(prev => ({ ...prev, sampler: { ...prev.sampler, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    // 1. In globalen State übernehmen
    dispatch({ type: 'SAVE_ANAMNESE', payload: formData });

    // 2. Den gigantischen Log-Text zusammenbauen (wie im Original)
    let logText = "Anamnese erfasst: ";
    if (formData.alter) logText += `Alter ${formData.alter} J. | `;
    if (formData.gewicht) logText += `Gewicht ${formData.gewicht} kg | `;
    
    if (formData.beobachtet) logText += `Beobachtet: ${formData.beobachtet.toUpperCase()} | `;
    if (formData.laienrea) logText += `Laien-REA: ${formData.laienrea.toUpperCase()} | `;
    if (formData.brustschmerz) logText += `Brustschmerz: ${formData.brustschmerz.toUpperCase()} | `;
    if (formData.therapie) logText += `Therapie-Einschränkung: ${formData.therapie.toUpperCase()} | `;

    let samplerParts = [];
    const sd = formData.sampler;
    if (sd.s) samplerParts.push(`S: ${sd.s}`);
    if (sd.a) samplerParts.push(`A: ${sd.a}`);
    if (sd.m) samplerParts.push(`M: ${sd.m}`);
    if (sd.p) samplerParts.push(`P: ${sd.p}`);
    if (sd.l) samplerParts.push(`L: ${sd.l}`);
    if (sd.e) samplerParts.push(`E: ${sd.e}`);
    if (sd.r) samplerParts.push(`R: ${sd.r}`);
    
    if (samplerParts.length > 0) logText += `\nSAMPLER: ${samplerParts.join(', ')}`;

    logEvent(CPR_CONFIG.EVENTS.INFO, logText);
    
    // 3. Modal schließen
    dispatch({ type: 'TOGGLE_HITS_MODAL', payload: false });
  };

  return (
    <div className="p-4 flex flex-col gap-6 pb-10">
      
      {/* Vitals */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Alter (Jahre)</label>
          <input 
            type="number" value={formData.alter} onChange={(e) => handleChange('alter', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-300"
            placeholder="z.B. 45"
          />
        </div>
        <div>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Gewicht (kg)</label>
          <input 
            type="number" value={formData.gewicht} onChange={(e) => handleChange('gewicht', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-300"
            placeholder="z.B. 80"
          />
        </div>
      </div>

      {/* Leitfragen */}
      <div>
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Leitfragen</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-slate-500 uppercase">Beobachteter Arrest?</span>
            <ToggleGroup value={formData.beobachtet} onChange={(v) => handleChange('beobachtet', v)} options={[{label:'JA',val:'ja'},{label:'NEIN',val:'nein'},{label:'?',val:'?'}]} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-slate-500 uppercase">Laien-Rea?</span>
            <ToggleGroup value={formData.laienrea} onChange={(v) => handleChange('laienrea', v)} options={[{label:'JA',val:'ja'},{label:'NEIN',val:'nein'}]} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-slate-500 uppercase">Brustbeschwerden?</span>
            <ToggleGroup value={formData.brustschmerz} onChange={(v) => handleChange('brustschmerz', v)} options={[{label:'JA',val:'ja'},{label:'NEIN',val:'nein'},{label:'?',val:'?'}]} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-slate-500 uppercase">Therapie-Einschränkung?</span>
            <ToggleGroup value={formData.therapie} onChange={(v) => handleChange('therapie', v)} options={[{label:'JA',val:'ja'},{label:'NEIN',val:'nein'}]} />
          </div>
        </div>
      </div>

      {/* SAMPLER Inputs */}
      <div>
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">SAMPLER + S</label>
        <div className="flex flex-col gap-2">
          {[
            { id: 's', label: 'Symptome...' },
            { id: 'a', label: 'Allergien...' },
            { id: 'm', label: 'Medikamente...' },
            { id: 'p', label: 'Patientengeschichte (Vorerkrankungen)...' },
            { id: 'l', label: 'Letzte Mahlzeit / Stuhlgang...' },
            { id: 'e', label: 'Ereignis vor dem Stillstand...' },
            { id: 'r', label: 'Risikofaktoren...' }
          ].map(field => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[12px] font-black shrink-0 shadow-sm uppercase">
                {field.id}
              </div>
              <input 
                type="text" value={formData.sampler[field.id]} onChange={(e) => handleChange(field.id, e.target.value, true)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-300 placeholder:text-slate-300 placeholder:font-medium"
                placeholder={field.label}
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_5px_20px_rgba(79,70,229,0.3)] active:scale-95 transition-transform"
      >
        SAMPLER Speichern
      </button>

    </div>
  );
}