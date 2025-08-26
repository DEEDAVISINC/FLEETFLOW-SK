'use client';

import { useEffect, useState } from 'react';
import WarehouseQuoteBuilder from '../components/WarehouseQuoteBuilder';
import { EnhancedCarrierService } from '../services/enhanced-carrier-service';
import { FraudGuardService } from '../services/fraud-guard-service';
import { shipperAccountService } from '../services/shipper-account-service';

export default function GoWithTheFlow() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [shipperRequests, setShipperRequests] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [liveLoads, setLiveLoads] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [quoteStatus, setQuoteStatus] = useState<
    'idle' | 'generating' | 'completed' | 'error'
  >('idle');
  const [generatedQuotes, setGeneratedQuotes] = useState<any[]>([]);
  const [quoteProgress, setQuoteProgress] = useState(0);
  const [accountCreationResult, setAccountCreationResult] = useState<any>(null);
  const [showAccountSuccess, setShowAccountSuccess] = useState(false);
  const [showWarehouseBuilder, setShowWarehouseBuilder] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [carrierFraudAnalysis, setCarrierFraudAnalysis] = useState<any[]>([]);
  const [fraudAnalysisLoading, setFraudAnalysisLoading] = useState(false);
  const [serviceType, setServiceType] = useState<
    'direct' | 'marketplace' | null
  >(null);

  const fraudGuardService = new FraudGuardService();
  const carrierService = new EnhancedCarrierService();

  // Fetch system data on component mount
  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      // Fetch system metrics
      const metricsResponse = await fetch(
        '/api/go-with-the-flow?action=system-metrics'
      );
      const metricsData = await metricsResponse.json();
      if (metricsData.success) {
        setSystemMetrics(metricsData.metrics);
      }

      // Fetch available drivers
      const driversResponse = await fetch(
        '/api/go-with-the-flow?action=available-drivers'
      );
      const driversData = await driversResponse.json();
      if (driversData.success) {
        setAvailableDrivers(driversData.drivers);
      }

      // Fetch live loads
      const loadsResponse = await fetch(
        '/api/go-with-the-flow?action=live-loads'
      );
      const loadsData = await loadsResponse.json();
      if (loadsData.success) {
        setLiveLoads(loadsData.loads);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  // Enhanced FleetGuard AI Carrier Analysis with BrokerSnapshot Integration
  const analyzeCarrierSafety = async (
    carrierName: string,
    carrierData?: any
  ) => {
    try {
      let comprehensiveCarrierData = null;
      let brokerSnapshotData = null;
      let mcNumber = '';

      // If carrier data provided, extract MC number, otherwise generate one for demo
      if (carrierData && carrierData.mcNumber) {
        mcNumber = carrierData.mcNumber;
      } else {
        // Generate realistic MC number for demo
        mcNumber = `MC${Math.floor(Math.random() * 900000 + 100000)}`;
      }

      // Step 1: Get comprehensive carrier data (FMCSA + BrokerSnapshot)
      try {
        console.log(
          `🔍 FleetGuard AI: Analyzing carrier ${carrierName} (${mcNumber})...`
        );

        // Get comprehensive carrier data including BrokerSnapshot
        comprehensiveCarrierData =
          await carrierService.verifyCarrierComprehensive(mcNumber);

        // If comprehensive data not available, try BrokerSnapshot separately
        if (!comprehensiveCarrierData) {
          brokerSnapshotData =
            await carrierService.getCarrierBrokerSnapshot(mcNumber);
        }

        console.log(
          `📊 BrokerSnapshot data retrieved for ${carrierName}:`,
          brokerSnapshotData || comprehensiveCarrierData
        );
      } catch (error) {
        console.log(
          `⚠️ Real data unavailable for ${carrierName}, using enhanced mock data`
        );
      }

      // Step 2: Create enhanced analysis data combining FMCSA + BrokerSnapshot
      const analysisData = comprehensiveCarrierData || {
        mcNumber: mcNumber,
        dotNumber: `DOT${Math.floor(Math.random() * 900000 + 100000)}`,
        companyName: carrierName,
        physicalAddress: '123 Carrier Street, Transport City, TX 75001',
        mailingAddress: '123 Carrier Street, Transport City, TX 75001',
        phone: '(555) 123-4567',
        safetyRating:
          Math.random() > 0.8
            ? 'SATISFACTORY'
            : Math.random() > 0.6
              ? 'CONDITIONAL'
              : 'NOT_RATED',
        operatingStatus: 'ACTIVE',
        // Enhanced with BrokerSnapshot-style financial data
        creditScore:
          brokerSnapshotData?.creditScore ||
          (Math.floor(Math.random() * 200) + 600).toString(),
        paymentHistory:
          brokerSnapshotData?.paymentHistory ||
          (Math.random() > 0.7
            ? 'Excellent'
            : Math.random() > 0.4
              ? 'Good'
              : 'Fair'),
        averagePaymentDays:
          brokerSnapshotData?.averagePaymentDays ||
          Math.floor(Math.random() * 45) + 15,
        trackingEnabled:
          brokerSnapshotData?.trackingEnabled || Math.random() > 0.5,
        source: (comprehensiveCarrierData as any)?.source || 'ENHANCED_DEMO',
      };

      // Step 3: Run FleetGuard AI fraud analysis with enhanced data
      const analysis = await fraudGuardService.assessFraudRisk(analysisData);

      // Step 4: Calculate enhanced risk factors including BrokerSnapshot data
      const enhancedFlags = [...(analysis.primaryRiskFactors || [])];
      const enhancedRecommendations = [...(analysis.recommendations || [])];

      // Add BrokerSnapshot-specific risk factors
      if (
        analysisData.creditScore &&
        parseInt(analysisData.creditScore) < 650
      ) {
        enhancedFlags.push('Low credit score detected');
        enhancedRecommendations.push('Require payment guarantees or factoring');
      }

      if (
        analysisData.averagePaymentDays &&
        analysisData.averagePaymentDays > 45
      ) {
        enhancedFlags.push('Slow payment history');
        enhancedRecommendations.push('Monitor payment terms closely');
      }

      if (
        analysisData.paymentHistory === 'Fair' ||
        analysisData.paymentHistory === 'Poor'
      ) {
        enhancedFlags.push('Poor payment history reported');
        enhancedRecommendations.push('Consider payment protection');
      }

      if (!analysisData.trackingEnabled) {
        enhancedFlags.push('No real-time tracking capability');
        enhancedRecommendations.push('Require manual check-ins');
      }

      // Step 5: Adjust risk level based on financial data
      let adjustedRiskLevel = analysis.riskLevel;
      let adjustedConfidence = analysis.confidence;

      // Increase risk if multiple financial red flags
      const financialRiskCount = enhancedFlags.filter(
        (flag) =>
          flag.includes('credit') ||
          flag.includes('payment') ||
          flag.includes('tracking')
      ).length;

      if (financialRiskCount >= 2 && adjustedRiskLevel === 'low') {
        adjustedRiskLevel = 'medium';
      } else if (financialRiskCount >= 3 && adjustedRiskLevel === 'medium') {
        adjustedRiskLevel = 'high';
      }

      // Increase confidence when we have real BrokerSnapshot data
      if (comprehensiveCarrierData || brokerSnapshotData) {
        adjustedConfidence = Math.min(0.95, adjustedConfidence + 0.15);
      }

      return {
        carrierName,
        analysis,
        riskLevel: adjustedRiskLevel,
        confidence: adjustedConfidence,
        flags: enhancedFlags,
        recommendations: enhancedRecommendations,
        dataSource: analysisData.source,
        financialData: {
          creditScore: analysisData.creditScore,
          paymentHistory: analysisData.paymentHistory,
          averagePaymentDays: analysisData.averagePaymentDays,
          trackingEnabled: analysisData.trackingEnabled,
        },
      };
    } catch (error) {
      console.error(`FleetGuard AI analysis failed for ${carrierName}:`, error);
      return {
        carrierName,
        analysis: null,
        riskLevel: 'medium',
        confidence: 0,
        flags: ['Analysis temporarily unavailable'],
        recommendations: ['Manual carrier verification recommended'],
        dataSource: 'ERROR',
        financialData: null,
      };
    }
  };

  // AI Flow Quote Generation System with FleetGuard Integration
  const generateAIQuotes = async (loadRequest: any) => {
    try {
      // Simulate AI analysis and quote generation
      const aiAnalysis = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            marketConditions: 'Strong demand, limited capacity',
            fuelCosts: '$3.85/gallon average',
            trafficPatterns: 'Moderate congestion expected',
            seasonalFactors: 'Peak season pricing active',
            competitorAnalysis: 'Market rates 15-20% above average',
          });
        }, 2000)
      );

      // Generate intelligent quotes based on AI analysis
      const isWarehousingService = [
        'Warehouse Storage',
        'Cross Docking',
        'Pick & Pack',
        'Inventory Management',
        'Distribution Center',
        'Fulfillment Services',
        '3PL Full Service',
      ].includes(loadRequest.equipmentType);

      const quotes = isWarehousingService
        ? [
            {
              id: `quote-${Date.now()}-1`,
              carrier: 'FleetFlow Warehousing Solutions',
              rate: calculateIntelligentRate(
                loadRequest,
                'premium',
                aiAnalysis
              ),
              eta: calculateETA(loadRequest, 'premium'),
              confidence: 96,
              features: [
                'Climate-controlled facilities',
                'Real-time inventory tracking',
                'Advanced WMS integration',
                '99.8% accuracy guarantee',
                '24/7 facility security',
              ],
              reasoning:
                'Premium warehousing with advanced technology and proven reliability',
            },
            {
              id: `quote-${Date.now()}-2`,
              carrier: 'Regional 3PL Partners',
              rate: calculateIntelligentRate(
                loadRequest,
                'standard',
                aiAnalysis
              ),
              eta: calculateETA(loadRequest, 'standard'),
              confidence: 89,
              features: [
                'Standard warehouse facilities',
                'Inventory management system',
                'Pick & pack services',
                'Business hours support',
              ],
              reasoning:
                'Reliable 3PL services with competitive pricing and good performance',
            },
            {
              id: `quote-${Date.now()}-3`,
              carrier: 'Economy Warehouse Network',
              rate: calculateIntelligentRate(
                loadRequest,
                'economy',
                aiAnalysis
              ),
              eta: calculateETA(loadRequest, 'economy'),
              confidence: 78,
              features: [
                'Basic storage facilities',
                'Manual inventory tracking',
                'Standard handling procedures',
                'Email support',
              ],
              reasoning:
                'Cost-effective warehousing solution for budget-conscious operations',
            },
          ]
        : [
            {
              id: `quote-${Date.now()}-1`,
              carrier: 'Premium Express Logistics',
              rate: calculateIntelligentRate(
                loadRequest,
                'premium',
                aiAnalysis
              ),
              eta: calculateETA(loadRequest, 'premium'),
              confidence: 95,
              features: [
                'Real-time tracking',
                'Insurance included',
                '24/7 support',
              ],
              reasoning:
                'Premium carrier with excellent safety record and on-time performance',
            },
            {
              id: `quote-${Date.now()}-2`,
              carrier: 'Reliable Transport Solutions',
              rate: calculateIntelligentRate(
                loadRequest,
                'standard',
                aiAnalysis
              ),
              eta: calculateETA(loadRequest, 'standard'),
              confidence: 88,
              features: [
                'Standard tracking',
                'Basic insurance',
                'Business hours support',
              ],
              reasoning:
                'Cost-effective option with good reliability and competitive pricing',
            },
            {
              id: `quote-${Date.now()}-3`,
              carrier: 'Economy Freight Services',
              rate: calculateIntelligentRate(loadRequest, 'budget', aiAnalysis),
              eta: calculateETA(loadRequest, 'budget'),
              confidence: 75,
              features: [
                'Basic tracking',
                'Standard insurance',
                'Email support',
              ],
              reasoning: 'Budget-friendly option for non-urgent shipments',
            },
          ];

      // Run FleetGuard AI analysis on all carriers
      setFraudAnalysisLoading(true);
      const carrierAnalyses = await Promise.all(
        quotes.map((quote) => analyzeCarrierSafety(quote.carrier))
      );
      setCarrierFraudAnalysis(carrierAnalyses);
      setFraudAnalysisLoading(false);

      // Add fraud analysis to quotes
      const quotesWithFraudAnalysis = quotes.map((quote, index) => ({
        ...quote,
        fraudAnalysis: carrierAnalyses[index],
      }));

      console.log(
        '🛡️ FleetGuard AI Analysis Complete for Go with the Flow:',
        carrierAnalyses
      );

      return quotesWithFraudAnalysis;
    } catch (error) {
      console.error('Error generating AI quotes:', error);
      setFraudAnalysisLoading(false);
      return [];
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQuoteStatus('generating');
    setQuoteProgress(0);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      // Extract contact information
      const contactInfo = {
        contactName: formData.get('contactName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        companyName: formData.get('companyName') as string,
      };

      const equipmentType = formData.get('equipmentType') as string;
      const isWarehousingService = [
        'Warehouse Storage',
        'Cross Docking',
        'Pick & Pack',
        'Inventory Management',
        'Distribution Center',
        'Fulfillment Services',
        '3PL Full Service',
      ].includes(equipmentType);

      // If warehousing service is selected, show the warehouse quote builder
      if (isWarehousingService) {
        setSelectedServiceType(equipmentType);
        setShowWarehouseBuilder(true);
        setIsLoading(false);
        return;
      }

      const loadRequest = {
        action: 'request-truck',
        loadRequest: {
          origin: formData.get('origin') as string,
          destination: formData.get('destination') as string,
          equipmentType: equipmentType,
          weight: parseInt(formData.get('weight') as string),
          urgency: formData.get('urgency') as 'low' | 'medium' | 'high',
          pickupDate: formData.get('pickupDate') as string,
          deliveryDate: formData.get('deliveryDate') as string,
          shipperId: `shipper-${Date.now()}`,
        },
      };

      // Step 1: Submit request to backend
      const response = await fetch('/api/go-with-the-flow/shipper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loadRequest),
      });

      const result = await response.json();

      if (result.success) {
        setQuoteProgress(25);

        // Step 2: AI Flow generates intelligent quotes
        const aiQuotes = await generateAIQuotes(loadRequest.loadRequest);
        setQuoteProgress(75);

        setQuoteProgress(100);
        setQuoteStatus('completed');
        setGeneratedQuotes(aiQuotes);

        // Step 4: Create shipper account automatically
        const accountResult =
          await shipperAccountService.createAccountFromQuoteRequest(
            loadRequest.loadRequest,
            contactInfo
          );

        if (accountResult.success) {
          setAccountCreationResult(accountResult);
          setShowAccountSuccess(true);

          setNotificationMessage(
            `🎉 ${accountResult.message} Load ID: ${result.load.id}. Your Go with the Flow ID: ${accountResult.account!.goWithFlowId}. Portal access sent to ${contactInfo.email}!`
          );
        } else {
          setNotificationMessage(
            `Request submitted successfully! Load ID: ${result.load.id}. Our team will contact you within 2 hours.`
          );
        }

        // Refresh system data
        fetchSystemData();
      } else {
        setNotificationMessage('Error submitting request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setNotificationMessage('Error submitting request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const contactData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        message: formData.get('message') as string,
        phone: formData.get('phone') as string,
      };

      const response = await fetch('/api/go-with-the-flow/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        setNotificationMessage(
          "Message sent successfully! We'll respond within 24 hours."
        );
      } else {
        setNotificationMessage('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      setNotificationMessage('Error sending message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Global Logistics Corp',
      role: 'Operations Director',
      content:
        'FleetFlow transformed our freight operations. The real-time tracking and AI-powered optimization saved us 30% on costs.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      company: 'Express Shipping Solutions',
      role: 'Fleet Manager',
      content:
        'Outstanding service and technology. Our drivers love the mobile app and our customers appreciate the transparency.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 3,
      name: 'Lisa Chen',
      company: 'Premium Cargo Services',
      role: 'CEO',
      content:
        'The best freight platform we have used. Professional, reliable, and the customer support is exceptional.',
      rating: 5,
      avatar: '👩‍💻',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
        `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />

      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Notification Display */}
        {notificationMessage && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>✅</span>
            {notificationMessage}
            <button
              onClick={() => setNotificationMessage('')}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Enterprise Command Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ef4444, #f59e0b)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>🚛</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🚛 FLEETFLOW™ "GO WITH THE FLOW"
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 12px 0',
                      fontWeight: '500',
                    }}
                  >
                    Professional Freight Services & Logistics Intelligence
                    Platform
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: '1px solid #10b981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      🟢 SERVICES ACTIVE
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Platform Status: OPERATIONAL • 24/7 Support Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'overview', label: '📊 Overview', icon: '📊' },
              {
                key: 'marketplace-bidding',
                label: '🎯 Marketplace Bidding',
                icon: '🎯',
              },
              { key: 'request', label: '🚀 Request Service', icon: '🚀' },
              { key: 'tracking', label: '📍 Track Shipment', icon: '📍' },
              { key: 'services', label: '🛠️ Our Services', icon: '🛠️' },
              { key: 'contact', label: '📞 Contact Us', icon: '📞' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background:
                    activeTab === tab.key
                      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                      : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            minHeight: '600px',
          }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Hero Section */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '48px',
                  padding: '40px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: '16px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  🚀 Transform Your Freight Operations
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '32px',
                    maxWidth: '800px',
                    margin: '0 auto 32px auto',
                    lineHeight: '1.6',
                  }}
                >
                  Join thousands of companies using FleetFlow's AI-powered
                  logistics platform to streamline operations, reduce costs, and
                  deliver exceptional customer experiences.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('request')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    🚀 Get Started Today
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px',
                  marginBottom: '48px',
                }}
              >
                {[
                  {
                    label: 'Active Users',
                    value: '15,000+',
                    icon: '👥',
                    color: '#3b82f6',
                  },
                  {
                    label: 'States Served',
                    value: '48',
                    icon: '🗺️',
                    color: '#10b981',
                  },
                  {
                    label: 'Success Rate',
                    value: '98.5%',
                    icon: '📈',
                    color: '#f59e0b',
                  },
                  {
                    label: 'Support Response',
                    value: '<2 hours',
                    icon: '⏰',
                    color: '#8b5cf6',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: `rgba(${
                        stat.color === '#3b82f6'
                          ? '59, 130, 246'
                          : stat.color === '#10b981'
                            ? '16, 185, 129'
                            : stat.color === '#f59e0b'
                              ? '245, 158, 11'
                              : '139, 92, 246'
                      }, 0.1)`,
                      border: `1px solid rgba(${
                        stat.color === '#3b82f6'
                          ? '59, 130, 246'
                          : stat.color === '#10b981'
                            ? '16, 185, 129'
                            : stat.color === '#f59e0b'
                              ? '245, 158, 11'
                              : '139, 92, 246'
                      }, 0.3)`,
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: stat.color,
                        marginBottom: '8px',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '32px',
                  }}
                >
                  💬 What Our Customers Say
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '24px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '32px', marginRight: '16px' }}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            {testimonial.name}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}
                          >
                            {testimonial.company}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '12px',
                            }}
                          >
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '16px',
                          lineHeight: '1.5',
                        }}
                      >
                        {testimonial.content}
                      </p>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span
                            key={i}
                            style={{ color: '#fbbf24', fontSize: '16px' }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Marketplace Bidding Tab */}
          {activeTab === 'marketplace-bidding' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🎯 Marketplace Bidding Service for Shippers
              </h2>

              {/* Service Information for Shippers */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '16px',
                  padding: '32px',
                  marginBottom: '32px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  📋 Post Your Loads for Competitive Bidding
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                    margin: '0 auto',
                  }}
                >
                  Post your freight loads to our marketplace where qualified
                  carriers and drivers compete with bids, ensuring you get the
                  best rates and service for your shipments.
                </p>
              </div>
            </div>
          )}

          {/* Request Service Tab */}
          {activeTab === 'request' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                🚀 Request Freight Service
              </h2>

              {/* Service Type Choice */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    textAlign: 'center',
                  }}
                >
                  📋 Choose Your Service Type
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  {/* Direct Booking Option */}
                  <button
                    type='button'
                    onClick={() => setServiceType('direct')}
                    style={{
                      background:
                        serviceType === 'direct'
                          ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                          : 'rgba(255, 255, 255, 0.1)',
                      border: `2px solid ${serviceType === 'direct' ? '#dc2626' : 'rgba(255, 255, 255, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      🚨
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        marginBottom: '4px',
                      }}
                    >
                      Direct Booking
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      Emergency/urgent loads - immediate carrier assignment
                    </div>
                  </button>

                  {/* Marketplace Option */}
                  <button
                    type='button'
                    onClick={() => setServiceType('marketplace')}
                    style={{
                      background:
                        serviceType === 'marketplace'
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'rgba(255, 255, 255, 0.1)',
                      border: `2px solid ${serviceType === 'marketplace' ? '#10b981' : 'rgba(255, 255, 255, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '16px',
                        marginBottom: '4px',
                      }}
                    >
                      Post to Marketplace
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      Regular loads - competitive bidding from drivers
                    </div>
                  </button>
                </div>

                {serviceType && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px',
                      background:
                        serviceType === 'direct'
                          ? 'rgba(220, 38, 38, 0.1)'
                          : 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${serviceType === 'direct' ? '#dc2626' : '#10b981'}`,
                    }}
                  >
                    <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
                      {serviceType === 'direct'
                        ? '⚡ Fast-track service: Get immediate carrier assignment with premium rates for time-sensitive shipments.'
                        : '💰 Cost-effective service: Let drivers compete for your load to get the best rates for flexible shipments.'}
                    </p>
                  </div>
                )}
              </div>

              {serviceType && (
                <form
                  onSubmit={handleRequestSubmit}
                  style={{ display: 'grid', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Pickup Location
                      </label>
                      <input
                        type='text'
                        name='origin'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='City, State'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Delivery Location
                      </label>
                      <input
                        type='text'
                        name='destination'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='City, State'
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Equipment Type
                      </label>
                      <select
                        name='equipmentType'
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                      >
                        <optgroup label='Transportation Services'>
                          <option value='Dry Van'>Dry Van</option>
                          <option value='Reefer'>Reefer</option>
                          <option value='Flatbed'>Flatbed</option>
                          <option value='Power Only'>Power Only</option>
                          <option value='Step Deck'>Step Deck</option>
                        </optgroup>
                        <optgroup label='Warehousing & 3PL Services'>
                          <option value='Warehouse Storage'>
                            🏭 Warehouse Storage
                          </option>
                          <option value='Cross Docking'>
                            📦 Cross Docking
                          </option>
                          <option value='Pick & Pack'>
                            📋 Pick & Pack Services
                          </option>
                          <option value='Inventory Management'>
                            📊 Inventory Management
                          </option>
                          <option value='Distribution Center'>
                            🚚 Distribution Center
                          </option>
                          <option value='Fulfillment Services'>
                            📮 Fulfillment Services
                          </option>
                          <option value='3PL Full Service'>
                            🏢 3PL Full Service
                          </option>
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Weight (lbs)
                      </label>
                      <input
                        type='number'
                        name='weight'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='0'
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Urgency Level
                      </label>
                      <select
                        name='urgency'
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                      >
                        <option value='low'>Low - Flexible timing</option>
                        <option value='medium'>
                          Medium - Standard delivery
                        </option>
                        <option value='high'>High - Urgent delivery</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Pickup Date
                      </label>
                      <input
                        type='date'
                        name='pickupDate'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      👤 Contact Information
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            color: 'white',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Contact Name *
                        </label>
                        <input
                          type='text'
                          name='contactName'
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Your full name'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            color: 'white',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Email Address *
                        </label>
                        <input
                          type='email'
                          name='email'
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='your@email.com'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            color: 'white',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Phone Number
                        </label>
                        <input
                          type='tel'
                          name='phone'
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='(555) 123-4567'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            color: 'white',
                            marginBottom: '8px',
                            fontWeight: '600',
                          }}
                        >
                          Company Name
                        </label>
                        <input
                          type='text'
                          name='companyName'
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Your company (optional)'
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          margin: '0',
                          lineHeight: '1.4',
                        }}
                      >
                        💡 <strong>Account Creation:</strong> A FleetFlow
                        shipper account will be automatically created for you,
                        giving you access to track shipments, request future
                        quotes, and manage your logistics needs anytime!
                      </p>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    {isLoading
                      ? 'Submitting...'
                      : serviceType === 'marketplace'
                        ? '🎯 Post Load to Marketplace'
                        : '🚀 Submit Request & Get Quotes'}
                  </button>
                </form>
              )}

              {/* AI Flow Quote Generation Progress */}
              {serviceType === 'direct' && quoteStatus === 'generating' && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginTop: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      🤖
                    </div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px',
                      }}
                    >
                      AI Flow Generating Quotes
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        marginBottom: '20px',
                      }}
                    >
                      Analyzing market conditions, fuel costs, and carrier
                      availability...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: `${quoteProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {quoteProgress}% Complete
                  </div>
                </div>
              )}

              {/* Generated Quotes Display */}
              {serviceType === 'direct' &&
                quoteStatus === 'completed' &&
                generatedQuotes.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginTop: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        ✨
                      </div>
                      <h3
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: 'white',
                          marginBottom: '8px',
                        }}
                      >
                        AI-Generated Quotes Ready!
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Intelligent pricing based on market analysis and carrier
                        optimization
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                      {generatedQuotes.map((quote, index) => (
                        <div
                          key={quote.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Confidence Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              background: `rgba(${
                                quote.confidence >= 90
                                  ? '16, 185, 129'
                                  : quote.confidence >= 80
                                    ? '245, 158, 11'
                                    : '239, 68, 68'
                              }, 0.2)`,
                              border: `1px solid rgba(${
                                quote.confidence >= 90
                                  ? '16, 185, 129'
                                  : quote.confidence >= 80
                                    ? '245, 158, 11'
                                    : '239, 68, 68'
                              }, 0.4)`,
                              borderRadius: '20px',
                              padding: '4px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: `${
                                quote.confidence >= 90
                                  ? '#10b981'
                                  : quote.confidence >= 80
                                    ? '#f59e0b'
                                    : '#ef4444'
                              }`,
                            }}
                          >
                            {quote.confidence}% Confidence
                          </div>

                          <div style={{ marginBottom: '16px' }}>
                            <h4
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: 'white',
                                marginBottom: '8px',
                              }}
                            >
                              {quote.carrier}
                            </h4>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '14px',
                                lineHeight: '1.5',
                              }}
                            >
                              {quote.reasoning}
                            </p>
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(120px, 1fr))',
                              gap: '16px',
                              marginBottom: '16px',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '4px',
                                }}
                              >
                                Rate
                              </div>
                              <div
                                style={{
                                  fontSize: '24px',
                                  fontWeight: '800',
                                  color: '#10b981',
                                }}
                              >
                                ${quote.rate.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '4px',
                                }}
                              >
                                ETA
                              </div>
                              <div
                                style={{
                                  fontSize: '18px',
                                  fontWeight: '700',
                                  color: 'white',
                                }}
                              >
                                {quote.eta}
                              </div>
                            </div>
                          </div>

                          <button
                            style={{
                              width: '100%',
                              background:
                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              border: 'none',
                              color: 'white',
                              padding: '12px 24px',
                              borderRadius: '8px',
                              fontWeight: '600',
                              fontSize: '14px',
                              cursor: 'pointer',
                              marginTop: '16px',
                            }}
                          >
                            🚀 Select This Quote
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Track Shipment Tab */}
          {activeTab === 'tracking' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                📍 Track Your Shipment
              </h2>

              {/* Tracking Form */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '32px',
                  marginBottom: '32px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '24px',
                    textAlign: 'center',
                  }}
                >
                  🔍 Enter Your Tracking Information
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gap: '20px',
                    maxWidth: '600px',
                    margin: '0 auto',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Load ID or Pro Number
                    </label>
                    <input
                      type='text'
                      placeholder='Enter your Load ID (e.g., FL-2024-001) or Pro Number'
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Phone Number or Email (Optional)
                    </label>
                    <input
                      type='text'
                      placeholder='Enter phone or email for additional verification'
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px',
                      }}
                    />
                  </div>

                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    🔍 Track Shipment
                  </button>
                </div>
              </div>

              {/* Sample Tracking Results */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  📋 Sample Tracking Information
                </h4>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Load Status:
                    </span>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                      🚛 In Transit
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Current Location:
                    </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      📍 Kansas City, MO
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Estimated Delivery:
                    </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      ⏰ Tomorrow 2:00 PM
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Driver Contact:
                    </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      📞 (555) 123-4567
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Our Services Tab */}
          {activeTab === 'services' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '48px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🛠️ Our Comprehensive Services
              </h2>

              {/* Services Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '24px',
                  marginBottom: '48px',
                }}
              >
                {/* Transportation Services */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    🚛
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    Transportation Services
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      🚛 Dry Van Transportation
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🧊 Temperature-Controlled Reefer
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📦 Flatbed & Heavy Haul
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ⚡ Power Only Services
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🎯 Expedited & Rush Deliveries
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📍 Real-time GPS Tracking
                    </li>
                  </ul>
                </div>

                {/* Logistics & Warehousing */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    🏭
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    Warehousing & 3PL
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      🏭 Warehouse Storage Solutions
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📦 Cross Docking Services
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📋 Pick & Pack Operations
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📊 Inventory Management
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🚚 Distribution Centers
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📮 Fulfillment Services
                    </li>
                  </ul>
                </div>

                {/* Technology Solutions */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    🤖
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    AI & Technology
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      🤖 AI-Powered Route Optimization
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📊 Real-time Analytics Dashboard
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🛡️ FleetGuard Fraud Protection
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📱 Mobile Driver Apps
                    </li>
                    <li style={{ marginBottom: '8px' }}>🔗 API Integrations</li>
                    <li style={{ marginBottom: '8px' }}>☁️ Cloud-based TMS</li>
                  </ul>
                </div>

                {/* Specialized Services */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    ⭐
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    Specialized Services
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      ☢️ Hazmat Transportation
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🏗️ Construction & Heavy Equipment
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🚗 Auto Transport Services
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      💊 Medical & Pharmaceutical
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      🎯 White Glove Delivery
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      📋 Dedicated Contract Carriage
                    </li>
                  </ul>
                </div>
              </div>

              {/* Why Choose FleetFlow */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '24px',
                  }}
                >
                  🌟 Why Choose FleetFlow?
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      ⚡
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Fast Response
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      2-hour quote turnaround
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      🛡️
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Secure & Reliable
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      99.5% on-time delivery
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      💰
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Competitive Rates
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Best-in-market pricing
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      🌍
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Nationwide Coverage
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      All 48 states + Canada
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('request')}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  🚀 Request Service Now
                </button>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                📞 Get in Touch
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '48px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '24px',
                    }}
                  >
                    Send us a Message
                  </h3>
                  <form
                    onSubmit={handleContactSubmit}
                    style={{ display: 'grid', gap: '16px' }}
                  >
                    <input
                      type='text'
                      name='name'
                      placeholder='Your full name'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='email'
                      name='email'
                      placeholder='your.email@company.com'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      name='company'
                      placeholder='Your company name'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <textarea
                      name='message'
                      placeholder='Tell us about your shipping needs...'
                      required
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                    <button
                      type='submit'
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        border: 'none',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      {isLoading ? '📤 Sending...' : '📤 Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            marginTop: '32px',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            🚀 Ready to Transform Your Freight Operations?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              lineHeight: '1.6',
            }}
          >
            Join thousands of companies already using FleetFlow to streamline
            their logistics, reduce costs, and improve customer satisfaction.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setActiveTab('request')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              🚀 Start Shipping Today
            </button>
          </div>
        </div>
      </div>

      {/* Account Creation Success Modal */}
      {showAccountSuccess && accountCreationResult && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAccountSuccess(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                Welcome to FleetFlow!
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  margin: '0',
                }}
              >
                Your shipper account has been created successfully
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse Quote Builder Modal */}
      {showWarehouseBuilder && (
        <WarehouseQuoteBuilder
          onQuoteGenerated={(quotes) => {
            setGeneratedQuotes(quotes);
            setQuoteStatus('completed');
            setShowWarehouseBuilder(false);
          }}
          onClose={() => setShowWarehouseBuilder(false)}
          initialData={{
            equipmentType: selectedServiceType,
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
          }}
        />
      )}
    </div>
  );
}

// Helper Functions for Quote Generation
const calculateIntelligentRate = (
  loadRequest: any,
  tier: string,
  aiAnalysis: any
) => {
  const baseRates: Record<string, Record<string, number>> = {
    // Transportation Services
    'Dry Van': { premium: 2.85, standard: 2.45, economy: 2.15, budget: 1.95 },
    Reefer: { premium: 3.25, standard: 2.85, economy: 2.55, budget: 2.25 },
    Flatbed: { premium: 3.15, standard: 2.75, economy: 2.45, budget: 2.15 },
    'Power Only': {
      premium: 1.95,
      standard: 1.65,
      economy: 1.45,
      budget: 1.25,
    },
    'Step Deck': { premium: 3.45, standard: 3.05, economy: 2.75, budget: 2.45 },

    // Warehousing & 3PL Services (monthly rates per sq ft or per pallet)
    'Warehouse Storage': {
      premium: 8.5,
      standard: 6.25,
      economy: 4.75,
      budget: 3.5,
    },
    'Cross Docking': {
      premium: 45.0,
      standard: 35.0,
      economy: 25.0,
      budget: 20.0,
    },
    'Pick & Pack': {
      premium: 3.25,
      standard: 2.75,
      economy: 2.25,
      budget: 1.85,
    },
    'Inventory Management': {
      premium: 125.0,
      standard: 95.0,
      economy: 75.0,
      budget: 60.0,
    },
    'Distribution Center': {
      premium: 15.5,
      standard: 12.25,
      economy: 9.75,
      budget: 8.0,
    },
    'Fulfillment Services': {
      premium: 4.85,
      standard: 3.95,
      economy: 3.25,
      budget: 2.75,
    },
    '3PL Full Service': {
      premium: 185.0,
      standard: 145.0,
      economy: 115.0,
      budget: 95.0,
    },
  };

  const equipmentType = loadRequest.equipmentType;
  const weight = loadRequest.weight || 40000;
  const distance = calculateDistance(
    loadRequest.origin,
    loadRequest.destination
  );

  // Check if this is a warehousing service
  const isWarehousingService = [
    'Warehouse Storage',
    'Cross Docking',
    'Pick & Pack',
    'Inventory Management',
    'Distribution Center',
    'Fulfillment Services',
    '3PL Full Service',
  ].includes(equipmentType);

  if (isWarehousingService) {
    // Warehousing pricing logic
    const baseRate = baseRates[equipmentType]?.[tier] || 100;
    const volumeMultiplier = Math.max(1, weight / 10000); // Scale by volume
    const serviceComplexity = getWarehousingComplexity(equipmentType);

    return Math.round(baseRate * volumeMultiplier * serviceComplexity);
  } else {
    // Transportation pricing logic
    const baseRate = baseRates[equipmentType]?.[tier] || 2.5;
    const fuelSurcharge = 0.25;
    const urgencyMultiplier =
      loadRequest.urgency === 'high'
        ? 1.3
        : loadRequest.urgency === 'medium'
          ? 1.1
          : 1.0;

    return Math.round(
      (baseRate + fuelSurcharge) * distance * urgencyMultiplier
    );
  }
};

const getWarehousingComplexity = (serviceType: string): number => {
  const complexityMap: Record<string, number> = {
    'Warehouse Storage': 1.0,
    'Cross Docking': 1.2,
    'Pick & Pack': 1.5,
    'Inventory Management': 2.0,
    'Distribution Center': 1.8,
    'Fulfillment Services': 2.2,
    '3PL Full Service': 2.5,
  };
  return complexityMap[serviceType] || 1.0;
};

const calculateETA = (loadRequest: any, tier: string) => {
  const equipmentType = loadRequest.equipmentType;

  // Check if this is a warehousing service
  const isWarehousingService = [
    'Warehouse Storage',
    'Cross Docking',
    'Pick & Pack',
    'Inventory Management',
    'Distribution Center',
    'Fulfillment Services',
    '3PL Full Service',
  ].includes(equipmentType);

  if (isWarehousingService) {
    // Warehousing setup times
    const setupTimes: Record<string, { min: number; max: number }> = {
      premium: { min: 1, max: 3 }, // 1-3 days
      standard: { min: 3, max: 7 }, // 3-7 days
      economy: { min: 7, max: 14 }, // 1-2 weeks
      budget: { min: 14, max: 21 }, // 2-3 weeks
    };

    const timeRange = setupTimes[tier] || setupTimes.standard;
    const days =
      Math.floor(Math.random() * (timeRange.max - timeRange.min + 1)) +
      timeRange.min;

    return `${days} day${days !== 1 ? 's' : ''} setup time`;
  } else {
    // Transportation delivery times
    const distance = calculateDistance(
      loadRequest.origin,
      loadRequest.destination
    );
    const baseHours =
      distance /
      (tier === 'premium'
        ? 65
        : tier === 'standard'
          ? 55
          : tier === 'economy'
            ? 45
            : 35);
    const urgencyMultiplier =
      loadRequest.urgency === 'high'
        ? 0.8
        : loadRequest.urgency === 'medium'
          ? 1.0
          : 1.2;

    const totalHours = Math.round(baseHours * urgencyMultiplier);
    const days = Math.ceil(totalHours / 24);

    return `${days} day${days !== 1 ? 's' : ''}`;
  }
};

const calculateDistance = (origin: string, destination: string): number => {
  // Simplified distance calculation (in production, use Google Maps API)
  const distances = {
    short: 250,
    medium: 650,
    long: 1200,
  };

  // Simple heuristic based on common routes
  const key =
    Math.random() > 0.6 ? 'long' : Math.random() > 0.4 ? 'medium' : 'short';
  return distances[key] + Math.floor(Math.random() * 200);
};
