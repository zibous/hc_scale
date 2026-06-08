// frontend/static/js/v3/renderProfile-ui.js
import { getAppleIcon } from './icons.js';

/**
 * Erzeugt den linken Block im originalen, cleanen Apple-Health-Style
 */
export function createProfileLeftHtml(dropdownOptions, isActive, dateStr, timeStr, timelineLength, servertime) {
  if (!document.getElementById('profile-left-premium-styles')) {
    const style = document.createElement('style');
    style.id = 'profile-left-premium-styles';
    style.textContent = `
      .profile-text-side {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .profile-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
      }
      /* Clean Apple Header Select */
      .profile-user-select {
        font-size: 22px;
        font-weight: 700;
        color: var(--text-main, #1c1c1e);
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        letter-spacing: -0.5px;
        outline: none;
      }
      /* Flache Apple Status-Pille */
      .status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 6px;
        white-space: nowrap;
      }
      .status-badge.status-active {
        color: #34c759;
        background: rgba(52, 199, 89, 0.1);
      }
      .status-badge.status-inactive {
        color: #8e8e93;
        background: rgba(142, 142, 147, 0.08);
      }
      /* Apple Health Line-Rows */
      .profile-meta-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--text-muted, #8e8e93);
        margin: 1px 0;
      }
      /* Dünne, einfarbige SVG-Icons */
      .apple-health-icon {
        width: 14px;
        height: 14px;
        stroke: var(--text-muted, #8e8e93);
        stroke-width: 1.8;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        opacity: 0.7;
      }
      .profile-meta-row strong {
        color: var(--text-main, #1c1c1e);
        font-weight: 600;
      }
      [data-theme=dark] .profile-user-select,
      [data-theme=dark] .profile-meta-row strong { color: #ffffff; }
    `;
    document.head.appendChild(style);
  }
  const iconScale = getAppleIcon('weight', 14, 'currentColor', 'apple-health-icon');
  const iconTrend = getAppleIcon('trend', 14, 'currentColor', 'apple-health-icon');
  const iconSync  = getAppleIcon('sync', 14, 'currentColor', 'apple-health-icon');

  return `
    <div class="profile-left-combined">
      <div class="profile-text-side">

        <div class="profile-title-row">
          <div style="position: relative; display: inline-flex; align-items: center;">
            <select id="userSelect" class="profile-user-select">
              ${dropdownOptions}
            </select>
            <span style="font-size: 9px; color: var(--text-muted, #8e8e93); pointer-events: none; margin-left: 3px;">▼</span>
          </div>
          <span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
            ${isActive ? 'Aktiv' : 'Inaktiv'}
          </span>
        </div>

        <p class="profile-meta-row">
          ${iconScale}
          <span>Letzte Messung: <strong>${dateStr} um ${timeStr} Uhr</strong></span>
        </p>

        <p class="profile-meta-row">
          ${iconTrend}
          <span>Messungen im Zeitraum: <strong>${timelineLength}</strong></span>
        </p>

        <p class="profile-meta-row">
          ${iconSync}
          <span>Synchronisiert: <strong>${servertime}</strong></span>
        </p>

      </div>
    </div>
  `;
}
