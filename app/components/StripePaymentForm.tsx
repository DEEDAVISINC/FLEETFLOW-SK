'use client';

import React, { useEffect, useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../config/subscription-plans';

interface SquarePaymentFormProps {
  selectedPlan: string;
  billingDetails: {
    name: string;
    email: string;
    company: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  onSuccess: (subscription: any) => void;
  onError: (error: string) => void;
}

function SquarePaymentForm({
  selectedPlan,
  billingDetails,
  onSuccess,
  onError,
}: SquarePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [squarePaymentForm, setSquarePaymentForm] = useState<any>(null);

  const plan = SUBSCRIPTION_PLANS[selectedPlan];

  useEffect(() => {
    // Initialize Square Payment Form
    const initializeSquarePaymentForm = async () => {
      if (typeof window !== 'undefined' && window.Square) {
        try {
          const payments = window.Square.payments(
            process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
            process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN!
          );

          const card = await payments.card();
          await card.attach('#square-card-container');

          setSquarePaymentForm(card);
        } catch (error) {
          console.error('Square payment form initialization failed:', error);
          onError('Payment form initialization failed');
        }
      }
    };

    initializeSquarePaymentForm();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!squarePaymentForm) {
      onError('Square payment form not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      // Tokenize the card
      const result = await squarePaymentForm.tokenize();

      if (result.status === 'OK') {
        // Create subscription with Square
        const response = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            squareToken: result.token,
            planId: selectedPlan,
            billingDetails,
          }),
        });

        const subscriptionResult = await response.json();

        if (!response.ok) {
          throw new Error(
            subscriptionResult.error || 'Subscription creation failed'
          );
        }

        onSuccess(subscriptionResult.subscription);
      } else {
        // Tokenization failed
        let errorMessage = 'Payment failed';
        if (result.errors && result.errors.length > 0) {
          errorMessage = result.errors[0].message;
        }
        onError(errorMessage);
      }
    } catch (error) {
      console.error('Square payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className='payment-form-container'>
      <div className='payment-header'>
        <h3>Complete Your Subscription</h3>
        <div className='plan-summary'>
          <div className='plan-name'>{plan.name}</div>
          <div className='plan-price'>${plan.price}/month</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='payment-form'>
        <div className='form-section'>
          <h4>Billing Information</h4>
          <div className='billing-details'>
            <div className='detail-row'>
              <span className='label'>Name:</span>
              <span className='value'>{billingDetails.name}</span>
            </div>
            <div className='detail-row'>
              <span className='label'>Email:</span>
              <span className='value'>{billingDetails.email}</span>
            </div>
            <div className='detail-row'>
              <span className='label'>Company:</span>
              <span className='value'>{billingDetails.company}</span>
            </div>
            <div className='detail-row'>
              <span className='label'>Address:</span>
              <span className='value'>
                {billingDetails.address.line1}, {billingDetails.address.city},{' '}
                {billingDetails.address.state}{' '}
                {billingDetails.address.postal_code}
              </span>
            </div>
          </div>
        </div>

        <div className='form-section'>
          <h4>Payment Information</h4>
          <div className='card-element-container'>
            <div id='square-card-container' style={{ minHeight: '60px' }}></div>
          </div>

          <div className='payment-notice'>
            <div className='security-icons'>
              <span className='security-icon'>🔒</span>
              <span className='security-text'>SSL Encrypted</span>
            </div>
            <div className='powered-by'>
              Powered by <strong>Square</strong>
            </div>
          </div>
        </div>

        <div className='form-section'>
          <div className='terms-agreement'>
            <label className='checkbox-container'>
              <input type='checkbox' required />
              <span className='checkmark'></span>I agree to the{' '}
              <a href='/terms' target='_blank'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href='/privacy' target='_blank'>
                Privacy Policy
              </a>
            </label>
          </div>

          <div className='subscription-notice'>
            <p>
              Your subscription will start immediately and renew monthly. You
              can cancel anytime from your account dashboard.
            </p>
            {plan.trialDays > 0 && (
              <p className='trial-notice'>
                🎁 <strong>{plan.trialDays}-day free trial included!</strong>
              </p>
            )}
          </div>
        </div>

        <div className='form-actions'>
          <button
            type='submit'
            disabled={!stripe || isProcessing}
            className='submit-payment-btn'
          >
            {isProcessing ? (
              <div className='processing'>
                <div className='spinner'></div>
                Processing...
              </div>
            ) : (
              `Subscribe to ${plan.name} - $${plan.price}/month`
            )}
          </button>
        </div>

        <div className='guarantee-notice'>
          <div className='guarantee-icon'>🛡️</div>
          <div className='guarantee-text'>
            <strong>30-Day Money-Back Guarantee</strong>
            <p>
              Not satisfied? Get a full refund within 30 days, no questions
              asked.
            </p>
          </div>
        </div>
      </form>

      <style jsx>{`
        .payment-form-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .payment-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 32px;
          text-align: center;
        }

        .payment-header h3 {
          margin: 0 0 16px 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .plan-summary {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 16px 24px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .plan-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .plan-price {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .payment-form {
          padding: 32px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }

        .billing-details {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .label {
          font-weight: 600;
          color: #64748b;
        }

        .value {
          color: #1e293b;
          text-align: right;
          max-width: 60%;
        }

        .card-element-container {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background: white;
          transition: border-color 0.3s ease;
        }

        .card-element-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .payment-notice {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          font-size: 0.85rem;
          color: #64748b;
        }

        .security-icons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .security-icon {
          font-size: 1rem;
        }

        .terms-agreement {
          margin-bottom: 24px;
        }

        .checkbox-container {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.9rem;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-container input[type='checkbox'] {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #3b82f6;
        }

        .checkbox-container a {
          color: #3b82f6;
          text-decoration: none;
        }

        .checkbox-container a:hover {
          text-decoration: underline;
        }

        .subscription-notice {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          font-size: 0.9rem;
          color: #92400e;
        }

        .subscription-notice p {
          margin: 0 0 8px 0;
        }

        .trial-notice {
          color: #059669;
          font-weight: 700;
        }

        .form-actions {
          text-align: center;
          margin-bottom: 24px;
        }

        .submit-payment-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 400px;
        }

        .submit-payment-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .submit-payment-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .processing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .guarantee-notice {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 8px;
          padding: 16px;
        }

        .guarantee-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .guarantee-text strong {
          color: #059669;
          display: block;
          margin-bottom: 4px;
        }

        .guarantee-text p {
          margin: 0;
          font-size: 0.9rem;
          color: #374151;
        }

        @media (max-width: 640px) {
          .payment-form-container {
            margin: 16px;
            border-radius: 12px;
          }

          .payment-header {
            padding: 24px 20px;
          }

          .payment-header h3 {
            font-size: 1.5rem;
          }

          .payment-form {
            padding: 24px 20px;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .value {
            text-align: left;
            max-width: 100%;
          }

          .payment-notice {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

// Export the component directly (no wrapper needed for Square)
export default SquarePaymentForm;
