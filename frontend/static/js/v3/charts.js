// frontend/static/js/v3/charts.js
import { syncChartTheme as syncBaseTheme } from './chartBase.js';
import { renderWeightChart } from './chartWeight.js';
import { renderSummaryChart } from './chartSummary.js';
import { renderFatChart } from './chartFat.js';
import { renderMuscleChart } from './chartMuscle.js';
import { renderRadarChart } from './chartRadar.js';
import { renderNutritionChart } from './chartNutrition.js';
import { renderDeltaChart } from './chartDelta.js';
import { renderEnergySplitChart } from './chartEnergySplit.js';

const activeCharts = {};

export function syncChartTheme() {
  syncBaseTheme();
}

function updateChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  if (activeCharts[id]) {
    try { activeCharts[id].destroy(); } catch (e) {}
  }

  const newCanvas = canvas.cloneNode(true);
  canvas.parentNode.replaceChild(newCanvas, canvas);
  activeCharts[id] = new Chart(newCanvas.getContext('2d'), config);
}

/**
 * Zeichnet alle Charts synchron basierend auf dem gewählten Zeitraum
 */
export function renderAllCharts(rawTimeline, user = null, startDateStr = '', endDateStr = '') {
  // Absicherung gegen komplett leere Datenstapel
  if (!rawTimeline || rawTimeline.length === 0) return;

  // Erzwinge die Bereinigung ungültiger Messwerte (z.B. Gewicht 0)
  const validTimeline = rawTimeline.filter(t => t && t.weight && t.weight > 0);
  if (validTimeline.length === 0) return;

  const startLimit = startDateStr ? new Date(startDateStr + 'T00:00:00') : null;
  const endLimit = endDateStr ? new Date(endDateStr + 'T23:59:59') : null;

  // 1. Filter die Daten exakt für den ausgewählten Zeitraum
  let activeTimeline = validTimeline.filter(t => {
    if (!startLimit || !endLimit) return true;
    const d = new Date(t.timestamp);
    return d >= startLimit && d <= endLimit;
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // 2. FACHLICHER HISTORIEN-FALLBACK (Mindestens 5 Tage für stabile Tagesachsen-Kurven)
  let historyTimeline = [...activeTimeline];

  // Wenn "Heute", "Gestern" oder ein frischer Zeitraum mit weniger als 5 Einträgen gewählt ist:
  // Fallback auf die letzten 30 Tage der Historie, damit die Kurven stabil bleiben!
  if (activeTimeline.length < 5) {
    historyTimeline = validTimeline.slice(-30).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // WICHTIGER FIX GEGEN STUNDEN-ACHSEN: Wir erzwingen reine Datums-Strings (YYYY-MM-DD)
  const dates = historyTimeline.map(t => {
    if (t.date) return Array.isArray(t.date) ? t.date[0] : t.date;
    const d = new Date(t.timestamp);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  });

  // 3. Aufruf aller Diagramme mit der mathematisch exakt synchronisierten Parameter-Reihenfolge
  renderWeightChart(historyTimeline, validTimeline, updateChart, dates);
  renderSummaryChart(historyTimeline, validTimeline, updateChart, dates);
  renderFatChart(historyTimeline, validTimeline, updateChart, dates);
  renderMuscleChart(historyTimeline, validTimeline, updateChart, dates);

  // Das Ernährungs-Chart erhält das user-Objekt, um den echten TDEE-Verbrauch anzuzeigen
  renderNutritionChart(historyTimeline, updateChart, validTimeline, user);

  // Das Delta-Chart vergleicht die echten Grenzen des gesetzten Filters
  renderDeltaChart(activeTimeline.length > 0 ? activeTimeline : [validTimeline[validTimeline.length - 1]], validTimeline, updateChart, startDateStr, endDateStr);

  // Übergibt validTimeline, damit das Netz bei Leerlauf nicht abstürzt und den aktuellsten Punkt findet
  renderRadarChart(validTimeline, updateChart, user);

  if (user) {
    renderEnergySplitChart(user, updateChart);
  }

  console.log(`🚀 Charts stabilisiert gezeichnet. X-Achsen-Punkte: ${dates.length} Tage.`);
}
