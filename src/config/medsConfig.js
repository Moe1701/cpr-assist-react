// --- Datei: src/config/medsConfig.js ---

export const MED_DATABASE = [
  {
    categoryId: 'reanimation',
    categoryName: 'Reanimation',
    meds: [
      { 
        id: 'amiodaron', 
        label: 'Amiodaron', 
        getAdultDose: (state) => state.amioCount === 0 ? '300 mg' : '150 mg', 
        getPedDose: (state) => `${Math.round(state.patientWeight * 5)} mg`,
        actionType: 'GIVE_AMIODARON' // Löst den Zähler im Reducer aus
      }
    ]
  },
  {
    categoryId: 'hits',
    categoryName: 'Reversibel (4H/HITS)',
    meds: [
      { 
        id: 'calcium', 
        label: 'Calcium', 
        getAdultDose: () => '1 g', 
        getPedDose: (state) => `${Math.round(state.patientWeight * 20)} mg`
      },
      { 
        id: 'magnesium', 
        label: 'Magnesium', 
        getAdultDose: () => '2 g', 
        getPedDose: (state) => `${Math.round(state.patientWeight * 40)} mg`
      },
      { 
        id: 'bicarbonat', 
        label: 'Bicarbonat (8,4%)', 
        getAdultDose: () => '50 mmol', 
        getPedDose: (state) => `${Math.round(state.patientWeight * 1)} mmol`
      },
      { 
        id: 'volumen', 
        label: 'Volumen (NaCl/VEL)', 
        getAdultDose: () => '500 ml', 
        getPedDose: (state) => `${Math.round(state.patientWeight * 10)} ml`
      },
      { 
        id: 'atropin', 
        label: 'Atropin', 
        getAdultDose: () => '1 mg', 
        getPedDose: (state) => `${Math.round(state.patientWeight * 20)} µg`
      }
    ]
  },
  {
    categoryId: 'katecholamine',
    categoryName: 'Katecholamine (Perfusor)',
    meds: [] 
  },
  {
    categoryId: 'narkotika',
    categoryName: 'Narkotika / Sedativa',
    meds: [] 
  }
];