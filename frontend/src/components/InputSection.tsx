import React, { useState } from 'react';
import trashIcon from '../assets/trash.png';

interface ChargePointType {
  count: number;
  power: number;
}

interface InputSectionProps {
  onRunSimulation: (input: {
    numChargePoints: number;
    arrivalProbabilityMult: number;
    carConsumption: number;
    chargingPower: number;
  }) => void;
  loading: boolean;
  error: string | null;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onRunSimulation,
  loading,
  error,
}) => {
  const [chargePoints, setChargePoints] = useState<ChargePointType[]>([
    { count: 20, power: 11 },
  ]);
  const [arrivalMultiplier, setArrivalMultiplier] = useState(100);
  const [consumption, setConsumption] = useState(18);

  const handleChargePointChange = (idx: number, field: 'count' | 'power', value: number) => {
    setChargePoints(cp => cp.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const addChargePointType = () => {
    setChargePoints(cp => [...cp, { count: 1, power: 11 }]);
  };

  const removeChargePointType = (idx: number) => {
    setChargePoints(cp => cp.length > 1 ? cp.filter((_, i) => i !== idx) : cp);
  };

  // Helper to flatten chargePoints for backend
  const getBackendInput = () => {
    const numChargePoints = chargePoints.reduce((sum, cp) => sum + cp.count, 0);
    const chargingPower = chargePoints[0]?.power || 11;
    return {
      numChargePoints,
      arrivalProbabilityMult: arrivalMultiplier,
      carConsumption: consumption,
      chargingPower,
    };
  };

  return (
    <section className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-xl font-bold mb-2">Input Parameters</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Charge Point Types</label>
          <div className="space-y-2">
            {chargePoints.map((cp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  className="border border-gray-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={cp.count}
                  onChange={e => handleChargePointChange(idx, 'count', Number(e.target.value))}
                />
                <span className="text-gray-600">x</span>
                <input
                  type="number"
                  min={1}
                  className="border border-gray-300 rounded px-2 py-1 w-20 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={cp.power}
                  onChange={e => handleChargePointChange(idx, 'power', Number(e.target.value))}
                />
                <span className="text-gray-600">kW</span>
                {chargePoints.length > 1 && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => removeChargePointType(idx)}
                  >
                    <img src={trashIcon} alt="Remove" className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              className="mt-2 px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors"
              onClick={addChargePointType}
            >
              Add Type
            </button>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Arrival Probability Multiplier (%)</label>
          <input
            type="range"
            min={20}
            max={200}
            value={arrivalMultiplier}
            onChange={e => setArrivalMultiplier(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
          />
          <div className="text-sm text-gray-700">{arrivalMultiplier}%</div>
        </div>
        <div>
          <label className="block font-medium mb-1">Car Consumption (kWh)</label>
          <input
            type="number"
            min={1}
            className="border border-gray-300 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={consumption}
            onChange={e => setConsumption(Number(e.target.value))}
          />
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
        onClick={() => onRunSimulation(getBackendInput())}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Simulation'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </section>
  );
};
