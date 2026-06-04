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
  const validTimeline = rawTimeline.filter(t => t.weight && t.weight > 0);
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

  // Wenn "Heute", "Gestern" oder ein frischer Monat mit weniger als 5 Einträgen gewählt ist:
  // Fallback auf die letzten 30 Tage der Historie, damit die Kurve stabil bleibt!
  if (activeTimeline.length < 5) {
    historyTimeline = validTimeline.slice(-30).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // WICHTIGER FIX GEGEN STUNDEN-ACHSEN: Wir erzwingen reine Datums-Strings (YYYY-MM-DD)
  const dates = historyTimeline.map(t => {
    if (t.date) return t.date;
    const d = new Date(t.timestamp);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  });

  // 3. Aufruf aller Diagramme mit sauber formatierten Strings und Datenbasen
  renderWeightChart(historyTimeline, rawTimeline, updateChart, dates);
  renderSummaryChart(historyTimeline, rawTimeline, updateChart, dates);
  renderFatChart(historyTimeline, rawTimeline, updateChart, dates);
  renderMuscleChart(historyTimeline, rawTimeline, updateChart, dates);
  renderNutritionChart(historyTimeline, updateChart);
  renderRadarChart(validTimeline, updateChart, user);
  renderDeltaChart(activeTimeline.length > 0 ? activeTimeline : [validTimeline[validTimeline.length-1]], rawTimeline, updateChart, startDateStr, endDateStr);


  if (user) {
    renderEnergySplitChart(user, updateChart);
  }

  console.log(`🚀 Charts stabilisiert gezeichnet. X-Achsen-Punkte: ${dates.length} Tage.`);

}
