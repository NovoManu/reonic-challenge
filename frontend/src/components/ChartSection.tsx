import React from 'react';
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
  const barData = {
    labels: ['Power Comparison'],
    datasets: [
      {
        label: 'Theoretical Max Power (kW)',
        data: [simResult?.theoreticalMaxPower || 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Actual Max Power (kW)',
        data: [simResult?.actualMaxPower || 0],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
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
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-4 h-80">
        <Bar data={barData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { position: 'top' as const }, 
            title: { display: true, text: 'Power Distribution per Chargepoint' }
          },
          scales: { y: { beginAtZero: true, title: { display: true, text: 'Power (kW)' } } },
        }} />
      </div>
      <div className="bg-gray-50 rounded-lg p-4 h-80">
        <div className="mb-2 text-sm text-gray-500 text-center">{exemplaryDate}</div>
        <Line data={lineData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false }, 
            title: { display: true, text: 'Daily Charging Pattern' }
          },
          scales: { 
            y: { beginAtZero: true, title: { display: true, text: 'Power (kW)' } },
            x: { title: { display: true, text: 'Time of Day' } }
          },
        }} />
      </div>
    </div>
  );
};
