'use client';

import { useEffect, useState } from 'react';
import WeightEvaluationService, {
  LoadWeightAssessment,
  TruckAxleConfiguration,
} from '../services/WeightEvaluationService';

interface WeightComplianceValidatorProps {
  cargoWeight: number;
  routeStates: string[];
  selectedTruckConfig?: TruckAxleConfiguration;
  onComplianceUpdate?: (compliance: LoadWeightAssessment) => void;
}

export default function WeightComplianceValidator({
  cargoWeight,
  routeStates,
  selectedTruckConfig,
  onComplianceUpdate,
}: WeightComplianceValidatorProps) {
  const [weightService] = useState(() => new WeightEvaluationService());
  const [compliance, setCompliance] = useState<LoadWeightAssessment | null>(
    null
  );
  const [availableConfigs, setAvailableConfigs] = useState<
    TruckAxleConfiguration[]
  >([]);
  const [selectedConfig, setSelectedConfig] =
    useState<TruckAxleConfiguration | null>(selectedTruckConfig || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const configs = weightService.getStandardConfigurations();
    setAvailableConfigs(configs);

    if (!selectedConfig && configs.length > 0) {
      // Default to 5-axle standard
      const standardConfig =
        configs.find((c) => c.id === 'tractor-semitrailer-5axle') || configs[0];
      setSelectedConfig(standardConfig);
    }
  }, [selectedConfig, weightService]);

  useEffect(() => {
    if (cargoWeight > 0 && routeStates.length > 0) {
      evaluateWeight();
    }
  }, [cargoWeight, routeStates, selectedConfig]);

  const evaluateWeight = async () => {
    if (!cargoWeight || cargoWeight <= 0) return;

    setIsLoading(true);
    try {
      const assessment = weightService.assessLoadWeight(
        `load-${Date.now()}`,
        cargoWeight,
        routeStates
      );

      setCompliance(assessment);
      onComplianceUpdate?.(assessment);
    } catch (error) {
      console.error('Weight evaluation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-red-500 bg-red-50';
      case 'MEDIUM':
        return 'text-orange-500 bg-orange-50';
      case 'LOW':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'SAFE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'CAUTION':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'OVERWEIGHT':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!cargoWeight || cargoWeight <= 0) {
    return (
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <p className='text-sm text-gray-600'>
          Enter cargo weight to evaluate DOT compliance
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '15px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        padding: '20px',
        color: 'white',
      }}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-white'>
          ⚖️ Weight Compliance Evaluation
        </h3>
        {isLoading && (
          <div className='flex items-center space-x-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
            <span className='text-sm'>Evaluating...</span>
          </div>
        )}
      </div>

      {/* Truck Configuration Selector */}
      <div className='mb-4'>
        <label className='mb-2 block text-sm font-medium text-gray-300'>
          Truck Configuration
        </label>
        <select
          value={selectedConfig?.id || ''}
          onChange={(e) => {
            const config = availableConfigs.find(
              (c) => c.id === e.target.value
            );
            setSelectedConfig(config || null);
          }}
          className='w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white'
        >
          {availableConfigs.map((config) => (
            <option key={config.id} value={config.id} className='bg-gray-800'>
              {config.name} - {config.totalAxles} axles (Max:{' '}
              {config.maxGrossWeight.toLocaleString()} lbs)
            </option>
          ))}
        </select>
      </div>

      {/* Weight Summary */}
      <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg bg-black/20 p-3'>
          <div className='text-sm text-gray-300'>Cargo Weight</div>
          <div className='text-lg font-bold text-white'>
            {cargoWeight.toLocaleString()} lbs
          </div>
        </div>
        <div className='rounded-lg bg-black/20 p-3'>
          <div className='text-sm text-gray-300'>Estimated Total Weight</div>
          <div className='text-lg font-bold text-white'>
            {(cargoWeight + 15000 + 14000).toLocaleString()} lbs
          </div>
          <div className='text-xs text-gray-400'>Cargo + Tractor + Trailer</div>
        </div>
        <div className='rounded-lg bg-black/20 p-3'>
          <div className='text-sm text-gray-300'>Legal Limit</div>
          <div className='text-lg font-bold text-white'>
            {selectedConfig?.maxGrossWeight.toLocaleString() || 'N/A'} lbs
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      {compliance && (
        <div className='space-y-4'>
          {/* Safety Rating */}
          <div
            className={`rounded-lg border-2 p-3 ${getSafetyColor(compliance.weightCompliance.safetyRating)}`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <span className='font-semibold'>
                  Safety Rating: {compliance.weightCompliance.safetyRating}
                </span>
                {compliance.weightCompliance.safetyRating === 'SAFE' && (
                  <span>✅</span>
                )}
                {compliance.weightCompliance.safetyRating === 'CAUTION' && (
                  <span>⚠️</span>
                )}
                {compliance.weightCompliance.safetyRating === 'OVERWEIGHT' && (
                  <span>🚫</span>
                )}
              </div>
              <div className='text-sm'>
                {compliance.weightCompliance.isCompliant
                  ? 'Compliant'
                  : 'Non-Compliant'}
              </div>
            </div>
          </div>

          {/* Violations */}
          {compliance.weightCompliance.violations.length > 0 && (
            <div>
              <h4 className='mb-2 font-medium text-red-400'>
                ⚠️ Weight Violations (
                {compliance.weightCompliance.violations.length})
              </h4>
              <div className='space-y-2'>
                {compliance.weightCompliance.violations.map(
                  (violation, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${getSeverityColor(violation.severity)}`}
                    >
                      <div className='flex items-start justify-between'>
                        <div>
                          <div className='font-medium'>{violation.type}</div>
                          <div className='text-sm'>{violation.description}</div>
                          <div className='mt-1 text-xs'>
                            Current: {violation.currentWeight.toLocaleString()}{' '}
                            lbs | Max: {violation.maxAllowed.toLocaleString()}{' '}
                            lbs | Over:{' '}
                            {violation.excessWeight.toLocaleString()} lbs
                          </div>
                        </div>
                        <div className='rounded bg-white/20 px-2 py-1 text-xs'>
                          {violation.severity}
                        </div>
                      </div>
                      {violation.fineRange && (
                        <div className='mt-2 text-xs text-gray-400'>
                          Potential Fine: {violation.fineRange}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Required Permits */}
          {compliance.weightCompliance.requiredPermits.length > 0 && (
            <div>
              <h4 className='mb-2 font-medium text-orange-400'>
                📋 Required Permits
              </h4>
              <div className='rounded-lg border border-orange-200 bg-orange-50 p-3'>
                <ul className='space-y-1 text-sm text-orange-800'>
                  {compliance.weightCompliance.requiredPermits.map(
                    (permit, index) => (
                      <li key={index} className='flex items-center space-x-2'>
                        <span>•</span>
                        <span>{permit}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {compliance.weightCompliance.recommendations.length > 0 && (
            <div>
              <h4 className='mb-2 font-medium text-blue-400'>
                💡 Recommendations
              </h4>
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                <ul className='space-y-1 text-sm text-blue-800'>
                  {compliance.weightCompliance.recommendations.map(
                    (rec, index) => (
                      <li key={index} className='flex items-center space-x-2'>
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Suitable Truck Configurations */}
          {compliance.recommendedTruckConfigs.length > 0 && (
            <div>
              <h4 className='mb-2 font-medium text-green-400'>
                ✅ Recommended Truck Configurations (
                {compliance.recommendedTruckConfigs.length})
              </h4>
              <div className='grid gap-2'>
                {compliance.recommendedTruckConfigs
                  .slice(0, 3)
                  .map((config, index) => (
                    <div
                      key={index}
                      className='rounded-lg border border-green-200 bg-green-50 p-3'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <div className='font-medium text-green-800'>
                            {config.name}
                          </div>
                          <div className='text-sm text-green-600'>
                            {config.totalAxles} axles • Max:{' '}
                            {config.maxGrossWeight.toLocaleString()} lbs
                          </div>
                        </div>
                        <div className='text-xs text-green-600'>
                          {Math.round(
                            ((cargoWeight + 29000) / config.maxGrossWeight) *
                              100
                          )}
                          % utilized
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* State-Specific Information */}
          {compliance.weightCompliance.stateSpecificLimits.length > 0 && (
            <div>
              <h4 className='mb-2 font-medium text-purple-400'>
                🗺️ State-Specific Limits
              </h4>
              <div className='grid gap-2'>
                {compliance.weightCompliance.stateSpecificLimits.map(
                  (stateLimit, index) => (
                    <div
                      key={index}
                      className='rounded-lg border border-purple-200 bg-purple-50 p-3'
                    >
                      <div className='font-medium text-purple-800'>
                        {stateLimit.state}
                      </div>
                      <div className='text-sm text-purple-600'>
                        Max Gross: {stateLimit.maxGrossWeight.toLocaleString()}{' '}
                        lbs
                      </div>
                      {stateLimit.specialRestrictions && (
                        <div className='mt-1 text-xs text-purple-500'>
                          {stateLimit.specialRestrictions.join(', ')}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


