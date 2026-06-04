// frontend/static/js/tiles.js
const activeSparklines = {};

/**
 * Erstellt die 11 Info-Karten basierend auf dem gewählten Zeitraum
 */
export function renderKPITiles(timeline, startDateStr, endDateStr) {
  const grid = document.getElementById('kpiGrid');
  if (!grid || !timeline || timeline.length === 0) return;

  // 1. Filter die Daten exakt für den gewählten Zeitraum
  const startLimit = new Date(startDateStr + 'T00:00:00');
  const endLimit = new Date(endDateStr + 'T23:59:59');

  const periodTimeline = timeline
    .filter(t => {
      const d = new Date(t.timestamp);
      return d >= startLimit && d <= endLimit;
    })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // WICHTIGER FIX: Wenn für den gewählten Zeitraum KEINE Daten existieren
  if (periodTimeline.length === 0) {
    grid.innerHTML = `
      <div class="tile" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
        <div class="tile-title" style="color: var(--apple-red);">Keine Messdaten im Zeitraum gefunden</div>
        <div class="tile-subtext" style="margin-top: 5px;">Bitte wähle einen anderen Zeitraum aus (Gewählt: ${startDateStr} bis ${endDateStr}).</div>
      </div>
    `;
    return;
  }

  // Letzter und erster Messpunkt innerhalb des Fokus
  const latestInPeriod = periodTimeline[periodTimeline.length - 1];
  const firstInPeriod = periodTimeline[0];
  const isSingleDay = (startDateStr === endDateStr);

  // Vergleichswert für den Trend-Pfeil ermitteln
  let comparisonEntry = firstInPeriod;
  if (isSingleDay || periodTimeline.length < 2) {
    const globalIndex = timeline.findIndex(t => t.id === latestInPeriod.id);
    comparisonEntry = globalIndex > 0 ? timeline[globalIndex - 1] : latestInPeriod;
  }

  // Sparkline-Verlauf festlegen
  const historyData = isSingleDay ? timeline.slice(-7) : periodTimeline;

  // 2. Dynamische Titel-Periode für die zentrale Überschrift generieren
  let periodHeadline = '';
  if (isSingleDay) {
    const formattedDate = new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE');
    periodHeadline = `Fokus: Einzelmessung vom ${formattedDate}`;
  } else {
    const fromDate = new Date(startDateStr).toLocaleDateString('de-DE');
    const toDate = new Date(endDateStr).toLocaleDateString('de-DE');
    const lastMeasureDate = new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE');
    periodHeadline = `Analyse-Zeitraum: ${fromDate} bis ${toDate} <span style="font-weight: normal; color: var(--text-muted); font-size: 13px;">(Letzter Messpunkt im Zeitraum: ${lastMeasureDate})</span>`;
  }

  // Definition aller Waagen-Metriken
  const metrics = [
    { id: 'w', title: 'Gewicht', val: latestInPeriod.weight, pVal: comparisonEntry.weight, unit: 'kg', color: 'var(--apple-red)', history: historyData.map(t => t.weight), min: 50, max: 100 },
    { id: 'f', title: 'Körperfett', val: latestInPeriod.fat, pVal: comparisonEntry.fat, unit: '%', color: 'var(--apple-orange)', history: historyData.map(t => t.fat), min: 5, max: 35 },
    { id: 'm', title: 'Muskelmasse', val: latestInPeriod.muscle, pVal: comparisonEntry.muscle, unit: 'kg', color: 'var(--apple-green)', history: historyData.map(t => t.muscle), min: 30, max: 70 },
    { id: 'b', title: 'BMI', val: latestInPeriod.bmi, pVal: comparisonEntry.bmi, unit: '', color: 'var(--apple-purple)', history: historyData.map(t => t.bmi), min: 15, max: 35 },
    { id: 'v', title: 'Viszeralfett', val: latestInPeriod.visceral, pVal: comparisonEntry.visceral, unit: 'Lvl', color: 'var(--apple-purple)', history: historyData.map(t => t.visceral), min: 1, max: 15 },
    { id: 'wa', title: 'Körperwasser', val: latestInPeriod.water, pVal: comparisonEntry.water, unit: '%', color: 'var(--apple-blue)', history: historyData.map(t => t.water), min: 40, max: 70 },
    { id: 'p', title: 'Protein', val: latestInPeriod.protein, pVal: comparisonEntry.protein, unit: '%', color: 'var(--apple-blue)', history: historyData.map(t => t.protein), min: 10, max: 25 },
    { id: 'l', title: 'Fettfreie Masse (LBM)', val: latestInPeriod.lbm, pVal: comparisonEntry.lbm, unit: 'kg', color: 'var(--apple-red)', history: historyData.map(t => t.lbm), min: 40, max: 85 },
    { id: 'po', title: 'Punkte (POI)', val: latestInPeriod.poi, pVal: comparisonEntry.poi, unit: 'Pts', color: 'var(--apple-green)', history: historyData.map(t => t.poi), min: 5, max: 20 },
    { id: 'i', title: 'Impedanz', val: latestInPeriod.impedance, pVal: comparisonEntry.impedance, unit: 'Ω', color: '#8e8e93', history: historyData.map(t => t.impedance), min: 400, max: 800 }
  ];

  // 3. HTML für die Überschrift und das Kachel-Grid erzeugen
  // Wir packen die Überschrift direkt vor das Grid oder injecten ein Full-Width Element im Grid
  const tilesHtml = metrics.map(m => {
    const diff = m.val - m.pVal;
    let trendClass = 'trend-stable', trendArrow = '→', trendText = 'Stabil';
    const isPositiveMetric = ['m', 'wa', 'p', 'po'].includes(m.id);

    if (diff > 0.02) {
      trendClass = isPositiveMetric ? 'trend-up' : 'trend-down';
      trendArrow = '▲';
      trendText = `+${diff.toFixed(1)}`;
    } else if (diff < -0.02) {
      trendClass = isPositiveMetric ? 'trend-down' : 'trend-up';
      trendArrow = '▼';
      trendText = `${diff.toFixed(1)}`;
    }

    const percent = Math.min(Math.max(((m.val - m.min) / (m.max - m.min)) * 100, 5), 100);

    return `
      <div class="tile">
        <div class="tile-header">
          <div class="tile-title">${m.title}</div>
          <div class="tile-trend ${trendClass}">${trendArrow} ${trendText}</div>
        </div>

        <div class="tile-body">
          <div class="tile-value">${m.val ? m.val.toFixed(1) : '--'}<span>${m.unit}</span></div>
          <div class="sparkline-container">
            <canvas id="spark_${m.id}"></canvas>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-bar" style="width: ${percent}%; background-color: ${m.color};"></div>
        </div>
      </div>
    `;
  }).join('');

  // Das Kachel-Grid erhält nun als erstes Element eine "Full-Width" Überschriften-Zeile
  grid.innerHTML = `
    <div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;">
      <h2 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin: 0; letter-spacing: -0.3px;">
        ${periodHeadline}
      </h2>
    </div>
    ${tilesHtml}
  `;

  // 4. Sparklines zeichnen
  metrics.forEach(m => {
    const canvasId = `spark_${m.id}`;
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    if (activeSparklines[canvasId]) activeSparklines[canvasId].destroy();

    activeSparklines[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: m.history.map((_, i) => i),
        datasets: [{
          data: m.history,
          borderColor: m.color,
          borderWidth: 2,
          pointRadius: m.history.length === 1 ? 3 : 0,
          backgroundColor: 'transparent',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  });
}
