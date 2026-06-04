// /static/js/v3/chartSummary.js
import {
    getBaseOptions,
    renderChartSummaryFooter,
    themeColors
} from './chartBase.js';

export function renderSummaryChart(timeline, rawTimeline, updateFn, dates) {
    // 1. Footer befüllen
    renderChartSummaryFooter('chartSummary', [
        { field: 'weight', label: 'Gewicht', unit: 'kg' },
        { field: 'muscle', label: 'Muskeln', unit: 'kg' },
        { field: 'bmi', label: 'BMI', unit: '' }
    ], timeline, rawTimeline);

    const isSingleDay = timeline.length <= 1;

    // 2. Wertebereiche ermitteln für die mathematischen Achsen
    const weights = timeline.map(t => t.weight);
    const muscles = timeline.map(t => t.muscle);
    const bmis = timeline.map(t => t.bmi);

    const minWeight = Math.min(...weights) - (isSingleDay ? 5 : 1);
    const maxWeight = Math.max(...weights) + (isSingleDay ? 5 : 1);
    const minMuscle = Math.min(...muscles) - (isSingleDay ? 5 : 0.5);
    const maxMuscle = Math.max(...muscles) + (isSingleDay ? 5 : 0.5);
    const minBmi = Math.min(...bmis) - (isSingleDay ? 5 : 0.5);
    const maxBmi = Math.max(...bmis) + (isSingleDay ? 5 : 0.5);

    // 3. ENTKOPPELTE STRUKTUR FÜR DEN EIN-TAGES-MODUS
    if (isSingleDay && timeline.length > 0) {
        const single = timeline[0];

        updateFn('chartSummary', {
            type: 'bar',
            data: {
                // Die echten Wertenamen sauber nebeneinander auf der X-Achse!
                labels: ['Gewicht (kg)', 'Muskelmasse (kg)', 'BMI'],
                datasets: [{
                    data: [single.weight, single.muscle, single.bmi],
                    backgroundColor: [
                        'rgba(255, 69, 58, 0.6)',  // Apple Red für Gewicht
                        'rgba(48, 209, 88, 0.6)',  // Apple Green für Muskeln
                        'rgba(255, 159, 10, 0.6)'  // Apple Orange für BMI
                    ],
                    borderColor: ['#ff453a', '#30d158', '#ff9f0a'],
                    borderWidth: 1,
                    borderRadius: 12, // Wunderschön abgerundete Apple-Säulen
                    barThickness: 45,
                    maxBarThickness: 50
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Keine verwirrende Legende bei Einzeltags-Balken
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: themeColors.text || '#ffffff', font: { weight: '600' } }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        // Dynamischer Startwert knapp unter dem kleinsten Wert, damit die Balken gut wirken
                        min: Math.floor(Math.min(single.weight, single.muscle, single.bmi) - 5),
                        max: Math.ceil(Math.max(single.weight, single.muscle, single.bmi) + 5),
                        grid: { color: themeColors.grid || '#3a3a3c' },
                        ticks: { color: themeColors.text || '#ffffff' }
                    }
                }
            }
        });
        return; // Verhindert das Ausführen der Linien-Logik für diesen Fall
    }

    // 4. KLASSISCHER VERLAUFS-MODUS (Mehrere Tage / Woche / Monat / Jahr)
    const weightPoints = timeline.map(t => ({ x: new Date(t.timestamp), y: t.weight }));
    const musclePoints = timeline.map(t => ({ x: new Date(t.timestamp), y: t.muscle }));
    const bmiPoints = timeline.map(t => ({ x: new Date(t.timestamp), y: t.bmi }));

    updateFn('chartSummary', {
        type: 'bar',
        data: {
            datasets: [
                {
                    type: 'bar', // BMI als dezenter Hintergrundbalken
                    label: 'BMI',
                    data: bmiPoints,
                    borderColor: '#ff9f0a',
                    backgroundColor: 'rgba(255, 159, 10, 0.15)',
                    borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
                    borderRadius: 4,
                    barThickness: timeline.length > 30 ? 8 : 16,
                    yAxisID: 'yBmi',
                    order: 3
                },
                {
                    type: 'line', // Gewicht als scharfe rote Linie
                    label: 'Gewicht (kg)',
                    data: weightPoints,
                    borderColor: '#ff453a',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    pointRadius: timeline.length < 20 ? 4 : 0,
                    pointBackgroundColor: '#ff453a',
                    yAxisID: 'yWeight',
                    tension: 0.2,
                    order: 1
                },
                {
                    type: 'line', // Muskeln als scharfe grüne Linie
                    label: 'Muskeln (kg)',
                    data: musclePoints,
                    borderColor: '#30d158',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    pointRadius: timeline.length < 20 ? 4 : 0,
                    pointBackgroundColor: '#30d158',
                    yAxisID: 'yMuscle',
                    tension: 0.2,
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        tooltipFormat: 'dd.MM.yyyy',
                        unit: timeline.length > 45 ? 'month' : 'day',
                        stepSize: timeline.length > 180 ? 2 : 1,
                        displayFormats: {
                            day: 'dd.MM',
                            month: 'MMM yyyy'
                        }
                    },
                    grid: { color: themeColors.grid || '#3a3a3c' },
                    ticks: {
                        color: themeColors.text || '#ffffff',
                        maxRotation: 0,
                        maxTicksLimit: 6
                    }
                },
                yWeight: {
                    type: 'linear',
                    position: 'left',
                    min: Math.floor(minWeight),
                    max: Math.ceil(maxWeight),
                    title: { display: true, text: 'Gewicht (kg)', color: '#ff453a' },
                    ticks: { color: themeColors.text || '#ffffff' },
                    grid: { color: themeColors.grid || '#3a3a3c' }
                },
                yMuscle: {
                    type: 'linear',
                    position: 'right',
                    min: Math.floor(minMuscle),
                    max: Math.ceil(maxMuscle),
                    title: { display: true, text: 'Muskelmasse (kg)', color: '#30d158' },
                    ticks: { color: themeColors.text || '#ffffff' },
                    grid: { display: false }
                },
                yBmi: {
                    type: 'linear',
                    position: 'right',
                    min: Math.floor(minBmi),
                    max: Math.ceil(maxBmi),
                    display: false,
                    grid: { display: false }
                }
            }
        }
    });
}
