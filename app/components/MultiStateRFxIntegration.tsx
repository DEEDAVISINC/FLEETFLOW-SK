'use client';

import { useEffect, useState } from 'react';
import {
  MultiStateConsolidatedQuote,
  multiStateQuoteService,
} from '../services/MultiStateQuoteService';

interface MultiStateRFxIntegrationProps {
  onRFxGenerated?: (rfxData: any) => void;
}

export default function MultiStateRFxIntegration({
  onRFxGenerated,
}: MultiStateRFxIntegrationProps) {
  const [selectedQuote, setSelectedQuote] =
    useState<MultiStateConsolidatedQuote | null>(null);
  const [availableQuotes, setAvailableQuotes] = useState<
    MultiStateConsolidatedQuote[]
  >([]);
  const [isGeneratingRFx, setIsGeneratingRFx] = useState(false);
  const [generatedRFx, setGeneratedRFx] = useState<any>(null);

  useEffect(() => {
    // Load available quotes
    const quotes = multiStateQuoteService
      .getAllQuotes()
      .filter((q) => q.status === 'approved' || q.status === 'under_review');
    setAvailableQuotes(quotes);
  }, []);

  const generateRFxFromQuote = async (quote: MultiStateConsolidatedQuote) => {
    setIsGeneratingRFx(true);

    try {
      // Generate comprehensive RFx document from multi-state quote
      const rfxDocument = {
        id: `RFX-${quote.id}-${Date.now()}`,
        type: 'Multi-State Logistics RFP',
        title: `Request for Proposal: ${quote.quoteName}`,
        client: quote.client,
        generatedDate: new Date().toISOString(),
        submissionDeadline: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(), // 14 days

        // Executive Summary
        executiveSummary: `${quote.client.name} is seeking proposals for comprehensive multi-state logistics services across ${quote.stateRoutes.length} strategic locations. This RFP encompasses transportation, warehousing, and value-added services with an estimated annual value of $${(quote.financialSummary.totalAnnualRevenue / 1000000).toFixed(1)}M.`,

        // Scope of Work
        scopeOfWork: {
          overview: `Multi-state logistics operations covering ${quote.stateRoutes.map((sr) => sr.stateName).join(', ')}`,
          services: [
            'Full Truckload (FTL) Transportation',
            'Less Than Truckload (LTL) Consolidation',
            'Cross-dock Operations',
            'Warehousing and Distribution',
            'Real-time Tracking and Visibility',
            'Dedicated Fleet Management',
            'Emergency and Expedited Services',
          ],
          volume: {
            annualLoads: quote.financialSummary.totalAnnualVolume,
            annualMiles: quote.financialSummary.totalAnnualMiles,
            averageLoadWeight: '45,000 lbs',
            equipmentTypes: ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck'],
          },
        },

        // Geographic Coverage
        geographicCoverage: {
          primaryStates: quote.stateRoutes.map((sr) => ({
            state: sr.stateName,
            region: sr.region,
            origins: sr.origins.length,
            destinations: sr.destinations.length,
            monthlyVolume: sr.origins.reduce(
              (sum, o) => sum + o.monthlyVolume,
              0
            ),
            specialRequirements: sr.stateRequirements.regulations,
          })),
          serviceArea: 'Multi-state coverage with potential for expansion',
          crossDockingRequirements:
            'Strategic consolidation points for efficiency optimization',
        },

        // Service Requirements
        serviceRequirements: {
          transitTimes: quote.sla.transitTimes,
          onTimeDelivery: `${(quote.sla.onTimeDeliveryGuarantee * 100).toFixed(1)}% minimum`,
          communication: quote.sla.communicationRequirements,
          reporting: quote.sla.reportingRequirements,
          qualityStandards: quote.sla.qualityStandards,
          insurance: {
            generalLiability: '$2M minimum',
            autoLiability: '$1M minimum',
            cargoInsurance: '$250K minimum',
            workersCompensation: 'As required by law',
          },
        },

        // Technology Requirements
        technologyRequirements: {
          tracking: 'Real-time GPS tracking with 15-minute updates',
          edi: 'EDI 204, 214, 990 transaction sets',
          api: 'RESTful API integration for TMS connectivity',
          reporting: 'Automated reporting with custom dashboard access',
          mobile: 'Driver mobile app with POD capture',
          visibility: '24/7 web portal access for shipment visibility',
        },

        // Pricing Structure
        pricingStructure: {
          rateStructure: 'Per-mile pricing with volume discounts',
          fuelSurcharge: 'Weekly DOE average with 2-week lag',
          accessorials: 'Detailed accessorial schedule required',
          volumeIncentives: 'Tiered discount structure based on annual volume',
          paymentTerms: 'Net 30 days from invoice date',
          rateProtection: 'Annual rate increases capped at 5%',
        },

        // Evaluation Criteria
        evaluationCriteria: {
          pricing: { weight: 35, description: 'Total cost of ownership' },
          serviceQuality: {
            weight: 25,
            description: 'On-time performance and service reliability',
          },
          technology: {
            weight: 20,
            description: 'Technology capabilities and integration',
          },
          experience: {
            weight: 10,
            description: 'Multi-state logistics experience',
          },
          financial: {
            weight: 5,
            description: 'Financial stability and insurance',
          },
          sustainability: {
            weight: 5,
            description: 'Environmental initiatives and fuel efficiency',
          },
        },

        // Submission Requirements
        submissionRequirements: {
          format: 'Electronic submission via FleetFlow RFx portal',
          sections: [
            'Company Overview and Qualifications',
            'Multi-State Service Capabilities',
            'Technology Platform Demonstration',
            'Pricing Proposal with Volume Discounts',
            'Implementation Timeline and Plan',
            'References from Similar Engagements',
            'Insurance Certificates',
            'Financial Statements (last 2 years)',
          ],
          deadline: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          contactInfo: {
            primaryContact: quote.client.contactPerson,
            email: quote.client.email,
            phone: quote.client.phone,
          },
        },

        // Contract Terms Preview
        contractTermsPreview: {
          duration: quote.contractTerms.duration,
          autoRenewal: quote.contractTerms.autoRenewal,
          volumeCommitments: quote.contractTerms.volumeCommitments,
          performanceStandards: {
            onTimeDelivery: `${(quote.sla.onTimeDeliveryGuarantee * 100).toFixed(1)}% minimum`,
            damageRatio: '0.5% maximum',
            billingAccuracy: '99.5% minimum',
          },
          penalties: quote.contractTerms.penalties,
          incentives: quote.contractTerms.incentives,
        },

        // Competitive Intelligence
        marketContext: {
          industryTrends: [
            'Increasing demand for multi-state consolidation',
            'Technology integration becoming standard',
            'Sustainability requirements growing',
            'Driver shortage affecting capacity',
          ],
          expectedParticipants: [
            'Major 3PL providers',
            'Regional transportation companies',
            'Technology-enabled logistics providers',
          ],
          estimatedResponseRate: '65-75% of invited participants',
        },

        // AI-Generated Insights
        aiInsights: {
          optimalPricing: `Based on market analysis, competitive pricing range: $${(quote.financialSummary.averageRevenuePerLoad * 0.9).toFixed(0)} - $${(quote.financialSummary.averageRevenuePerLoad * 1.1).toFixed(0)} per load`,
          keyDifferentiators: [
            'Multi-state consolidation expertise',
            'Advanced route optimization technology',
            'Real-time visibility platform',
            'Performance-based pricing models',
          ],
          riskFactors: [
            'Seasonal demand variations',
            'Fuel price volatility',
            'Regulatory compliance complexity',
            'Equipment positioning challenges',
          ],
          successProbability: `${quote.competitiveAnalysis.winProbability}% based on competitive positioning`,
        },
      };

      setGeneratedRFx(rfxDocument);
      onRFxGenerated?.(rfxDocument);
    } catch (error) {
      console.error('Error generating RFx:', error);
    } finally {
      setIsGeneratingRFx(false);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          🔗 Multi-State RFx Integration
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0',
          }}
        >
          Generate comprehensive RFx documents from approved multi-state quotes
        </p>
      </div>

      {/* Available Quotes */}
      <div style={{ marginBottom: '30px' }}>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px',
          }}
        >
          📋 Available Quotes for RFx Generation
        </h3>

        {availableQuotes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0' }}>
              No approved quotes available for RFx generation
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            {availableQuotes.map((quote) => (
              <div
                key={quote.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  border:
                    selectedQuote?.id === quote.id
                      ? '2px solid #3b82f6'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setSelectedQuote(quote)}
                onMouseOver={(e) => {
                  if (selectedQuote?.id !== quote.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedQuote?.id !== quote.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0',
                    }}
                  >
                    {quote.quoteName}
                  </h4>
                  <span
                    style={{
                      background:
                        quote.status === 'approved' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {quote.status.replace('_', ' ')}
                  </span>
                </div>

                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    margin: '0 0 12px 0',
                  }}
                >
                  {quote.client.name}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#3b82f6',
                        fontSize: '18px',
                        fontWeight: '700',
                      }}
                    >
                      $
                      {(
                        quote.financialSummary.totalAnnualRevenue / 1000000
                      ).toFixed(1)}
                      M
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Annual Value
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {quote.stateRoutes.length} States
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Coverage Area
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {quote.stateRoutes.slice(0, 3).map((sr) => (
                    <span
                      key={sr.state}
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#93c5fd',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}
                    >
                      {sr.state}
                    </span>
                  ))}
                  {quote.stateRoutes.length > 3 && (
                    <span
                      style={{
                        background: 'rgba(107, 114, 128, 0.2)',
                        color: '#d1d5db',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}
                    >
                      +{quote.stateRoutes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RFx Generation */}
      {selectedQuote && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            marginBottom: '30px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            🚀 Generate RFx Document
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                }}
              >
                Selected Quote: <strong>{selectedQuote.quoteName}</strong>
              </p>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0',
                  fontSize: '14px',
                }}
              >
                Generate comprehensive RFP document with AI-powered insights and
                competitive analysis
              </p>
            </div>

            <button
              onClick={() => generateRFxFromQuote(selectedQuote)}
              disabled={isGeneratingRFx}
              style={{
                background: isGeneratingRFx
                  ? 'rgba(107, 114, 128, 0.5)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: isGeneratingRFx ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '140px',
              }}
            >
              {isGeneratingRFx ? '🔄 Generating...' : '📄 Generate RFx'}
            </button>
          </div>
        </div>
      )}

      {/* Generated RFx Preview */}
      {generatedRFx && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                margin: '0',
              }}
            >
              ✅ RFx Document Generated
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                📧 Send to Client
              </button>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                📄 Download PDF
              </button>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 12px 0',
              }}
            >
              {generatedRFx.title}
            </h4>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                margin: '0 0 16px 0',
                lineHeight: '1.6',
              }}
            >
              {generatedRFx.executiveSummary}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '18px',
                    fontWeight: '700',
                  }}
                >
                  $
                  {(
                    (generatedRFx.scopeOfWork.volume.annualLoads *
                      generatedRFx.aiInsights.optimalPricing
                        .split('$')[1]
                        .split(' ')[0]) /
                    1000000
                  ).toFixed(1)}
                  M
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Estimated Value
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {generatedRFx.geographicCoverage.primaryStates.length} States
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Geographic Coverage
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {generatedRFx.submissionRequirements.deadline}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Submission Deadline
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {generatedRFx.aiInsights.successProbability}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Win Probability
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {generatedRFx.aiInsights.keyDifferentiators.map(
              (diff: string, index: number) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(16, 185, 129, 0.3)',
                    color: '#6ee7b7',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '500',
                  }}
                >
                  {diff}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

















































