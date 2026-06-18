// frontend/static/js/v3/app.js
import { showMessage } from './messageBox.js';
import { renderAllCharts, syncChartTheme, injectChartTitles } from './charts.js';
import { renderProfile } from './renderProfile.js';
import { renderKPITiles as renderGroupedTiles, renderKPITilesSkeleton } from './tiles2.js';
import { initDateSelector } from './dateselector.js';
import { getAppleIcon } from './icons.js';

const renderTiles = renderGroupedTiles;

export const state = {
  lastTimeline: [], currentFrom: '', currentTo: '',
  usersCache: [], triggerSelectorRefresh: null,
  pollingInterval: null, lastKnownCount: 0,
  currentFetchController: null
};

const appVersion = "3.2.0";
const $ = (selector) => document.querySelector(selector);
const STORAGE_USER_KEY = 'health-active-user';
const STORAGE_THEME_KEY = 'health-theme';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserDropdown();

  setTimeout(() => {
    injectChartTitles();
  }, 10);

  $('#themeToggle').addEventListener('click', toggleTheme);
  startSmartPolling(5);
});

window.addEventListener('resize', () => {
  if (state.lastTimeline.length > 0) {
    const activeUser = $('#userSelect')?.value;
    const userData = state.usersCache.find(u => u.name.toLowerCase() === activeUser?.toLowerCase());
    renderAllCharts(state.lastTimeline, userData, state.currentFrom, state.currentTo);
  }
});

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'light'; // 🌟 FIX: Tippfehler repariert
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonIcon(savedTheme);
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_THEME_KEY, next);

  updateThemeButtonIcon(next);

  if (state.lastTimeline.length > 0) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        syncChartTheme();
        const activeUser = $('#userSelect')?.value;
        const userData = state.usersCache.find(u => u.name.toLowerCase() === activeUser?.toLowerCase());
        renderTiles(state.lastTimeline, state.currentFrom, state.currentTo, userData);
        renderAllCharts(state.lastTimeline, userData, state.currentFrom, state.currentTo);
      }, 0);
    });
  }
}

/**
 * 🌟 DYNAMISCHER BUTTON-ICON-MANAGER (Korrigierte Parameter-Reihenfolge)
 */
function updateThemeButtonIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const iconName = theme === 'dark' ? 'sun' : 'moon';

  // 🌟 FIX: Größe 16px, Deckkraft 1.0 (voll sichtbar), rechter Abstand 0px
  btn.innerHTML = getAppleIcon(iconName, 16, 1.0, 0);
}

/**
 * Synchronisiert alle UI-Komponenten (Profil, Kacheln, Charts) aus einem API-Payload
 */
function updateDashboardUI(payload, username) {
  const fullTimeline = [...(payload.previous || []), ...(payload.current || [])]
    .map(item => ({ ...item, timestamp: new Date(item.timestamp) }))
    .sort((a, b) => a.timestamp - b.timestamp);

  state.lastTimeline = fullTimeline;
  if (payload.all_users) state.usersCache = payload.all_users;

  const currentUserData = state.usersCache.find(u => u.name.toLowerCase() === username.toLowerCase());
  state.lastKnownCount = currentUserData ? currentUserData.count : payload.count || 0;

  const profileRenderer = typeof renderProfile === 'function' ? renderProfile : (window.renderProfile || renderProfile.renderProfile);

  if (typeof profileRenderer === 'function') {
    profileRenderer(payload.user, payload.system, fullTimeline[fullTimeline.length - 1], fullTimeline, state.usersCache, (newSelectedUser) => {
      localStorage.setItem(STORAGE_USER_KEY, newSelectedUser);
      if (state.triggerSelectorRefresh) state.triggerSelectorRefresh();
      startSmartPolling(5);
    });
  } else {
    console.error("Fehler: renderProfile-Modul konnte nicht als Funktion geladen werden.");
  }

  renderTiles(fullTimeline, state.currentFrom, state.currentTo, payload.user);

  injectChartTitles();

  syncChartTheme();
  renderAllCharts(fullTimeline, payload.user, state.currentFrom, state.currentTo);
}

function startSmartPolling(minutes = 5) {
  if (state.pollingInterval) clearInterval(state.pollingInterval);

  state.pollingInterval = setInterval(async () => {
    const activeUser = $('#userSelect')?.value;
    if (!activeUser) return;

    try {
      let url = `dashboard/api/datav2?user=${activeUser.toLowerCase()}&from=${state.currentFrom}&to=${state.currentTo}`;
      const response = await fetch(url);
      const payload = await response.json();

      if (payload && payload.all_users) {
        const userData = payload.all_users.find(u => u.name.toLowerCase() === activeUser.toLowerCase());
        if (userData && typeof userData.count !== 'undefined' && userData.count !== state.lastKnownCount) {
          console.log(`🔔 Live-Messung im Hintergrund verarbeitet! (${userData.count})`);
          showMessage(`Neue Waagen-Messung für ${activeUser.toUpperCase()} empfangen!`, 'success');
          updateDashboardUI(payload, activeUser);
        }
      }
    } catch (err) {
      console.error('Polling Fehler:', err);
    }
  }, minutes * 60 * 1000);
}

async function initUserDropdown() {
  try {
    const savedUser = localStorage.getItem(STORAGE_USER_KEY) || 'peter';
    state.triggerSelectorRefresh = initDateSelector($('#dateSelectorContainer'), (from, to) => {
      state.currentFrom = from;
      state.currentTo = to;
      loadDashboard($('#userSelect')?.value || savedUser);
    });

    if (state.triggerSelectorRefresh) state.triggerSelectorRefresh();
  } catch (err) {
    console.error('Dropdown Fehler:', err);
  }
}

async function loadDashboard(username, isSilent = false) {
  if (!username) return;

  // Vorherigen Request abbrechen falls noch laufend
  if (state.currentFetchController) {
    state.currentFetchController.abort();
  }
  state.currentFetchController = new AbortController();

  if (!isSilent) {
    const grid = document.getElementById('kpiGrid');
    if (!grid || grid.children.length <= 1) {
      renderKPITilesSkeleton();
    }
    $('#dashboardContent').style.display = 'block';
    if ($('#loadBox')) $('#loadBox').style.display = 'none';
  }

  try {
    let url = `dashboard/api/datav2?user=${username.toLowerCase()}&from=${state.currentFrom}&to=${state.currentTo}`;
    const response = await fetch(url, { signal: state.currentFetchController.signal });
    const payload = await response.json();
    if ((payload.current && payload.current.length > 0) || (payload.previous && payload.previous.length > 0)) {
      updateDashboardUI(payload, username);

      if (!isSilent) {
        showMessage(`Daten für ${username.toUpperCase()} geladen.`, 'success');

        // 🌟 DER CSS-STRIKE-TRACKER: Macht die Nachricht systemweit sofort unsichtbar!
        setTimeout(() => {
          const styleOverride = document.createElement('style');
          styleOverride.id = 'temp-msg-hide';
          styleOverride.textContent = `
            .message-box, .alert, .success, [class*="message"], #messageBoxContainer div {
              opacity: 0 !important;
              visibility: hidden !important;
              transform: translateY(-10px) !important;
              transition: opacity 0.1s ease, visibility 0.1s ease !important;
              display: none !important;
            }
          `;
          document.head.appendChild(styleOverride);

          setTimeout(() => {
            const styleEl = document.getElementById('temp-msg-hide');
            if (styleEl) styleEl.remove();
          }, 2800);

        }, 500);
      }
    } else {
      if (!isSilent) showMessage('Keine Messwerte im gewählten Zeitraum vorhanden.', 'info');
    }
  } catch (err) {
    if (err.name === 'AbortError') return; // Request wurde durch neueren ersetzt
    console.error('Dashboard Ladefehler:', err);
    if (!isSilent) showMessage('Fehler beim Laden der Benutzerdaten.', 'error');
  }
}

// ─── App Info ───────────────────────────────────────────
console.info(
  `%c 🌟 BodyScale Health Dashboard %c ESM v${appVersion} `,
  'color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px',
  'color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px'
);