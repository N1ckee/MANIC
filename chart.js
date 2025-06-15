function drawTiltchart(labels, data) {
  const ctx = document.getElementById('tiltChart').getContext('2d');

  if (window.tiltChartInstance) {
    window.tiltChartInstance.destroy(); // Reset previous chart
  }

  window.tiltChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Estimated Output (kWh)',
        data: data,
        borderColor: 'orange',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Tilt Angle (°)' } },
        y: { title: { display: true, text: 'Annual Output (kWh/year)' } }
      }
    }
  });
};

function drawDailyProductionChart(avg_ghi) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // Distribute GHI across daylight hours (e.g., 6 AM to 6 PM) using a bell-like shape
  const hourlyProfile = hours.map((_, hour) => {
    const daylightStart = 6;
    const daylightEnd = 18;
    const daylightHours = daylightEnd - daylightStart;

    if (hour < daylightStart || hour >= daylightEnd) return 0;

    // Normalize hour to a 0–π range to simulate sun elevation curve
    const x = Math.PI * (hour - daylightStart) / daylightHours;
    const weight = Math.sin(x); // 0 at 6 AM/6 PM, peak at noon

    return (avg_ghi * weight) / daylightHours;
  });

  const ctx = document.getElementById('daychart').getContext('2d');

  if (window.usageChartInstance) {
    window.usageChartInstance.destroy();
  }

  window.usageChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Simulated Hourly Production (kWh/m²)',
        data: hourlyProfile.map(v => parseFloat(v.toFixed(2))),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hour of Day'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'kWh/m²'
          }
        }
      }
    }
  });
}