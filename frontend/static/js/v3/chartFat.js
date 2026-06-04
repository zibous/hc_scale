// /static/js/v3/chartFat.js
import { getBaseOptions, renderChartSummaryFooter, themeColors } from './chartBase.js';

export function renderFatChart(timeline, rawTimeline, updateFn, dates) {
  const opts = getBaseOptions();

  renderChartSummaryFooter('chartFat', [
    { field: 'fat', label: 'Fett', unit: '%' },
    { field: 'visceral', label: 'Viszeral', unit: 'Lvl' }
  ], timeline, rawTimeline);

  updateFn('chartFat', {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Körperfett (%)',
          data: timeline.map(t => t.fat),
          borderColor: '#ff9f0a',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0
        },
        {
          label: 'Viszeralfett',
          data: timeline.map(t => t.visceral),
          borderColor: '#bf5af2',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          yAxisID: 'yVisc'
        }
      ]
    },
    options: {
      ...opts,
      scales: {
        x: opts.scales.x,
        y: {
          grid: { color: themeColors.grid }, // Nutzt die importierten themeColors aus der Basis
          ticks: { color: themeColors.text }
        },
        yVisc: {
          position: 'right',
          grid: { display: false },
          ticks: { color: themeColors.text }
        }
      }
    }
  });
}
