// /static/js/v3/chartDelta.js
import {
    getBaseOptions,
    renderChartSummaryFooter, // 🔧 NEU: Importiert die universelle Footer-Funktion
    themeColors
} from './chartBase.js';
import { getAppleIcon } from './icons.js';

/**
 * Zeichnet das Delta-Balkendiagramm vertikal im exakten Stil von chartNutrition mit Werten im Footer
 */
export function renderDeltaChart(timeline, rawTimeline, updateFn, startDateStr, endDateStr) {
    // 1. 🔧 DER SUMMARY-FOOTER FIX: Injiziert die echten Absolutwerte direkt unter das Diagramm!
    renderChartSummaryFooter('chartDelta', [
        { field: 'weight', label: 'Gewicht', unit: 'kg' },
        { field: 'fat', label: 'Körperfett', unit: '%' },
        { field: 'muscle', label: 'Muskelmasse', unit: 'kg' },
        { field: 'water', label: 'Körperwasser', unit: '%' }
    ], timeline, rawTimeline);

    const opts = getBaseOptions();

    // 2. FACHLICHE WEICHE: Kurzzeitraum abfangen
    const isShortPeriod = timeline.length < 3 || startDateStr === endDateStr;

    let targetData = [...timeline];
    let chartSubtitle = '';

    if (isShortPeriod) {
        const validHistory = rawTimeline.filter(t => t.weight && t.weight > 0);
        targetData = validHistory.slice(-7).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        chartSubtitle = ' (Review: Letzte 7 Tage)';
    } else {
        const fromDate = new Date(startDateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        const toDate = new Date(endDateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        chartSubtitle = ` (Veränderung ${fromDate} bis ${toDate})`;
    }

    if (targetData.length < 2) return;

    // 3. Mathematische Berechnung des Deltas
    const firstEntry = targetData[0];
    const lastEntry = targetData[targetData.length - 1];

    const weightDelta = lastEntry.weight - firstEntry.weight;
    const fatDelta = (lastEntry.fat && firstEntry.fat) ? (lastEntry.fat - firstEntry.fat) : 0;
    const muscleDelta = (lastEntry.muscle && firstEntry.muscle) ? (lastEntry.muscle - firstEntry.muscle) : 0;
    const waterDelta = (lastEntry.water && firstEntry.water) ? (lastEntry.water - firstEntry.water) : 0;

    // 4. Dynamischen Titel setzen inklusive Apple-Health Line-Icon
    const chartCard = document.getElementById('chartDelta')?.closest('.chart-card');
    if (chartCard) {
        const titleEl = chartCard.querySelector('.chart-title');
        if (titleEl) {
            // Holt das Icon mit Größe 16px passend zur H3-Schrift
            const svgIcon = getAppleIcon('bar', 16);

            // Baut das HTML perfekt zusammen, ohne das Icon wegzuschneiden
            titleEl.innerHTML = `${svgIcon}<span style="margin-left: 8px;">Veränderung (Fett, Muskeln, Wasser)</span><span style="font-size:12px; font-weight:normal; color:var(--text-muted); margin-left:6px;">${chartSubtitle}</span>`;

            // Apple-Health Flex-Ausrichtung erzwingen
            titleEl.style.display = 'inline-flex';
            titleEl.style.alignItems = 'center';
        }
    }

    // 5. DIREKTE ZUWEISUNG DER DESIGN-PARAMETERN
    updateFn('chartDelta', {
        type: 'bar',
        data: {
            labels: ['Gewicht', 'Körperfett', 'Muskelmasse', 'Körperwasser'],
            datasets: [{
                data: [weightDelta, fatDelta, muscleDelta, waterDelta],
                backgroundColor: ['#ff453a', '#ff9f0a', '#30d158', '#0a84ff'], // Reine Markenfarben
                borderRadius: function(context) {
                    const index = context.dataIndex;
                    const value = context.dataset.data[index];
                    if (value >= 0) {
                        return { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 };
                    } else {
                        return { topLeft: 0, topRight: 0, bottomLeft: 8, bottomRight: 8 };
                    }
                },
                borderSkipped: false,
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
                        label: function(context) {
                            const val = context.raw;
                            const unit = context.dataIndex === 0 || context.dataIndex === 2 ? ' kg' : ' %';
                            return ` Bilanz: ${val >= 0 ? '+' : ''}${val.toFixed(1)}${unit}`;
                        }
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
                        callback: function(value) {
                            return (value >= 0 ? '+' : '') + value.toFixed(1);
                        }
                    }
                }
            }
        }
    });
}
