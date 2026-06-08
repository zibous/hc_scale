import { prepareGroupMetrics } from './tiles-data.js';
import { createKPITileHtml, getTileSkeletonHtml, injectTileStyles, getLineColor, getGradient } from './tiles-ui.js';

const activeSparklines = {};
// 🌟 Cache um 'user' erweitert
let cached = { timeline: null, start: "", end: "", user: null, initialized: false };

export function renderKPITilesSkeleton() {
  const grid = document.getElementById('kpiGrid');
  injectTileStyles();
  if (grid) grid.innerHTML = getTileSkeletonHtml();
}

// 🌟 Nimmt jetzt 'user' als 4. Parameter entgegen
export function renderKPITiles(timeline, startDateStr, endDateStr, user) {
  const grid = document.getElementById('kpiGrid');
  if (!grid || !timeline?.length) return;

  // Caching für Resize & Theme (user wird mitgesichert)
  cached.timeline = timeline;
  cached.start = startDateStr;
  cached.end = endDateStr;
  cached.user = user;

  injectTileStyles();

  // 🌟 Übergibt das User-Objekt an den Datenprozessor für die dynamischen Grenzen
  const { metrics, periodHeadline } = prepareGroupMetrics(timeline, startDateStr, endDateStr, user);

  grid.innerHTML = `<div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;"><h2 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0; letter-spacing: -0.3px;">${periodHeadline}</h2></div>${metrics.map(createKPITileHtml).join('')}`;

  metrics.forEach(m => {
    const canvas = document.getElementById(`spark_${m.id}`);
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (activeSparklines[m.id]) activeSparklines[m.id].destroy();

    const lineColor = getLineColor(m.color);
    activeSparklines[m.id] = new Chart(ctx, {
      type: 'line',
      data: { labels: m.history.map((_, i) => i), datasets: [{ data: m.history, borderColor: lineColor, borderWidth: 2.5, pointRadius: m.history.length === 1 ? 4 : 0, pointBackgroundColor: lineColor, backgroundColor: getGradient(ctx, canvas, lineColor), fill: true, tension: 0.35 }] },
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 150 }, plugins: { legend: false, tooltip: false }, scales: { x: { display: false }, y: { display: false, offset: true } } }
    });
  });

  // Registriere globale Listener einmalig (Mit sicherem cached.user Aufruf)
  if (!cached.initialized) {
    cached.initialized = true;
    let timeout;
    window.addEventListener('resize', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => renderKPITiles(cached.timeline, cached.start, cached.end, cached.user), 150);
    });
    new MutationObserver(() => renderKPITiles(cached.timeline, cached.start, cached.end, cached.user))
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
}
