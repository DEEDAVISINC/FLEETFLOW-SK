'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Truck, 
  Shield, 
  TrendingUp, 
  Globe, 
  Trophy, 
  Fuel, 
  MapPin,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Award
} from 'lucide-react';
import EPAService, { 
  EPAEmissionsData, 
  EPAFuelEfficiencyData, 
  EPAComplianceData,
  EPASustainabilityMetrics,
  EPAEnvironmentalImpact,
  EPACarrierRankings,
  EPAAlternativeFuels,
  EPARegionalEnvironmental
} from '@/app/services/EPAService';

interface EPASustainabilityAnalyticsProps {
  className?: string;
}

const EPASustainabilityAnalytics: React.FC<EPASustainabilityAnalyticsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('emissions');
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Data states
  const [emissionsData, setEmissionsData] = useState<EPAEmissionsData | null>(null);
  const [fuelEfficiencyData, setFuelEfficiencyData] = useState<EPAFuelEfficiencyData | null>(null);
  const [complianceData, setComplianceData] = useState<EPAComplianceData | null>(null);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<EPASustainabilityMetrics | null>(null);
  const [environmentalImpact, setEnvironmentalImpact] = useState<EPAEnvironmentalImpact | null>(null);
  const [carrierRankings, setCarrierRankings] = useState<EPACarrierRankings[]>([]);
  const [alternativeFuels, setAlternativeFuels] = useState<EPAAlternativeFuels[]>([]);
  const [regionalData, setRegionalData] = useState<EPARegionalEnvironmental | null>(null);

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
        regional
      ] = await Promise.all([
        epaService.getVehicleEmissions('1HGCM82633A123456'),
        epaService.getFuelEfficiencyData('fleet_001'),
        epaService.getComplianceStatus('carrier_001'),
        epaService.getSustainabilityMetrics('annual'),
        epaService.getEnvironmentalImpact('national'),
        epaService.getCarrierRankings('sustainability'),
        epaService.getAlternativeFuels('national'),
        epaService.getRegionalEnvironmentalData('CA')
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
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'Expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-600';
      case 'A': return 'bg-green-500';
      case 'B+': return 'bg-blue-500';
      case 'B': return 'bg-blue-400';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">EPA SmartWay Sustainability Analytics</h2>
            <p className="text-gray-600">Environmental compliance and sustainability tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button onClick={refreshData} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="emissions" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Emissions
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Efficiency
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="sustainability" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sustainability
          </TabsTrigger>
          <TabsTrigger value="environmental" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Environmental
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Rankings
          </TabsTrigger>
          <TabsTrigger value="altfuels" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Alt Fuels
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Regional
          </TabsTrigger>
        </TabsList>

        {/* Emissions Tab */}
        <TabsContent value="emissions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO2 Emissions</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emissionsData?.co2EmissionsGrams || 0}g</div>
                <p className="text-xs text-muted-foreground">per mile</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NOx Emissions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emissionsData?.noxEmissionsGrams || 0}g</div>
                <p className="text-xs text-muted-foreground">per mile</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emissionsData?.carbonFootprintLbs || 0} lbs</div>
                <p className="text-xs text-muted-foreground">per mile</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emissionsData?.mpgRating || 0} MPG</div>
                <Badge className={getEfficiencyBadgeColor(emissionsData?.efficiency || 'fair')}>
                  {emissionsData?.efficiency || 'N/A'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certification Level</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{emissionsData?.certificationLevel || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">{emissionsData?.fuelType || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fuel Efficiency Tab */}
        <TabsContent value="efficiency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average MPG</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fuelEfficiencyData?.avgMPG || 0}</div>
                <p className="text-xs text-muted-foreground">miles per gallon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annual Fuel Cost</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${fuelEfficiencyData?.annualFuelCost?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">per year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Consumption</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fuelEfficiencyData?.fuelConsumptionGallons?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">gallons annually</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fuelEfficiencyData?.efficiencyRating || 0}/10</div>
                <p className="text-xs text-muted-foreground">EPA rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Greenhouse Gas Score</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fuelEfficiencyData?.greenhouseGasScore || 0}/10</div>
                <p className="text-xs text-muted-foreground">lower is better</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smog Rating</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fuelEfficiencyData?.smogRating || 0}/10</div>
                <p className="text-xs text-muted-foreground">air quality impact</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className={`font-bold ${getComplianceStatusColor(complianceData?.certificationStatus || 'N/A')}`}>
                    {complianceData?.certificationStatus || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Current status</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complianceData?.complianceScore || 0}%</div>
                <p className="text-xs text-muted-foreground">overall compliance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Violations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{complianceData?.violationCount || 0}</div>
                <p className="text-xs text-muted-foreground">active violations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Inspection</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{complianceData?.lastInspectionDate || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">inspection date</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Inspection</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{complianceData?.nextInspectionDue || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">due date</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audit Status</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{complianceData?.auditStatus || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">{complianceData?.certificationLevel || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sustainability Tab */}
        <TabsContent value="sustainability" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Footprint Reduction</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sustainabilityMetrics?.carbonFootprintReduction || 0}%</div>
                <p className="text-xs text-muted-foreground">year over year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Savings</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sustainabilityMetrics?.fuelSavingsGallons?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">gallons saved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annual Cost Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${sustainabilityMetrics?.costSavingsAnnual?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">per year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emissions Reduction</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sustainabilityMetrics?.emissionsReductionTons || 0}</div>
                <p className="text-xs text-muted-foreground">tons CO2 reduced</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sustainabilityMetrics?.sustainabilityScore || 0}/10</div>
                <p className="text-xs text-muted-foreground">overall rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renewable Fuel Usage</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sustainabilityMetrics?.renewableFuelUsage || 0}%</div>
                <p className="text-xs text-muted-foreground">of total fuel</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Environmental Impact Tab */}
        <TabsContent value="environmental" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{environmentalImpact?.totalEmissionsTons || 0}</div>
                <p className="text-xs text-muted-foreground">tons CO2 annually</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Footprint</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{environmentalImpact?.waterFootprintGallons?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">gallons annually</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{environmentalImpact?.renewableEnergyPercentage || 0}%</div>
                <p className="text-xs text-muted-foreground">of total energy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recycling Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{environmentalImpact?.recyclingRate || 0}%</div>
                <p className="text-xs text-muted-foreground">materials recycled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Air Quality Index</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{environmentalImpact?.airQualityIndex || 0}</div>
                <p className="text-xs text-muted-foreground">local impact</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Biodiversity Impact</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold capitalize">{environmentalImpact?.biodiversityImpact || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">ecosystem effect</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Carrier Rankings Tab */}
        <TabsContent value="rankings" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  EPA SmartWay Carrier Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carrierRankings.map((carrier, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-500">#{carrier.smartWayRank}</div>
                        <div>
                          <div className="font-semibold">{carrier.carrierName}</div>
                          <div className="text-sm text-gray-500">{carrier.fleetSize} vehicles</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{carrier.sustainabilityScore}</div>
                          <div className="text-xs text-gray-500">Sustainability</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{carrier.carbonEfficiency}%</div>
                          <div className="text-xs text-gray-500">Carbon Efficiency</div>
                        </div>
                        <Badge className={getPerformanceGradeColor(carrier.performanceGrade)}>
                          {carrier.performanceGrade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alternative Fuels Tab */}
        <TabsContent value="altfuels" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  Alternative Fuel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alternativeFuels.map((fuel, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{fuel.fuelType}</h3>
                          <p className="text-sm text-gray-600">${fuel.costPerGallon}/gallon</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {fuel.incentivesAvailable && (
                            <Badge variant="secondary">Incentives Available</Badge>
                          )}
                          <Badge variant="outline">{fuel.roiTimeframe} ROI</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Availability</div>
                          <div className="text-gray-600">{fuel.availabilityPercentage}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Emissions Reduction</div>
                          <div className="text-gray-600">{fuel.emissionsReduction}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Infrastructure</div>
                          <div className="text-gray-600">{fuel.infrastructureReadiness}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Adoption Rate</div>
                          <div className="text-gray-600">{fuel.adoptionRate}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Air Quality Index</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{regionalData?.airQualityIndex || 0}</div>
                <p className="text-xs text-muted-foreground">{regionalData?.state || 'N/A'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ozone Levels</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{regionalData?.ozoneLevels || 0}</div>
                <p className="text-xs text-muted-foreground">ppm</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Particulate Matter</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{regionalData?.particulateMatter || 0}</div>
                <p className="text-xs text-muted-foreground">μg/m³</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Regional Compliance Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Emissions Standards</h4>
                    <Badge variant="outline">{regionalData?.emissionsStandards || 'N/A'}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Incentive Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {regionalData?.incentivePrograms?.map((program, index) => (
                        <Badge key={index} variant="secondary">{program}</Badge>
                      )) || <span className="text-gray-500">None available</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Compliance Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {regionalData?.complianceRequirements?.map((req, index) => (
                        <Badge key={index} variant="outline">{req}</Badge>
                      )) || <span className="text-gray-500">None specified</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Green Zone Restrictions</h4>
                    <Badge variant={regionalData?.greenZoneRestrictions ? "destructive" : "secondary"}>
                      {regionalData?.greenZoneRestrictions ? 'Active' : 'None'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EPASustainabilityAnalytics; 