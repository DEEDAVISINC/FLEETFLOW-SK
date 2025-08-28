/**
 * Subscription Agreement Signup Component
 * Handles legal agreements, payment collection, and subscription activation
 */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  PaymentMethod,
  paymentCollectionService,
} from '../services/PaymentCollectionService';
import {
  SubscriptionAgreement,
  subscriptionAgreementService,
} from '../services/SubscriptionAgreementService';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';

interface SubscriptionSetupProps {
  subscriptionTierId: string;
  onComplete?: (subscriptionId: string) => void;
  onCancel?: () => void;
}

interface SignatureData {
  signature: string;
  signedByName: string;
  signedByTitle?: string;
}

export default function SubscriptionAgreementSignup({
  subscriptionTierId,
  onComplete,
  onCancel,
}: SubscriptionSetupProps) {
  const [currentStep, setCurrentStep] = useState<
    'agreements' | 'payment' | 'confirmation'
  >('agreements');
  const [requiredAgreements, setRequiredAgreements] = useState<
    SubscriptionAgreement[]
  >([]);
  const [agreedTo, setAgreedTo] = useState<Set<string>>(new Set());
  const [signatureData, setSignatureData] = useState<{
    [agreementId: string]: SignatureData;
  }>({});
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card' as 'card' | 'bank_account',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
  });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { user } = getCurrentUser();
  const subscription =
    SubscriptionManagementService.getSubscriptionTier(subscriptionTierId);

  useEffect(() => {
    loadRequiredAgreements();
    loadUserPaymentMethods();
  }, []);

  const loadRequiredAgreements = () => {
    const agreements = subscriptionAgreementService.getRequiredAgreements();

    // Add phone service terms if subscription includes phone features
    const hasPhoneFeatures = subscription?.features?.some(
      (f) =>
        f.includes('phone') ||
        f.includes('Phone') ||
        f.includes('📞') ||
        f.includes('📱')
    );

    if (hasPhoneFeatures) {
      const phoneTerms = subscriptionAgreementService.getAgreementsByType(
        'phone_service_terms'
      );
      agreements.push(...phoneTerms);
    }

    setRequiredAgreements(agreements);
  };

  const loadUserPaymentMethods = () => {
    const methods = paymentCollectionService.getUserPaymentMethods(user.id);
    setPaymentMethods(methods.filter((pm) => pm.isActive));
  };

  const handleAgreementConsent = async (
    agreementId: string,
    method: 'digital_signature' | 'checkbox_consent'
  ) => {
    try {
      const signature =
        method === 'digital_signature' ? signatureData[agreementId] : undefined;

      await subscriptionAgreementService.recordUserConsent(
        user.id,
        agreementId,
        '127.0.0.1', // In production, get real IP
        navigator.userAgent,
        method,
        signature
          ? {
              signature: signature.signature,
              signedByName: signature.signedByName,
              signedByTitle: signature.signedByTitle,
              timestamp: new Date(),
            }
          : undefined
      );

      setAgreedTo((prev) => new Set([...prev, agreementId]));
      console.log(`✅ Agreement consent recorded: ${agreementId}`);
    } catch (error) {
      console.error('Error recording consent:', error);
      setError(`Failed to record agreement consent: ${error}`);
    }
  };

  const handleSignatureDraw = (
    agreementId: string,
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple signature drawing logic
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const stopDrawing = () => {
      isDrawing = false;
      // Save signature
      const signatureDataURL = canvas.toDataURL();
      setSignatureData((prev) => ({
        ...prev,
        [agreementId]: {
          signature: signatureDataURL,
          signedByName: user.name,
          signedByTitle: user.position || undefined,
        },
      }));
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const clearSignature = (agreementId: string) => {
    const canvas = document.getElementById(
      `signature-${agreementId}`
    ) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setSignatureData((prev) => {
      const updated = { ...prev };
      delete updated[agreementId];
      return updated;
    });
  };

  const canProceedToPayment = () => {
    return requiredAgreements.every((agreement) => agreedTo.has(agreement.id));
  };

  const handleAddPaymentMethod = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const method = await paymentCollectionService.addPaymentMethod(
        user.id,
        newPaymentMethod
      );

      setPaymentMethods((prev) => [...prev, method]);
      setSelectedPaymentMethod(method.id);

      // Clear form
      setNewPaymentMethod({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
      });

      console.log('✅ Payment method added successfully');
    } catch (error) {
      console.error('Error adding payment method:', error);
      setError(`Failed to add payment method: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteSubscription = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create subscription billing
      const billing = await paymentCollectionService.createSubscriptionBilling(
        user.id,
        subscriptionTierId,
        selectedPaymentMethod,
        billingCycle
      );

      // Update user's subscription in SubscriptionManagementService
      SubscriptionManagementService.changeSubscription(
        user.id,
        subscriptionTierId
      );

      setCurrentStep('confirmation');
      console.log('✅ Subscription created successfully:', billing.id);

      setTimeout(() => {
        onComplete?.(billing.id);
      }, 3000);
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError(`Failed to create subscription: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateAmount = () => {
    if (!subscription) return 0;
    const baseAmount = subscription.price;
    return billingCycle === 'annual' ? baseAmount * 12 * 0.8 : baseAmount; // 20% annual discount
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        color: 'white',
        minHeight: '600px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FleetFlow Subscription Setup
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
          }}
        >
          {subscription
            ? `Activating: ${subscription.name}`
            : 'Setting up your subscription'}
        </p>
      </div>

      {/* Progress Steps */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        {[
          {
            id: 'agreements',
            label: '📋 Agreements',
            active: currentStep === 'agreements',
          },
          {
            id: 'payment',
            label: '💳 Payment',
            active: currentStep === 'payment',
          },
          {
            id: 'confirmation',
            label: '✅ Complete',
            active: currentStep === 'confirmation',
          },
        ].map((step, index) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: step.active ? '#60a5fa' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: step.active ? '600' : '400',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step.active
                  ? '#60a5fa'
                  : 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                fontSize: '14px',
              }}
            >
              {index + 1}
            </div>
            {step.label}
            {index < 2 && (
              <div
                style={{
                  width: '60px',
                  height: '2px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  margin: '0 20px',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#ef4444',
          }}
        >
          {error}
        </div>
      )}

      {/* Step 1: Agreements */}
      {currentStep === 'agreements' && (
        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>
            Legal Agreements
          </h3>
          <p
            style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}
          >
            Please review and accept the following agreements to proceed with
            your subscription:
          </p>

          {requiredAgreements.map((agreement) => (
            <div
              key={agreement.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: agreedTo.has(agreement.id)
                  ? '2px solid #34d399'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: agreedTo.has(agreement.id) ? '#34d399' : 'white',
                }}
              >
                {agreement.title}
              </h4>

              <div
                style={{
                  maxHeight: '200px',
                  overflow: 'auto',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                }}
              >
                {agreement.content}
              </div>

              {/* Signature requirement for subscription terms */}
              {agreement.type === 'subscription_terms' &&
                !agreedTo.has(agreement.id) && (
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ fontSize: '14px', marginBottom: '8px' }}>
                      Digital Signature Required:
                    </h5>
                    <canvas
                      id={`signature-${agreement.id}`}
                      width={400}
                      height={100}
                      style={{
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        background: 'white',
                        cursor: 'crosshair',
                        marginBottom: '8px',
                      }}
                      onMouseEnter={(e) =>
                        handleSignatureDraw(agreement.id, e.currentTarget)
                      }
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => clearSignature(agreement.id)}
                        style={{
                          background: 'rgba(107, 114, 128, 0.3)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          color: 'white',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginTop: '4px',
                      }}
                    >
                      Please sign above and click "I Agree" below.
                    </p>
                  </div>
                )}

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                {agreedTo.has(agreement.id) ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#34d399',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>✅</span>
                    <span>Agreed on {new Date().toLocaleDateString()}</span>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handleAgreementConsent(
                        agreement.id,
                        agreement.type === 'subscription_terms'
                          ? 'digital_signature'
                          : 'checkbox_consent'
                      )
                    }
                    disabled={
                      agreement.type === 'subscription_terms' &&
                      !signatureData[agreement.id]
                    }
                    style={{
                      background:
                        agreement.type === 'subscription_terms' &&
                        !signatureData[agreement.id]
                          ? 'rgba(107, 114, 128, 0.3)'
                          : 'linear-gradient(135deg, #34d399, #10b981)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor:
                        agreement.type === 'subscription_terms' &&
                        !signatureData[agreement.id]
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    I Agree to {agreement.title}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => setCurrentStep('payment')}
              disabled={!canProceedToPayment()}
              style={{
                background: canProceedToPayment()
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'rgba(107, 114, 128, 0.3)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: canProceedToPayment() ? 'pointer' : 'not-allowed',
                marginRight: '12px',
              }}
            >
              Continue to Payment Setup
            </button>
            <button
              onClick={onCancel}
              style={{
                background: 'rgba(107, 114, 128, 0.3)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {currentStep === 'payment' && (
        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>
            Payment Information
          </h3>

          {/* Billing Cycle Selection */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>
              Billing Cycle
            </h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                {
                  id: 'monthly',
                  label: 'Monthly',
                  amount: subscription?.price || 0,
                },
                {
                  id: 'annual',
                  label: 'Annual (20% off)',
                  amount: (subscription?.price || 0) * 12 * 0.8,
                },
              ].map((cycle) => (
                <label
                  key={cycle.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '12px',
                    border:
                      billingCycle === cycle.id
                        ? '2px solid #60a5fa'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    flex: 1,
                  }}
                >
                  <input
                    type='radio'
                    name='billingCycle'
                    value={cycle.id}
                    checked={billingCycle === cycle.id}
                    onChange={(e) =>
                      setBillingCycle(e.target.value as 'monthly' | 'annual')
                    }
                    style={{ accentColor: '#60a5fa' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600' }}>{cycle.label}</div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      ${cycle.amount.toFixed(2)}/{cycle.id}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Existing Payment Methods */}
          {paymentMethods.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>
                Select Payment Method
              </h4>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border:
                      selectedPaymentMethod === method.id
                        ? '2px solid #60a5fa'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='radio'
                    name='paymentMethod'
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    style={{ accentColor: '#60a5fa' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600' }}>
                      {method.type === 'card'
                        ? `${method.brand} **** ${method.last4}`
                        : `Bank **** ${method.last4}`}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {method.type === 'card' &&
                      method.expiryMonth &&
                      method.expiryYear
                        ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                        : method.accountType
                          ? `${method.accountType} account`
                          : 'Bank account'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Add New Payment Method */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>
              Add New Payment Method
            </h4>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              {[
                { id: 'card', label: '💳 Credit/Debit Card' },
                { id: 'bank_account', label: '🏦 Bank Account (ACH)' },
              ].map((type) => (
                <label
                  key={type.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='radio'
                    name='newPaymentType'
                    value={type.id}
                    checked={newPaymentMethod.type === type.id}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        type: e.target.value as 'card' | 'bank_account',
                      }))
                    }
                    style={{ accentColor: '#60a5fa' }}
                  />
                  {type.label}
                </label>
              ))}
            </div>

            {newPaymentMethod.type === 'card' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <input
                  type='text'
                  placeholder='Card Number'
                  value={newPaymentMethod.cardNumber}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      cardNumber: e.target.value,
                    }))
                  }
                  style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <input
                  type='text'
                  placeholder='MM'
                  value={newPaymentMethod.expiryMonth}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      expiryMonth: e.target.value,
                    }))
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <input
                  type='text'
                  placeholder='YYYY'
                  value={newPaymentMethod.expiryYear}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      expiryYear: e.target.value,
                    }))
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <input
                  type='text'
                  placeholder='CVC'
                  value={newPaymentMethod.cvc}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      cvc: e.target.value,
                    }))
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <input
                  type='text'
                  placeholder='Account Number'
                  value={newPaymentMethod.accountNumber}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <input
                  type='text'
                  placeholder='Routing Number'
                  value={newPaymentMethod.routingNumber}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      routingNumber: e.target.value,
                    }))
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <select
                  value={newPaymentMethod.accountType}
                  onChange={(e) =>
                    setNewPaymentMethod((prev) => ({
                      ...prev,
                      accountType: e.target.value as 'checking' | 'savings',
                    }))
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='checking'>Checking</option>
                  <option value='savings'>Savings</option>
                </select>
              </div>
            )}

            <button
              onClick={handleAddPaymentMethod}
              disabled={isProcessing}
              style={{
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                marginTop: '16px',
              }}
            >
              {isProcessing ? 'Adding...' : 'Add Payment Method'}
            </button>
          </div>

          {/* Order Summary */}
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                marginBottom: '12px',
                color: '#8b5cf6',
              }}
            >
              Order Summary
            </h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span>
                {subscription?.name} ({billingCycle})
              </span>
              <span>${calculateAmount().toFixed(2)}</span>
            </div>
            {billingCycle === 'annual' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#34d399',
                }}
              >
                <span>Annual Discount (20%)</span>
                <span>
                  -${((subscription?.price || 0) * 12 * 0.2).toFixed(2)}
                </span>
              </div>
            )}
            <div
              style={{
                borderTop: '1px solid rgba(139, 92, 246, 0.3)',
                paddingTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '600',
                fontSize: '18px',
              }}
            >
              <span>Total</span>
              <span>${calculateAmount().toFixed(2)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleCompleteSubscription}
              disabled={!selectedPaymentMethod || isProcessing}
              style={{
                background:
                  selectedPaymentMethod && !isProcessing
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(107, 114, 128, 0.3)',
                border: 'none',
                borderRadius: '8px',
                padding: '16px 32px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor:
                  selectedPaymentMethod && !isProcessing
                    ? 'pointer'
                    : 'not-allowed',
                marginRight: '12px',
              }}
            >
              {isProcessing
                ? 'Processing...'
                : `Complete Subscription - $${calculateAmount().toFixed(2)}`}
            </button>
            <button
              onClick={() => setCurrentStep('agreements')}
              style={{
                background: 'rgba(107, 114, 128, 0.3)',
                border: 'none',
                borderRadius: '8px',
                padding: '16px 32px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 'confirmation' && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#34d399',
            }}
          >
            Subscription Activated!
          </h3>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '24px',
            }}
          >
            Welcome to {subscription?.name}! Your subscription is now active and
            ready to use.
          </p>
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              Next Steps:
            </div>
            <ul
              style={{
                textAlign: 'left',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
              }}
            >
              <li>Access your subscription features in the user profile</li>
              <li>Set up your payment preferences and billing notifications</li>
              <li>Explore phone system features (if included)</li>
              <li>Contact support if you need assistance</li>
            </ul>
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Redirecting to your dashboard in 3 seconds...
          </div>
        </div>
      )}
    </div>
  );
}















