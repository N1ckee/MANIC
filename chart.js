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

function drawDailyProductionChart(irradiance) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const ctx = document.getElementById('daychart').getContext('2d');

  if (window.usageChartInstance) {
    window.usageChartInstance.destroy();
  }

  window.usageChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Energy Production (kWh)',
        data: irradiance,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
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
            text: 'kWh'
          }
        }
      }
    }
  });
};