'use client';

import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  Phone,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import LRAFSourceDirectory from './LRAFSourceDirectory';

interface AgencyContact {
  name: string;
  title: string;
  email: string;
  phone?: string;
  office: string;
}

interface ForecastOpportunity {
  id: string;
  title: string;
  agency: string;
  agencyCode?: string;
  office?: string;
  predictedPostDate: string;
  estimatedValue: number;
  wosbProbability: number;
  competitionLevel: 'low' | 'medium' | 'high';
  winProbability: number;
  preparationTime: number;
  strategicImportance: number;
  naicsCode?: string;
  placeOfPerformance?: string;
  primaryContact?: AgencyContact;
  alternateContacts?: AgencyContact[];
  pastWinners?: string[];
  typicalBuyerBehavior?: string;
  keyRequirements?: string[];
}

interface SpendingForecast {
  agency: string;
  category: string;
  predictedValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface MarketForecast {
  sector: string;
  totalMarketSize: number;
  wosbOpportunities: number;
  growthRate: number;
  keyTrends: string[];
}

interface ForecastSummary {
  totalPredictedValue: number;
  wosbOpportunities: number;
  highProbabilityWins: number;
  strategicRecommendations: string[];
}

const GovContractForecaster: React.FC = () => {
  const [forecastData, setForecastData] = useState<{
    opportunityForecasts: ForecastOpportunity[];
    spendingForecasts: SpendingForecast[];
    marketForecasts: MarketForecast[];
    summary: ForecastSummary;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [selectedQuarters, setSelectedQuarters] = useState(4);
  const [forecastStatus, setForecastStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadAgency, setUploadAgency] = useState('');
  const [uploadAgencyCode, setUploadAgencyCode] = useState('');
  const [uploadFiscalYear, setUploadFiscalYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    // Don't auto-fetch on mount - let user click the button
    // fetchLatestForecast();
  }, []);

  const fetchLatestForecast = async () => {
    try {
      setIsLoading(true);
      setForecastStatus('Fetching latest forecasts...');
      const response = await fetch('/api/gov-contract-scan');

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('📊 Forecast API Response:', data);

      if (data.success && data.forecast) {
        // Transform the REAL forecast data
        setForecastData({
          opportunityForecasts: data.forecast.opportunityForecasts || [],
          spendingForecasts: [],
          marketForecasts: [],
          summary: data.forecast.summary || {
            totalPredictedValue: 0,
            wosbOpportunities: 0,
            highProbabilityWins: 0,
            strategicRecommendations: [],
          },
        });
        setLastGenerated(data.forecastedAt || new Date().toISOString());
        setForecastStatus(
          `Forecast generated: ${data.sources?.lraf?.forecastsFound || 0} LRAFs + ${data.sources?.contractExpirations?.analyzed || 0} expirations`
        );
      } else {
        console.warn('❌ API returned unsuccessful response:', data);
        setForecastStatus(data.error || 'No forecast data available');
      }
      setIsLoading(false);
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error';
      setForecastStatus(`❌ Error: ${errorMsg}`);
      console.error('❌ Error fetching forecast:', error);
      setIsLoading(false);
    }
  };

  const generateNewForecast = async (quarters: number = 4) => {
    setIsGenerating(true);
    setForecastStatus(
      `Generating ${quarters}-quarter forecast (LRAFs + Contract Expirations)...`
    );

    try {
      const monthsAhead = quarters * 3; // Convert quarters to months
      console.log('🔮 Generating forecast with params:', {
        monthsAhead,
        quarters,
      });

      const response = await fetch('/api/gov-contract-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthsAhead: monthsAhead,
          scanType: 'comprehensive',
        }),
      });

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('📊 Forecast Generation Response:', data);

      if (data.success && data.forecast) {
        setForecastData({
          opportunityForecasts: data.forecast.opportunityForecasts || [],
          spendingForecasts: [],
          marketForecasts: [],
          summary: data.forecast.summary || {
            totalPredictedValue: 0,
            wosbOpportunities: 0,
            highProbabilityWins: 0,
            strategicRecommendations: [],
          },
        });
        setLastGenerated(data.forecastedAt || new Date().toISOString());
        setForecastStatus(
          `✅ Forecast complete: ${data.metadata?.forecastCount || 0} opportunities, $${(data.metadata?.totalPredictedValue || 0).toLocaleString()} value, ${data.metadata?.wosbOpportunities || 0} WOSB-eligible`
        );
      } else {
        console.warn('❌ API returned unsuccessful response:', data);
        setForecastStatus(data.error || '❌ No forecast data returned');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error';
      console.error('❌ Error generating forecast:', error);
      setForecastStatus(`❌ Error: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!uploadAgency.trim()) {
      alert('Please enter the agency name before uploading');
      return;
    }

    setIsUploading(true);
    setForecastStatus(`📤 Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('agency', uploadAgency);
      formData.append('agencyCode', uploadAgencyCode || uploadAgency);
      formData.append('fiscalYear', uploadFiscalYear);

      console.log(`📤 Uploading ${file.name} for ${uploadAgency}...`);

      const response = await fetch('/api/lraf-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log(`✅ Upload successful:`, data);
      setForecastStatus(
        `✅ Extracted ${data.opportunitiesFound} opportunities from ${data.fileName}! Refreshing...`
      );

      // Refresh the forecast data
      await fetchLatestForecast();

      // Clear upload form
      setUploadAgency('');
      setUploadAgencyCode('');
      event.target.value = ''; // Reset file input
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setForecastStatus(`❌ Upload error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className='text-green-400' size={16} />;
      case 'decreasing':
        return <TrendingUp className='rotate-180 text-red-400' size={16} />;
      default:
        return <TrendingUp className='text-gray-400' size={16} />;
    }
  };

  const generateIntroductionEmail = (opp: ForecastOpportunity) => {
    if (!opp.primaryContact) {
      alert('No contact information available for this opportunity.');
      return;
    }

    const subject = `Introduction: DEE DAVIS INC - ${opp.title}`;
    const body = `Dear ${opp.primaryContact.name},

I hope this message finds you well. My name is [Your Name] from DEE DAVIS INC/DEPOINTE, a Women-Owned Small Business (WOSB) certified transportation company based in Michigan.

We specialize in ${opp.naicsCode ? `NAICS ${opp.naicsCode}` : 'transportation services'} and have been tracking upcoming opportunities with ${opp.agency}. We understand that your office may be planning to solicit for "${opp.title}" in the coming months.

We would welcome the opportunity to introduce our capabilities and discuss how we can support ${opp.agency}'s transportation needs. Key highlights of our company:

• WOSB Certified
• ${opp.placeOfPerformance ? `Serving ${opp.placeOfPerformance}` : 'Nationwide coverage'}
• Proven track record in government contracting
• Strong safety and compliance record

Would you be available for a brief call or meeting to discuss your upcoming requirements? I'm happy to work around your schedule.

Thank you for your time and consideration.

Best regards,
Dee Davis
DEE DAVIS INC/DEPOINTE
info@deedavis.biz
[Your Phone Number]`;

    window.open(
      `mailto:${opp.primaryContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  const addToPipeline = (opp: ForecastOpportunity) => {
    alert(
      `"${opp.title}" will be added to your RFx pipeline. This feature will save the opportunity to your dashboard for tracking and preparation.`
    );
    // TODO: Implement actual pipeline integration
  };

  const setAlert = (opp: ForecastOpportunity) => {
    alert(
      `You'll receive an alert when "${opp.title}" is posted to SAM.gov. Expected posting date: ${formatDate(opp.predictedPostDate)}`
    );
    // TODO: Implement actual alert system
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '8px',
              }}
            >
              🏛️ Long Range Acquisition Forecasts (LRAFs)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Federal, State, Local & Enterprise Procurement Intelligence
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tenant</div>
            <div
              style={{ fontWeight: '600', color: 'white', fontSize: '0.9rem' }}
            >
              DEE DAVIS INC/DEPOINTE
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
              ✓ WOSB Certified
            </div>
          </div>
        </div>

        {/* LRAF Source Directory - Browse First */}
        <div style={{ marginBottom: '30px' }}>
          <LRAFSourceDirectory />
        </div>

        {/* Forecast Controls */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            marginBottom: '30px',
          }}
        >
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
              }}
            >
              <BarChart3 size={18} />
              LRAF Intelligence Scanner
            </h3>
            {lastGenerated && (
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Last scanned: {formatDate(lastGenerated)}
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '12px',
                marginTop: 0,
              }}
            >
              📤 Upload LRAF Document
            </h4>

            <div
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                marginBottom: '16px',
              }}
            >
              Upload PDF or Excel files from Federal, State, Local, or
              Enterprise LRAF sources below. The system will automatically
              extract opportunities and save them to the database.
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                }}
              >
                <input
                  type='text'
                  placeholder='Agency Name (required) *'
                  value={uploadAgency}
                  onChange={(e) => setUploadAgency(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.9rem',
                  }}
                />
                <input
                  type='text'
                  placeholder='Agency Code (optional)'
                  value={uploadAgencyCode}
                  onChange={(e) => setUploadAgencyCode(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.9rem',
                  }}
                />
                <input
                  type='text'
                  placeholder='Fiscal Year'
                  value={uploadFiscalYear}
                  onChange={(e) => setUploadFiscalYear(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <label
                htmlFor='lraf-file-input'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  background: isUploading
                    ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isUploading
                  ? '⏳ Processing...'
                  : '📄 Select PDF or Excel File'}
                <input
                  id='lraf-file-input'
                  type='file'
                  accept='.pdf,.xls,.xlsx'
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <button
              onClick={() => generateNewForecast(4)}
              disabled={isGenerating}
              style={{
                background: isGenerating
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: isGenerating
                  ? 'none'
                  : '0 4px 15px rgba(6, 182, 212, 0.3)',
              }}
            >
              {isGenerating ? (
                <RefreshCw size={16} className='animate-spin' />
              ) : (
                <RefreshCw size={16} />
              )}
              {isGenerating
                ? 'Scanning LRAFs...'
                : '🏛️ Generate LRAF Intelligence'}
            </button>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Scan 17 federal agency forecasts for upcoming opportunities
            </div>
          </div>

          {forecastStatus && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.85rem',
                color: '#94a3b8',
              }}
            >
              {forecastStatus}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#94a3b8',
          }}
        >
          <div style={{ marginBottom: '20px', fontSize: '2rem' }}>🔄</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
            Loading forecast data...
          </div>
        </div>
      ) : !forecastData ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#94a3b8',
          }}
        >
          <div style={{ marginBottom: '20px', fontSize: '3rem' }}>📈</div>
          <div style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
            No forecast data available
          </div>
          <button
            onClick={() => generateNewForecast(4)}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
            }}
          >
            Generate Initial Forecast
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '20px',
          }}
        >
          {/* Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <DollarSign
                  style={{ color: '#10b981', fontSize: '1.5rem' }}
                  size={24}
                />
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {formatCurrency(forecastData.summary.totalPredictedValue)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Total Predicted Market
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <Award
                  style={{ color: '#3b82f6', fontSize: '1.5rem' }}
                  size={24}
                />
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {forecastData.summary.wosbOpportunities}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                WOSB Opportunities
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <Target
                  style={{ color: '#f59e0b', fontSize: '1.5rem' }}
                  size={24}
                />
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {forecastData.summary.highProbabilityWins}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                High Win Probability
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <Calendar
                  style={{ color: '#8b5cf6', fontSize: '1.5rem' }}
                  size={24}
                />
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {selectedQuarters}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Forecast Quarters
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
            }}
          >
            {/* Predicted Opportunities */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  margin: 0,
                }}
              >
                <Clock size={18} />
                Predicted Opportunities
              </h3>

              {forecastData.opportunityForecasts.length === 0 ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#64748b',
                  }}
                >
                  <div style={{ marginBottom: '12px', fontSize: '2rem' }}>
                    📊
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    No opportunities forecasted
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {forecastData.opportunityForecasts.map((opp) => (
                    <div
                      key={opp.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
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
                        <h4
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'white',
                            lineHeight: '1.3',
                            flex: 1,
                            marginRight: '12px',
                          }}
                        >
                          {opp.title}
                        </h4>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: '0.9rem',
                              fontWeight: '700',
                              color: '#10b981',
                            }}
                          >
                            {formatCurrency(opp.estimatedValue)}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#64748b',
                            }}
                          >
                            {opp.winProbability}% win prob
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                          fontSize: '0.8rem',
                          color: '#94a3b8',
                        }}
                      >
                        <span>{opp.agency}</span>
                        <span
                          style={{
                            color: getCompetitionColor(opp.competitionLevel),
                          }}
                        >
                          {opp.competitionLevel} competition
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                        }}
                      >
                        <span style={{ color: '#94a3b8' }}>
                          📅 Expected: {formatDate(opp.predictedPostDate)}
                        </span>
                        <span style={{ color: '#f59e0b' }}>
                          ⏱️ {opp.preparationTime} days prep
                        </span>
                      </div>

                      {opp.wosbProbability > 50 && (
                        <div
                          style={{
                            marginTop: '8px',
                            fontSize: '0.75rem',
                            color: '#10b981',
                          }}
                        >
                          ✓ WOSB Set-Aside Likely ({opp.wosbProbability}%)
                        </div>
                      )}

                      {/* Contact Information */}
                      {opp.primaryContact && (
                        <div
                          style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '8px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              color: '#06b6d4',
                              marginBottom: '8px',
                            }}
                          >
                            <User size={14} />
                            Primary Contact
                          </div>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'white',
                              marginBottom: '4px',
                            }}
                          >
                            {opp.primaryContact.name} -{' '}
                            {opp.primaryContact.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                              marginBottom: '2px',
                            }}
                          >
                            <Mail
                              size={12}
                              style={{ display: 'inline', marginRight: '4px' }}
                            />
                            {opp.primaryContact.email}
                          </div>
                          {opp.primaryContact.phone && (
                            <div
                              style={{ fontSize: '0.75rem', color: '#94a3b8' }}
                            >
                              <Phone
                                size={12}
                                style={{
                                  display: 'inline',
                                  marginRight: '4px',
                                }}
                              />
                              {opp.primaryContact.phone}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Buyer Intelligence */}
                      {opp.typicalBuyerBehavior && (
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '8px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            color: '#c4b5fd',
                          }}
                        >
                          💡 {opp.typicalBuyerBehavior}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div
                        style={{
                          marginTop: '12px',
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          onClick={() => generateIntroductionEmail(opp)}
                          disabled={!opp.primaryContact}
                          style={{
                            background:
                              'linear-gradient(135deg, #06b6d4, #0891b2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: opp.primaryContact
                              ? 'pointer'
                              : 'not-allowed',
                            opacity: opp.primaryContact ? 1 : 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Mail size={12} />
                          Send Introduction
                        </button>
                        <button
                          onClick={() => addToPipeline(opp)}
                          style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.5)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Target size={12} />
                          Add to Pipeline
                        </button>
                        <button
                          onClick={() => setAlert(opp)}
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.5)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Clock size={12} />
                          Set Alert
                        </button>
                      </div>

                      {/* Past Winners */}
                      {opp.pastWinners && opp.pastWinners.length > 0 && (
                        <div
                          style={{
                            marginTop: '8px',
                            fontSize: '0.7rem',
                            color: '#64748b',
                          }}
                        >
                          <Users
                            size={11}
                            style={{ display: 'inline', marginRight: '4px' }}
                          />
                          Past winners: {opp.pastWinners.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strategic Insights */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  margin: 0,
                }}
              >
                <Star size={18} />
                Strategic Insights
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '4px',
                    }}
                  >
                    WOSB Advantage
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Focus on WOSB set-aside opportunities for 3x higher win
                    rates
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px',
                    }}
                  >
                    Michigan Focus
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Prioritize state and local contracts for geographic
                    advantage
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#8b5cf6',
                      marginBottom: '4px',
                    }}
                  >
                    Healthcare Growth
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Medical transportation sector showing 15% growth
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#f59e0b',
                      marginBottom: '4px',
                    }}
                  >
                    Q1 Surge
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Prepare for fiscal year-end spending surge in Q1
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#06b6d4',
                      marginBottom: '4px',
                    }}
                  >
                    Relationship Building
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Build connections with contracting officers now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovContractForecaster;
