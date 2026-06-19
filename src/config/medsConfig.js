// --- Datei: src/config/medsConfig.js ---

export const MED_DATABASE = [
  {
    categoryId: 'hits',
    categoryName: 'Reversibel (4H/HITS)',
    meds: [
      { 
        id: 'calcium', 
        label: 'Calcium', 
        adultDose: '1 g', 
        calcPedDose: (kg) => `${Math.round(kg * 20)} mg` // 20 mg / kg
      },
      { 
        id: 'magnesium', 
        label: 'Magnesium', 
        adultDose: '2 g', 
        calcPedDose: (kg) => `${Math.round(kg * 40)} mg` // 40 mg / kg
      },
      { 
        id: 'bicarbonat', 
        label: 'Bicarbonat (8,4%)', 
        adultDose: '50 mmol', 
        calcPedDose: (kg) => `${Math.round(kg * 1)} mmol` // 1 mmol / kg
      },
      { 
        id: 'volumen', 
        label: 'Volumen (NaCl/VEL)', 
        adultDose: '500 ml', 
        calcPedDose: (kg) => `${Math.round(kg * 10)} ml` // 10 ml / kg
      },
      { 
        id: 'atropin', 
        label: 'Atropin', 
        adultDose: '1 mg', 
        calcPedDose: (kg) => `${Math.round(kg * 20)} µg` // 20 µg / kg
      }
    ]
  },
  {
    categoryId: 'katecholamine',
    categoryName: 'Katecholamine (Perfusor)',
    meds: [] // Perspektivisch für spätere Updates
  },
  {
    categoryId: 'narkotika',
    categoryName: 'Narkotika / Sedativa',
    meds: [] // Perspektivisch für spätere Updates
  }
];