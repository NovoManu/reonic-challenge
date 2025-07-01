import React, { useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { InputSection } from '../components/InputSection';
import { ChartSection } from '../components/ChartSection';

interface SimulationInput {
  numChargePoints: number;
  arrivalProbabilityMult: number;
  carConsumption: number;
  chargingPower: number;
}

interface SimulationResult {
  id: string;
  chargingPower: number;
  actualMaxPower: number;
  totalEnergyCharged: number;
  chargingEventsPerYear: number;
  chargingEventsPerMonth: number;
  chargingEventsPerDay: number;
  chargingValues: {
    values: number[];
  };
}

const Dashboard: React.FC = () => {
  // Simulation result states
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Run simulation handler
  const runSimulation = async (input: SimulationInput) => {
    setLoading(true);
    setError(null);
    setSimResult(null);
    try {
      const inputRes = await fetch('http://localhost:4000/inputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!inputRes.ok) throw new Error('Failed to create input');
      const simRes = await fetch(`http://localhost:4000/simulate/`, { method: 'POST' });
      if (!simRes.ok) throw new Error('Failed to run simulation');
      const simData: SimulationResult = await simRes.json();
      setSimResult(simData);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-8">
      <InputSection
        onRunSimulation={runSimulation}
        loading={loading}
        error={error}
      />

      {/* Output Section with charts */}
      <section className="bg-white rounded shadow p-6 space-y-6">
        <h2 className="text-xl font-bold mb-2">Output Visualization</h2>
        <ChartSection simResult={simResult} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            value={simResult?.totalEnergyCharged || 0}
            label="Total Energy Charged (kWh)"
          />
          <StatsCard
            value={simResult?.chargingEventsPerYear || 0}
            label="Charging Events/Year"
          />
          <StatsCard
            value={simResult?.chargingEventsPerMonth || 0}
            label="Charging Events/Month"
          />
          <StatsCard
            value={simResult?.chargingEventsPerDay || 0}
            label="Charging Events/Day"
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 