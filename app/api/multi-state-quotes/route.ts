import { NextRequest, NextResponse } from 'next/server';
import { multiStateQuoteService } from '../../services/MultiStateQuoteService';

/**
 * 🌎 MULTI-STATE CONSOLIDATED QUOTES API
 * Enterprise-grade API for managing multi-state logistics quotes
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const quoteId = searchParams.get('quoteId');

    switch (action) {
      case 'all-quotes':
        const allQuotes = multiStateQuoteService.getAllQuotes();
        return NextResponse.json({
          success: true,
          quotes: allQuotes,
          summary: {
            totalQuotes: allQuotes.length,
            totalValue: allQuotes.reduce(
              (sum, q) => sum + q.financialSummary.totalAnnualRevenue,
              0
            ),
            averageValue:
              allQuotes.length > 0
                ? allQuotes.reduce(
                    (sum, q) => sum + q.financialSummary.totalAnnualRevenue,
                    0
                  ) / allQuotes.length
                : 0,
            statusBreakdown: allQuotes.reduce(
              (acc, q) => {
                acc[q.status] = (acc[q.status] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            ),
          },
        });

      case 'quote-details':
        if (!quoteId) {
          return NextResponse.json(
            { success: false, error: 'Quote ID required' },
            { status: 400 }
          );
        }

        const quote = multiStateQuoteService.getQuote(quoteId);
        if (!quote) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          quote,
          pricing: multiStateQuoteService.calculateConsolidatedPricing(
            quote.stateRoutes
          ),
          optimization: multiStateQuoteService.generateRouteOptimization(
            quote.stateRoutes
          ),
        });

      case 'pricing-calculator':
        const states = searchParams.get('states')?.split(',') || [];
        if (states.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'States required for pricing calculation',
            },
            { status: 400 }
          );
        }

        // Create mock state routes for pricing calculation
        const mockStateRoutes = states.map((state) => ({
          state,
          stateName: state,
          region: 'Various' as const,
          origins: [
            {
              id: `${state}-001`,
              city: 'City',
              address: 'Address',
              coordinates: { lat: 0, lng: 0 },
              facilityType: 'distribution' as const,
              weeklyVolume: 150,
              monthlyVolume: 650,
              specialRequirements: [],
              operatingHours: { start: '06:00', end: '18:00' },
              dockCount: 10,
              equipmentTypes: ['Dry Van'],
            },
          ],
          destinations: [
            {
              id: `${state}-DEST-001`,
              city: 'Destination City',
              state: state,
              address: 'Destination Address',
              coordinates: { lat: 0, lng: 0 },
              facilityType: 'retail',
              weeklyVolume: 75,
              monthlyVolume: 325,
              timeWindows: [{ start: '08:00', end: '16:00' }],
              specialRequirements: [],
              priority: 'medium' as const,
            },
          ],
          stateRequirements: {
            permits: [],
            regulations: [],
            equipmentRestrictions: [],
            driverRequirements: [],
            seasonalConsiderations: [],
            weatherFactors: [],
            tolls: { average: 0, routes: [] },
            fuelTaxes: 0,
          },
          stateMetrics: {
            averageTransitTime: 24,
            congestionFactor: 1.0,
            costMultiplier: 1.0,
            seasonalVariation: 0.05,
            weatherRisk: 'low' as const,
            regulatoryComplexity: 'simple' as const,
          },
        }));

        const pricingCalculation =
          multiStateQuoteService.calculateConsolidatedPricing(mockStateRoutes);
        const routeOptimization =
          multiStateQuoteService.generateRouteOptimization(mockStateRoutes);

        return NextResponse.json({
          success: true,
          pricing: pricingCalculation,
          optimization: routeOptimization,
          recommendations: {
            volumeDiscountEligible: mockStateRoutes.length >= 3,
            consolidationSavings: mockStateRoutes.length * 0.08,
            recommendedContractLength:
              mockStateRoutes.length > 5 ? '24 months' : '12 months',
          },
        });

      case 'market-analysis':
        return NextResponse.json({
          success: true,
          marketData: {
            industryAverageRates: {
              perMile: 2.85,
              perStop: 85,
              fuelSurcharge: 0.42,
            },
            competitivePosition: {
              ourRates: {
                perMile: 2.5,
                perStop: 75,
                fuelSurcharge: 0.35,
              },
              advantage: '12% cost advantage',
              marketShare: '15% in multi-state logistics',
            },
            trendAnalysis: {
              rateIncrease: '8% year-over-year',
              demandGrowth: '15% in multi-state consolidation',
              fuelTrends: 'Stable with seasonal variation',
            },
          },
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Multi-State Quotes API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create-quote':
        const { quoteData } = body;
        if (!quoteData) {
          return NextResponse.json(
            { success: false, error: 'Quote data required' },
            { status: 400 }
          );
        }

        const newQuote = multiStateQuoteService.createQuote(quoteData);
        return NextResponse.json({
          success: true,
          quote: newQuote,
          message: 'Multi-state quote created successfully',
        });

      case 'update-quote':
        const { quoteId, updates } = body;
        if (!quoteId || !updates) {
          return NextResponse.json(
            { success: false, error: 'Quote ID and updates required' },
            { status: 400 }
          );
        }

        const updatedQuote = multiStateQuoteService.updateQuote(
          quoteId,
          updates
        );
        if (!updatedQuote) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          quote: updatedQuote,
          message: 'Multi-state quote updated successfully',
        });

      case 'submit-quote':
        const { submitQuoteId } = body;
        if (!submitQuoteId) {
          return NextResponse.json(
            { success: false, error: 'Quote ID required' },
            { status: 400 }
          );
        }

        const quoteToSubmit = multiStateQuoteService.getQuote(submitQuoteId);
        if (!quoteToSubmit) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        const submittedQuote = multiStateQuoteService.updateQuote(
          submitQuoteId,
          {
            status: 'submitted',
            submittedDate: new Date().toISOString(),
          }
        );

        return NextResponse.json({
          success: true,
          quote: submittedQuote,
          message: 'Multi-state quote submitted successfully',
        });

      case 'approve-quote':
        const { approveQuoteId, approverRole } = body;
        if (!approveQuoteId || !approverRole) {
          return NextResponse.json(
            { success: false, error: 'Quote ID and approver role required' },
            { status: 400 }
          );
        }

        const quoteToApprove = multiStateQuoteService.getQuote(approveQuoteId);
        if (!quoteToApprove) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        // Update approval workflow
        const updatedApprovalWorkflow = {
          ...quoteToApprove.approvalWorkflow,
          requiredApprovals:
            quoteToApprove.approvalWorkflow.requiredApprovals.map((approval) =>
              approval.role === approverRole
                ? {
                    ...approval,
                    status: 'approved' as const,
                    timestamp: new Date().toISOString(),
                  }
                : approval
            ),
        };

        // Check if all approvals are complete
        const allApproved = updatedApprovalWorkflow.requiredApprovals.every(
          (a) => a.status === 'approved'
        );
        const newStatus = allApproved ? 'approved' : 'under_review';

        const approvedQuote = multiStateQuoteService.updateQuote(
          approveQuoteId,
          {
            status: newStatus,
            approvalWorkflow: updatedApprovalWorkflow,
          }
        );

        return NextResponse.json({
          success: true,
          quote: approvedQuote,
          message: allApproved
            ? 'Multi-state quote fully approved'
            : 'Approval recorded, awaiting additional approvals',
        });

      case 'generate-proposal':
        const { proposalQuoteId } = body;
        if (!proposalQuoteId) {
          return NextResponse.json(
            { success: false, error: 'Quote ID required' },
            { status: 400 }
          );
        }

        const quoteForProposal =
          multiStateQuoteService.getQuote(proposalQuoteId);
        if (!quoteForProposal) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        // Generate comprehensive proposal document
        const proposal = {
          id: `PROPOSAL-${proposalQuoteId}`,
          quoteId: proposalQuoteId,
          generatedDate: new Date().toISOString(),
          title: `Multi-State Logistics Proposal: ${quoteForProposal.quoteName}`,
          executiveSummary: `FleetFlow is pleased to present this comprehensive multi-state logistics solution for ${quoteForProposal.client.name}. Our AI-powered platform will optimize operations across ${quoteForProposal.stateRoutes.length} states, delivering an estimated annual value of $${(quoteForProposal.financialSummary.totalAnnualRevenue / 1000000).toFixed(1)}M with significant cost savings through consolidation and route optimization.`,
          keyBenefits: [
            `Multi-state consolidation across ${quoteForProposal.stateRoutes.length} strategic locations`,
            `Annual cost savings of $${((quoteForProposal.financialSummary.totalAnnualRevenue * 0.15) / 1000000).toFixed(1)}M through volume discounts`,
            `Advanced AI route optimization reducing transit times by 15-25%`,
            `Real-time visibility and reporting across all operations`,
            `Dedicated account management and 24/7 support`,
          ],
          pricing: multiStateQuoteService.calculateConsolidatedPricing(
            quoteForProposal.stateRoutes
          ),
          implementation: quoteForProposal.implementationPlan,
          terms: quoteForProposal.contractTerms,
        };

        return NextResponse.json({
          success: true,
          proposal,
          message: 'Proposal generated successfully',
        });

      case 'competitive-analysis':
        const { analysisQuoteId } = body;
        if (!analysisQuoteId) {
          return NextResponse.json(
            { success: false, error: 'Quote ID required' },
            { status: 400 }
          );
        }

        const quoteForAnalysis =
          multiStateQuoteService.getQuote(analysisQuoteId);
        if (!quoteForAnalysis) {
          return NextResponse.json(
            { success: false, error: 'Quote not found' },
            { status: 404 }
          );
        }

        const competitiveAnalysis = {
          ourProposal: {
            totalValue: quoteForAnalysis.financialSummary.totalAnnualRevenue,
            ratePerMile:
              quoteForAnalysis.financialSummary.totalAnnualRevenue /
              quoteForAnalysis.financialSummary.totalAnnualMiles,
            states: quoteForProposal.stateRoutes.length,
            technology: 'Advanced AI optimization',
            support: '24/7 dedicated support',
          },
          competitors: [
            {
              name: 'C.H. Robinson',
              estimatedValue:
                quoteForAnalysis.financialSummary.totalAnnualRevenue * 1.12,
              ratePerMile: 2.85,
              advantages: ['Large network', 'Established relationships'],
              disadvantages: ['Higher costs', 'Limited technology integration'],
            },
            {
              name: 'XPO Logistics',
              estimatedValue:
                quoteForAnalysis.financialSummary.totalAnnualRevenue * 1.08,
              ratePerMile: 2.75,
              advantages: ['Technology focus', 'Last-mile capabilities'],
              disadvantages: [
                'Limited multi-state optimization',
                'Higher accessorial charges',
              ],
            },
            {
              name: 'J.B. Hunt',
              estimatedValue:
                quoteForAnalysis.financialSummary.totalAnnualRevenue * 1.15,
              ratePerMile: 2.95,
              advantages: ['Intermodal capabilities', 'Capacity'],
              disadvantages: ['Highest pricing', 'Less flexible service'],
            },
          ],
          ourAdvantages: [
            '12-15% cost advantage over major competitors',
            'Only platform with true multi-state AI optimization',
            'Real-time visibility and predictive analytics',
            'Consolidated billing and reporting',
            'Performance-based incentives',
          ],
          winProbability: 78,
          recommendedStrategy:
            'Emphasize technology differentiation and cost savings while highlighting superior service levels',
        };

        return NextResponse.json({
          success: true,
          analysis: competitiveAnalysis,
          message: 'Competitive analysis generated successfully',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Multi-State Quotes API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID required' },
        { status: 400 }
      );
    }

    const quote = multiStateQuoteService.getQuote(quoteId);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }

    // In a real implementation, this would delete from database
    // For now, we'll just mark as cancelled
    const cancelledQuote = multiStateQuoteService.updateQuote(quoteId, {
      status: 'cancelled' as any,
      lastModified: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Multi-state quote cancelled successfully',
      quote: cancelledQuote,
    });
  } catch (error) {
    console.error('Multi-State Quotes DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}









































































