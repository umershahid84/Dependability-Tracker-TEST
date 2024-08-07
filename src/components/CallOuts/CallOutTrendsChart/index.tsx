import { useEffect, useRef } from 'react';
import { AdminDashboardData } from '../../../lib/apiController/dashboard';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function CallOutTrendsChart({
  callOutTrends
}: Readonly<{ callOutTrends: AdminDashboardData['callOutTrends'] }>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null); // Using a ref to store the chart instance

  useEffect(() => {
    const createChart = async () => {
      const { Chart, registerables } = await import('chart.js/auto');
      Chart.register(...registerables);

      const buildMonthLabels = (months: string[]) => {
        return months.map(month => {
          const [year, _month] = month.split('-');
          return `${_month} ${year}`;
        });
      };

      const sortedByMonthArray = callOutTrends?.sort((a, b) => {
        if (a.year === b.year) {
          return months.indexOf(a.month) - months.indexOf(b.month);
        }
        return parseInt(a.year) - parseInt(b.year);
      });

      if (callOutTrends) {
        if (chartRef.current) {
          // update the chart data
          chartRef.current.data.labels = buildMonthLabels(
            sortedByMonthArray?.map(month => `${month.year}-${month.month}`) ?? []
          );
          chartRef.current.data.datasets[0].data = callOutTrends.map(month => month.count);
          chartRef.current.update();
          return;
        }

        chartRef.current = new Chart(canvasRef.current as HTMLCanvasElement, {
          type: 'line',
          data: {
            labels: buildMonthLabels(
              sortedByMonthArray?.map(month => `${month.year}-${month.month}`) ?? []
            ),
            datasets: [
              {
                label: 'CallOuts',
                data: callOutTrends.map(month => month.count),
                backgroundColor: 'rgba(74, 202, 0, 0.2)',
                borderColor: 'rgba(74, 202, 0, 1)',
                borderWidth: 1.5,

              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#b0b0b0' // Color for Y-axis labels
                },
                grid: {
                  color: '#78909C' // Color for Y-axis grid lines
                }
              },
              x: {
                ticks: {
                  color: '#b0b0b0' // Color for X-axis labels
                },
                grid: {
                  color: '#78909C' // Color for X-axis grid lines
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#b0b0b0' // Color for legend text
                }
              }
            }
          }
        });
      }
    };

    createChart();
  }, [callOutTrends]);

  return <canvas ref={canvasRef}></canvas>;
}
