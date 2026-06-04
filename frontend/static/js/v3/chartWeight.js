// /static/js/v3/chartWeight.js
import {
    calculateMovingAverage,
    getBaseOptions,
    renderChartSummaryFooter,
    themeColors
} from './chartBase.js';

export function renderWeightChart(timeline, rawTimeline, updateFn, dates) {
    const canvas = document.getElementById('chartWeight');
    let gradient = 'transparent';

    if (canvas) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, isDark ? 'rgba(255, 69, 58, 0.35)' : 'rgba(255, 59, 48, 0.22)');
        gradient.addColorStop(1, 'rgba(255, 59, 48, 0.0)');
    }

    // Footer-Berechnung bleibt aktiv
    renderChartSummaryFooter('chartWeight', [
        { field: 'weight', label: 'Gewicht', unit: 'kg' },
        { field: 'lbm', label: 'Fettfreie Masse', unit: 'kg' }
    ], timeline, rawTimeline);

    const weightValues = timeline.map(t => t.weight);
    const lbmValues = timeline.map(t => t.lbm);

    // 🔧 MATHEMATISCHER SPREIZUNGS-FIX FÜR DEN TREND
    const minW = Math.min(...weightValues, ...lbmValues);
    const maxW = Math.max(...weightValues);
    const deltaW = maxW - minW;

    let targetMin = minW - 1.0;
    let targetMax = maxW + 1.0;

    // Wenn die Schwankung sehr klein ist (z.B. Delta 0.3), weiten wir das Fenster künstlich
    // auf mindestens 3.5 kg auf, damit die Kurven optisch flacher werden und der Trend atmet
    if (deltaW < 3.5) {
        const center = (minW + maxW) / 2;
        targetMin = center - 1.75;
        targetMax = center + 1.75;
    }

    const opts = getBaseOptions();
    if (opts.scales) delete opts.scales;

    updateFn('chartWeight', {
        type: 'line',
        data: {
            labels: dates, // Nutzt die stabilen Tages-Strings aus charts.js gegen Stunden-Fehler
            datasets: [
                {
                    label: 'Gewicht',
                    data: weightValues,
                    borderColor: '#ff453a',
                    backgroundColor: gradient,
                    fill: true,
                    borderWidth: 2.5,
                    pointRadius: timeline.length > 45 ? 0 : 2,
                    pointBackgroundColor: '#ff453a',
                    tension: 0.2
                },
                {
                    label: 'Gewicht Trend',
                    data: calculateMovingAverage(weightValues, 3), // Glättung über 3 Punkte
                    borderColor: '#ff9f0a',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [3, 3],
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Fettfreie Masse',
                    data: lbmValues,
                    borderColor: '#0a84ff',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.2
                }
            ]
        },
        options: {
            ...opts,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'category', // Stabilisiert das Gitter auf Tagesbasis ohne Stundensprünge
                    grid: { color: themeColors.grid || '#3a3a3c' },
                    ticks: {
                        color: themeColors.text || '#ffffff',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6 // Hält das Schriftbild auch im Jahres-Modus sauber und aufgeräumt
                    }
                },
                y: {
                    type: 'linear',
                    min: Math.floor(targetMin),
                    max: Math.ceil(targetMax),
                    title: { display: true, text: 'Masse (kg)', color: themeColors.text || '#ffffff' },
                    grid: { color: themeColors.grid || '#3a3a3c' },
                    ticks: { color: themeColors.text || '#ffffff' }
                }
            }
        }
    });
}
