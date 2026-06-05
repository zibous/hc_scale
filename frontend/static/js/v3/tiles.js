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

  const isSingleDay = (startDateStr === endDateStr);

  // 2. 🔧 ECHTER HISTORIEN-FALLBACK-FIX (Verhindert den undefined-Absturz!)
  let latestInPeriod;
  let firstInPeriod;
  let isHistoricalReview = false;

  if (periodTimeline.length > 0) {
    // Wenn Daten im gewählten Zeitraum existieren
    latestInPeriod = periodTimeline[periodTimeline.length - 1];
    firstInPeriod = periodTimeline[0];
  } else {
    // Falls heute noch keine Messung vorliegt: Nimm den letzten historischen Messpunkt!
    latestInPeriod = timeline[timeline.length - 1];
    firstInPeriod = latestInPeriod;
    isHistoricalReview = true;
  }

  // Vergleichswert für den Trend-Pfeil fehlerfrei ermitteln
  let comparisonEntry = firstInPeriod;
  if (isSingleDay || periodTimeline.length < 2 || isHistoricalReview) {
    // Sichere Suche in der Gesamthistorie per ID oder Zeitstempel
    const globalIndex = timeline.findIndex(t => {
      if (latestInPeriod && latestInPeriod.id && t.id) return t.id === latestInPeriod.id;
      return new Date(t.timestamp).getTime() === new Date(latestInPeriod.timestamp).getTime();
    });
    comparisonEntry = globalIndex > 0 ? timeline[globalIndex - 1] : latestInPeriod;
  }

  // Sparkline-Verlauf festlegen (Bei Leerlauf zeigen wir die letzten 7 Messungen gesamt)
  const historyData = (isSingleDay || isHistoricalReview) ? timeline.slice(-7) : periodTimeline;

  // 3. Dynamische Titel-Periode für die zentrale Überschrift generieren
  let periodHeadline = '';
  if (isHistoricalReview) {
    const lastMeasureDate = new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE');
    periodHeadline = `Fokus: Heute noch keine Messung <span style="font-weight: normal; color: var(--apple-orange); font-size: 13px;">(Historischer Rückblick vom ${lastMeasureDate})</span>`;
  } else if (isSingleDay) {
    const formattedDate = new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE');
    periodHeadline = `Fokus: Einzelmessung vom ${formattedDate}`;
  } else {
    const fromDate = new Date(startDateStr).toLocaleDateString('de-DE');
    const toDate = new Date(endDateStr).toLocaleDateString('de-DE');
    const lastMeasureDate = new Date(latestInPeriod.timestamp).toLocaleDateString('de-DE');
    periodHeadline = `Analyse-Zeitraum: ${fromDate} bis ${toDate} <span style="font-weight: normal; color: var(--text-muted); font-size: 13px;">(Letzter Messpunkt im Zeitraum: ${lastMeasureDate})</span>`;
  }

  // 🔍 DIAGNOSE-TEST: Zeigt uns alle echten Tabellen-Spalten deiner Waage!
  // console.error("MESSWERT-STRUKTUR DER WAAGE:", JSON.stringify(latestInPeriod, null, 2));

  // Definition aller Waagen-Metriken (Impedanz durch Biologisches Alter ersetzt!)
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
    { id: 'i', title: 'Biologisches Alter', val: latestInPeriod.metabolic_age, pVal: comparisonEntry.metabolic_age, unit: ' J.', color: '#8e8e93', history: historyData.map(t => t.metabolic_age), min: 18, max: 80 }
  ];

  // 3. HTML für die Überschrift und das Kachel-Grid erzeugen
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
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  metrics.forEach(m => {
    const canvasId = `spark_${m.id}`;
    const canvasEl = document.getElementById(canvasId);
    const ctx = canvasEl?.getContext('2d');
    if (!ctx) return;

    if (activeSparklines[canvasId]) activeSparklines[canvasId].destroy();

    // 1. Hole die leuchtende Kontrast-Farbe für die Linie
    let lineColor = m.color;
    if (isDark) {
      const darkColorMap = {
        'var(--apple-red)': '#ff453a',
        'var(--apple-orange)': '#ff9f0a',
        'var(--apple-green)': '#30d158',
        'var(--apple-purple)': '#bf5af2',
        'var(--apple-blue)': '#0a84ff',
        '#8e8e93': '#aeaeac'
      };
      lineColor = darkColorMap[m.color] || m.color;
    } else {
      // Lightmode Kontrast-Absicherung für CSS-Variablen
      const lightColorMap = {
        'var(--apple-red)': '#ff3b30',
        'var(--apple-orange)': '#ff9500',
        'var(--apple-green)': '#34c759',
        'var(--apple-purple)': '#af52de',
        'var(--apple-blue)': '#007aff',
        '#8e8e93': '#8e8e93'
      };
      lineColor = lightColorMap[m.color] || m.color;
    }

    // 2. 🔧 DER NEON-GLOW-FIX: Dynamischen vertikalen Farbverlauf erzeugen
    // Wir erstellen einen Verlauf von oben (Säulen-Spitze) nach unten (Kachel-Boden)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasEl.height || 40);

    // Wir wandeln die Hex-Farbe in RGB um, um die Deckkraft exakt zu steuern
    let rgb = '10, 132, 255'; // Fallback Blue
    const hex = lineColor.startsWith('#') ? lineColor : '#0a84ff';
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      rgb = `${r}, ${g}, ${b}`;
    }

    if (isDark) {
      // Im Darkmode lassen wir den Verlauf oben kräftig mit 25% starten für echtes Leuchten
      gradient.addColorStop(0, `rgba(${rgb}, 0.25)`);
      gradient.addColorStop(1, `rgba(${rgb}, 0.0)`);
    } else {
      // Im Lightmode etwas dezenter, damit es nicht matschig wirkt
      gradient.addColorStop(0, `rgba(${rgb}, 0.15)`);
      gradient.addColorStop(1, `rgba(${rgb}, 0.0)`);
    }

    // 3. Chart instanziieren
    activeSparklines[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: m.history.map((_, i) => i),
        datasets: [{
          data: m.history,
          borderColor: lineColor,
          borderWidth: 2.5, // Linie leicht dicker für bessere Sichtbarkeit
          pointRadius: m.history.length === 1 ? 4 : 0,
          pointBackgroundColor: lineColor,
          backgroundColor: gradient, // Der flüssige Neon-Verlauf wird injiziert
          fill: true,                // Fläche unter der Linie ausfüllen
          tension: 0.35              // Macht die Kurven noch geschmeidiger
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 150 },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: {
            display: false,
            offset: true // Gibt der Kurve oben und unten 10% Luft, damit sie nicht am Canvas-Rand klebt
          }
        }
      }
    });
  });
}
