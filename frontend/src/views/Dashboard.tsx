import React, { useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { InputSection } from '../components/InputSection';
import { ChartSection } from '../components/ChartSection';
import type { SimulationInput, SimulationResult } from '../types';
import { api } from '../api';

const Dashboard: React.FC = () => {
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (input: SimulationInput) => {
    setLoading(true);
    setError(null);
    setSimResult(null);
    try {
      await api.inputsService.create(input);
      const simRes = await api.simulationService.simulate(input);
      setSimResult(simRes);
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
      <section className="bg-white rounded shadow p-6 space-y-6">
        <h2 className="text-xl font-bold mb-2">Output Visualization</h2>
        <ChartSection simResult={simResult} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            value={simResult?.totalEnergyKWh || 0}
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