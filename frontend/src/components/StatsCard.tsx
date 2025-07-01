import React from 'react';

interface StatsCardProps {
  value: number;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <div className="bg-blue-100 rounded p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-700">{label}</div>
    </div>
  );
};
