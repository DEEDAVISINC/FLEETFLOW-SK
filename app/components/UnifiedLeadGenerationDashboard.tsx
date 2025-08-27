'use client';

import {
  Building2,
  CheckCircle,
  Globe,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Star,
  Target,
  Truck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface UnifiedLead {
  id: string;
  source: 'TruckingPlanet' | 'ThomasNet' | 'Combined';
  companyName: string;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  businessInfo: {
    industry: string;
    size?: string;
    revenue?: string;
    specializations?: string[];
  };
  leadScore: number;
  enhancedScore: number;
  freightPotential: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  conversionProbability: number;
  estimatedMonthlyRevenue: number;
  lastUpdated: string;
  fmcsaData?: {
    dotNumber?: string;
    mcNumber?: string;
    safetyRating?: string;
    verified: boolean;
  };
}

interface LeadGenerationStats {
  totalFound: number;
  highPriority: number;
  averageScore: number;
  sourceBreakdown: {
    truckingPlanet: number;
    thomasNet: number;
    combined: number;
  };
  fmcsaMatches: number;
}

interface ServiceStatus {
  truckingPlanet: {
    status: string;
    account: string;
    capabilities: string[];
  };
  thomasNet: {
    status: string;
    account: string;
    capabilities: string[];
  };
  fmcsa: {
    status: string;
    capabilities: string[];
  };
  integration: {
    leadSources: string[];
    scoringMethod: string;
    averageLeadScore: string;
    conversionRate: string;
  };
}

export default function UnifiedLeadGenerationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [stats, setStats] = useState<LeadGenerationStats | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    industries: [] as string[],
    locations: [] as string[],
    freightVolume: '',
    minLeadScore: 80,
    sources: [] as string[],
  });

  // Load service status on component mount
  useEffect(() => {
    fetchServiceStatus();
  }, []);

  const fetchServiceStatus = async () => {
    try {
      const response = await fetch('/api/unified-leads');
      const data = await response.json();
      setServiceStatus(data.status);
    } catch (error) {
      console.error('Failed to fetch service status:', error);
    }
  };

  const generateLeads = async () => {
    setIsLoading(true);
    try {
      const filters = {
        industries:
          searchFilters.industries.length > 0
            ? searchFilters.industries
            : undefined,
        locations:
          searchFilters.locations.length > 0
            ? searchFilters.locations
            : undefined,
        freightVolume: searchFilters.freightVolume || undefined,
        minLeadScore: searchFilters.minLeadScore,
        sources:
          searchFilters.sources.length > 0 ? searchFilters.sources : undefined,
      };

      const response = await fetch('/api/unified-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      if (data.success) {
        setLeads(data.data.leads);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to generate leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(revenue);
  };

  return (
    <div className='mx-auto w-full max-w-7xl space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-3 text-3xl font-bold text-gray-900'>
            <Target className='h-8 w-8 text-blue-600' />
            Unified Lead Generation
          </h1>
          <p className='mt-1 text-gray-600'>
            TruckingPlanet + ThomasNet + FMCSA Integration
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button onClick={fetchServiceStatus} variant='outline' size='sm'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
          <Button
            onClick={generateLeads}
            disabled={isLoading}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {isLoading ? (
              <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Search className='mr-2 h-4 w-4' />
            )}
            Generate Leads
          </Button>
        </div>
      </div>

      {/* Service Status Overview */}
      {serviceStatus && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                <Globe className='h-4 w-4 text-blue-600' />
                TruckingPlanet Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Badge variant='outline' className='bg-green-50 text-green-700'>
                  {serviceStatus.truckingPlanet.status}
                </Badge>
                <p className='text-sm text-gray-600'>
                  Account: {serviceStatus.truckingPlanet.account}
                </p>
                <div className='text-xs text-gray-500'>
                  • 70,000+ Verified Shippers
                  <br />
                  • 2M+ Licensed Carriers
                  <br />• FreightBlaster Email Service
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                <Building2 className='h-4 w-4 text-orange-600' />
                ThomasNet Manufacturing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Badge
                  variant='outline'
                  className='bg-yellow-50 text-yellow-700'
                >
                  {serviceStatus.thomasNet.status}
                </Badge>
                <p className='text-sm text-gray-600'>
                  Account: {serviceStatus.thomasNet.account}
                </p>
                <div className='text-xs text-gray-500'>
                  • Manufacturing Database
                  <br />
                  • Industrial Lead Generation
                  <br />• Company Detail Extraction
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                <Shield className='h-4 w-4 text-green-600' />
                FMCSA Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Badge variant='outline' className='bg-green-50 text-green-700'>
                  {serviceStatus.fmcsa.status}
                </Badge>
                <p className='text-sm text-gray-600'>Government Integration</p>
                <div className='text-xs text-gray-500'>
                  • DOT Number Verification
                  <br />
                  • Safety Rating Lookup
                  <br />• Carrier Compliance Data
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='search'>Lead Search</TabsTrigger>
          <TabsTrigger value='results'>Results</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600'>Total Database</p>
                    <p className='text-2xl font-bold'>2.17M+</p>
                    <p className='text-xs text-green-600'>Companies</p>
                  </div>
                  <Users className='h-8 w-8 text-blue-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600'>Average Score</p>
                    <p className='text-2xl font-bold'>
                      {stats?.averageScore?.toFixed(0) || '85'}
                    </p>
                    <p className='text-xs text-green-600'>Lead Quality</p>
                  </div>
                  <Star className='h-8 w-8 text-yellow-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600'>High Priority</p>
                    <p className='text-2xl font-bold'>
                      {stats?.highPriority || '0'}
                    </p>
                    <p className='text-xs text-green-600'>Ready to Contact</p>
                  </div>
                  <Target className='h-8 w-8 text-red-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600'>FMCSA Verified</p>
                    <p className='text-2xl font-bold'>
                      {stats?.fmcsaMatches || '0'}
                    </p>
                    <p className='text-xs text-green-600'>Compliance Check</p>
                  </div>
                  <CheckCircle className='h-8 w-8 text-green-600' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Lead Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <Button
                  onClick={() => {
                    setSearchFilters({
                      ...searchFilters,
                      industries: ['automotive'],
                      freightVolume: 'high',
                      minLeadScore: 90,
                    });
                    setActiveTab('search');
                  }}
                  variant='outline'
                  className='h-20 flex-col'
                >
                  <Truck className='mb-2 h-6 w-6' />
                  Automotive Manufacturing
                  <span className='text-xs text-gray-500'>
                    High-Volume Shippers
                  </span>
                </Button>

                <Button
                  onClick={() => {
                    setSearchFilters({
                      ...searchFilters,
                      industries: ['chemical', 'steel'],
                      freightVolume: 'high',
                      minLeadScore: 85,
                    });
                    setActiveTab('search');
                  }}
                  variant='outline'
                  className='h-20 flex-col'
                >
                  <Building2 className='mb-2 h-6 w-6' />
                  Chemical & Steel
                  <span className='text-xs text-gray-500'>
                    Industrial Freight
                  </span>
                </Button>

                <Button
                  onClick={() => {
                    setSearchFilters({
                      ...searchFilters,
                      minLeadScore: 95,
                      sources: ['TruckingPlanet'],
                    });
                    setActiveTab('search');
                  }}
                  variant='outline'
                  className='h-20 flex-col'
                >
                  <Star className='mb-2 h-6 w-6' />
                  Premium Leads Only
                  <span className='text-xs text-gray-500'>Score 95+</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value='search' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Lead Generation Filters</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <div>
                  <label className='text-sm font-medium'>Industries</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select industries' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='automotive'>Automotive</SelectItem>
                      <SelectItem value='chemical'>Chemical</SelectItem>
                      <SelectItem value='steel'>Steel</SelectItem>
                      <SelectItem value='food'>Food & Beverage</SelectItem>
                      <SelectItem value='construction'>Construction</SelectItem>
                      <SelectItem value='manufacturing'>
                        Manufacturing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium'>Freight Volume</label>
                  <Select
                    value={searchFilters.freightVolume}
                    onValueChange={(value) =>
                      setSearchFilters({
                        ...searchFilters,
                        freightVolume: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Volume level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='high'>High Volume</SelectItem>
                      <SelectItem value='medium'>Medium Volume</SelectItem>
                      <SelectItem value='low'>Low Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-sm font-medium'>Lead Score</label>
                  <Select
                    value={searchFilters.minLeadScore.toString()}
                    onValueChange={(value) =>
                      setSearchFilters({
                        ...searchFilters,
                        minLeadScore: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='95'>95+ (Premium)</SelectItem>
                      <SelectItem value='90'>90+ (Excellent)</SelectItem>
                      <SelectItem value='85'>85+ (Very Good)</SelectItem>
                      <SelectItem value='80'>80+ (Good)</SelectItem>
                      <SelectItem value='70'>70+ (Fair)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='flex justify-center pt-4'>
                <Button
                  onClick={generateLeads}
                  disabled={isLoading}
                  className='bg-blue-600 px-8 hover:bg-blue-700'
                >
                  {isLoading ? (
                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Search className='mr-2 h-4 w-4' />
                  )}
                  Generate Leads
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value='results' className='space-y-6'>
          {stats && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
              <Card>
                <CardContent className='p-4 text-center'>
                  <p className='text-2xl font-bold'>{stats.totalFound}</p>
                  <p className='text-sm text-gray-600'>Total Found</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4 text-center'>
                  <p className='text-2xl font-bold text-red-600'>
                    {stats.highPriority}
                  </p>
                  <p className='text-sm text-gray-600'>High Priority</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4 text-center'>
                  <p className='text-2xl font-bold text-green-600'>
                    {Math.round(stats.averageScore)}
                  </p>
                  <p className='text-sm text-gray-600'>Avg Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4 text-center'>
                  <p className='text-2xl font-bold text-blue-600'>
                    {stats.sourceBreakdown.truckingPlanet}
                  </p>
                  <p className='text-sm text-gray-600'>TruckingPlanet</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4 text-center'>
                  <p className='text-2xl font-bold text-green-600'>
                    {stats.fmcsaMatches}
                  </p>
                  <p className='text-sm text-gray-600'>FMCSA Verified</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lead Results */}
          <div className='space-y-4'>
            {leads.map((lead) => (
              <Card key={lead.id} className='transition-shadow hover:shadow-md'>
                <CardContent className='p-6'>
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
                    {/* Company Info */}
                    <div className='lg:col-span-4'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h3 className='text-lg font-semibold'>
                            {lead.companyName}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {lead.businessInfo.industry}
                          </p>
                          {lead.contactInfo.name && (
                            <p className='mt-1 text-sm text-gray-500'>
                              Contact: {lead.contactInfo.name}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={`${getPriorityColor(lead.priority)} text-white`}
                        >
                          {lead.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Scores & Metrics */}
                    <div className='space-y-2 lg:col-span-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>
                          Lead Score:
                        </span>
                        <Badge className={getScoreColor(lead.enhancedScore)}>
                          {lead.enhancedScore}/100
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>
                          Conversion:
                        </span>
                        <span className='text-sm font-medium'>
                          {Math.round(lead.conversionProbability * 100)}%
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Revenue:</span>
                        <span className='text-sm font-medium text-green-600'>
                          {formatRevenue(lead.estimatedMonthlyRevenue)}/mo
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-2 lg:col-span-3'>
                      {lead.contactInfo.email && (
                        <div className='flex items-center gap-2 text-sm'>
                          <Mail className='h-4 w-4 text-gray-400' />
                          <span>{lead.contactInfo.email}</span>
                        </div>
                      )}
                      {lead.contactInfo.phone && (
                        <div className='flex items-center gap-2 text-sm'>
                          <Phone className='h-4 w-4 text-gray-400' />
                          <span>{lead.contactInfo.phone}</span>
                        </div>
                      )}
                      {lead.contactInfo.address && (
                        <div className='flex items-center gap-2 text-sm'>
                          <MapPin className='h-4 w-4 text-gray-400' />
                          <span className='truncate'>
                            {lead.contactInfo.address}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className='flex flex-col gap-2 lg:col-span-2'>
                      <Button
                        size='sm'
                        className='bg-blue-600 hover:bg-blue-700'
                      >
                        <Phone className='mr-2 h-4 w-4' />
                        Call Now
                      </Button>
                      <Button size='sm' variant='outline'>
                        <Mail className='mr-2 h-4 w-4' />
                        Send Email
                      </Button>
                      {lead.fmcsaData?.verified && (
                        <Badge
                          variant='outline'
                          className='bg-green-50 text-xs text-green-700'
                        >
                          FMCSA ✓
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Freight Potential */}
                  <div className='mt-4 border-t pt-4'>
                    <p className='text-sm text-gray-600'>
                      <strong>Freight Potential:</strong>{' '}
                      {lead.freightPotential}
                    </p>
                    <div className='mt-2 flex items-center gap-4'>
                      <Badge variant='outline' className='bg-blue-50'>
                        Source: {lead.source}
                      </Badge>
                      {lead.businessInfo.revenue && (
                        <Badge variant='outline' className='bg-green-50'>
                          Revenue: {lead.businessInfo.revenue}
                        </Badge>
                      )}
                      {lead.businessInfo.size && (
                        <Badge variant='outline' className='bg-purple-50'>
                          Size: {lead.businessInfo.size}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value='analytics' className='space-y-6'>
          {serviceStatus && (
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div>
                      <h4 className='mb-3 font-medium'>Lead Quality Metrics</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='text-sm'>Average Score:</span>
                          <span className='font-medium'>
                            {serviceStatus.integration.averageLeadScore}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-sm'>Conversion Rate:</span>
                          <span className='font-medium text-green-600'>
                            {serviceStatus.integration.conversionRate}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-sm'>Scoring Method:</span>
                          <span className='font-medium'>
                            {serviceStatus.integration.scoringMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-3 font-medium'>Data Sources</h4>
                      <div className='space-y-2'>
                        {serviceStatus.integration.leadSources.map(
                          (source, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-2'
                            >
                              <CheckCircle className='h-4 w-4 text-green-600' />
                              <span className='text-sm'>{source}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Competitive Advantage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>2.17M+</div>
                  <div className='text-sm text-gray-600'>Total Companies</div>
                  <div className='mt-1 text-xs text-gray-500'>
                    vs Freight Genie's limited database
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    100/100
                  </div>
                  <div className='text-sm text-gray-600'>AI Scoring</div>
                  <div className='mt-1 text-xs text-gray-500'>
                    vs basic lead lists
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>$249</div>
                  <div className='text-sm text-gray-600'>Lifetime Cost</div>
                  <div className='mt-1 text-xs text-gray-500'>
                    vs ongoing subscriptions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
