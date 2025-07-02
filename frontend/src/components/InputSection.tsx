import React, { useState } from 'react';
import type { FormEvent } from 'react';
import trashIcon from '../assets/trash.png';

interface ChargePointType {
  count: number;
  power: number;
  id: string;
}

interface ValidationErrors {
  chargePoints?: string[];
  consumption?: string;
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
    { count: 20, power: 11, id: 'cp-' + Date.now() },
  ]);
  const [arrivalMultiplier, setArrivalMultiplier] = useState(100);
  const [consumption, setConsumption] = useState(18);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChargePointChange = (idx: number, field: 'count' | 'power', value: number) => {
    setChargePoints(cp => cp.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    validateField('chargePoints');
  };

  const addChargePointType = () => {
    setChargePoints(cp => [...cp, { count: 1, power: 11, id: 'cp-' + Date.now() }]);
  };

  const removeChargePointType = (idx: number) => {
    setChargePoints(cp => cp.length > 1 ? cp.filter((_, i) => i !== idx) : cp);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors: ValidationErrors = { ...validationErrors };
    
    if (field === 'chargePoints') {
      const cpErrors: string[] = [];
      chargePoints.forEach((cp, idx) => {
        if (cp.count <= 0) cpErrors[idx] = 'Count must be greater than 0';
        if (cp.power <= 0) cpErrors[idx] = 'Power must be greater than 0';
      });
      if (cpErrors.length > 0) {
        newErrors.chargePoints = cpErrors;
      } else {
        delete newErrors.chargePoints;
      }
    }
    
    if (field === 'consumption') {
      if (consumption <= 0) {
        newErrors.consumption = 'Consumption must be greater than 0';
      } else {
        delete newErrors.consumption;
      }
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const isChargePointsValid = validateField('chargePoints');
    const isConsumptionValid = validateField('consumption');
    return isChargePointsValid && isConsumptionValid;
  };

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      chargePoints: true,
      consumption: true
    });
    
    if (validateForm()) {
      onRunSimulation(getBackendInput());
    }
  };

  return (
    <section className="bg-white rounded shadow p-4 md:p-6 space-y-4" aria-labelledby="input-parameters-heading">
      <h2 id="input-parameters-heading" className="text-xl font-bold mb-2">Input Parameters</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <fieldset>
            <legend className="block font-medium mb-1">Charge Point Types</legend>
            <div className="space-y-2">
              {chargePoints.map((cp, idx) => (
                <div key={cp.id} className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-col">
                    <label htmlFor={`count-${cp.id}`} className="sr-only">Count</label>
                    <input
                      id={`count-${cp.id}`}
                      type="number"
                      min={1}
                      className={`border ${validationErrors.chargePoints?.[idx] ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 w-20 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      value={cp.count}
                      onChange={e => handleChargePointChange(idx, 'count', Number(e.target.value))}
                      onBlur={() => handleBlur('chargePoints')}
                      aria-invalid={!!validationErrors.chargePoints?.[idx]}
                      aria-describedby={validationErrors.chargePoints?.[idx] ? `error-count-${cp.id}` : undefined}
                    />
                    {validationErrors.chargePoints?.[idx] && touched.chargePoints && (
                      <span id={`error-count-${cp.id}`} className="text-xs text-red-500">{validationErrors.chargePoints[idx]}</span>
                    )}
                  </div>
                  <span className="text-gray-600" aria-hidden="true">x</span>
                  <div className="flex flex-col">
                    <label htmlFor={`power-${cp.id}`} className="sr-only">Power (kW)</label>
                    <input
                      id={`power-${cp.id}`}
                      type="number"
                      min={1}
                      className={`border ${validationErrors.chargePoints?.[idx] ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 w-20 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      value={cp.power}
                      onChange={e => handleChargePointChange(idx, 'power', Number(e.target.value))}
                      onBlur={() => handleBlur('chargePoints')}
                      aria-invalid={!!validationErrors.chargePoints?.[idx]}
                      aria-describedby={validationErrors.chargePoints?.[idx] ? `error-power-${cp.id}` : undefined}
                    />
                  </div>
                  <span className="text-gray-600">kW</span>
                  {chargePoints.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => removeChargePointType(idx)}
                      aria-label={`Remove charge point type ${idx + 1}`}
                    >
                      <img src={trashIcon} alt="" className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                onClick={addChargePointType}
                aria-label="Add another charge point type"
              >
                Add Type
              </button>
            </div>
          </fieldset>
        </div>
        <div>
          <label htmlFor="arrival-multiplier" className="block font-medium mb-1">Arrival Probability Multiplier (%)</label>
          <div className="flex items-center gap-2">
            <input
              id="arrival-multiplier"
              type="range"
              min={20}
              max={200}
              value={arrivalMultiplier}
              onChange={e => setArrivalMultiplier(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
              aria-valuemin={20}
              aria-valuemax={200}
              aria-valuenow={arrivalMultiplier}
            />
            <div className="text-sm text-gray-700 w-12 text-right">{arrivalMultiplier}%</div>
          </div>
        </div>
        <div>
          <label htmlFor="consumption" className="block font-medium mb-1">Car Consumption (kWh)</label>
          <div className="flex flex-col">
            <input
              id="consumption"
              type="number"
              min={1}
              className={`border ${validationErrors.consumption && touched.consumption ? 'border-red-500' : 'border-gray-300'} rounded px-2 py-1 w-32 focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              value={consumption}
              onChange={e => setConsumption(Number(e.target.value))}
              onBlur={() => handleBlur('consumption')}
              aria-invalid={!!validationErrors.consumption && touched.consumption}
              aria-describedby={validationErrors.consumption && touched.consumption ? 'error-consumption' : undefined}
            />
            {validationErrors.consumption && touched.consumption && (
              <span id="error-consumption" className="text-xs text-red-500">{validationErrors.consumption}</span>
            )}
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
          {error && (
            <div className="text-red-600 mt-2" role="alert">{error}</div>
          )}
        </div>
      </form>
    </section>
  );
};
