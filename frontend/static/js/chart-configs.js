import { gc, tc } from './constants.js';

// c1: Gewicht (mit Trend) & Fettfreie Masse
export const getWeightConfig = (data) => {
  // Trendlinie berechnen (lineare Regression)
  const weights = data.map(d => d.weight);
  const n = weights.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += weights[i]; sumXY += i * weights[i]; sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const trendData = weights.map((_, i) => +(intercept + slope * i).toFixed(2));

  return {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Gewicht (kg)',
          data: weights,
          borderColor: '#4361ee',
          backgroundColor: 'rgba(66, 97, 238, 0.05)',
          tension: 0.2,
          fill: true
        },
        {
          label: 'Trend',
          data: trendData,
          borderColor: '#e63946',
          borderDash: [6, 3],
          pointRadius: 0,
          tension: 0
        },
        {
          label: 'Fettfreie Masse',
          data: data.map(d => d.lbm),
          borderColor: '#2ec4b6',
          tension: 0.2,
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: 'time', grid: { color: gc() } },
        y: { grid: { color: gc() } }
      }
    }
  };
};

// c2: Zusammenfassung (Gewicht / Muskeln / BMI)
export const getSummaryConfig = (data) => ({
  type: 'line',
  data: {
    labels: data.map(d => d.date),
    datasets: [
      { label: 'Gewicht (kg)', data: data.map(d => d.weight), borderColor: '#4361ee', yAxisID: 'yKg', tension: 0.15 },
      { label: 'Muskelmasse (kg)', data: data.map(d => d.muscle), borderColor: '#2ec4b6', yAxisID: 'yKg', tension: 0.15 },
      { label: 'BMI', data: data.map(d => d.bmi), borderColor: '#f4a261', yAxisID: 'yBmi', tension: 0.1, borderDash: [5, 5] }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'time', grid: { color: gc() } },
      yKg: { type: 'linear', position: 'left', grid: { color: gc() }, title: { display: true, text: 'kg', color: tc() } },
      yBmi: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'BMI', color: tc() } }
    }
  }
});

// c3: Körperfett & Viszeralfett
export const getFatVisceralConfig = (data) => ({
  type: 'line',
  data: {
    labels: data.map(d => d.date),
    datasets: [
      { label: 'Körperfett (%)', data: data.map(d => d.fat), borderColor: '#e63946', yAxisID: 'yPct', tension: 0.2 },
      { label: 'Viszeralfett', data: data.map(d => d.visceral), borderColor: '#f4a261', yAxisID: 'yIdx', tension: 0.0 }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'time', grid: { color: gc() } },
      yPct: { type: 'linear', position: 'left', grid: { color: gc() }, title: { display: true, text: 'Fett %', color: tc() } },
      yIdx: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Index', color: tc() } }
    }
  }
});

// c4: Muskeln & Protein
export const getMuscleProteinConfig = (data) => ({
  type: 'line',
  data: {
    labels: data.map(d => d.date),
    datasets: [
      { label: 'Muskelmasse (kg)', data: data.map(d => d.muscle), borderColor: '#2ec4b6', yAxisID: 'yKg', tension: 0.2 },
      { label: 'Protein (%)', data: data.map(d => d.protein), borderColor: '#4cc9f0', yAxisID: 'yPct', tension: 0.2 }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'time', grid: { color: gc() } },
      yKg: { type: 'linear', position: 'left', grid: { color: gc() } },
      yPct: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } }
    }
  }
});

// c5: Körperwerte (normalisiert in %)
export const getNormalizedConfig = (data) => {
  const base = data[0] || {};
  const calcPct = (curr, b) => b ? (curr / b) * 100 : 100;
  return {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [
        { label: 'Fett % (rel.)', data: data.map(d => calcPct(d.fat, base.fat)), borderColor: '#e63946', tension: 0.2 },
        { label: 'Muskeln % (rel.)', data: data.map(d => calcPct(d.muscle, base.muscle)), borderColor: '#2ec4b6', tension: 0.2 },
        { label: 'Wasser % (rel.)', data: data.map(d => calcPct(d.water, base.water)), borderColor: '#4cc9f0', tension: 0.2 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: 'time', grid: { color: gc() } },
        y: { grid: { color: gc() }, ticks: { callback: v => `${(v - 100).toFixed(1)}%` } }
      }
    }
  };
};

// c6: Makronährstoffe (kcal/Tag) – berechnet aus Gewicht/Größe/Alter
export const getNutritionConfig = (data) => {
  // BMR schätzen (Mifflin-St Jeor, männlich als Default)
  const bmrData = data.map(d => {
    // Vereinfachte BMR-Schätzung: 10 * weight + 625 - 5 * 70 (Alter ~70)
    return d.weight ? Math.round(10 * d.weight + 625 - 350) : null;
  });

  return {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: 'Geschätzter Grundumsatz (kcal)',
        data: bmrData,
        borderColor: '#f4a261',
        backgroundColor: 'rgba(244, 162, 97, 0.1)',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: 'time', grid: { color: gc() } },
        y: { grid: { color: gc() }, title: { display: true, text: 'kcal', color: tc() } }
      }
    }
  };
};

// c7: Veränderung (Differenz zur historischen Vorperiode)
export const getDeltaConfig = (data, prevData) => {
  const hasData = data && data.length > 0;
  const hasPrev = prevData && prevData.length > 0;

  const avgCurrent = hasData ? data.reduce((acc, d) => acc + (d.weight || 0), 0) / data.length : 0;
  const avgPrev = hasPrev ? prevData.reduce((acc, d) => acc + (d.weight || 0), 0) / prevData.length : 0;
  const delta = hasPrev && hasData ? avgCurrent - avgPrev : 0;

  return {
    type: 'bar',
    data: {
      labels: ['Gewichtsänderung zur Vorperiode'],
      datasets: [{
        label: 'Differenz (kg)',
        data: [delta],
        backgroundColor: delta > 0 ? 'rgba(230, 57, 70, 0.75)' : 'rgba(46, 196, 182, 0.75)',
        borderColor: delta > 0 ? '#e63946' : '#2ec4b6',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: gc() },
          suggestedMin: -2,
          suggestedMax: 2
        }
      }
    }
  };
};
