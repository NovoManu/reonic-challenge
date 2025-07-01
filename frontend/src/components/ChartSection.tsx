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

interface SimulationResult {
  chargingPower: number;
  actualMaxPower: number;
  chargingValues: {
    values: number[];
  };
}

interface ChartSectionProps {
  simResult: SimulationResult | null;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ simResult }) => {
  const barData = {
    labels: [simResult ? `${simResult.chargingPower}kW` : 'Charging Power'],
    datasets: [
      {
        label: 'Charging Value (kW)',
        data: [simResult?.actualMaxPower || 0],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  const lineData = simResult ? {
    labels: Array.from({ length: simResult.chargingValues?.values?.length || 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Charging Power (kW)',
        data: simResult.chargingValues?.values?.slice(0, 24) || [],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  } : {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Charging Power (kW)',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bar chart for charging values per chargepoint */}
      <div className="bg-gray-50 rounded p-4 h-64 flex items-center justify-center">
        <Bar data={barData} options={{
          responsive: true,
          plugins: { legend: { display: false }, title: { display: true, text: 'Charging Values per Chargepoint' } },
          scales: { y: { beginAtZero: true } },
        }} />
      </div>
      {/* Line chart for exemplary day */}
      <div className="bg-gray-50 rounded p-4 h-64 flex items-center justify-center">
        <Line data={lineData} options={{
          responsive: true,
          plugins: { legend: { display: false }, title: { display: true, text: 'Exemplary Day (kW over 24h)' } },
          scales: { y: { beginAtZero: true } },
        }} />
      </div>
    </div>
  );
};
