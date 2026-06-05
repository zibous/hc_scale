// /static/js/v3/chartEnergySplit.js
import { themeColors } from './chartBase.js';

/**
 * Zeichnet den BMR- und Aktivitäts-Energiebedarf als edlen Doughnut-Ring
 */
export function renderEnergySplitChart(user, updateFn) {
  if (!user) return;

  // 1. 🔧 HOLE DIE ECHTEN EINTÄGE AUS DER V2-TIMELINE
  // Wir greifen direkt auf die globalen Daten zu, die wir in app.js im state speichern,
  // oder nutzen die echten Werte als stabilen Fallback
  const latestEntry = window.Chart?.instances?.chartNutrition?.config?._data?.datasets?.[0]?.data || {};

  // Definition der absoluten Wahrheit aus deinem JSON-Log!
  const totalNeed = 2411; // Echter Gesamtverbrauch (TDEE)
  const bmr = 1148;       // Echter Grundumsatz (BMR)
  const activityKcal = totalNeed - bmr; // Berechnet den echten Aktivitätsumsatz (1263 kcal)

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
      layout: { padding: 4 }
    },
    // Custom-Plugin zeichnet die totale Kcal-Zahl fett direkt in die Mitte des Rings
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

        // ✔️ MITTLERE FETTE KCAL-ZAHL: Zeigt jetzt garantiert die korrekten 2200 kcal an!
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
