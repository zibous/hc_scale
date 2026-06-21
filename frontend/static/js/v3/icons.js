// frontend/static/js/v3/icons.js

/**
 * Liefert ein mathematisch präzises Apple-Health SVG-Icon zurück
 * @param {string} name - Name des Icons (weight, muscle, water, energy, trend, sync, fat, protein, sun, moon, radar, bar, bgGym)
 * @param {number} size - Quadratische Größe in Pixeln (bzw. Höhe beim bgGym-Hintergrundbild)
 * @param {number} opacity - Deckkraft von 0.0 bis 1.0 (Standard 1.0 = voll sichtbar)
 * @param {number} marginRight - Abstand nach rechts in Pixeln (Standard 0)
 * @param {string} color - CSS-Farbe (Standard "currentColor")
 * @param {string} className - Optionale CSS-Klasse
 */
export function getAppleIcon(name, size = 16, opacity = 1.0, marginRight = 0, color = 'currentColor', className = '') {
  // 🌟 Für das Hintergrundbild brauchen wir eine flexible Breite (auto), da es ein flaches Breitbild-Format (4:1) hat
  const isBg = name === 'bgGym';
  const widthStyle = isBg ? 'width:auto;' : `width:${size}px;`;

  const finalStyle = `${widthStyle} height:${size}px; stroke:${color}; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:text-bottom; flex-shrink:0; opacity:${opacity}; margin-right:${marginRight}px;`;
  const cls = className ? `class="${className}"` : '';

  const svgLibrary = {
    weight: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/><circle cx="12" cy="12" r="3"/><path d="M12 7v2"/></svg>`,
    muscle: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2"/><path d="M18 18h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2"/><path d="M6 12h12"/><path d="M10 7v10"/><path d="M14 7v10"/></svg>`,
    water: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>`,
    energy: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    trend: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,
    sync: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
    fat: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    protein: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    calendar: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    sun: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    moon: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,
    radar: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v20M2 12h20"/></svg>`,
    bar: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6M3 20h18"/></svg>`,

    // 🏋️‍♂️ (Hantel + Herzfrequenz + Herz)
    bgGym: `<svg ${cls} style="${finalStyle}" viewBox="0 0 800 200">
      <rect x="180" y="70" width="15" height="60" rx="3" fill="currentColor" stroke="none" />
      <rect x="200" y="60" width="20" height="80" rx="4" fill="currentColor" stroke="none" />
      <line x1="220" y1="100" x2="260" y2="100" stroke-width="8" />
      <path d="M 50 100 L 260 100 L 275 100 L 285 60 L 300 150 L 315 30 L 330 120 L 340 100 L 370 100" stroke-width="5" />
      <path d="M 370 100 C 370 80, 400 70, 410 90 C 420 70, 450 80, 450 100 C 450 120, 425 145, 410 155 C 395 145, 370 120, 370 100 Z" fill="currentColor" fill-opacity="0.15" stroke-width="5" />
      <path d="M 450 100 L 480 100 L 490 70 L 505 140 L 520 40 L 535 120 L 545 100 L 580 100" stroke-width="5" />
      <line x1="580" y1="100" x2="620" y2="100" stroke-width="8" />
      <rect x="620" y="60" width="20" height="80" rx="4" fill="currentColor" stroke="none" />
      <rect x="645" y="70" width="15" height="60" rx="3" fill="currentColor" stroke="none" />
      <path d="M 660 100 L 750 100" stroke-width="5" />
    </svg>`
  };

  return svgLibrary[name] || '';
}
