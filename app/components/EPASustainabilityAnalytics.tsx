'use client';

import EPAService, {
  EPAAlternativeFuels,
  EPACarrierRankings,
  EPAComplianceData,
  EPAEmissionsData,
  EPAEnvironmentalImpact,
  EPAFuelEfficiencyData,
  EPARegionalEnvironmental,
  EPASustainabilityMetrics,
} from '@/app/services/EPAService';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Fuel,
  Globe,
  Leaf,
  MapPin,
  RefreshCw,
  Shield,
  TrendingUp,
  Trophy,
  Truck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EPASustainabilityAnalyticsProps {
  className?: string;
}

const EPASustainabilityAnalytics: React.FC<EPASustainabilityAnalyticsProps> = ({
  className,
}) => {
  const [activeTab, setActiveTab] = useState('emissions');
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Data states
  const [emissionsData, setEmissionsData] = useState<EPAEmissionsData | null>(
    null
  );
  const [fuelEfficiencyData, setFuelEfficiencyData] =
    useState<EPAFuelEfficiencyData | null>(null);
  const [complianceData, setComplianceData] =
    useState<EPAComplianceData | null>(null);
  const [sustainabilityMetrics, setSustainabilityMetrics] =
    useState<EPASustainabilityMetrics | null>(null);
  const [environmentalImpact, setEnvironmentalImpact] =
    useState<EPAEnvironmentalImpact | null>(null);
  const [carrierRankings, setCarrierRankings] = useState<EPACarrierRankings[]>(
    []
  );
  const [alternativeFuels, setAlternativeFuels] = useState<
    EPAAlternativeFuels[]
  >([]);
  const [regionalData, setRegionalData] =
    useState<EPARegionalEnvironmental | null>(null);

  const epaService = EPAService.getInstance();

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        emissions,
        fuelEfficiency,
        compliance,
        sustainability,
        environmental,
        rankings,
        altFuels,
        regional,
      ] = await Promise.all([
        epaService.getVehicleEmissions('1HGCM82633A123456'),
        epaService.getFuelEfficiencyData('fleet_001'),
        epaService.getComplianceStatus('carrier_001'),
        epaService.getSustainabilityMetrics('annual'),
        epaService.getEnvironmentalImpact('national'),
        epaService.getCarrierRankings('sustainability'),
        epaService.getAlternativeFuels('national'),
        epaService.getRegionalEnvironmentalData('CA'),
      ]);

      setEmissionsData(emissions);
      setFuelEfficiencyData(fuelEfficiency);
      setComplianceData(compliance);
      setSustainabilityMetrics(sustainability);
      setEnvironmentalImpact(environmental);
      setCarrierRankings(rankings);
      setAlternativeFuels(altFuels);
      setRegionalData(regional);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading EPA data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    epaService.clearCache();
    loadData();
  };

  const getEfficiencyBadgeColor = (efficiency: string) => {
    switch (efficiency) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'fair':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10b981';
      case 'Pending':
        return '#f59e0b';
      case 'Expired':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPerformanceGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return '#059669';
      case 'A':
        return '#10b981';
      case 'B+':
        return '#3b82f6';
      case 'B':
        return '#60a5fa';
      case 'C':
        return '#f59e0b';
      case 'D':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '12px 20px',
    borderRadius: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    background: isActive
      ? 'rgba(255, 255, 255, 0.25)'
      : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  });

  const tabs = [
    { id: 'emissions', label: 'Emissions', icon: Truck },
    { id: 'efficiency', label: 'Efficiency', icon: Fuel },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'sustainability', label: 'Sustainability', icon: TrendingUp },
    { id: 'environmental', label: 'Environmental', icon: Globe },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'altfuels', label: 'Alt Fuels', icon: Leaf },
    { id: 'regional', label: 'Regional', icon: MapPin },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Header */}
      <div style={cardStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Leaf style={{ height: '32px', width: '32px', color: '#10b981' }} />
            <div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                EPA SmartWay Sustainability Analytics
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                }}
              >
                Environmental compliance and sustainability tracking
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              onClick={refreshData}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <RefreshCw
                style={{
                  height: '16px',
                  width: '16px',
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                }}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={tabButtonStyle(activeTab === tab.id)}
              >
                <IconComponent style={{ height: '16px', width: '16px' }} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'emissions' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                CO2 Emissions
              </h3>
              <Truck
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}
            >
              {emissionsData?.co2EmissionsGrams || 0}g
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              per mile
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                NOx Emissions
              </h3>
              <AlertTriangle
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
            >
              {emissionsData?.noxEmissionsGrams || 0}g
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              per mile
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Carbon Footprint
              </h3>
              <Globe
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {emissionsData?.carbonFootprintLbs || 0} lbs
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              per mile
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Fuel Efficiency
              </h3>
              <Fuel
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {emissionsData?.mpgRating || 0} MPG
            </div>
            <div
              style={{
                marginTop: '8px',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block',
                background: getEfficiencyBadgeColor(
                  emissionsData?.efficiency || 'fair'
                ),
                color: 'white',
              }}
            >
              {emissionsData?.efficiency || 'N/A'}
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Certification Level
              </h3>
              <Award
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#34d399', fontSize: '24px', fontWeight: 'bold' }}
            >
              {emissionsData?.certificationLevel || 'N/A'}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              {emissionsData?.fuelType || 'N/A'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'efficiency' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Average MPG
              </h3>
              <Fuel
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}
            >
              {fuelEfficiencyData?.avgMPG || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              miles per gallon
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Annual Fuel Cost
              </h3>
              <TrendingUp
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}
            >
              ${fuelEfficiencyData?.annualFuelCost?.toLocaleString() || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              per year
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Fuel Consumption
              </h3>
              <Fuel
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {fuelEfficiencyData?.fuelConsumptionGallons?.toLocaleString() ||
                0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              gallons annually
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Efficiency Rating
              </h3>
              <Award
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#34d399', fontSize: '32px', fontWeight: 'bold' }}
            >
              {fuelEfficiencyData?.efficiencyRating || 0}/10
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              EPA rating
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Greenhouse Gas Score
              </h3>
              <Globe
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
            >
              {fuelEfficiencyData?.greenhouseGasScore || 0}/10
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              lower is better
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Smog Rating
              </h3>
              <AlertTriangle
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#ef4444', fontSize: '32px', fontWeight: 'bold' }}
            >
              {fuelEfficiencyData?.smogRating || 0}/10
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              air quality impact
            </p>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Compliance Status
              </h3>
              <Shield
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle
                style={{ height: '20px', width: '20px', color: '#10b981' }}
              />
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: getComplianceStatusColor(
                    complianceData?.certificationStatus || 'N/A'
                  ),
                }}
              >
                {complianceData?.certificationStatus || 'N/A'}
              </span>
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              Current status
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Compliance Score
              </h3>
              <TrendingUp
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}
            >
              {complianceData?.complianceScore || 0}%
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              overall compliance
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Violations
              </h3>
              <AlertTriangle
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#ef4444', fontSize: '32px', fontWeight: 'bold' }}
            >
              {complianceData?.violationCount || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              active violations
            </p>
          </div>
        </div>
      )}

      {activeTab === 'sustainability' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Carbon Footprint Reduction
              </h3>
              <Leaf
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}
            >
              {sustainabilityMetrics?.carbonFootprintReduction || 0}%
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              year over year
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Fuel Savings
              </h3>
              <Fuel
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {sustainabilityMetrics?.fuelSavingsGallons?.toLocaleString() || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              gallons saved
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Annual Cost Savings
              </h3>
              <TrendingUp
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}
            >
              ${sustainabilityMetrics?.costSavingsAnnual?.toLocaleString() || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              per year
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Emissions Reduction
              </h3>
              <Globe
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
            >
              {sustainabilityMetrics?.emissionsReductionTons || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              tons CO2 reduced
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Sustainability Score
              </h3>
              <Award
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#34d399', fontSize: '32px', fontWeight: 'bold' }}
            >
              {sustainabilityMetrics?.sustainabilityScore || 0}/10
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              overall rating
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Renewable Fuel Usage
              </h3>
              <Leaf
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {sustainabilityMetrics?.renewableFuelUsage || 0}%
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              of total fuel
            </p>
          </div>
        </div>
      )}

      {activeTab === 'environmental' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Total Emissions
              </h3>
              <Globe
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {environmentalImpact?.totalEmissionsTons || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              tons CO2 annually
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Water Footprint
              </h3>
              <Globe
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {environmentalImpact?.waterFootprintGallons?.toLocaleString() ||
                0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              gallons annually
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Renewable Energy
              </h3>
              <Leaf
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}
            >
              {environmentalImpact?.renewableEnergyPercentage || 0}%
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              of total energy
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Recycling Rate
              </h3>
              <TrendingUp
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#f59e0b', fontSize: '32px', fontWeight: 'bold' }}
            >
              {environmentalImpact?.recyclingRate || 0}%
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              materials recycled
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Air Quality Index
              </h3>
              <AlertTriangle
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#ef4444', fontSize: '32px', fontWeight: 'bold' }}
            >
              {environmentalImpact?.airQualityIndex || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              local impact
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Biodiversity Impact
              </h3>
              <Leaf
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#34d399', fontSize: '24px', fontWeight: 'bold' }}
            >
              {environmentalImpact?.biodiversityImpact || 'N/A'}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              ecosystem effect
            </p>
          </div>
        </div>
      )}

      {activeTab === 'rankings' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                EPA SmartWay Carrier Rankings
              </h3>
              <Trophy
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {carrierRankings.map((carrier, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        color: '#34d399',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      #{carrier.smartWayRank}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '18px',
                          color: 'white',
                        }}
                      >
                        {carrier.carrierName}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {carrier.fleetSize} vehicles
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      >
                        {carrier.sustainabilityScore}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Sustainability
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      >
                        {carrier.carbonEfficiency}%
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Carbon Efficiency
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block',
                        background: getPerformanceGradeColor(
                          carrier.performanceGrade
                        ),
                        color: 'white',
                      }}
                    >
                      {carrier.performanceGrade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'altfuels' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Alternative Fuel Analysis
              </h3>
              <Fuel
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {alternativeFuels.map((fuel, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: '600',
                          fontSize: '18px',
                          color: 'white',
                        }}
                      >
                        {fuel.fuelType}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        ${fuel.costPerGallon}/gallon
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {fuel.incentivesAvailable && (
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-block',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                          }}
                        >
                          Incentives Available
                        </div>
                      )}
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-block',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                        }}
                      >
                        {fuel.roiTimeframe} ROI
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '12px',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        Availability
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {fuel.availabilityPercentage}%
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        Emissions Reduction
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {fuel.emissionsReduction}%
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        Infrastructure
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {fuel.infrastructureReadiness}%
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        Adoption Rate
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {fuel.adoptionRate}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'regional' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Air Quality Index
              </h3>
              <MapPin
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {regionalData?.airQualityIndex || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              {regionalData?.state || 'N/A'}
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Ozone Levels
              </h3>
              <Globe
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {regionalData?.ozoneLevels || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              ppm
            </p>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Particulate Matter
              </h3>
              <AlertTriangle
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ color: '#ef4444', fontSize: '32px', fontWeight: 'bold' }}
            >
              {regionalData?.particulateMatter || 0}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              μg/m³
            </p>
          </div>

          <div style={{ ...cardStyle, gridColumn: 'span 2 / span 3' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                Regional Compliance Requirements
              </h3>
              <Shield
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <h4
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Emissions Standards
                </h4>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {regionalData?.emissionsStandards || 'N/A'}
                </div>
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Incentive Programs
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {regionalData?.incentivePrograms?.map((program, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {program}
                    </div>
                  )) || (
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      None available
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Compliance Requirements
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {regionalData?.complianceRequirements?.map((req, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {req}
                    </div>
                  )) || (
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      None specified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Green Zone Restrictions
                </h4>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {regionalData?.greenZoneRestrictions ? 'Active' : 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EPASustainabilityAnalytics;
