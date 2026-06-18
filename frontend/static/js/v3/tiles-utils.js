// frontend/static/js/tiles-utils.js
let cached = { timeline: null, start: "", end: "", renderFn: null, initialized: false };

/**
 * Übernimmt die gesamte Filterung, Fallback-Logik und Gruppen-Definitionen
 */
export function prepareGroupMetrics(timeline, startDateStr, endDateStr) {
  const startLimit = new Date(startDateStr + 'T00:00:00');
  const endLimit = new Date(endDateStr + 'T23:59:59');
  const periodTimeline = timeline
    .filter(t => { const d = new Date(t.timestamp); return d >= startLimit && d <= endLimit; })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const isSingleDay = (startDateStr === endDateStr);

  let latestInPeriod, firstInPeriod, isHistoricalReview = false;
  if (periodTimeline.length > 0) {
    latestInPeriod = periodTimeline[periodTimeline.length - 1];
    firstInPeriod = periodTimeline;
  } else {
    latestInPeriod = timeline[timeline.length - 1];
    firstInPeriod = latestInPeriod;
    isHistoricalReview = true;
  }

  let comparisonEntry = firstInPeriod;
  if (isSingleDay || periodTimeline.length < 2 || isHistoricalReview) {
    const globalIndex = timeline.findIndex(t => t.id === latestInPeriod.id || new Date(t.timestamp).getTime() === new Date(latestInPeriod.timestamp).getTime());
    comparisonEntry = globalIndex > 0 ? timeline[globalIndex - 1] : latestInPeriod;
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

  const metrics = [
    {
      id: 'w_group', title: 'Gewicht & Index', val: latestInPeriod.weight, pVal: comparisonEntry.weight, unit: 'kg', color: 'var(--apple-red)', history: historyData.map(t => t.weight), min: 50, max: 100,
      subMetrics: [{ title: 'BMI', val: latestInPeriod.bmi, unit: '' }, { title: 'Fettfrei (LBM)', val: latestInPeriod.lbm, unit: 'kg' }]
    },
    {
      id: 'f_group', title: 'Zusammensetzung', val: latestInPeriod.fat, pVal: comparisonEntry.fat, unit: '%', color: 'var(--apple-orange)', history: historyData.map(t => t.fat), min: 5, max: 35,
      subMetrics: [{ title: 'Muskelmasse', val: latestInPeriod.muscle, unit: 'kg' }, { title: 'Viszeralfett', val: latestInPeriod.visceral, unit: 'Lvl' }]
    },
    {
      id: 'wa_group', title: 'Wasser & Bausteine', val: latestInPeriod.water, pVal: comparisonEntry.water, unit: '%', color: 'var(--apple-blue)', history: historyData.map(t => t.water), min: 40, max: 70,
      subMetrics: [{ title: 'Proteinanteil', val: latestInPeriod.protein, unit: '%' }]
    },
    {
      id: 'i_group', title: 'Stoffwechsel & Alter', val: latestInPeriod.metabolic_age, pVal: comparisonEntry.metabolic_age, unit: ' J.', color: 'var(--apple-green)', history: historyData.map(t => t.metabolic_age), min: 18, max: 80,
      subMetrics: [{ title: 'Score (POI)', val: latestInPeriod.poi, unit: 'Pts' }, { title: 'Umsatz (BMR)', val: latestInPeriod.bmr || 0, unit: ' kcal' }]
    }
  ];

  return { metrics, periodHeadline };
}

export function initTileUtils(timeline, start, end, renderFn) {
  cached.timeline = timeline; cached.start = start; cached.end = end; cached.renderFn = renderFn;
  if (cached.initialized) return;
  cached.initialized = true;

  const style = document.createElement('style');
  style.textContent = `#kpiGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;padding:16px 0;width:100%}.tile{background:var(--card-bg,#fff);border-radius:14px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 12px rgba(0,0,0,.05);border:1px solid var(--border-color,rgba(0,0,0,.05));transition:transform .2s,box-shadow .2s;min-height:175px}.tile:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.08)}.tile-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}.tile-title{font-size:13px;font-weight:600;color:var(--text-muted,#8e8e93);letter-spacing:-.2px}.tile-trend{font-size:11px;font-weight:700;padding:2px 6px;border-radius:6px;white-space:nowrap}.tile-trend.trend-up{color:#34c759;background:rgba(52,199,89,.1)}.tile-trend.trend-down{color:#ff3b30;background:rgba(255,59,48,.1)}.tile-trend.trend-stable{color:#8e8e93;background:rgba(142,142,147,.1)}.tile-body{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px;gap:12px}.tile-value{font-size:26px;font-weight:700;color:var(--text-main,#1c1c1e);letter-spacing:-.5px;line-height:1}.tile-value span{font-size:13px;font-weight:500;color:var(--text-muted,#8e8e93);margin-left:2px}.sparkline-container{flex:1;height:38px;position:relative;max-width:110px}.sparkline-container canvas{width:100%!important;height:100%!important}.progress-container{width:100%;height:4px;background:var(--bg-progress-track,#f2f2f7);border-radius:2px;overflow:hidden}.progress-bar{height:100%;border-radius:2px;transition:width .4s ease}.tile-subs-wrapper{margin-top:12px;padding-top:10px;border-top:1px solid var(--border-color,rgba(0,0,0,.05));display:flex;gap:8px;justify-content:space-between}.tile-sub-item{display:flex;flex-direction:column;flex:1}.sub-title{font-size:10px;color:var(--text-muted,#8e8e93);font-weight:500;margin-bottom:1px;white-space:nowrap}.sub-value{font-size:14px;font-weight:600;color:var(--text-main,#1c1c1e)}.sub-unit{font-size:10px;font-weight:500;color:var(--text-muted,#8e8e93);margin-left:1px}[data-theme=dark] .tile{--card-bg:#1c1c1e;--border-color:rgba(255,255,255,.05);--text-main:#ffffff;--bg-progress-track:#2c2c2e}`;
  document.head.appendChild(style);

  let timeout;
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cached.renderFn?.(cached.timeline, cached.start, cached.end), 150);
  });

  new MutationObserver(() => cached.renderFn?.(cached.timeline, cached.start, cached.end))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

export function getLineColor(col) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const map = isDark
    ? { 'var(--apple-red)': '#ff453a', 'var(--apple-orange)': '#ff9f0a', 'var(--apple-green)': '#30d158', 'var(--apple-purple)': '#bf5af2', 'var(--apple-blue)': '#0a84ff', '#8e8e93': '#aeaeac' }
    : { 'var(--apple-red)': '#ff3b30', 'var(--apple-orange)': '#ff9500', 'var(--apple-green)': '#34c759', 'var(--apple-purple)': '#af52de', 'var(--apple-blue)': '#007aff', '#8e8e93': '#8e8e93' };
  return map[col] || col;
}

export function getGradient(ctx, canvas, color) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height || 40);
  let rgb = '10, 132, 255';
  if (color.startsWith('#') && color.length === 7) {
    rgb = `${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}`;
  }
  grad.addColorStop(0, isDark ? `rgba(${rgb}, 0.25)` : `rgba(${rgb}, 0.15)`);
  grad.addColorStop(1, `rgba(${rgb}, 0.0)`);
  return grad;
}
