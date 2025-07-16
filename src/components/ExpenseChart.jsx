import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ExpenseChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    if (!chartRef.current || data.length === 0) return;
    
    // Prepare data for Chart.js
    const chartLabels = data.map(item => item.category);
    const chartValues = data.map(item => item.amount);
    const chartColors = data.map(item => item.color);
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: chartColors,
            borderColor: 'white',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '65%',
      },
    });
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ExpenseChart;