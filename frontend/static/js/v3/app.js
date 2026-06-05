// frontend/static/js/v3/app.js
import { showMessage } from './messageBox.js';
import { renderAllCharts, syncChartTheme } from './charts.js';
import { renderProfile } from './renderProfile.js'; // 🔧 Falls es im Browser zickt, hier den Export sichern
import { renderKPITiles as renderFancyTiles } from './tiles.js';
import { initDateSelector } from './dateselector.js';

export const state = {
  lastTimeline: [], currentFrom: '', currentTo: '',
  usersCache: [], triggerSelectorRefresh: null,
  pollingInterval: null, lastKnownCount: 0
};

const appVersion = "3.1.0";
const $ = (selector) => document.querySelector(selector);
const STORAGE_USER_KEY = 'health-active-user';
const STORAGE_THEME_KEY = 'health-theme';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserDropdown();
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
  const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_THEME_KEY, next);
  if (state.lastTimeline.length > 0) {    
    requestAnimationFrame(() => {
      setTimeout(() => {        
        syncChartTheme();
        renderFancyTiles(state.lastTimeline, state.currentFrom, state.currentTo);
        const activeUser = $('#userSelect')?.value;
        const userData = state.usersCache.find(u => u.name.toLowerCase() === activeUser?.toLowerCase());
        renderAllCharts(state.lastTimeline, userData, state.currentFrom, state.currentTo);
      }, 0);
    });
  }
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

  // 🔧 ABSICHERUNG GEGEN TYP-CRASH: Falls renderProfile falsch importiert wurde, fangen wir das hier ab
  const profileRenderer = typeof renderProfile === 'function' ? renderProfile : (window.renderProfile || renderProfile.renderProfile);

  if (typeof profileRenderer === 'function') {
    profileRenderer(payload.user, fullTimeline[fullTimeline.length - 1], fullTimeline, state.usersCache, (newSelectedUser) => {
      localStorage.setItem(STORAGE_USER_KEY, newSelectedUser);
      if (state.triggerSelectorRefresh) state.triggerSelectorRefresh();
      startSmartPolling(5);
    });
  } else {
    console.error("Fehler: renderProfile-Modul konnte nicht als Funktion geladen werden.");
  }

  renderFancyTiles(fullTimeline, state.currentFrom, state.currentTo);
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
      showMessage('Verbindung zum Waagen-Server verloren.', 'error');
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
    $('#loadBox').textContent = 'Fehler beim Starten des Dashboards.';
  }
}

async function loadDashboard(username, isSilent = false) {
  if (!username) return;
  if (!isSilent) {
    $('#loadBox').style.display = 'block';
    $('#dashboardContent').style.display = 'none';
  }

  try {
    let url = `dashboard/api/datav2?user=${username.toLowerCase()}&from=${state.currentFrom}&to=${state.currentTo}`;
    const response = await fetch(url);
    const payload = await response.json();

    if ((payload.current && payload.current.length > 0) || (payload.previous && payload.previous.length > 0)) {
      $('#loadBox').style.display = 'none';
      $('#dashboardContent').style.display = 'block';

      updateDashboardUI(payload, username);

      if (!isSilent) showMessage(`Daten für ${username.toUpperCase()} geladen.`, 'success');
    } else {
      $('#loadBox').style.display = 'none';
      if (!isSilent) showMessage('Keine Messwerte im gewählten Zeitraum vorhanden.', 'info');
    }
  } catch (err) {
    console.error('Dashboard Ladefehler:', err);
    $('#loadBox').style.display = 'none';
    if (!isSilent) showMessage('Fehler beim Laden der Benutzerdaten.', 'error');
  }
}

// ─── App Info ───────────────────────────────────────────
console.info(
  `%c ⚡ BodyScale Health Dashboard %c ESM v${appVersion} `,
  'color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px',
  'color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px'
);
