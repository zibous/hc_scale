// /static/js/v3/chartBase.js

export const themeColors = { text: '#8e8e93', grid: '#e5e5ea', radarBg: 'rgba(0,122,255,0.1)' };

export function syncChartTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeColors.text = isDark ? '#aeaea2' : '#8e8e93';
  themeColors.grid = isDark ? '#2c2c2e' : '#e5e5ea';
  themeColors.radarBg = isDark ? 'rgba(10,132,255,0.15)' : 'rgba(0,122,255,0.08)';
}

export function calculateMovingAverage(data, period = 3) {
  return data.map((val, index) => {
    if (index < period - 1) {
      const slice = data.slice(0, index + 1);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    }
    const slice = data.slice(index - period + 1, index + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

export function calculateStats(timeline, rawTimeline, field) {
  const currentPoints = timeline.filter(t => t[field] && t[field] > 0);
  const latest = currentPoints[currentPoints.length - 1]?.[field] || 0;

  const currentAvg = currentPoints.length > 0
    ? currentPoints.reduce((sum, t) => sum + t[field], 0) / currentPoints.length
    : 0;

  const currentDates = new Set(timeline.map(t => t.date));
  const prevPoints = rawTimeline.filter(t => !currentDates.has(t.date) && t[field] && t[field] > 0);

  const prevAvg = prevPoints.length > 0
    ? prevPoints.reduce((sum, t) => sum + t[field], 0) / prevPoints.length
    : currentAvg;

  const diff = currentAvg - prevAvg;

  const trendArrow = diff > 0.02 ? '▲' : (diff < -0.02 ? '▼' : '●');

  const isNegativeField = ['fat', 'visceral'].includes(field);
  let badgeColorClass = 'badge-stable';

  if (Math.abs(diff) > 0.02) {
    if (diff > 0) {
      badgeColorClass = isNegativeField ? 'badge-danger' : 'badge-success';
    } else {
      badgeColorClass = isNegativeField ? 'badge-success' : 'badge-danger';
    }
  }

  return {
    latest: latest.toFixed(1),
    avg: currentAvg.toFixed(1),
    prevAvg: prevAvg.toFixed(1),
    diff: (diff > 0 ? '+' : '') + diff.toFixed(1),
    arrow: trendArrow,
    className: badgeColorClass
  };
}

/**
 * 🔧 UPGRADE: Horizontale Kacheln am Desktop nebeneinander, automatischer Umbruch auf Mobile
 */
export function renderChartSummaryFooter(canvasId, configArray, timeline, rawTimeline) {
  const canvas = document.getElementById(canvasId);
  const cardElement = canvas?.closest('.chart-card');
  if (!cardElement) return;

  // Modernisiertes, horizontales Layout-Grid im DOM verankern
  if (!document.getElementById('summary-footer-styles-v7')) {
    const style = document.createElement('style');
    style.id = 'summary-footer-styles-v7';
    style.textContent = `
      .chart-summary-footer {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        margin-top: 24px;
        border-top: 1px solid var(--card-border);
        padding-top: 20px;
        display: flex;
        flex-direction: row; /* 🔧 Desktop-Standard: Boxen nebeneinander ausrichten */
        flex-wrap: wrap;     /* 🔧 Mobil-Standard: Automatischer Zeilenumbruch falls zu schmal */
        gap: 20px;
        width: 100%;
        justify-content: center; /* Zentriert die Kacheln in der Mitte */
      }
      .summary-block-notused {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1 1 340px;    /* 🔧 Lässt Kacheln flexibel wachsen, bricht aber ab 340px Breite um */
        max-width: 440px;   /* Begrenzt die maximale Weite für kompakten Look */
      }
      .summary-metric-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        align-items: center;
        background: var(--bg-color);
        padding: 12px 16px;
        border-radius: 16px;
        border: 1px solid var(--card-border);
      }
      .summary-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .summary-col-label {
        font-size: 9px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .summary-col-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--text-main);
      }
      .summary-pill {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        justify-content: center;
      }
      .badge-success { background-color: rgba(52, 199, 89, 0.16); color: #248a3d; }
      .badge-danger { background-color: rgba(255, 59, 48, 0.16); color: #d6241a; }
      .badge-stable { background-color: rgba(142, 142, 147, 0.16); color: var(--text-muted); }

      [data-theme="dark"] .badge-success { color: #30d158; background-color: rgba(48, 209, 88, 0.2); }
      [data-theme="dark"] .badge-danger { color: #ff453a; background-color: rgba(255, 69, 58, 0.2); }

      @media (max-width: 768px) {
        .chart-summary-footer { flex-direction: column; align-items: center; }
        .summary-block { width: 100%; max-width: 100%; }
        .summary-grid { gap: 8px; padding: 10px; }
      }
    `;
    document.head.appendChild(style);
  }

  let summaryEl = cardElement.querySelector('.chart-summary-footer');
  if (!summaryEl) {
    summaryEl = document.createElement('div');
    summaryEl.className = 'chart-summary-footer';
    cardElement.appendChild(summaryEl);
  }

  // Generiert die Blöcke
  const htmlBlocks = configArray.map(cfg => {
    const s = calculateStats(timeline, rawTimeline, cfg.field);
    const cleanDiff = parseFloat(s.diff) === 0 ? '0.0' : s.diff;

    return `
      <div class="summary-block">
        <div class="summary-metric-title">${cfg.label} <span style="font-size: 11px; font-weight:500; text-transform:none;">(${cfg.unit})</span></div>

        <div class="summary-grid">
          <div class="summary-col">
            <span class="summary-col-label">Aktuell</span>
            <span class="summary-col-value" style="font-size: 15px; color:var(--apple-blue);">${s.latest}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">Ø Zeitraum</span>
            <span class="summary-col-value">${s.avg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">Ø Vor-Per.</span>
            <span class="summary-col-value" style="color:var(--text-muted); font-weight:500;">${s.prevAvg}</span>
          </div>
          <div class="summary-col">
            <span class="summary-col-label">Trend</span>
            <div class="summary-pill ${s.className}">
              <span>${s.arrow}</span>
              <span>${cleanDiff}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  summaryEl.innerHTML = htmlBlocks;
}

export function getBaseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: themeColors.text, boxWidth: 10, usePointStyle: true, font: { size: 12, weight: '600' } } }
    },
    scales: {
      x: { type: 'category', grid: { display: false }, ticks: { color: themeColors.text, font: { size: 11, weight: '500' } } },
      y: { grid: { color: themeColors.grid }, ticks: { color: themeColors.text, font: { size: 11, weight: '500' } } }
    }
  };
}
