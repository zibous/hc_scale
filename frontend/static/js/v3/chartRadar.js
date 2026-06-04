// /static/js/v3/chartRadar.js
import {
    themeColors
} from './chartBase.js';

// 🔧 FIX: Nimmt jetzt das 'user'-Objekt für die präzise Geschlechter-Erkennung auf!
export function renderRadarChart(timeline, updateFn, user = null) {
    const lat = timeline[timeline.length - 1] || {};

    // Ermittle das Geschlecht sicher über das übergebene API-User-Objekt oder den Namen
    const username = user?.name || user?.username || '';
    const isFemale = username.toLowerCase() === 'reni';

    // Definition der biologisch exakten Referenzwerte
    const target = {
        weight: isFemale ? 54.0 : 70.0,
        fat: isFemale ? 15.5 : 11.5,
        water: isFemale ? 57.0 : 55.0,
        muscle: isFemale ? 48.0 : 56.0,
        protein: isFemale ? 18.0 : 22.0,
        bmi: 22.0
    };

    // Mathematisch gedeckelte Normalisierung (verhindert das optische "Sprengen" des Netzes)
    const normalizedData = [
        lat.weight ? Math.min(Math.max((lat.weight / target.weight) * 100, 40), 160) : 100,
        lat.fat ? Math.min(Math.max((lat.fat / target.fat) * 100, 40), 160) : 100,
        lat.water ? Math.min(Math.max((lat.water / target.water) * 100, 40), 160) : 100,
        lat.muscle ? Math.min(Math.max((lat.muscle / target.muscle) * 100, 40), 160) : 100,
        lat.protein ? Math.min(Math.max((lat.protein / target.protein) * 100, 40), 160) : 100,
        lat.bmi ? Math.min(Math.max((lat.bmi / target.bmi) * 100, 40), 160) : 100
    ];

    updateFn('chartRadar', {
        type: 'radar',
        data: {
            labels: ['Gewicht', 'Körperfett', 'Wasser', 'Muskeln', 'Protein', 'BMI'],
            datasets: [{
                    label: 'Dein Ist-Zustand (%)',
                    data: normalizedData,
                    backgroundColor: themeColors.radarBg || 'rgba(10, 132, 255, 0.15)',
                    borderColor: '#0a84ff', // High-End Apple Blue
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#0a84ff',
                    order: 1
                },
                {
                    label: 'Optimales Ziel (100%)',
                    data: [100, 100, 100, 100, 100, 100],
                    borderColor: '#30d158', // Apple Green
                    borderWidth: 1.5,
                    borderDash: [4, 4], // Elegante gestrichelte Ideallinie
                    backgroundColor: 'transparent',
                    pointRadius: 0,
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: themeColors.text,
                        boxWidth: 12,
                        font: { size: 11, weight: '600' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (c) => ` ${c.dataset.label}: ${c.raw.toFixed(1)}%`
                    }
                }
            },
            scales: {
                r: {
                    min: 50,
                    max: 150,
                    grid: {
                        color: themeColors.grid || '#3a3a3c'
                    },
                    angleLines: {
                        color: themeColors.grid || '#3a3a3c'
                    },
                    pointLabels: {
                        color: themeColors.text,
                        font: {
                            size: 11,
                            weight: '600'
                        },
                        padding: 12 // Zwingt die Labels nach außen, um Überlappungen mit dem Netz zu verhindern!
                    },
                    ticks: {
                        display: true,
                        color: themeColors.text,
                        backdropColor: 'transparent',
                        font: { size: 9 },
                        stepSize: 25, // Erzeugt klare, saubere Kreise bei 50%, 75%, 100%, 125%, 150%
                        callback: (v) => v === 100 ? '100%' : `${v}%`
                    }
                }
            }
        }
    });
}
