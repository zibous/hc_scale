// frontend/static/js/tiles-data.js
import { getAppleIcon } from './icons.js';

export function prepareGroupMetrics(timeline, startDateStr, endDateStr, user) {
  const startLimit = new Date(startDateStr + 'T00:00:00');
  const endLimit = new Date(endDateStr + 'T23:59:59');

  const periodTimeline = timeline
    .filter(t => { const d = new Date(t.timestamp); return d >= startLimit && d <= endLimit; })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const isSingleDay = (startDateStr === endDateStr);

  let latestInPeriod, firstInPeriod, isHistoricalReview = false;
  if (periodTimeline.length > 0) {
    latestInPeriod = periodTimeline[periodTimeline.length - 1];
    firstInPeriod = periodTimeline[0];
  } else {
    latestInPeriod = timeline[timeline.length - 1];
    firstInPeriod = latestInPeriod;
    isHistoricalReview = true;
  }

  let comparisonEntry = firstInPeriod;
  if (isSingleDay || periodTimeline.length < 2 || isHistoricalReview) {
    const globalIndex = timeline.findIndex(t => t.id === latestInPeriod.id || new Date(t.timestamp).getTime() === new Date(latestInPeriod.timestamp).getTime());
    comparisonEntry = globalIndex > 0 ? timeline[globalIndex - 1] : latestInPeriod;
  } else {
    comparisonEntry = firstInPeriod;
  }

  const historyData = (isSingleDay || isHistoricalReview) ? timeline.slice(-7) : periodTimeline;

  let periodHeadline = '';
  if (isHistoricalReview) {
    periodHeadline = `Fokus: Keine heutigen Messdaten <span style="font-weight:normal;color:var(--apple-orange);font-size:13px;">(Rückblick vom ${new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE')})</span>`;
  } else if (isSingleDay) {
    periodHeadline = `Fokus: Einzelmessung vom ${new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE')}`;
  } else {
    periodHeadline = `Analyse: ${new Date(startDateStr).toLocaleDateString('de-DE')} bis ${new Date(endDateStr).toLocaleDateString('de-DE')} <span style="font-weight:normal;color:var(--text-muted);font-size:13px;">(Letzter Messpunkt: ${new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE')})</span>`;
  }

  // 🌟 DYNAMISCHE GRENZEN AUS DEN USER-SCORES BERECHNEN (±15% Toleranz-Fenster)
  const uScores = user?.scores || {};
  const targetW = user?.target || uScores.WEIGHT || 70.0;
  const targetM = uScores.MUSCLE || 55.0;
  const targetWa = uScores.WATER || 55.0;

  const iconWeight = getAppleIcon('weight', 18, 0.85, 6);
  const iconMuscle = getAppleIcon('muscle', 18, 0.85, 6);
  const iconWater  = getAppleIcon('water',  18, 0.85, 6);
  const iconEnergy = getAppleIcon('energy', 18, 0.85, 6);

  const metrics = [
    {
      id: 'w_group',
      title: `${iconWeight} Gewicht & Index (${latestInPeriod.bodytype || 'Normal'})`, // 🆕 Apple Waage-Icon
      val: latestInPeriod.weight, pVal: comparisonEntry.weight, unit: 'kg', color: 'var(--apple-red)', history: historyData.map(t => t.weight),
      min: targetW * 0.85, max: targetW * 1.15,
      subMetrics: [
        { title: 'BMI', val: latestInPeriod.bmi, unit: '' },
        { title: 'Fettfrei (LBM)', val: latestInPeriod.lbm, unit: 'kg' },
        { title: 'Ziel-Abw.', val: (latestInPeriod.weight - targetW), unit: 'kg' }
      ]
    },
    {
      id: 'f_group',
      title: `${iconMuscle} Körperbau & Muskeln`, // 🆕 Apple Hantel-Icon
      val: latestInPeriod.muscle, pVal: comparisonEntry.muscle, unit: 'kg', color: 'var(--apple-orange)', history: historyData.map(t => t.muscle),
      min: targetM * 0.85, max: targetM * 1.15,
      subMetrics: [
        { title: 'Körperfett', val: latestInPeriod.fat, unit: '%' },
        { title: 'Viszeralfett', val: latestInPeriod.visceral, unit: 'Lvl' },
        { title: 'FFMI Index', val: latestInPeriod.ffmi, unit: '' }
      ]
    },
    {
      id: 'wa_group',
      title: `${iconWater} Hydration & Proteine`, // 🆕 Apple Wassertropfen-Icon
      val: latestInPeriod.water, pVal: comparisonEntry.water, unit: '%', color: 'var(--apple-blue)', history: historyData.map(t => t.water),
      min: targetWa * 0.85, max: targetWa * 1.15,
      subMetrics: [
        { title: 'Proteinanteil', val: latestInPeriod.protein, unit: '%' },
        { title: 'Knochenmasse', val: latestInPeriod.bone, unit: 'kg' }
      ]
    },
    {
      id: 'i_group',
      title: `${iconEnergy} Stoffwechsel & Alter`, // 🆕 Apple Energie-Blitz-Icon
      val: latestInPeriod.metabolic_age, pVal: comparisonEntry.metabolic_age, unit: ' J.', color: 'var(--apple-green)', history: historyData.map(t => t.metabolic_age),
      min: 18, max: 75,
      subMetrics: [
        { title: 'Score (POI)', val: latestInPeriod.poi, unit: 'Pts' },
        { title: 'Grundumsatz', val: latestInPeriod.bmr, unit: ' kcal' },
        { title: 'Bedarf (TDEE)', val: latestInPeriod.tdee, unit: ' kcal' }
      ]
    }
  ];


  return { metrics, periodHeadline };
}
