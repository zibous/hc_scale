// frontend/static/js/v3/app.js
import { renderAllCharts, syncChartTheme } from './charts.js';
import { renderProfile } from './renderProfile.js';
import { renderKPITiles as renderFancyTiles } from './tiles.js';
import { initDateSelector } from './dateselector.js';

// -----------------------------------------------------------------------
// Es werden 2 API Aufrufe gemacht:
// -----------------------------------------------------------------------
//  1. /dashboard/api/users       User Profildaten
//  2. /dashboard/api/data?user   User, aktuelle Messung, Timeline Daten

export const state = {
  lastTimeline: [],
  currentFrom: '',
  currentTo: '',
  usersCache: [],
  triggerSelectorRefresh: null,
  pollingInterval: null,
  lastKnownCount: 0
};

const $ = (selector) => document.querySelector(selector);

// Speicher-Schlüssel (Keys) für den LocalStorage definieren
const STORAGE_USER_KEY = 'health-active-user';
const STORAGE_THEME_KEY = 'health-theme';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserDropdown();
  $('#themeToggle').addEventListener('click', toggleTheme);

  startSmartPolling(5);
});

// Der Resize-Listener zeichnet die Charts flüssig neu, sobald das Fenster schrumpft
window.addEventListener('resize', () => {
  if (state.lastTimeline.length > 0) {
    // 🔧 FIX: Reicht den aktiven User aus dem Cache beim Skalieren weiter
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
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE_THEME_KEY, next);

  if (state.lastTimeline.length > 0) {
    syncChartTheme();
    // 🔧 FIX: Reicht den aktiven User aus dem Cache beim Theme-Wechsel weiter
    const activeUser = $('#userSelect')?.value;
    const userData = state.usersCache.find(u => u.name.toLowerCase() === activeUser?.toLowerCase());
    renderAllCharts(state.lastTimeline, userData);

    const latest = state.lastTimeline[state.lastTimeline.length - 1];
    renderFancyTiles(state.lastTimeline, state.currentFrom, state.currentTo);
  }
}

function startSmartPolling(minutes = 5) {
  if (state.pollingInterval) clearInterval(state.pollingInterval);

  state.pollingInterval = setInterval(async () => {
    const activeUser = $('#userSelect')?.value;
    if (!activeUser) return;

    try {
      // Abfrage ob sich daten geändert haben.
      const response = await fetch('/dashboard/api/users');
      const users = await response.json();

      if (users && Array.isArray(users)) {
        state.usersCache = users;
        const userData = users.find(u => u.name.toLowerCase() === activeUser.toLowerCase());

        if (userData && typeof userData.count !== 'undefined') {
          if (userData.count !== state.lastKnownCount) {
            console.log(`🔔 Neue Messung! (${userData.count})`);
            loadDashboard(activeUser, true);
          }
        }
      }
    } catch (err) {
      console.error('Fehler beim Polling:', err);
    }
  }, minutes * 60 * 1000);
}

async function initUserDropdown() {
  try {
    // Benutzerdaten holen
    const response = await fetch('/dashboard/api/users');
    const users = await response.json();

    if (users && users.length > 0) {
      state.usersCache = users;

      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      const userExists = users.some(u => u.name.toLowerCase() === savedUser?.toLowerCase());
      const defaultUser = userExists ? savedUser : users[0].name;

      state.triggerSelectorRefresh = initDateSelector($('#dateSelectorContainer'), (from, to) => {
        state.currentFrom = from;
        state.currentTo = to;

        const activeUser = $('#userSelect')?.value || defaultUser;
        loadDashboard(activeUser);
      });

      if (state.triggerSelectorRefresh) {
        state.triggerSelectorRefresh();
      }

    } else {
      $('#loadBox').textContent = 'Keine Benutzer im System gefunden.';
    }
  } catch (err) {
    console.error('Dropdown Fehler:', err);
    $('#loadBox').textContent = 'Backend nicht erreichbar.';
  }
}

async function loadDashboard(username, isSilent = false) {
  if (!username) return;

  if (!isSilent) {
    $('#loadBox').style.display = 'block';
    $('#dashboardContent').style.display = 'none';
  }

  try {
    // Daten timeline holen
    let url = `/dashboard/api/data?user=${username.toLowerCase()}`;
    if (state.currentFrom) url += `&from=${state.currentFrom}`;
    if (state.currentTo) url += `&to=${state.currentTo}`;

    const response = await fetch(url);
    const payload = await response.json();

    if (payload && payload.current && payload.current.length > 0) {
      const fullTimeline = [...(payload.previous || []), ...(payload.current || [])]
        .map(item => ({ ...item, timestamp: new Date(item.timestamp) }))
        .sort((a, b) => a.timestamp - b.timestamp);

      state.lastTimeline = fullTimeline;

      const currentUserData = state.usersCache.find(u => u.name.toLowerCase() === username.toLowerCase());
      state.lastKnownCount = currentUserData ? currentUserData.count : payload.count || 0;

      $('#loadBox').style.display = 'none';
      $('#dashboardContent').style.display = 'block';

      renderProfile(payload.user, payload.current[payload.current.length - 1], fullTimeline, state.usersCache, (newSelectedUser) => {
        localStorage.setItem(STORAGE_USER_KEY, newSelectedUser);

        if (state.triggerSelectorRefresh) state.triggerSelectorRefresh();
        startSmartPolling(5);
      });

      renderFancyTiles(fullTimeline, state.currentFrom, state.currentTo);

      syncChartTheme();
      renderAllCharts(fullTimeline, payload.user, state.currentFrom, state.currentTo);

    } else {
      if (!isSilent) $('#loadBox').textContent = 'Keine Messwerte im gewählten Zeitraum vorhanden.';
    }
  } catch (err) {
    console.error('Dashboard Ladefehler:', err);
    if (!isSilent) $('#loadBox').textContent = 'Fehler beim Laden der Benutzerdaten.';
  }
}

// ─── App Info ───────────────────────────────────────────
let appVersion = "3.1.0";
console.info(
  `%c ⚡ Health Dashboard %c ESM v${appVersion} `,
  'color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px',
  'color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px'
);
