// /static/js/v3/chartNutrition.js
import {
    themeColors,
    renderChartSummaryFooter
} from './chartBase.js';

export function renderNutritionChart(timeline, updateFn, rawTimeline, user = null) {
    // 1. DURCHSCHNITTS-KALORIEN AUS DEN PUNKTEN BERECHNEN (12.89 * 150 = 1933.5 kcal)
    const points = timeline.filter(t => t.poi && t.poi > 0);
    const avgPoints = points.length > 0 ? points.reduce((sum, t) => sum + t.poi, 0) / points.length : 12.9;
    const avgKcal = avgPoints * 150;

    // 2. 🔧 ECHTE ENERGIE-WERTE DIREKT AUS DEM NEUEN PAYLOAD LESEN!
    // Holt sich die echten 2411 kcal direkt aus dem aktuellsten Timeline-Eintrag
    const latestEntry = timeline[timeline.length - 1] || {};
    const userTdee = latestEntry.tdee || user?.scores?.BMR || 2400;

    // 3. ENRICHMENT FÜR DEN SYSTEM-FOOTER
    const enrichedTimeline = timeline.map(t => ({ ...t, poi: avgKcal, tdee: userTdee }));
    const enrichedRaw = (rawTimeline || timeline).map(t => ({ ...t, poi: avgKcal, tdee: userTdee }));

    renderChartSummaryFooter('chartNutrition', [
        { field: 'poi', label: 'Energie-Zufuhr', unit: ' kcal' },
        { field: 'tdee', label: 'Gesamtverbrauch', unit: ' kcal' }
    ], enrichedTimeline, enrichedRaw);

    renderChartSummaryFooter('chartNutrition', [
        { field: 'poi', label: 'Energie-Zufuhr', unit: ' kcal' },
        { field: 'tdee', label: 'Gesamtverbrauch', unit: ' kcal' }
    ], enrichedTimeline, enrichedRaw);

    // 4. DIAGRAMM ZEICHNEN
    updateFn('chartNutrition', {
        type: 'bar',
        data: {
            labels: ['Kohlenhydrate', 'Proteine', 'Fette'],
            datasets: [{
                data: [avgKcal * 0.45, avgKcal * 0.30, avgKcal * 0.25],
                backgroundColor: ['#ff9f0a', '#0a84ff', '#ff453a'],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8,
                    bottomLeft: 0,
                    bottomRight: 0
                },
                borderSkipped: 'bottom',
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
