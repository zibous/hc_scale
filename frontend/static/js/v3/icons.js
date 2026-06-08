// frontend/static/js/v3/icons.js

/**
 * Liefert ein mathematisch präzises Apple-Health SVG-Icon zurück
 * @param {string} name - Name des Icons (weight, muscle, water, energy, trend, sync, fat, protein, sun, moon, radar, bar)
 * @param {number} size - Quadratische Größe in Pixeln (z.B. 14, 16, 18)
 * @param {number} opacity - Deckkraft von 0.0 bis 1.0 (Standard 1.0 = voll sichtbar)
 * @param {number} marginRight - Abstand nach rechts in Pixeln (Standard 0)
 * @param {string} color - CSS-Farbe (Standard "currentColor")
 * @param {string} className - Optionale CSS-Klasse
 */
export function getAppleIcon(name, size = 16, opacity = 1.0, marginRight = 0, color = 'currentColor', className = '') {
  // 🌟 FIX: finalStyle korrekt zusammengebaut, damit alle SVGs fehlerfrei darauf zugreifen können!
  const finalStyle = `width:${size}px; height:${size}px; stroke:${color}; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:text-bottom; flex-shrink:0; opacity:${opacity}; margin-right:${marginRight}px;`;
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
    bar: `<svg ${cls} style="${finalStyle}" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6M3 20h18"/></svg>`
  };

  return svgLibrary[name] || '';
}
