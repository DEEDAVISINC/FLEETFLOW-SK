'use client';

import {
  BarChart3,
  CheckCircle,
  DollarSign,
  Mail,
  MapPin,
  Pause,
  Phone,
  Play,
  RefreshCw,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadBookingOpportunity {
  id: string;
  source: string;
  origin: {
    city: string;
    state: string;
    zipCode: string;
  };
  destination: {
    city: string;
    state: string;
    zipCode: string;
  };
  rate: number;
  miles: number;
  rpmRate: number;
  equipment: string;
  weight: number;
  pickupDate: string;
  brokerInfo: {
    name: string;
    phone?: string;
    email?: string;
    factoringRating: string;
    paymentTerms: string;
    creditScore: number;
  };
  aiAnalysis: {
    profitabilityScore: number;
    riskLevel: string;
    recommendationScore: number;
    autoBookEligible: boolean;
  };
  googleMapsData: {
    estimatedDriveTime: string;
    routeOptimized: boolean;
  };
  postedAt: string;
  expiresAt: string;
}

interface LoadBookingMetrics {
  totalOpportunities: number;
  autoBookedLoads: number;
  successRate: number;
  averageRPM: number;
  totalRevenue: number;
  averageBookingTime: number;
  topPerformingSources: Array<{
    source: string;
    bookings: number;
    revenue: number;
    successRate: number;
  }>;
}

export default function AILoadBookingHub() {
  const [opportunities, setOpportunities] = useState<LoadBookingOpportunity[]>(
    []
  );
  const [metrics, setMetrics] = useState<LoadBookingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoBookingActive, setAutoBookingActive] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<LoadBookingOpportunity | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState<string[]>([]);

  useEffect(() => {
    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // Load opportunities
      const opportunitiesResponse = await fetch(
        '/api/ai-load-booking?action=opportunities'
      );
      const opportunitiesData = await opportunitiesResponse.json();

      if (opportunitiesData.success) {
        setOpportunities(opportunitiesData.opportunities);
      }

      // Load metrics
      const metricsResponse = await fetch(
        '/api/ai-load-booking?action=metrics'
      );
      const metricsData = await metricsResponse.json();

      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }
    } catch (error) {
      console.error('Failed to load AI load booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoBook = async () => {
    try {
      const response = await fetch('/api/ai-load-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto-book' }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh data after auto-booking
        await loadData();

        // Show results
        alert(
          `Auto-booking complete!\nAttempted: ${data.result.attempted}\nSuccessful: ${data.result.successful}\nFailed: ${data.result.failed}`
        );
      }
    } catch (error) {
      console.error('Auto-booking failed:', error);
      alert('Auto-booking failed. Please try again.');
    }
  };

  const handleBookLoad = async (loadId: string) => {
    if (bookingInProgress.includes(loadId)) return;

    setBookingInProgress((prev) => [...prev, loadId]);

    try {
      const response = await fetch('/api/ai-load-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'book-load', loadId }),
      });

      const data = await response.json();
      if (data.success && data.result.success) {
        alert(`Load ${loadId} booked successfully!`);
        await loadData();
      } else {
        alert(
          `Failed to book load: ${data.result?.message || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('Load booking failed:', error);
      alert('Load booking failed. Please try again.');
    } finally {
      setBookingInProgress((prev) => prev.filter((id) => id !== loadId));
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'text-green-600 bg-green-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'HIGH':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSourceColor = (source: string) => {
    const colors = {
      DAT_ONE: 'bg-blue-100 text-blue-800',
      POWER_DAT: 'bg-blue-100 text-blue-800',
      TRUCKSTOP: 'bg-green-100 text-green-800',
      '123LOADBOARD': 'bg-purple-100 text-purple-800',
      UBER_FREIGHT: 'bg-gray-100 text-gray-800',
      CONVOY: 'bg-orange-100 text-orange-800',
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex items-center gap-3'>
          <RefreshCw className='h-6 w-6 animate-spin text-blue-400' />
          <span className='text-white'>Loading AI Load Booking Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Controls */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='mb-2 text-2xl font-bold text-white'>
            🚛 AI Load Booking Hub
          </h2>
          <p className='text-white/70'>
            Load Hunter-style automated load booking with AI analysis
          </p>
        </div>

        <div className='flex items-center gap-4'>
          <button
            onClick={() => setAutoBookingActive(!autoBookingActive)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              autoBookingActive
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {autoBookingActive ? (
              <Pause className='h-4 w-4' />
            ) : (
              <Play className='h-4 w-4' />
            )}
            {autoBookingActive ? 'Auto-Booking ON' : 'Auto-Booking OFF'}
          </button>

          <button
            onClick={handleAutoBook}
            className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
          >
            <CheckCircle className='h-4 w-4' />
            Run Auto-Book
          </button>

          <button
            onClick={loadData}
            className='flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800'
          >
            <RefreshCw className='h-4 w-4' />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      {metrics && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <Truck className='h-6 w-6 text-blue-400' />
              <h3 className='font-semibold text-white'>Total Opportunities</h3>
            </div>
            <div className='text-3xl font-bold text-blue-400'>
              {metrics.totalOpportunities}
            </div>
            <div className='mt-2 text-sm text-white/70'>
              Active load opportunities
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <CheckCircle className='h-6 w-6 text-green-400' />
              <h3 className='font-semibold text-white'>Auto-Booked Loads</h3>
            </div>
            <div className='text-3xl font-bold text-green-400'>
              {metrics.autoBookedLoads}
            </div>
            <div className='mt-2 text-sm text-white/70'>
              {metrics.successRate.toFixed(1)}% success rate
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <DollarSign className='h-6 w-6 text-yellow-400' />
              <h3 className='font-semibold text-white'>Average RPM</h3>
            </div>
            <div className='text-3xl font-bold text-yellow-400'>
              ${metrics.averageRPM.toFixed(2)}
            </div>
            <div className='mt-2 text-sm text-white/70'>Revenue per mile</div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <TrendingUp className='h-6 w-6 text-purple-400' />
              <h3 className='font-semibold text-white'>Total Revenue</h3>
            </div>
            <div className='text-3xl font-bold text-purple-400'>
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <div className='mt-2 text-sm text-white/70'>From auto-booking</div>
          </div>
        </div>
      )}

      {/* Load Opportunities Table */}
      <div className='overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm'>
        <div className='border-b border-white/20 p-6'>
          <h3 className='text-xl font-semibold text-white'>
            Available Load Opportunities
          </h3>
          <p className='mt-1 text-white/70'>
            AI-analyzed loads ready for booking
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-white/20'>
                <th className='p-4 text-left font-medium text-white/80'>
                  Source
                </th>
                <th className='p-4 text-left font-medium text-white/80'>
                  Route
                </th>
                <th className='p-4 text-left font-medium text-white/80'>
                  Rate/RPM
                </th>
                <th className='p-4 text-left font-medium text-white/80'>
                  Equipment
                </th>
                <th className='p-4 text-left font-medium text-white/80'>
                  Broker
                </th>
                <th className='p-4 text-left font-medium text-white/80'>
                  AI Analysis
                </th>
                <th className='p-4 text-left font-medium text-white/80'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((load) => (
                <tr
                  key={load.id}
                  className='border-b border-white/10 transition-colors hover:bg-white/5'
                >
                  <td className='p-4'>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getSourceColor(load.source)}`}
                    >
                      {load.source.replace('_', ' ')}
                    </span>
                  </td>

                  <td className='p-4'>
                    <div className='font-medium text-white'>
                      {load.origin.city}, {load.origin.state} →{' '}
                      {load.destination.city}, {load.destination.state}
                    </div>
                    <div className='mt-1 flex items-center gap-2 text-sm text-white/60'>
                      <MapPin className='h-3 w-3' />
                      {load.miles} miles •{' '}
                      {load.googleMapsData.estimatedDriveTime}
                    </div>
                  </td>

                  <td className='p-4'>
                    <div className='font-medium text-white'>
                      ${load.rate.toLocaleString()}
                    </div>
                    <div className='text-sm font-medium text-green-400'>
                      ${load.rpmRate.toFixed(2)}/mile
                    </div>
                  </td>

                  <td className='p-4'>
                    <div className='text-white'>{load.equipment}</div>
                    <div className='text-sm text-white/60'>
                      {(load.weight / 1000).toFixed(0)}k lbs
                    </div>
                  </td>

                  <td className='p-4'>
                    <div className='font-medium text-white'>
                      {load.brokerInfo.name}
                    </div>
                    <div className='mt-1 flex items-center gap-2'>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          load.brokerInfo.factoringRating.startsWith('A')
                            ? 'bg-green-100 text-green-800'
                            : load.brokerInfo.factoringRating.startsWith('B')
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {load.brokerInfo.factoringRating}
                      </span>
                      <span className='text-xs text-white/60'>
                        {load.brokerInfo.paymentTerms}
                      </span>
                    </div>
                  </td>

                  <td className='p-4'>
                    <div className='mb-1 flex items-center gap-2'>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${getRiskColor(load.aiAnalysis.riskLevel)}`}
                      >
                        {load.aiAnalysis.riskLevel}
                      </span>
                      {load.aiAnalysis.autoBookEligible && (
                        <CheckCircle className='h-4 w-4 text-green-400' />
                      )}
                    </div>
                    <div className='text-sm text-white/60'>
                      Score: {load.aiAnalysis.recommendationScore}/100
                    </div>
                  </td>

                  <td className='p-4'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleBookLoad(load.id)}
                        disabled={bookingInProgress.includes(load.id)}
                        className='rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
                      >
                        {bookingInProgress.includes(load.id)
                          ? 'Booking...'
                          : 'Book Load'}
                      </button>

                      {load.brokerInfo.phone && (
                        <button className='p-1 text-white/60 transition-colors hover:text-white'>
                          <Phone className='h-4 w-4' />
                        </button>
                      )}

                      {load.brokerInfo.email && (
                        <button className='p-1 text-white/60 transition-colors hover:text-white'>
                          <Mail className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analytics */}
      {metrics && metrics.topPerformingSources.length > 0 && (
        <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
          <div className='mb-6 flex items-center gap-3'>
            <BarChart3 className='h-6 w-6 text-purple-400' />
            <h3 className='text-xl font-semibold text-white'>
              Top Performing Sources
            </h3>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {metrics.topPerformingSources.map((source, index) => (
              <div
                key={source.source}
                className='rounded-lg border border-white/10 bg-white/5 p-4'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${getSourceColor(source.source)}`}
                  >
                    {source.source.replace('_', ' ')}
                  </span>
                  <span className='text-sm text-white/60'>#{index + 1}</span>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Bookings:</span>
                    <span className='font-medium text-white'>
                      {source.bookings}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Revenue:</span>
                    <span className='font-medium text-green-400'>
                      ${source.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-white/70'>Success Rate:</span>
                    <span className='font-medium text-blue-400'>
                      {source.successRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
