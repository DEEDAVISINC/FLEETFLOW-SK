'use client';

import {
  Building,
  Factory,
  Globe,
  Loader2,
  MapPin,
  Phone,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface LeadResult {
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  website?: string;
  industryType?: string;
  enhancedLeadScore?: number;
  freightVolume?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  freightVolumeEstimate?: {
    monthlyShipments: number;
    averageLoadValue: number;
    potentialRevenue: number;
    confidence: number;
  };
  fmcsaMatches?: {
    dotNumber?: string;
    mcNumber?: string;
    carrierRelationships?: string;
  };
}

interface SearchParams {
  action: string;
  industry?: string;
  location?: string;
  productKeywords?: string[];
}

export default function ThomasNetLeadGenerator() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    action: 'freight_focused_search',
    location: '',
  });
  const [results, setResults] = useState<LeadResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState<{
    total: number;
    highQuality: number;
    averageScore: number;
    withFMCSA: number;
  } | null>(null);

  const industries = [
    { value: 'automotive', label: 'Automotive Manufacturing' },
    { value: 'steel', label: 'Steel & Metal Fabrication' },
    { value: 'chemical', label: 'Chemical Manufacturing' },
    { value: 'construction', label: 'Construction Materials' },
    { value: 'machinery', label: 'Industrial Machinery' },
    { value: 'food', label: 'Food Processing' },
  ];

  const searchActions = [
    { value: 'freight_focused_search', label: 'High Freight Volume Companies' },
    { value: 'search_by_industry', label: 'Industry-Specific Search' },
    { value: 'search_manufacturers', label: 'Custom Manufacturer Search' },
    { value: 'search_wholesalers', label: 'Wholesale/Distribution Search' },
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    setResults([]);
    setSearchStats(null);

    try {
      console.info('Starting ThomasNet search with params:', searchParams);

      const requestBody: any = { ...searchParams };

      // Add product keywords if custom search
      if (searchParams.action === 'search_manufacturers') {
        requestBody.productKeywords = ['manufacturing', 'industrial'];
      }

      const response = await fetch('/api/thomas-net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setResults(data.data);

        // Calculate search statistics
        const highQualityLeads = data.data.filter(
          (lead: LeadResult) => (lead.enhancedLeadScore || 0) >= 80
        );
        const withFMCSA = data.data.filter(
          (lead: LeadResult) => lead.fmcsaMatches
        );
        const averageScore =
          data.data.reduce(
            (sum: number, lead: LeadResult) =>
              sum + (lead.enhancedLeadScore || 0),
            0
          ) / data.data.length;

        setSearchStats({
          total: data.data.length,
          highQuality: highQualityLeads.length,
          averageScore: Math.round(averageScore),
          withFMCSA: withFMCSA.length,
        });

        console.info(
          `ThomasNet search completed: ${data.data.length} leads found`
        );
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('ThomasNet search error:', error);
      alert(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSearching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFreightVolumeColor = (volume: string) => {
    switch (volume) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(1)}K`;
    }
    return `$${revenue.toLocaleString()}`;
  };

  return (
    <div className='mx-auto max-w-7xl space-y-6 p-6'>
      <div className='mb-6 flex items-center gap-3'>
        <Factory className='h-8 w-8 text-blue-600' />
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            ThomasNet Lead Generator
          </h1>
          <p className='text-gray-600'>
            Discover high-value manufacturing and wholesale leads with
            AI-enhanced scoring
          </p>
        </div>
      </div>

      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Search className='h-5 w-5' />
            Lead Discovery Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Search Type
              </label>
              <Select
                value={searchParams.action}
                onValueChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, action: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select search type' />
                </SelectTrigger>
                <SelectContent>
                  {searchActions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {searchParams.action === 'search_by_industry' && (
              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Industry
                </label>
                <Select
                  value={searchParams.industry}
                  onValueChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, industry: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select industry' />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className='mb-2 block text-sm font-medium'>
                Location (Optional)
              </label>
              <Input
                placeholder='e.g., Texas, Detroit MI, California'
                value={searchParams.location || ''}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className='w-full md:w-auto'
          >
            {isSearching ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Searching ThomasNet...
              </>
            ) : (
              <>
                <Search className='mr-2 h-4 w-4' />
                Start Lead Discovery
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Statistics */}
      {searchStats && (
        <Card>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {searchStats.total}
                </div>
                <div className='text-sm text-gray-600'>Total Leads</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {searchStats.highQuality}
                </div>
                <div className='text-sm text-gray-600'>High Quality (80+)</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  {searchStats.averageScore}
                </div>
                <div className='text-sm text-gray-600'>Avg Score</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {searchStats.withFMCSA}
                </div>
                <div className='text-sm text-gray-600'>FMCSA Matched</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>
            Lead Results ({results.length})
          </h2>

          {results.map((lead, index) => (
            <Card key={index} className='transition-shadow hover:shadow-md'>
              <CardContent className='pt-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                      {lead.companyName || 'Unknown Company'}
                    </h3>

                    <div className='mb-3 flex flex-wrap gap-2'>
                      {lead.enhancedLeadScore && (
                        <Badge
                          className={`${getScoreColor(lead.enhancedLeadScore)} border`}
                        >
                          <TrendingUp className='mr-1 h-3 w-3' />
                          Score: {lead.enhancedLeadScore}
                        </Badge>
                      )}

                      {lead.freightVolume && (
                        <Badge
                          className={`${getFreightVolumeColor(lead.freightVolume)} border`}
                        >
                          <Factory className='mr-1 h-3 w-3' />
                          {lead.freightVolume} Volume
                        </Badge>
                      )}

                      {lead.fmcsaMatches && (
                        <Badge className='border border-purple-200 bg-purple-100 text-purple-800'>
                          <Building className='mr-1 h-3 w-3' />
                          FMCSA Match
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3'>
                  {/* Contact Information */}
                  <div className='space-y-2'>
                    <h4 className='font-medium text-gray-700'>Contact Info</h4>
                    {lead.phone && (
                      <div className='flex items-center gap-2'>
                        <Phone className='h-4 w-4 text-gray-400' />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.address && (
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-gray-400' />
                        <span>{lead.address}</span>
                      </div>
                    )}
                    {lead.website && (
                      <div className='flex items-center gap-2'>
                        <Globe className='h-4 w-4 text-gray-400' />
                        <a
                          href={lead.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline'
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Business Information */}
                  <div className='space-y-2'>
                    <h4 className='font-medium text-gray-700'>Business Info</h4>
                    {lead.industryType && (
                      <div className='flex items-center gap-2'>
                        <Factory className='h-4 w-4 text-gray-400' />
                        <span>{lead.industryType}</span>
                      </div>
                    )}
                    {lead.fmcsaMatches?.dotNumber && (
                      <div className='flex items-center gap-2'>
                        <Building className='h-4 w-4 text-gray-400' />
                        <span>DOT: {lead.fmcsaMatches.dotNumber}</span>
                      </div>
                    )}
                    {lead.fmcsaMatches?.carrierRelationships && (
                      <div className='flex items-center gap-2'>
                        <Users className='h-4 w-4 text-gray-400' />
                        <span>{lead.fmcsaMatches.carrierRelationships}</span>
                      </div>
                    )}
                  </div>

                  {/* Revenue Potential */}
                  {lead.freightVolumeEstimate && (
                    <div className='space-y-2'>
                      <h4 className='font-medium text-gray-700'>
                        Revenue Potential
                      </h4>
                      <div className='space-y-1 text-xs'>
                        <div>
                          Monthly Shipments:{' '}
                          {lead.freightVolumeEstimate.monthlyShipments}
                        </div>
                        <div>
                          Avg Load:{' '}
                          {formatRevenue(
                            lead.freightVolumeEstimate.averageLoadValue
                          )}
                        </div>
                        <div className='font-medium text-green-600'>
                          Monthly Revenue:{' '}
                          {formatRevenue(
                            lead.freightVolumeEstimate.potentialRevenue
                          )}
                        </div>
                        <div className='text-gray-500'>
                          Confidence:{' '}
                          {Math.round(
                            lead.freightVolumeEstimate.confidence * 100
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='mt-4 flex gap-2 border-t pt-4'>
                  {lead.phone && (
                    <Button variant='outline' size='sm'>
                      <Phone className='mr-1 h-4 w-4' />
                      Call
                    </Button>
                  )}
                  <Button variant='outline' size='sm'>
                    Add to CRM
                  </Button>
                  <Button variant='outline' size='sm'>
                    Create Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isSearching && results.length === 0 && (
        <Card>
          <CardContent className='pt-6 text-center'>
            <Factory className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              Ready to Discover Leads
            </h3>
            <p className='mb-4 text-gray-600'>
              Configure your search parameters above and click ""Start Lead
              Discovery"" to find high-value manufacturing and wholesale
              prospects.
            </p>
            <div className='text-sm text-gray-500'>
              <p>• AI-enhanced lead scoring (70-100 points)</p>
              <p>• FMCSA cross-referencing for verification</p>
              <p>• Freight volume estimation and revenue potential</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
