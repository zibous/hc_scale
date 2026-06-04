// /static/js/v3/chartNutrition.js
import {
    themeColors
} from './chartBase.js';

export function renderNutritionChart(timeline, updateFn) {
    const points = timeline.filter(t => t.poi && t.poi > 0);
    const avgKcal = (points.length > 0 ? points.reduce((sum, t) => sum + t.poi, 0) / points.length : 13.3) * 150;

    updateFn('chartNutrition', {
        type: 'bar',
        data: {
            labels: ['Kohlenhydrate', 'Proteine', 'Fette'],
            datasets: [{
                data: [avgKcal * 0.45, avgKcal * 0.30, avgKcal * 0.25],
                backgroundColor: ['#ff9f0a', '#0a84ff', '#ff453a'],

                // 🔧 DER FIX: Ein Objekt gilt für JEDEN Balken und rundet exklusiv die Oberkante!
                borderRadius: {
                    topLeft: 8,
                    topRight: 8,
                    bottomLeft: 0,
                    bottomRight: 0
                },
                borderSkipped: 'bottom', // Verhindert Rundungen an der Andockstelle unten
                barPercentage: 0.85
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (c) => ` Ø ${c.raw.toFixed(0)} kcal/Tag`
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: themeColors.text,
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                },
                y: {
                    grid: {
                        color: themeColors.grid
                    },
                    ticks: {
                        color: themeColors.text,
                        callback: (v) => `${v} kcal`
                    },
                    title: {
                        display: true,
                        text: `Zeitraum-Schnitt: Gesamt Ø ${avgKcal.toFixed(0)} kcal/Tag`,
                        color: themeColors.text
                    }
                }
            }
        }
    });
}
