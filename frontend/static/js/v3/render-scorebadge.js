// frontend/static/js/v3/render-scorebadge.js

/**
 * Erzeugt ein einzelnes Score-Badge mit interaktivem HTML-Tooltip und fixierten Breiten
 */
import { getAppleIcon } from './icons.js';

export function createScoreBadge(title, current, targetInput, unit = '', isNegativeMetric = false) {
  if (!current) return '';

  const target = typeof targetInput === 'number' && !isNaN(targetInput) ? targetInput : (current || 0);
  const diff = current - target;

  let icon = '●';
  let bgClass = 'badge-success';
  let statusText = 'Optimal';

  if (Math.abs(diff) <= 0.5) {
    icon = '●'; bgClass = 'badge-success'; statusText = 'Optimal';
  } else {
    if (diff > 0) {
      icon = '▲'; statusText = `+${diff.toFixed(1)} ${unit}`;
      bgClass = isNegativeMetric ? 'badge-danger' : 'badge-success';
    } else {
      icon = '▼'; statusText = `${diff.toFixed(1)} ${unit}`;
      bgClass = isNegativeMetric ? 'badge-success' : 'badge-danger';
    }
  }

  if (title === 'Gewicht') {
    statusText = diff > 0 ? `+${diff.toFixed(1)} ${unit}` : `${diff.toFixed(1)} ${unit}`;
    bgClass = diff > 0 ? 'badge-danger' : (diff < 0 ? 'badge-info' : 'badge-success');
    icon = diff > 0 ? '▲' : '▼';
  }

  let svgIcon = '';
  if (title === 'Gewicht')    svgIcon = getAppleIcon('weight', 11, 0.6, 4);
  if (title === 'Körperfett') svgIcon = getAppleIcon('fat', 11, 0.6, 4);
  if (title === 'Muskeln')    svgIcon = getAppleIcon('muscle', 11, 0.6, 4);
  if (title === 'Protein')    svgIcon = getAppleIcon('protein', 11, 0.6, 4);

  const oldStyle = document.getElementById('scorebadge-apple-styles');
  if (oldStyle) oldStyle.remove();

  const style = document.createElement('style');
  style.id = 'scorebadge-apple-styles';
  style.textContent = `
    /* 🌟 FIX: flex: 1 und feste min-width zwingen alle 4 Badges in dieselbe quadratische Breite */
    .score-badge {
      position: relative !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      overflow: visible !important;
      flex: 1 !important;
      min-width: 95px !important;
      max-width: 115px !important;
      box-sizing: border-box !important;
    }
    .score-badge-title { display: inline-flex; align-items: center; justify-content: center; width: 100%; white-space: nowrap; pointer-events: none; }
    .score-badge-value { pointer-events: none; white-space: nowrap; }

    /* 🌟 FIX: Verhindert, dass lange Statustexte das Badge aufblähen oder umbrechen */
    .score-badge-status {
      pointer-events: none;
      white-space: nowrap !important;
      font-size: 10px !important;
      letter-spacing: -0.2px !important;
    }

    /* Der schwebende Premium-Tooltip nach UNTEN öffnend */
    .apple-custom-tooltip {
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%) translateY(5px);
      background: rgba(28, 28, 30, 0.98) !important;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #ffffff !important;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      width: 180px;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      line-height: 1.5;
      text-align: left;
      border: 1px solid rgba(255,255,255,0.08);
      overflow: visible !important;
    }

    /* Einblenden bei Maus-Hover */
    .score-badge:hover .apple-custom-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }
    [data-theme="dark"] .apple-custom-tooltip { border-color: rgba(255,255,255,0.15); }
  `;
  document.head.appendChild(style);

  // 🌟 FIX: XML-Namespace-URL für SVG-Validität korrigiert
  const htmlTooltip = `
    <div class="apple-custom-tooltip">
      <svg xmlns="http://w3.org" viewBox="0 0 20 10" style="display: block !important; width: 20px; height: 10px; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); pointer-events: none; z-index: 100000;">
        <polygon points="10,0 20,10 0,10" fill="#bd1111" />
      </svg>
      <strong style="display:block; margin-bottom:6px; font-size:10px; text-transform:uppercase; letter-spacing:0.3px; opacity:0.6;">■ ${title}</strong>
      <div>• Aktuell: <strong>${current.toFixed(1)} ${unit}</strong></div>
      <div>• Sollwert: <strong>${target.toFixed(1)} ${unit}</strong></div>
      <div style="margin-top:4px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.15);">
        • Abw.: <strong>${diff >= 0 ? '+' : ''}${diff.toFixed(1)} ${unit}</strong>
      </div>
    </div>
  `;

  return `
    <div class="score-badge ${bgClass}" style="position: relative !important; overflow: visible !important; cursor: pointer;">
      ${htmlTooltip}
      <span class="score-badge-title">${svgIcon}${title}</span>
      <span class="score-badge-value">${icon} ${current.toFixed(1)}${unit}</span>
      <span class="score-badge-status">${statusText}</span>
    </div>
  `;
}
