'use client';

import { useState } from 'react';
import { AddressValidationService } from '../services/address-validation-service';
import { CarrierBehaviorAnalyzer } from '../services/carrier-behavior-analyzer';
import { DocumentFraudDetector } from '../services/document-fraud-detector';
import { FraudGuardService } from '../services/fraud-guard-service';

interface CarrierData {
  mcNumber: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  documents?: any[];
}

interface EnhancedCarrierVerificationPanelProps {
  onCarrierVerified?: (carrierData: any) => void;
  onClose?: () => void;
  initialMcNumber?: string;
}

export default function EnhancedCarrierVerificationPanel({
  onCarrierVerified,
  onClose,
  initialMcNumber,
}: EnhancedCarrierVerificationPanelProps) {
  const [mcNumber, setMcNumber] = useState(initialMcNumber || '');
  const [verificationTab, setVerificationTab] = useState<
    'basic' | 'fraudguard' | 'documents' | 'behavior'
  >('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [carrier, setCarrier] = useState<any>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);

  // FleetGuard services
  const [fraudRisk, setFraudRisk] = useState<any>(null);
  const [enhancedScore, setEnhancedScore] = useState<any>(null);
  const [addressValidation, setAddressValidation] = useState<any>(null);
  const [documentAnalysis, setDocumentAnalysis] = useState<any>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null);

  // Initialize services
  const fraudGuard = new FraudGuardService();
  const addressValidator = new AddressValidationService();
  const documentAnalyzer = new DocumentFraudDetector();
  const behaviorAnalyzer = new CarrierBehaviorAnalyzer();

  const handleVerifyCarrier = async () => {
    if (!mcNumber.trim()) {
      setError('Please enter an MC number');
      return;
    }

    setLoading(true);
    setError('');
    setCarrier(null);
    setFraudRisk(null);
    setEnhancedScore(null);

    try {
      // Basic carrier data (mock for now)
      const carrierData: CarrierData = {
        mcNumber,
        companyName: 'Elite Transport LLC',
        address: '123 Business St, New York, NY 10001',
        phone: '(555) 123-4567',
        email: 'dispatch@elitetransport.com',
        documents: [],
      };

      setCarrier(carrierData);

      // Run FleetGuard analysis
      await runFleetGuardAnalysis(carrierData);
    } catch (err) {
      console.error('Carrier verification error:', err);
      setError('Failed to verify carrier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const runFleetGuardAnalysis = async (carrierData: CarrierData) => {
    try {
      // Run all FleetGuard analyses in parallel
      const [fraudAssessment, addressValidationResult, enhancedScoreResult] =
        await Promise.all([
          fraudGuard.assessFraudRisk(carrierData),
          addressValidator.validateBusinessAddress(carrierData.address),
          fraudGuard.getEnhancedScore(carrierData),
        ]);

      setFraudRisk(fraudAssessment);
      setAddressValidation(addressValidationResult);
      setEnhancedScore(enhancedScoreResult);

      // If documents exist, analyze them
      if (carrierData.documents && carrierData.documents.length > 0) {
        const docAnalysis = await documentAnalyzer.analyzeDocumentType(
          carrierData.documents[0]
        );
        setDocumentAnalysis(docAnalysis);
      }

      // Run behavior analysis
      const mockCarrierProfile = {
        id: '1',
        companyName: carrierData.companyName,
        mcNumber: carrierData.mcNumber,
        submissionDate: new Date(),
        submissionTime: 1200, // 20 minutes
        dataQuality: {
          hasValidPhone: true,
          hasValidEmail: true,
          hasCompleteAddress: true,
          hasValidDocuments: true,
          documentCompleteness: 85,
        },
        contactResponse: {
          responseTime: 4,
          communicationQuality: 'good' as const,
          followUpResponsiveness: 80,
        },
        businessActivity: {
          yearsInBusiness: 5,
          employeeCount: 25,
          fleetSize: 12,
          serviceAreas: ['Northeast', 'Southeast'],
          businessHours: '24/7',
        },
        submissionPatterns: {
          submissionSpeed: 'Normal',
          dataConsistency: 90,
          documentQuality: 'Good',
          informationCompleteness: 85,
        },
      };

      const behaviorResult =
        await behaviorAnalyzer.analyzeSubmissionPatterns(mockCarrierProfile);
      setBehaviorAnalysis(behaviorResult);
    } catch (error) {
      console.error('FleetGuard analysis error:', error);
      // Continue with basic verification if FleetGuard fails
    }
  };

  const handleEnableTracking = async () => {
    if (!carrier) return;

    setLoading(true);
    try {
      // Mock tracking enablement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTrackingEnabled(true);
    } catch (error) {
      console.error('Failed to enable tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'approve':
        return 'text-green-600 bg-green-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'reject':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-gray-900'>
            🛡️ FleetGuard AI - Enhanced Carrier Verification
          </h2>
          <button
            onClick={onClose}
            className='text-2xl text-gray-400 hover:text-gray-600'
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1'>
          <button
            onClick={() => setVerificationTab('basic')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              verificationTab === 'basic'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Basic Verification
          </button>
          <button
            onClick={() => setVerificationTab('fraudguard')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              verificationTab === 'fraudguard'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🛡️ FleetGuard AI
          </button>
          <button
            onClick={() => setVerificationTab('documents')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              verificationTab === 'documents'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Document Analysis
          </button>
          <button
            onClick={() => setVerificationTab('behavior')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              verificationTab === 'behavior'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Behavior Analysis
          </button>
        </div>

        {/* Basic Verification Tab */}
        {verificationTab === 'basic' && (
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                MC Number
              </label>
              <input
                type='text'
                value={mcNumber}
                onChange={(e) => setMcNumber(e.target.value)}
                placeholder='Enter MC number (e.g., MC-123456)'
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>

            <button
              onClick={handleVerifyCarrier}
              disabled={loading}
              className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Verifying...' : 'Verify Carrier with FleetGuard AI'}
            </button>

            {error && (
              <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>
                {error}
              </div>
            )}
          </div>
        )}

        {/* FleetGuard AI Tab */}
        {verificationTab === 'fraudguard' && fraudRisk && (
          <div className='space-y-6'>
            <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
              <h3 className='mb-4 text-lg font-semibold text-blue-900'>
                🛡️ FleetGuard AI Risk Assessment
              </h3>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Overall Risk */}
                <div className='rounded-lg border bg-white p-4'>
                  <h4 className='mb-2 font-medium text-gray-900'>
                    Overall Risk
                  </h4>
                  <div
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getRiskLevelColor(fraudRisk.riskLevel)}`}
                  >
                    {fraudRisk.riskLevel.toUpperCase()}
                  </div>
                  <div className='mt-2 text-2xl font-bold text-gray-900'>
                    {fraudRisk.overallRisk}/100
                  </div>
                </div>

                {/* Enhanced Score */}
                {enhancedScore && (
                  <div className='rounded-lg border bg-white p-4'>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      Enhanced Score
                    </h4>
                    <div
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getRecommendationColor(enhancedScore.recommendation)}`}
                    >
                      {enhancedScore.recommendation.toUpperCase()}
                    </div>
                    <div className='mt-2 text-2xl font-bold text-gray-900'>
                      {enhancedScore.combinedScore}/100
                    </div>
                  </div>
                )}
              </div>

              {/* Risk Breakdown */}
              <div className='mt-6'>
                <h4 className='mb-3 font-medium text-gray-900'>
                  Risk Breakdown
                </h4>
                <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Address</div>
                    <div className='text-lg font-semibold'>
                      {fraudRisk.breakdown.addressRisk}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Documents</div>
                    <div className='text-lg font-semibold'>
                      {fraudRisk.breakdown.documentRisk}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Behavior</div>
                    <div className='text-lg font-semibold'>
                      {fraudRisk.breakdown.behaviorRisk}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>FMCSA</div>
                    <div className='text-lg font-semibold'>
                      {fraudRisk.breakdown.fmcsaRisk}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Business</div>
                    <div className='text-lg font-semibold'>
                      {fraudRisk.breakdown.businessRisk}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Risk Factors */}
              <div className='mt-6'>
                <h4 className='mb-3 font-medium text-gray-900'>
                  Primary Risk Factors
                </h4>
                <div className='space-y-2'>
                  {fraudRisk.primaryRiskFactors.map(
                    (factor: string, index: number) => (
                      <div
                        key={index}
                        className='flex items-center text-sm text-red-700'
                      >
                        <span className='mr-2'>⚠️</span>
                        {factor}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className='mt-6'>
                <h4 className='mb-3 font-medium text-gray-900'>
                  Recommendations
                </h4>
                <div className='space-y-2'>
                  {fraudRisk.recommendations.map(
                    (rec: string, index: number) => (
                      <div
                        key={index}
                        className='flex items-center text-sm text-blue-700'
                      >
                        <span className='mr-2'>💡</span>
                        {rec}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Analysis Tab */}
        {verificationTab === 'documents' && documentAnalysis && (
          <div className='space-y-6'>
            <div className='rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6'>
              <h3 className='mb-4 text-lg font-semibold text-green-900'>
                📄 Document Analysis Results
              </h3>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border bg-white p-4'>
                  <h4 className='mb-2 font-medium text-gray-900'>
                    Document Type
                  </h4>
                  <div className='text-lg font-semibold text-gray-900'>
                    {documentAnalysis.documentType}
                  </div>
                </div>

                <div className='rounded-lg border bg-white p-4'>
                  <h4 className='mb-2 font-medium text-gray-900'>
                    Overall Risk
                  </h4>
                  <div
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getRiskLevelColor(documentAnalysis.overallRisk)}`}
                  >
                    {documentAnalysis.overallRisk.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Fraud Indicators */}
              {documentAnalysis.fraudIndicators.length > 0 && (
                <div className='mt-6'>
                  <h4 className='mb-3 font-medium text-gray-900'>
                    Fraud Indicators
                  </h4>
                  <div className='space-y-2'>
                    {documentAnalysis.fraudIndicators.map(
                      (indicator: string, index: number) => (
                        <div
                          key={index}
                          className='flex items-center text-sm text-red-700'
                        >
                          <span className='mr-2'>🚨</span>
                          {indicator}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Behavior Analysis Tab */}
        {verificationTab === 'behavior' && behaviorAnalysis && (
          <div className='space-y-6'>
            <div className='rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 p-6'>
              <h3 className='mb-4 text-lg font-semibold text-purple-900'>
                🧠 Behavior Analysis Results
              </h3>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border bg-white p-4'>
                  <h4 className='mb-2 font-medium text-gray-900'>Risk Level</h4>
                  <div
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getRiskLevelColor(behaviorAnalysis.riskLevel)}`}
                  >
                    {behaviorAnalysis.riskLevel.toUpperCase()}
                  </div>
                </div>

                <div className='rounded-lg border bg-white p-4'>
                  <h4 className='mb-2 font-medium text-gray-900'>Risk Score</h4>
                  <div className='text-2xl font-bold text-gray-900'>
                    {behaviorAnalysis.riskScore}/100
                  </div>
                </div>
              </div>

              {/* Suspicious Patterns */}
              {behaviorAnalysis.suspiciousPatterns.length > 0 && (
                <div className='mt-6'>
                  <h4 className='mb-3 font-medium text-gray-900'>
                    Suspicious Patterns
                  </h4>
                  <div className='space-y-2'>
                    {behaviorAnalysis.suspiciousPatterns.map(
                      (pattern: string, index: number) => (
                        <div
                          key={index}
                          className='flex items-center text-sm text-orange-700'
                        >
                          <span className='mr-2'>⚠️</span>
                          {pattern}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className='mt-6'>
                <h4 className='mb-3 font-medium text-gray-900'>
                  Recommendations
                </h4>
                <div className='space-y-2'>
                  {behaviorAnalysis.recommendations.map(
                    (rec: string, index: number) => (
                      <div
                        key={index}
                        className='flex items-center text-sm text-blue-700'
                      >
                        <span className='mr-2'>💡</span>
                        {rec}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {carrier && (
          <div className='mt-6 flex space-x-3'>
            <button
              onClick={handleEnableTracking}
              disabled={loading || trackingEnabled}
              className='flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {trackingEnabled ? 'Tracking Enabled' : 'Enable Tracking'}
            </button>

            <button
              onClick={() => onCarrierVerified?.(carrier)}
              className='flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            >
              Approve Carrier
            </button>
          </div>
        )}

        {/* Confidence Score */}
        {fraudRisk && (
          <div className='mt-4 text-center text-sm text-gray-600'>
            Analysis Confidence: {fraudRisk.confidence}%
          </div>
        )}
      </div>
    </div>
  );
}

