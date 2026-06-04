// /static/js/v3/chartMuscle.js
import {
    getBaseOptions,
    renderChartSummaryFooter,
    themeColors
} from './chartBase.js';

export function renderMuscleChart(timeline, rawTimeline, updateFn, dates) {
    // 1. Footer-Berechnung für die Kachel-Unterzeile befüllen
    renderChartSummaryFooter('chartMuscle', [
        { field: 'muscle', label: 'Muskeln', unit: 'kg' },
        { field: 'protein', label: 'Protein', unit: '%' }
    ], timeline, rawTimeline);

    const muscleValues = timeline.map(t => t.muscle);
    const proteinValues = timeline.map(t => t.protein);

    // 2. MATHEMATISCHER SPREIZUNGS-FIX FÜR MINI-SCHWANKUNGEN
    const minM = Math.min(...muscleValues);
    const maxM = Math.max(...muscleValues);
    const deltaM = maxM - minM;

    let targetMin = minM - 0.5;
    let targetMax = maxM + 0.5;

    // Wenn die Muskelmasse im Jahr kaum schwankt (z.B. nur um 0.2 kg),
    // weiten wir die Achse künstlich auf 3kg auf, damit der Trend sauber atmet
    if (deltaM < 3.0) {
        const center = (minM + maxM) / 2;
        targetMin = center - 1.5;
        targetMax = center + 1.5;
    }

    const opts = getBaseOptions();
    if (opts.scales) delete opts.scales;

    updateFn('chartMuscle', {
        type: 'line',
        data: {
            labels: dates, // Nutzt die stabilen Tages-Strings aus charts.js gegen Stunden-Fehler im Jahr
            datasets: [
                {
                    label: 'Muskelmasse (kg)',
                    data: muscleValues,
                    borderColor: '#30d158', // Apple Green
                    backgroundColor: 'transparent',
                    borderWidth: 0.9,
                    pointRadius: timeline.length > 45 ? 0 : 2,
                    pointBackgroundColor: '#30d158',
                    yAxisID: 'yMuscle',
                    tension: 0.2
                },
                {
                    label: 'Protein (%)',
                    data: proteinValues,
                    borderColor: '#0a84ff', // Apple Blue
                    backgroundColor: 'transparent',
                    borderWidth: 0.6,
                    pointRadius: 0,
                    yAxisID: 'yProtein', // Separate Achse für Prozentwerte!
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
                    type: 'category', // Verhindert wirre Stundensprünge im Jahres-Modus
                    grid: { color: themeColors.grid || '#3a3a3c' },
                    ticks: {
                        color: themeColors.text || '#ffffff',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6 // Hält die X-Achse bei 365 Tagen perfekt sauber
                    }
                },
                // Linke Achse für die Muskeln (kg)
                yMuscle: {
                    type: 'linear',
                    position: 'left',
                    min: Math.floor(targetMin),
                    max: Math.ceil(targetMax),
                    title: { display: true, text: 'Muskelmasse (kg)', color: '#30d158' },
                    grid: { color: themeColors.grid || '#3a3a3c' },
                    ticks: { color: themeColors.text || '#ffffff' }
                },
                // Rechte Achse für das Protein (%)
                yProtein: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Protein (%)', color: '#0a84ff' },
                    grid: { display: false }, // Verhindert doppeltes Gitterplatz-Chaos
                    ticks: { color: themeColors.text || '#ffffff' }
                }
            }
        }
    });
}
