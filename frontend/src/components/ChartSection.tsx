import React, { useRef, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale
);

import type { SimulationResult } from '../types';

interface ChartSectionProps {
  simResult: SimulationResult | null;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ simResult }) => {
  const barChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (simResult && barChartRef.current && lineChartRef.current) {
      const barDesc = document.createElement('p');
      barDesc.id = 'bar-chart-desc';
      barDesc.className = 'sr-only';
      barDesc.textContent = `Theoretical max power: ${simResult.theoreticalMaxPower} kW. Actual max power: ${simResult.actualMaxPower} kW.`;
      
      const lineDesc = document.createElement('p');
      lineDesc.id = 'line-chart-desc';
      lineDesc.className = 'sr-only';
      lineDesc.textContent = `Daily charging pattern over 24 hours with peak power of ${Math.max(...simResult.chargingValues)} kW.`;
      
      // Replace existing descriptions if they exist
      const existingBarDesc = document.getElementById('bar-chart-desc');
      const existingLineDesc = document.getElementById('line-chart-desc');
      
      if (existingBarDesc) {
        existingBarDesc.textContent = barDesc.textContent;
      } else {
        barChartRef.current.appendChild(barDesc);
      }
      
      if (existingLineDesc) {
        existingLineDesc.textContent = lineDesc.textContent;
      } else {
        lineChartRef.current.appendChild(lineDesc);
      }
    }
  }, [simResult]);

  const barData = {
    labels: ['Power Comparison'],
    datasets: [
      {
        label: 'Theoretical Max Power (kW)',
        data: [simResult?.theoreticalMaxPower || 0],
        backgroundColor: 'rgba(20, 184, 166, 0.6)',
      },
      {
        label: 'Actual Max Power (kW)',
        data: [simResult?.actualMaxPower || 0],
        backgroundColor: 'rgba(13, 148, 136, 0.6)',
      },
    ],
  };

  const values = Array.isArray(simResult?.chargingValues) 
    ? simResult.chargingValues 
    : [];
    
  const lineData = {
    labels: Array.from({ length: values.length || 24 }, (_, i) => {
      const hours = Math.floor((24 * i) / (values.length || 24));
      return `${hours.toString().padStart(2, '0')}:00`;
    }),
    datasets: [
      {
        label: 'Charging Power (kW)',
        data: values.length > 0 ? values : Array.from({ length: 24 }, () => 0),
        borderColor: 'rgba(15, 118, 110, 1)',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const exemplaryDate = simResult?.exemplaryDay 
    ? new Date(simResult.exemplaryDay).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Not available';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div 
        ref={barChartRef}
        className="bg-gray-50 rounded-lg p-3 md:p-4 h-64 md:h-80 shadow-sm"
        role="region"
        aria-label="Power distribution chart"
      >
        <Bar 
          data={barData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                position: 'top' as const,
                labels: {
                  boxWidth: 12,
                  padding: 15,
                  font: {
                    size: 11
                  }
                }
              }, 
              title: { 
                display: true, 
                text: 'Power Distribution per Chargepoint',
                font: {
                  size: 14
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y} kW`;
                  }
                }
              }
            },
            scales: { 
              y: { 
                beginAtZero: true, 
                title: { 
                  display: true, 
                  text: 'Power (kW)',
                  font: {
                    size: 12
                  }
                } 
              } 
            },
          }} 
          aria-describedby="bar-chart-desc"
        />
      </div>
      
      <div 
        ref={lineChartRef}
        className="bg-gray-50 rounded-lg p-3 md:p-4 h-64 md:h-80 shadow-sm"
        role="region"
        aria-label="Daily charging pattern chart"
      >
        <div className="mb-2 text-sm text-gray-500 text-center" aria-live="polite">{exemplaryDate}</div>
        <Line 
          data={lineData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false }, 
              title: { 
                display: true, 
                text: 'Daily Charging Pattern',
                font: {
                  size: 14
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Power: ${context.parsed.y.toFixed(1)} kW`;
                  }
                }
              }
            },
            scales: { 
              y: { 
                beginAtZero: true, 
                title: { 
                  display: true, 
                  text: 'Power (kW)',
                  font: {
                    size: 12
                  }
                } 
              },
              x: { 
                title: { 
                  display: true, 
                  text: 'Time of Day',
                  font: {
                    size: 12
                  }
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 12
                }
              }
            },
          }}
          aria-describedby="line-chart-desc"
        />
      </div>
    </div>
  );
};
