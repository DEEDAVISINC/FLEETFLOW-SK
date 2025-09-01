'use client';

import { useState } from 'react';
import WeightComplianceValidator from '../components/WeightComplianceValidator';
import WeightEvaluationService, {
  LoadWeightAssessment,
} from '../services/WeightEvaluationService';

/**
 * Test Page for Weight Compliance System
 * Tests axle-based weight evaluation and DOT compliance validation
 */

export default function TestWeightCompliance() {
  const [cargoWeight, setCargoWeight] = useState(45000); // 45,000 lbs cargo
  const [routeStates, setRouteStates] = useState(['CA', 'TX', 'FL']);
  const [compliance, setCompliance] = useState<LoadWeightAssessment | null>(
    null
  );
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const [weightService] = useState(() => new WeightEvaluationService());

  // Test scenarios
  const testScenarios = [
    {
      name: 'Standard Legal Load',
      cargoWeight: 34000,
      states: ['FEDERAL'],
      expectedResult: 'SAFE',
    },
    {
      name: 'Heavy Load - Permits Required',
      cargoWeight: 55000,
      states: ['TX'],
      expectedResult: 'CAUTION',
    },
    {
      name: 'Overweight - Critical Violation',
      cargoWeight: 75000,
      states: ['CA'],
      expectedResult: 'OVERWEIGHT',
    },
    {
      name: 'Multi-State Route',
      cargoWeight: 42000,
      states: ['CA', 'AZ', 'TX'],
      expectedResult: 'SAFE',
    },
    {
      name: 'Michigan Heavy Haul',
      cargoWeight: 65000,
      states: ['MI'],
      expectedResult: 'SAFE',
    },
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const results = [];

    for (const scenario of testScenarios) {
      try {
        console.info(`\n🧪 Testing: ${scenario.name}`);

        const assessment = weightService.assessLoadWeight(
          `test-${scenario.name}`,
          scenario.cargoWeight,
          scenario.states
        );

        const passed =
          assessment.weightCompliance.safetyRating === scenario.expectedResult;

        results.push({
          ...scenario,
          actualResult: assessment.weightCompliance.safetyRating,
          passed,
          violations: assessment.weightCompliance.violations.length,
          permits: assessment.weightCompliance.requiredPermits.length,
          recommendations: assessment.weightCompliance.recommendations.length,
          details: assessment,
        });

        console.info(
          `   Expected: ${scenario.expectedResult} | Actual: ${assessment.weightCompliance.safetyRating} | ${passed ? '✅ PASS' : '❌ FAIL'}`
        );
      } catch (error) {
        console.error(`   Error in test ${scenario.name}:`, error);
        results.push({
          ...scenario,
          actualResult: 'ERROR',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);

    const passedTests = results.filter((r) => r.passed).length;
    console.info(
      `\n📊 Test Results: ${passedTests}/${results.length} tests passed`
    );
  };

  const testTruckConfigurations = () => {
    const configs = weightService.getStandardConfigurations();
    console.info('\n🚛 Available Truck Configurations:');

    configs.forEach((config) => {
      console.info(`\n${config.name}:`);
      console.info(
        `   • ${config.totalAxles} axles (${config.steerAxles}S + ${config.driveAxles}D + ${config.trailerAxles}T)`
      );
      console.info(
        `   • Max Gross Weight: ${config.maxGrossWeight.toLocaleString()} lbs`
      );
      console.info(
        `   • Steer Axle Limit: ${config.maxSteerAxleWeight.toLocaleString()} lbs`
      );
      console.info(
        `   • Drive Axle Limit: ${config.maxDriveAxleWeight.toLocaleString()} lbs`
      );
      console.info(
        `   • Trailer Axle Limit: ${config.maxTrailerAxleWeight.toLocaleString()} lbs`
      );
      console.info(
        `   • Bridge Formula Required: ${config.bridgeFormulaRequired ? 'Yes' : 'No'}`
      );
    });
  };

  const testStateLimits = () => {
    const states = ['CA', 'TX', 'FL', 'MI', 'NY'];
    const stateLimits = weightService.getStateWeightLimits(states);

    console.info('\n🗺️ State Weight Limits:');
    stateLimits.forEach((state) => {
      console.info(`\n${state.state}:`);
      console.info(
        `   • Max Gross: ${state.maxGrossWeight.toLocaleString()} lbs`
      );
      console.info(
        `   • Max Steer Axle: ${state.maxSteerAxle.toLocaleString()} lbs`
      );
      console.info(
        `   • Max Drive Axle: ${state.maxDriveAxle.toLocaleString()} lbs`
      );
      console.info(
        `   • Max Trailer Axle: ${state.maxTrailerAxle.toLocaleString()} lbs`
      );
      if (state.specialRestrictions) {
        console.info(
          `   • Restrictions: ${state.specialRestrictions.join(', ')}`
        );
      }
    });
  };

  return (
    <div
      className='min-h-screen'
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div className='mx-auto mb-8 max-w-7xl'>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            padding: '30px',
            textAlign: 'center',
          }}
        >
          <h1 className='mb-4 text-3xl font-bold text-white'>
            ⚖️ Weight Compliance System Test
          </h1>
          <p className='text-lg text-gray-200'>
            DOT Axle-Based Weight Evaluation & Compliance Validation
          </p>
        </div>
      </div>

      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 xl:grid-cols-2'>
        {/* Interactive Weight Validator */}
        <div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <h2 className='mb-4 text-xl font-bold text-white'>
              Interactive Weight Validation
            </h2>

            {/* Controls */}
            <div className='mb-6 space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Cargo Weight (lbs)
                </label>
                <input
                  type='number'
                  value={cargoWeight}
                  onChange={(e) =>
                    setCargoWeight(parseInt(e.target.value) || 0)
                  }
                  className='w-full rounded-lg border border-white/20 bg-black/20 px-4 py-2 text-white'
                  placeholder='Enter cargo weight'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Route States (comma-separated)
                </label>
                <input
                  type='text'
                  value={routeStates.join(', ')}
                  onChange={(e) =>
                    setRouteStates(
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s)
                    )
                  }
                  className='w-full rounded-lg border border-white/20 bg-black/20 px-4 py-2 text-white'
                  placeholder='CA, TX, FL'
                />
              </div>
            </div>
          </div>

          {/* Weight Compliance Validator Component */}
          <WeightComplianceValidator
            cargoWeight={cargoWeight}
            routeStates={routeStates}
            onComplianceUpdate={setCompliance}
          />
        </div>

        {/* Test Suite */}
        <div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              padding: '20px',
            }}
          >
            <h2 className='mb-4 text-xl font-bold text-white'>
              🧪 Automated Test Suite
            </h2>

            {/* Test Control Buttons */}
            <div className='mb-6 grid grid-cols-1 gap-3'>
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className='w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-600'
              >
                {isRunning ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                    <span>Running Tests...</span>
                  </div>
                ) : (
                  '🚀 Run All Weight Tests'
                )}
              </button>

              <button
                onClick={testTruckConfigurations}
                className='w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700'
              >
                🚛 Test Truck Configurations
              </button>

              <button
                onClick={testStateLimits}
                className='w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700'
              >
                🗺️ Test State Weight Limits
              </button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div>
                <h3 className='mb-3 font-bold text-white'>
                  📊 Test Results ({testResults.filter((r) => r.passed).length}/
                  {testResults.length} passed)
                </h3>

                <div className='max-h-96 space-y-3 overflow-y-auto'>
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${
                        result.passed
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className='mb-2 flex items-start justify-between'>
                        <div>
                          <div
                            className={`font-medium ${result.passed ? 'text-green-800' : 'text-red-800'}`}
                          >
                            {result.passed ? '✅' : '❌'} {result.name}
                          </div>
                          <div className='text-sm text-gray-600'>
                            Weight: {result.cargoWeight.toLocaleString()} lbs |
                            States: {result.states.join(', ')}
                          </div>
                        </div>
                        <div
                          className={`rounded px-2 py-1 text-xs ${
                            result.actualResult === 'SAFE'
                              ? 'bg-green-200 text-green-800'
                              : result.actualResult === 'CAUTION'
                                ? 'bg-yellow-200 text-yellow-800'
                                : result.actualResult === 'OVERWEIGHT'
                                  ? 'bg-red-200 text-red-800'
                                  : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {result.actualResult}
                        </div>
                      </div>

                      <div className='text-xs text-gray-600'>
                        Expected: {result.expectedResult} | Violations:{' '}
                        {result.violations || 0} | Permits:{' '}
                        {result.permits || 0}
                      </div>

                      {result.error && (
                        <div className='mt-2 text-xs text-red-600'>
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Compliance Summary */}
            {compliance && (
              <div className='mt-6 border-t border-white/20 pt-6'>
                <h3 className='mb-3 font-bold text-white'>
                  📋 Current Load Assessment
                </h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <div className='text-gray-300'>Safety Rating</div>
                    <div
                      className={`font-medium ${
                        compliance.weightCompliance.safetyRating === 'SAFE'
                          ? 'text-green-400'
                          : compliance.weightCompliance.safetyRating ===
                              'CAUTION'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {compliance.weightCompliance.safetyRating}
                    </div>
                  </div>
                  <div>
                    <div className='text-gray-300'>Violations</div>
                    <div className='font-medium text-white'>
                      {compliance.weightCompliance.violations.length}
                    </div>
                  </div>
                  <div>
                    <div className='text-gray-300'>Required Permits</div>
                    <div className='font-medium text-white'>
                      {compliance.weightCompliance.requiredPermits.length}
                    </div>
                  </div>
                  <div>
                    <div className='text-gray-300'>Suitable Configs</div>
                    <div className='font-medium text-white'>
                      {compliance.recommendedTruckConfigs.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
