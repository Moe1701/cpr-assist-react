// =====================================================
// 1. DAS ORIGINALE BROSELOW-TAPE DATEN-ARRAY
// =====================================================
export const BROSELOW_DATA = [
  { color: 'grau',   minKg: 3,  maxKg: 5,  avgKg: 4,    cm: 55,  ageStr: '< 1 J.',   airway: { tubus: '3.0-3.5', tiefe: '9-10',  sga: '1',       guedel: '000', wendel: '12 CH' } },
  { color: 'rosa',   minKg: 6,  maxKg: 7,  avgKg: 6.5,  cm: 65,  ageStr: '< 1 J.',   airway: { tubus: '3.5',     tiefe: '10-11', sga: '1.5',     guedel: '00',  wendel: '14 CH' } },
  { color: 'rot',    minKg: 8,  maxKg: 9,  avgKg: 8.5,  cm: 70,  ageStr: '< 1 J.',   airway: { tubus: '3.5-4.0', tiefe: '11-12', sga: '1.5',     guedel: '0',   wendel: '16 CH' } },
  { color: 'lila',   minKg: 10, maxKg: 11, avgKg: 10.5, cm: 80,  ageStr: '1-2 J.',   airway: { tubus: '4.0',     tiefe: '12',    sga: '1.5-2.0', guedel: '1',   wendel: '18 CH' } },
  { color: 'gelb',   minKg: 12, maxKg: 14, avgKg: 13,   cm: 90,  ageStr: '2-3 J.',   airway: { tubus: '4.0-4.5', tiefe: '13',    sga: '2.0',     guedel: '1',   wendel: '20 CH' } },
  { color: 'weiss',  minKg: 15, maxKg: 18, avgKg: 16.5, cm: 100, ageStr: '4-5 J.',   airway: { tubus: '4.5',     tiefe: '14',    sga: '2.0',     guedel: '2',   wendel: '22 CH' } },
  { color: 'blau',   minKg: 19, maxKg: 23, avgKg: 21,   cm: 110, ageStr: '6-7 J.',   airway: { tubus: '5.0',     tiefe: '15',    sga: '2.0-2.5', guedel: '2',   wendel: '24 CH' } },
  { color: 'orange', minKg: 24, maxKg: 29, avgKg: 26.5, cm: 120, ageStr: '8-9 J.',   airway: { tubus: '5.5',     tiefe: '16-17', sga: '2.5',     guedel: '2-3', wendel: '26 CH' } },
  { color: 'gruen',  minKg: 30, maxKg: 36, avgKg: 33,   cm: 135, ageStr: '10-12 J.', airway: { tubus: '6.0',     tiefe: '18',    sga: '3.0',     guedel: '3',   wendel: '28 CH' } }
];

// =====================================================
// 2. BERECHNUNG: ALTER <-> GEWICHT <-> GRÖSSE
// =====================================================
export function calculatePediatricVitals(source, value) {
  let age = 0, kg = 0, cm = 0;

  if (source === 'age') { 
      age = value;
      // Säugling = 6kg, ab 1 Jahr Formel: 2 * (Alter + 4)
      if (age === 0) kg = 6; 
      else kg = 2 * (age + 4); 
      cm = Math.round((age * 6) + 77); 
  } 
  else if (source === 'kg') { 
      kg = value;
      // Unter 10kg = Säugling, ab 10kg Formel umgestellt: (Gewicht / 2) - 4
      if (kg < 10) age = 0; 
      else age = Math.max(1, Math.round((kg / 2) - 4)); 
      cm = Math.round((age * 6) + 77); 
  }
  return { age, kg, cm };
}

// =====================================================
// 3. BROSELOW FARBBESTIMMUNG
// =====================================================
export function getBroselowZone(kg) {
  if (!BROSELOW_DATA) return null;
  return BROSELOW_DATA.find(z => kg >= z.minKg && kg <= z.maxKg) || BROSELOW_DATA[BROSELOW_DATA.length - 1];
}

// =====================================================
// 4. MEDIKAMENTEN-BERECHNUNG (Adrenalin & Amiodaron)
// =====================================================
export function calculatePediatricMeds(kg) {
  if (!kg) return null;
  return {
      adrenalin: Math.round(kg * 10) + ' µg',
      amiodaron: Math.round(kg * 5) + ' mg'
  };
}

// =====================================================
// 5. ROSC-ZIELWERTE BERECHNEN (RR, HF, VT)
// =====================================================
export function calculatePediatricRoscVitals(kg) {
  if (!kg) return null;
  let age = 0; 
  if (kg >= 10) age = Math.max(1, Math.round((kg / 2) - 4));

  let rr = "> 70 mmHg"; 
  if (age >= 1 && age <= 10) rr = `> ${70 + (2 * age)} mmHg`; 
  else if (age > 10) rr = "> 90 mmHg";

  let hr = "110 - 160 /min"; 
  if (age >= 1 && age < 2) hr = "100 - 150 /min"; 
  else if (age >= 2 && age < 5) hr = "90 - 140 /min"; 
  else if (age >= 5 && age <= 12) hr = "80 - 120 /min"; 
  else if (age > 12) hr = "60 - 100 /min";

  let vt = Math.round(kg * 6) + " ml";

  return { age, rr, hr, vt };
}