'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import { SchedulingService } from '../scheduling/service';
import LoadScheduleIntegrationService from '../services/LoadScheduleIntegrationService';

/**
 * Test Component for Load-Schedule Integration
 * Tests the complete workflow from load assignment to schedule management
 */

export default function TestScheduleIntegration() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [schedulingService] = useState(() => new SchedulingService());

  const user = getCurrentUser();

  useEffect(() => {
    checkIntegrationStatus();
    loadSchedules();
  }, []);

  const checkIntegrationStatus = async () => {
    const status = await LoadScheduleIntegrationService.getIntegrationStatus();
    setIntegrationStatus(status);
  };

  const loadSchedules = async () => {
    const allSchedules = await schedulingService.getSchedules({});
    setSchedules(allSchedules.schedules || []);
  };

  const runIntegrationTest = async () => {
    setIsRunning(true);
    const results: any[] = [];

    try {
      // Test 1: Basic Integration Test
      console.log('🧪 Running Test 1: Basic Integration Test');
      const testLoad1 = {
        loadId: `TEST-LOAD-${Date.now()}`,
        loadBoardNumber: `TB${Date.now().toString().slice(-6)}`,
        driverId: 'DRV-001',
        driverName: 'Test Driver John',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        pickupDate: '2025-01-10',
        deliveryDate: '2025-01-11',
        pickupTime: '08:00',
        deliveryTime: '14:00',
        rate: 1200,
        distance: '650 mi',
        equipment: 'Dry Van',
        weight: '25,000 lbs',
        priority: 'High' as const,
        assignedBy: user?.user?.name || 'Test User',
        specialInstructions: 'Test load for integration validation',
      };

      const result1 =
        await LoadScheduleIntegrationService.integrateLoadAssignment(testLoad1);
      results.push({
        test: 'Basic Integration',
        success: result1.success,
        scheduleId: result1.scheduleId,
        conflicts: result1.conflicts,
        error: result1.error,
      });

      // Test 2: Conflict Detection Test
      console.log('🧪 Running Test 2: Conflict Detection Test');
      const testLoad2 = {
        ...testLoad1,
        loadId: `TEST-CONFLICT-${Date.now()}`,
        loadBoardNumber: `TC${Date.now().toString().slice(-6)}`,
        // Same driver and date to trigger conflict
        pickupDate: '2025-01-10',
        deliveryDate: '2025-01-10',
      };

      const result2 =
        await LoadScheduleIntegrationService.integrateLoadAssignment(testLoad2);
      results.push({
        test: 'Conflict Detection',
        success: result2.success,
        scheduleId: result2.scheduleId,
        conflicts: result2.conflicts,
        error: result2.error,
      });

      // Test 3: Driver Availability Check
      console.log('🧪 Running Test 3: Driver Availability Check');
      const availabilityCheck =
        await LoadScheduleIntegrationService.checkDriverAvailability(
          'DRV-001',
          '2025-01-12',
          '2025-01-13'
        );
      results.push({
        test: 'Driver Availability Check',
        success: true,
        available: availabilityCheck.available,
        conflicts: availabilityCheck.conflicts,
      });

      // Test 4: Multi-day Load Test
      console.log('🧪 Running Test 4: Multi-day Load Test');
      const testLoad3 = {
        ...testLoad1,
        loadId: `TEST-MULTIDAY-${Date.now()}`,
        loadBoardNumber: `TM${Date.now().toString().slice(-6)}`,
        driverId: 'DRV-002',
        driverName: 'Test Driver Sarah',
        pickupDate: '2025-01-15',
        deliveryDate: '2025-01-17',
        distance: '2400 mi',
        estimatedHours: 32,
      };

      const result3 =
        await LoadScheduleIntegrationService.integrateLoadAssignment(testLoad3);
      results.push({
        test: 'Multi-day Load',
        success: result3.success,
        scheduleId: result3.scheduleId,
        conflicts: result3.conflicts,
        error: result3.error,
      });

      // Test 5: Status Update Test
      console.log('🧪 Running Test 5: Status Update Test');
      if (result1.success && result1.scheduleId) {
        const statusUpdateResult =
          await LoadScheduleIntegrationService.updateScheduleFromLoadStatus(
            testLoad1.loadId,
            'in-transit',
            testLoad1.driverId
          );
        results.push({
          test: 'Status Update',
          success: statusUpdateResult,
          loadId: testLoad1.loadId,
          newStatus: 'in-transit',
        });
      }

      // Test 6: Load Cancellation Test
      console.log('🧪 Running Test 6: Load Cancellation Test');
      if (result2.success) {
        const cancellationResult =
          await LoadScheduleIntegrationService.removeScheduleFromLoadCancellation(
            testLoad2.loadId
          );
        results.push({
          test: 'Load Cancellation',
          success: cancellationResult,
          loadId: testLoad2.loadId,
        });
      }
    } catch (error) {
      console.error('❌ Test execution error:', error);
      results.push({
        test: 'Overall Test Execution',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    setTestResults(results);
    setIsRunning(false);

    // Refresh schedules after testing
    await loadSchedules();
    await checkIntegrationStatus();
  };

  const clearTestData = async () => {
    // Clear test schedules (those with TEST in the loadId)
    try {
      const testSchedules = schedules.filter(
        (schedule) => schedule.loadId && schedule.loadId.includes('TEST')
      );

      for (const schedule of testSchedules) {
        await schedulingService.deleteSchedule(schedule.id);
      }

      await loadSchedules();
      setTestResults([]);
      console.log(`✅ Cleared ${testSchedules.length} test schedules`);
    } catch (error) {
      console.error('❌ Error clearing test data:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            🧪 Load-Schedule Integration Test Suite
          </h1>
          <p className='text-gray-600'>
            Comprehensive testing of load assignment to schedule management
            integration
          </p>
        </div>

        {/* Integration Status */}
        <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            📊 Integration Status
          </h2>
          {integrationStatus ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='text-center'>
                <div
                  className={`text-2xl font-bold ${integrationStatus.enabled ? 'text-green-600' : 'text-red-600'}`}
                >
                  {integrationStatus.enabled ? '✅' : '❌'}
                </div>
                <div className='text-sm text-gray-600'>Integration Enabled</div>
              </div>
              <div className='text-center'>
                <div
                  className={`text-2xl font-bold ${integrationStatus.schedulingServiceConnected ? 'text-green-600' : 'text-red-600'}`}
                >
                  {integrationStatus.schedulingServiceConnected ? '✅' : '❌'}
                </div>
                <div className='text-sm text-gray-600'>Scheduling Service</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {schedules.length}
                </div>
                <div className='text-sm text-gray-600'>Total Schedules</div>
              </div>
            </div>
          ) : (
            <div className='text-center text-gray-500'>
              Loading integration status...
            </div>
          )}
        </div>

        {/* Test Controls */}
        <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            🎮 Test Controls
          </h2>
          <div className='flex gap-4'>
            <button
              onClick={runIntegrationTest}
              disabled={isRunning}
              className={`rounded-lg px-6 py-3 font-medium ${
                isRunning
                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? '⏳ Running Tests...' : '🧪 Run Integration Tests'}
            </button>
            <button
              onClick={clearTestData}
              disabled={isRunning}
              className='rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500'
            >
              🗑️ Clear Test Data
            </button>
            <button
              onClick={loadSchedules}
              disabled={isRunning}
              className='rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500'
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-4 text-xl font-semibold text-gray-900'>
              📋 Test Results
            </h2>
            <div className='space-y-4'>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`border-l-4 p-4 ${
                    result.success
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {result.success ? '✅' : '❌'} {result.test}
                      </h3>
                      {result.error && (
                        <p className='mt-1 text-sm text-red-600'>
                          Error: {result.error}
                        </p>
                      )}
                      {result.scheduleId && (
                        <p className='mt-1 text-sm text-gray-600'>
                          Schedule ID: {result.scheduleId}
                        </p>
                      )}
                      {result.conflicts && result.conflicts.length > 0 && (
                        <div className='mt-2'>
                          <p className='text-sm font-medium text-orange-600'>
                            Conflicts Detected:
                          </p>
                          <ul className='list-inside list-disc text-sm text-orange-600'>
                            {result.conflicts.map(
                              (conflict: any, i: number) => (
                                <li key={i}>{conflict.message}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Schedules */}
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            📅 Current Schedules ({schedules.length})
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Schedule
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Driver
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Route
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Load ID
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className={
                      schedule.loadId?.includes('TEST') ? 'bg-yellow-50' : ''
                    }
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {schedule.title}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {schedule.scheduleType} • {schedule.priority}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {schedule.driverName || 'Not assigned'}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {schedule.assignedDriverId}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {schedule.origin} → {schedule.destination}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {schedule.startDate}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          schedule.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : schedule.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : schedule.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                      {schedule.loadId || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {schedules.length === 0 && (
            <div className='py-8 text-center text-gray-500'>
              No schedules found. Run integration tests to create test
              schedules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


