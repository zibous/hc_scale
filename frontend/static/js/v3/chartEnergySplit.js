// /static/js/v3/chartEnergySplit.js
import { themeColors } from './chartBase.js';

/**
 * Zeichnet den BMR- und Aktivitäts-Energiebedarf als edlen Doughnut-Ring
 */
export function renderEnergySplitChart(user, updateFn) {
  if (!user) return;

  // 1. Hole die Profildaten live aus dem Backend-User-Objekt
  const targetScores = user.scores || {};
  const bmr = targetScores.BMR || (user.sex === 'female' ? 1850 : 2200);
  const activityFactor = user.activity || (user.sex === 'female' ? 1.5 : 2.1);

  // 2. Mathematische Berechnung des Leistungsumsatzes
  const totalNeed = bmr * activityFactor;
  const activityKcal = totalNeed - bmr;

  updateFn('chartEnergySplit', {
    type: 'doughnut',
    data: {
      labels: ['Grundumsatz (BMR)', 'Aktivitätsumsatz'],
      datasets: [{
        data: [bmr, activityKcal],
        backgroundColor: [
          '#bf5af2', // Edles Apple-Lila für den Grundumsatz
          '#30d158'  // Sportliches Apple-Grün für die Aktivität
        ],
        borderWidth: 0,
        // 🔧 Apple-Style: Macht den Ring dünner und eleganter
        cutout: '75%',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { color: themeColors.text, boxWidth: 10, usePointStyle: true, font: { size: 11, weight: '600' } }
        },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.label}: ${context.raw.toFixed(0)} kcal`
          }
        }
      },
      // 🔧 Schafft Platz im Zentrum für die Gesamt-Kcal Textanzeige
      layout: { padding: 4 }
    },
    // 🔧 Custom-Plugin zeichnet die totale Kcal-Zahl fett direkt in die Mitte des Rings
    plugins: [{
      id: 'centerText',
      beforeDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.save();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Obere kleine Beschriftung
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8e8e93';
        ctx.fillText('BEDARF', width / 2, height / 2 - 10);

        // Mittlere fette Kcal-Zahl
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        ctx.fillText(`${totalNeed.toFixed(0)}`, width / 2, height / 2 + 10);

        // Untere kleine Einheit
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#8e8e93';
        ctx.fillText('KCAL / TAG', width / 2, height / 2 + 24);
        ctx.restore();
      }
    }]
  });
}
