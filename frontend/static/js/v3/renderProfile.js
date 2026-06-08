// frontend/static/js/v3/renderProfile.js
import { createProfileLeftHtml } from './renderProfile-ui.js';
import { createScoreBadge } from './render-scorebadge.js';

// 🌟 DYNAMISCHES INLINE-CSS FÜR DAS GESAMTE PROFIL-LAYOUT
if (!document.getElementById('profile-core-styles')) {
  const style = document.createElement('style');
  style.id = 'profile-core-styles';
  style.textContent = `
    .profile-main-layout {
      background: var(--card-bg, #ffffff);
      border-radius: 24px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 24px;
      border: 1px solid var(--card-border, rgba(0, 0, 0, 0.04));
      box-shadow: var(--shadow-sm);
      box-sizing: border-box;
      transition: background-color 0.3s, border-color 0.3s;
    }
    .profile-status-side {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .score-badge {
      padding: 10px 14px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
      box-shadow: var(--shadow-sm);
      border: 1px solid transparent;
      box-sizing: border-box;
    }
    .badge-success { background-color: rgba(52, 199, 89, 0.12); border-color: rgba(52, 199, 89, 0.2); }
    .badge-success .score-badge-value { color: var(--apple-green, #34c759); }
    .badge-danger { background-color: rgba(255, 59, 48, 0.12); border-color: rgba(255, 59, 48, 0.2); }
    .badge-danger .score-badge-value { color: var(--apple-red, #ff3b30); }
    .badge-info { background-color: rgba(0, 122, 255, 0.12); border-color: rgba(0, 122, 255, 0.2); }
    .badge-info .score-badge-value { color: var(--apple-blue, #007aff); }
    .score-badge-title { font-size: 10px; font-weight: 700; color: var(--text-muted, #8e8e93); text-transform: uppercase; margin-bottom: 4px; }
    .score-badge-value { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    .score-badge-status { font-size: 11px; font-weight: 700; text-transform: capitalize; color: var(--text-muted, #8e8e93); }
    .ring-container { position: relative; width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 12px; }
    .ring-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .ring-bg { fill: transparent; stroke: var(--bg-color, #f2f2f7); stroke-width: 6; }
    .ring-fill { fill: transparent; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s; }
    .ring-text { position: absolute; font-size: 11px; font-weight: 700; color: var(--text-main, #000000); text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
    [data-theme="dark"] .score-badge-title { color: var(--text-main, #ffffff); opacity: 0.7; }
    [data-theme="dark"] .ring-bg { stroke: #2c2c2e; }
  `;
  document.head.appendChild(style);
}

/**
 * Befüllt die Profil-Leiste und platziert den Meilenstein-Ring als edlen Abschluss ganz rechts
 */
export function renderProfile(user, system, latest, timeline, allUsers = [], onUserChange = null) {
  const profileContainer = document.querySelector('.profile-info');
  const avatarEl = document.getElementById('userAvatar');

  if (!profileContainer || !user || !latest || timeline.length === 0) return;

  // 1. Avatar setzen
  if (avatarEl) {
    avatarEl.src = user.avatar || `dashboard/avatar/${user.name.toLowerCase()}`;
  }

  // 2. Zeit und Datum formatieren
  let dateStr = latest.date || '--';
  let timeStr = '--:--';
  if (latest.timestamp) {
    const d = new Date(latest.timestamp);
    if (!isNaN(d.getTime())) {
      timeStr = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
  }

  const lastMeasurementDate = latest.timestamp ? new Date(latest.timestamp) : new Date();
  const diffDays = Math.ceil(Math.abs(new Date() - lastMeasurementDate) / (1000 * 60 * 60 * 24));
  const isActive = diffDays <= 4;

  const targetScores = user.scores || {};
  const targetWeight = user.target || targetScores.WEIGHT || 70;
  const currentWeight = latest.weight || 0;
  const weightDiff = currentWeight - targetWeight;

  // 3. Mathematisch präzise Apple-Style Ring-Berechnung
  let progressPercent = 0;
  let ringColor = 'var(--apple-blue)';
  let centerText = 'Ziel';

  const initialWeight = (timeline && timeline.length > 0) ? timeline[0].weight : currentWeight;
  const totalWay = initialWeight - targetWeight;
  const wayAchieved = initialWeight - currentWeight;

  if (Math.abs(weightDiff) <= 0.2) {
    progressPercent = 100;
    ringColor = 'var(--apple-green)';
    centerText = '<span style="font-size:16px;">✓</span>';
  } else if (weightDiff < 0) {
    progressPercent = (currentWeight / targetWeight) * 100;
    ringColor = 'var(--apple-blue)';
    centerText = 'Ziel';
  } else if (totalWay > 0 && wayAchieved > 0) {
    progressPercent = (wayAchieved / totalWay) * 100;
    ringColor = 'var(--apple-red)';
    centerText = 'Ziel';
  } else if (totalWay < 0 && wayAchieved < 0) {
    progressPercent = (Math.abs(wayAchieved) / Math.abs(totalWay)) * 100;
    ringColor = 'var(--apple-blue)';
    centerText = 'Ziel';
  } else {
    progressPercent = 25;
    ringColor = weightDiff > 0 ? 'var(--apple-red)' : 'var(--apple-blue)';
    centerText = 'Ziel';
  }

  progressPercent = Math.min(Math.max(Math.round(progressPercent), 15), 100);
  const ringCircumference = 2 * Math.PI * 32;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  const dropdownOptions = allUsers.map(u => {
    const isSelected = u.name.toLowerCase() === user.name.toLowerCase() ? 'selected' : '';
    return `<option value="${u.name}" ${isSelected}>${u.name.toUpperCase()}</option>`;
  }).join('');

  // 4. Das bereinigte Layout im DOM injizieren
  profileContainer.innerHTML = `
    <div class="profile-main-layout">

      <!-- Linker Block: Textdaten mit den edlen Apple-Health Line Icons -->
      ${createProfileLeftHtml(dropdownOptions, isActive, dateStr, timeStr, timeline.length, system.servertime)}

      <!-- Mittlerer Block: Die vier farbigen Status-Tiles -->
      <div class="profile-status-side">
        ${createScoreBadge('Gewicht', latest.weight, targetWeight, 'kg', true)}
        ${createScoreBadge('Körperfett', latest.fat, targetScores.FAT || 15.0, '%', true)}
        ${createScoreBadge('Muskeln', latest.muscle, targetScores.MUSCLE || 50.0, 'kg', false)}
        ${createScoreBadge('Protein', latest.protein, targetScores.PROTEIN || 20.0, '%', false)}
      </div>

      <!-- Rechter Block: Der Fortschrittsring als edler Abschluss der Karte -->
      <div class="ring-container" title="Dein aktueller Zielerreichungsgrad">
        <svg class="ring-svg" viewBox="0 0 72 72">
          <circle class="ring-bg" cx="36" cy="36" r="32"></circle>
          <circle class="ring-fill" cx="36" cy="36" r="32"
                  style="stroke-dasharray: ${ringCircumference}; stroke-dashoffset: ${ringOffset}; stroke: ${ringColor};">
          </circle>
        </svg>
        <div class="ring-text">${centerText}</div>
      </div>

    </div>
  `;

  if (onUserChange) {
    document.getElementById('userSelect').addEventListener('change', (e) => {
      onUserChange(e.target.value);
    });
  }
}
