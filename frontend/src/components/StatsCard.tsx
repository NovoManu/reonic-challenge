import React from 'react';

interface StatsCardProps {
  value: number;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <div 
      className="bg-teal-100 rounded p-4 text-center shadow-sm transition-all hover:shadow-md" 
      role="region" 
      aria-label={`${label}: ${value}`}
    >
      <div className="text-2xl font-bold text-teal-800">{value}</div>
      <div className="text-xs text-gray-700">{label}</div>
    </div>
  );
};
