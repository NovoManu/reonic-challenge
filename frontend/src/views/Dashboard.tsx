import React, { useState, useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { InputSection } from '../components/InputSection';
import { ChartSection } from '../components/ChartSection';
import type { SimulationInput, SimulationResult } from '../types';
import { api } from '../api';

const Dashboard: React.FC = () => {
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiErrorDetails, setApiErrorDetails] = useState<string | null>(null);

  // Reset error details when error is cleared
  useEffect(() => {
    if (!error) {
      setApiErrorDetails(null);
    }
  }, [error]);

  const runSimulation = async (input: SimulationInput) => {
    setLoading(true);
    setError(null);
    setApiErrorDetails(null);
    setSimResult(null);
    
    try {
      // First try to create the input
      try {
        await api.inputsService.create(input);
      } catch (inputErr) {
        const error = inputErr as Error;
        throw new Error(`Failed to save input parameters: ${error.message}`);
      }
      
      // Then try to run the simulation
      try {
        const simRes = await api.simulationService.simulate(input);
        setSimResult(simRes);
      } catch (simErr) {
        const error = simErr as Error;
        throw new Error(`Simulation failed: ${error.message}`);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Unknown error');
      
      // Extract more detailed error information if available
      if (error instanceof Response) {
        error.json().then(data => {
          setApiErrorDetails(data.detail || data.message || JSON.stringify(data));
        }).catch(() => {
          setApiErrorDetails(`Status: ${error.status} ${error.statusText}`);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const hasResults = simResult !== null;

  return (
    <div className="space-y-8">
      <InputSection
        onRunSimulation={runSimulation}
        loading={loading}
        error={error}
      />
      
      {apiErrorDetails && (
        <div 
          className="bg-red-50 border border-red-200 text-red-800 rounded p-4 text-sm" 
          role="alert"
          aria-live="polite"
        >
          <h3 className="font-bold">Error Details</h3>
          <p>{apiErrorDetails}</p>
        </div>
      )}
      
      <section 
        className={`bg-white rounded shadow p-4 md:p-6 space-y-4 md:space-y-6 ${!hasResults ? 'opacity-50' : ''}`}
        aria-labelledby="simulation-results-heading"
        aria-busy={loading}
      >
        <h2 id="simulation-results-heading" className="text-xl font-bold mb-2">Simulation Results</h2>
        
        {!hasResults && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>Run a simulation to see results</p>
          </div>
        )}
        
        {(hasResults || loading) && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatsCard 
                value={Math.round(simResult?.totalEnergyKWh || 0)}
                label="Total Energy (kWh)"
              />
              <StatsCard 
                value={Math.round((simResult?.concurrencyFactor || 0) * 100)}
                label="Concurrency Factor (%)"
              />
              <StatsCard 
                value={simResult?.chargingEventsPerDay || 0}
                label={`Daily Events (${simResult?.chargingEventsPerYear?.toLocaleString() || 0}/year)`}
              />
              <StatsCard 
                value={simResult?.chargingEventsPerMonth || 0}
                label={`Monthly Events (${simResult?.chargingEventsPerWeek || 0}/week)`}
              />
            </div>
            
            <h2 className="text-xl font-bold mb-2" id="charging-patterns-heading">Charging Patterns</h2>
            <div aria-labelledby="charging-patterns-heading">
              <ChartSection simResult={simResult} />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard; 