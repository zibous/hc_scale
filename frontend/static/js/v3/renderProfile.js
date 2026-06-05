// frontend/static/js/v3/renderProfile.js

/**
 * Befüllt die Profil-Leiste und platziert den Meilenstein-Ring als edlen Abschluss ganz rechts
 */
export function renderProfile(user, latest, timeline, allUsers = [], onUserChange = null) {
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

  // 4. 🔧 SCORE BADGES: Mit unfehlbarer Tooltip-Absicherung gegen undefined-Ziele
    // 4. 🔧 LOGIK-FIX: Biologisch und mathematisch korrekte Farb-Ampel für jedes Badge
  function createScoreBadge(title, current, targetInput, unit = '', isNegativeMetric = false) {
    if (!current) return '';

    // Zwingt targetInput auf eine gültige Zahl, falls die DB undefined liefert
    const target = typeof targetInput === 'number' && !isNaN(targetInput) ? targetInput : (current || 0);
    const diff = current - target;

    let icon = '●';
    let bgClass = 'badge-success'; // Standard: Grün (Optimal)
    let statusText = 'Optimal';

    // Ein Toleranzbereich von 0.5 Einheiten gilt im Profil als biologisch perfekt eingependelt
    if (Math.abs(diff) <= 0.5) {
      icon = '●';
      bgClass = 'badge-success';
      statusText = 'Optimal';
    } else {
      if (diff > 0) {
        // --- POSITIVE ABWEICHUNG (+) ---
        icon = '▲';
        statusText = `+${diff.toFixed(1)} ${unit}`;

        // Wenn eine Metrik negativ ist (z.B. Fett hoch), färbe sie ROT (danger).
        // Wenn sie positiv ist (z.B. Muskeln hoch), färbe sie GRÜN (success).
        bgClass = isNegativeMetric ? 'badge-danger' : 'badge-success';
      } else {
        // --- NEGATIVE ABWEICHUNG (-) ---
        icon = '▼';
        statusText = `${diff.toFixed(1)} ${unit}`;

        // Wenn eine Metrik negativ ist (z.B. Fett runter), färbe sie GRÜN (success).
        // Wenn sie positiv ist (z.B. Muskeln runter), färbe sie ROT (danger).
        bgClass = isNegativeMetric ? 'badge-success' : 'badge-danger';
      }
    }

    // 🔧 GEWICHTS-SONDERREGELUNG: Mehr Gewicht = Rot/Orange, Weniger Gewicht = Blau/Grün
    if (title === 'Gewicht') {
      statusText = diff > 0 ? `+${diff.toFixed(1)} ${unit}` : `${diff.toFixed(1)} ${unit}`;
      bgClass = diff > 0 ? 'badge-danger' : (weightDiff < 0 ? 'badge-info' : 'badge-success');
      icon = diff > 0 ? '▲' : '▼';
    }

    // INFOTEXT FÜR DEN GRAPHISCHEN APPLE-TOOLTIP
    const tooltipExplanation = `📊 METRIK: ${title.toUpperCase()}\n\n` +
      `● Aktuell: ${current.toFixed(1)} ${unit}\n` +
      `● Zielwert: ${target.toFixed(1)} ${unit}\n` +
      `● Abweichung: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)} ${unit}\n\n` +
      `Bewertung basiert auf deinem Profil-Sollwert.`;

    return `
      <div class="score-badge ${bgClass}" data-title="${tooltipExplanation}" style="cursor: help;">
        <span class="score-badge-title">${title}</span>
        <span class="score-badge-value">${icon} ${current.toFixed(1)}${unit}</span>
        <span class="score-badge-status">${statusText}</span>
      </div>
    `;
  }

  let targetMessage = '';
  if (weightDiff > 0) {
    targetMessage = ` &bull; Noch <strong>${weightDiff.toFixed(1)} kg</strong> bis zum Wunschgewicht`;
  } else if (weightDiff < 0) {
    targetMessage = ` &bull; <strong>${Math.abs(weightDiff).toFixed(1)} kg</strong> unter Wunschgewicht`;
  } else {
    targetMessage = ` &bull; <strong>Punktlandung! 🎉</strong>`;
  }

  const dropdownOptions = allUsers.map(u => {
    const isSelected = u.name.toLowerCase() === user.name.toLowerCase() ? 'selected' : '';
    return `<option value="${u.name}" ${isSelected}>${u.name.toUpperCase()}</option>`;
  }).join('');

  // 5. Das bereinigte Layout im DOM injizieren
  profileContainer.innerHTML = `
    <div class="profile-main-layout">

      <!-- Linker Block: Textdaten -->
      <div class="profile-left-combined">
        <div class="profile-text-side">
          <div class="profile-title-row">
            <select id="userSelect" class="profile-user-select">
              ${dropdownOptions}
            </select>
            <span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">
              ${isActive ? '● Aktiv' : '● Inaktiv'}
            </span>
          </div>
          <p class="profile-meta-main">
            Geschlecht: ${user.sex === 'female' ? 'Weiblich' : 'Männlich'} &bull; Wunschgewicht: <strong>${targetWeight} kg</strong>${targetMessage}
          </p>
          <p class="profile-meta-secondary">
            Letzte Messung: <strong>${dateStr}</strong> um <strong>${timeStr} Uhr</strong> &bull;
            <strong>${timeline.length}</strong> Messungen im ausgewählten Zeitraum
          </p>
        </div>
      </div>

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
