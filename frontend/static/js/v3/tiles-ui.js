// frontend/static/js/v3/tiles-ui.js

export function getTileSkeletonHtml() {
  return `
    <div style="grid-column: 1 / -1; width: 100%; margin-bottom: 5px; padding: 5px 0;">
      <div class="skeleton-line" style="width: 250px; height: 20px; border-radius: 4px;"></div>
    </div>
    ${Array(4).fill(0).map(() => `
      <div class="tile skeleton-tile">
        <div class="tile-header">
          <div class="skeleton-line" style="width: 100px; height: 16px; border-radius: 4px;"></div>
          <div class="skeleton-line" style="width: 60px; height: 20px; border-radius: 6px;"></div>
        </div>
        <div class="tile-body">
          <div class="skeleton-line" style="width: 80px; height: 32px; border-radius: 6px;"></div>
          <div class="skeleton-line" style="width: 100px; height: 38px; border-radius: 4px;"></div>
        </div>
        <div class="skeleton-line" style="width: 100%; height: 4px; border-radius: 2px; margin: 8px 0;"></div>
        <div class="tile-subs-wrapper" style="border: none; padding-top: 5px;">
          <div class="skeleton-line" style="width: 30%; height: 24px; border-radius: 4px;"></div>
          <div class="skeleton-line" style="width: 30%; height: 24px; border-radius: 4px;"></div>
          <div class="skeleton-line" style="width: 30%; height: 24px; border-radius: 4px;"></div>
        </div>
      </div>
    `).join('')}
  `;
}

export function createKPITileHtml(m) {
  const diff = m.val - m.pVal;
  let trendClass = 'trend-stable', trendArrow = '→', trendText = 'Stabil';

  const isLowerBetter = ['w_group', 'i_group'].includes(m.id);
  if (diff > 0.02) {
    trendClass = isLowerBetter ? 'trend-down' : 'trend-up';
    trendArrow = '▲';
    trendText = `+${diff.toFixed(1)}`;
  } else if (diff < -0.02) {
    trendClass = isLowerBetter ? 'trend-up' : 'trend-down';
    trendArrow = '▼';
    trendText = `${diff.toFixed(1)}`;
  }

  // Prozentmetriken füllen den Balken absolut. Relative Werte füllen ihn um den Ziel-Mittelpunkt (50%) herum.
  const percent = m.unit === '%'
    ? Math.min(Math.max(m.val, 5), 100)
    : Math.min(Math.max(((m.val - m.min) / (m.max - m.min)) * 100, 5), 100);

  // 🌟 DYNAMISCHE ZIEL-POSITION: Setzt den Strich beim Wasser auf 55%, bei den anderen auf die Mitte (50%)
  const targetPercent = m.unit === '%' ? 55.0 : 50.0;

  // Nur bei den drei Ziel-Kacheln blenden wir die visuelle Markierung ein
  const hasTargetIndicator = ['w_group', 'f_group', 'wa_group'].includes(m.id);

  const subHtml = m.subMetrics?.map(sub => {
    let subDisplay = sub.val ? sub.val.toFixed(1) : '--';
    if (sub.title.includes('BMR') || sub.title.includes('Bedarf') || sub.title.includes('Umsatz') || sub.title.includes('TDEE')) {
      subDisplay = Math.round(sub.val);
    }
    if (sub.title.includes('Ziel-Abw.') && sub.val > 0) {
      subDisplay = `+${sub.val.toFixed(1)}`;
    }

    return `
      <div class="tile-sub-item">
        <span class="sub-title">${sub.title}</span>
        <span class="sub-value">${subDisplay}<span class="sub-unit">${sub.unit}</span></span>
      </div>
    `;
  }).join('') || '';

  return `
    <div class="tile">
      <div class="tile-header">
        <div class="tile-title">${m.title}</div>
        <div class="tile-trend ${trendClass}"><span>${trendArrow}</span> ${trendText}</div>
      </div>
      <div class="tile-body">
        <div class="tile-value">${m.val ? m.val.toFixed(1) : '--'}<span>${m.unit}</span></div>
        <div class="sparkline-container"><canvas id="spark_${m.id}"></canvas></div>
      </div>

      <!-- Fortschritts-Zone mit integrierter Ziel-Markierung und Skala-Indikatoren -->
      <div class="progress-zone">
        <div class="progress-container">
          <div class="progress-bar" style="width: ${percent}%; background-color: ${m.color};"></div>
        </div>
        ${hasTargetIndicator ? `
          <div class="progress-scale-labels">
            <span class="scale-min">-</span>
            <div class="progress-target-line" style="left: ${targetPercent}%;">
              <span class="target-label">Ziel</span>
            </div>
            <span class="scale-max">+</span>
          </div>
        ` : ''}
      </div>
      <div class="tile-subs-wrapper">${subHtml}</div>
    </div>
  `;
}

export function injectTileStyles() {
  if (document.getElementById('tile-styles')) return;
  const style = document.createElement('style');
  style.id = 'tile-styles';
  style.textContent = `
    #kpiGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; padding: 16px 0; width: 100%; }
    .tile { background: var(--card-bg,#fff); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 24px rgba(0,0,0,.04); border: 1px solid var(--border-color,rgba(0,0,0,.04)); transition: transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s ease; min-height: 185px; position: relative; overflow: hidden; }
    .tile:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
    .tile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .tile-title {font-size: 13px; font-weight: 600; color: var(--text-muted); letter-spacing: -.2px; display: inline-flex; align-items: center;}
    .tile-trend { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 20px; white-space: nowrap; display: flex; align-items: center; gap: 4px; box-shadow: inset 0 -1px 0 rgba(0,0,0,.05); }
    .tile-trend.trend-up { color: #34c759; background: rgba(52,199,89,.12); }
    .tile-trend.trend-down { color: #ff3b30; background: rgba(255,59,48,.12); }
    .tile-trend.trend-stable { color: #8e8e93; background: rgba(142,142,147,.1); }
    .tile-body { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; gap: 12px; }
    .tile-value { font-size: 28px; font-weight: 700; color: var(--text-main,#1a1d27); letter-spacing: -.7px; line-height: 1; }
    .tile-value span { font-size: 13px; font-weight: 600; color: var(--text-muted,#8e8e93); margin-left: 2px; }
    .sparkline-container { flex: 1; height: 40px; position: relative; max-width: 110px; }

    /* Zielerreichungs-Zone */
    .progress-zone { position: relative; width: 100%; padding: 4px 0 10px 0; }
    .progress-container { width: 100%; height: 5px; background: var(--bg-progress-track,#f2f2f7); border-radius: 3px; overflow: hidden; position: relative; }
    .progress-bar { height: 100%; border-radius: 3px; transition: width .5s ease; position: relative; }
    .progress-bar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 10px; background: #fff; opacity: .3; filter: blur(2px); }

    /* Minimalistischer Ziel-Strich (left wird jetzt dynamisch per JS gesetzt) */
    .progress-target-line { position: absolute; top: 0; bottom: 4px; width: 1.5px; background: var(--text-muted, #8e8e93); opacity: 0.4; pointer-events: none; }
    .target-label { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); font-size: 8px; font-weight: 700; color: var(--text-muted, #8e8e93); text-transform: uppercase; letter-spacing: 0.3px; }

    .tile-subs-wrapper { margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--border-color,rgba(0,0,0,.04)); display: flex; gap: 6px; justify-content: space-between; }
    .tile-sub-item { display: flex; flex-direction: column; flex: 1; background: var(--bg-sub-box,#f8f9fa); padding: 6px 6px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.01); text-align: center; }
    .sub-title { font-size: 9px; color: var(--text-muted,#8e8e93); font-weight: 600; margin-bottom: 2px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.2px; }
    .sub-value { font-size: 13px; font-weight: 700; color: var(--text-main,#1a1d27); letter-spacing: -.2px; }
    .sub-unit { font-size: 10px; font-weight: 500; color: var(--text-muted,#8e8e93); margin-left: 1px; }
    .skeleton-tile { pointer-events: none; box-shadow: none!important; border-color: var(--border-color,rgba(0,0,0,.04))!important; }
    .skeleton-line { background: linear-gradient(90deg,var(--bg-progress-track,#f2f2f7) 25%,var(--bg-sub-box,#e5e5ea) 50%,var(--bg-progress-track,#f2f2f7) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    [data-theme=dark] .tile { --card-bg: #1a1d27; --border-color: rgba(255,255,255,.05); --text-main: #ffffff; --bg-progress-track: #2c2c2e; --bg-sub-box: #000000; }

    /* Zielerreichungs-Zone */
    .progress-zone { position: relative; width: 100%; padding: 4px 0 14px 0; }
    .progress-container { width: 100%; height: 5px; background: var(--bg-progress-track,#f2f2f7); border-radius: 3px; overflow: hidden; position: relative; }
    .progress-bar { height: 100%; border-radius: 3px; transition: width .5s ease; position: relative; }
    .progress-bar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 10px; background: #fff; opacity: .3; filter: blur(2px); }

    /* Achsen-Beschriftungen (Sichtbarkeit erhöht, auf gleicher Linie mit 'Ziel') */
    .progress-scale-labels { position: relative; display: flex; justify-content: space-between; width: 100%; height: 12px; margin-top: 6px; pointer-events: none; align-items: center; }
    .scale-min, .scale-max { font-size: 13px; font-weight: 700; color: var(--text-muted, #8e8e93); opacity: 0.75; line-height: 1; transform: translateY(-1px); }

    /* Minimalistischer Ziel-Strich (Reicht jetzt bis nach unten) */
    .progress-target-line { position: absolute; top: -11px; bottom: -2px; width: 1.5px; background: var(--text-muted, #8e8e93); opacity: 0.4; }
    .target-label { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); font-size: 8px; font-weight: 700; color: var(--text-muted, #8e8e93); text-transform: uppercase; letter-spacing: 0.3px; }


  `;
  document.head.appendChild(style);
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
  grad.addColorStop(0, isDark ? `rgba(${rgb}, 0.28)` : `rgba(${rgb}, 0.18)`);
  grad.addColorStop(1, `rgba(${rgb}, 0.0)`);
  return grad;
}
