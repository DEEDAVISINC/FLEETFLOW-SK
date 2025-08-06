'use client';

import { useEffect, useState } from 'react';

interface SquarePaymentFormProps {
  amount: number;
  description?: string;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: string) => void;
  customerId?: string;
  orderId?: string;
}

declare global {
  interface Window {
    Square?: any;
  }
}

export default function SquarePaymentForm({
  amount,
  description,
  onPaymentSuccess,
  onPaymentError,
  customerId,
  orderId,
}: SquarePaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    loadSquareConfig();
  }, []);

  const loadSquareConfig = async () => {
    try {
      const response = await fetch('/api/payments/square?action=get-config');
      const data = await response.json();

      if (data.success) {
        setConfig(data.config);
        await loadSquareSDK(data.config);
      } else {
        setError('Failed to load payment configuration');
      }
    } catch (error) {
      setError('Failed to initialize payment system');
      console.error('Square config error:', error);
    }
  };

  const loadSquareSDK = async (config: any) => {
    try {
      // Load Square SDK
      if (!window.Square) {
        const script = document.createElement('script');
        script.src =
          config.environment === 'production'
            ? 'https://js.squareup.com/v2/paymentform'
            : 'https://js.squareupsandbox.com/v2/paymentform';
        script.async = true;

        script.onload = () => initializeSquarePayments(config);
        script.onerror = () => setError('Failed to load Square SDK');

        document.head.appendChild(script);
      } else {
        initializeSquarePayments(config);
      }
    } catch (error) {
      setError('Failed to load payment SDK');
      console.error('Square SDK error:', error);
    }
  };

  const initializeSquarePayments = async (config: any) => {
    try {
      if (!window.Square) {
        setError('Square SDK not loaded');
        return;
      }

      const payments = window.Square.payments(
        config.applicationId,
        config.locationId
      );
      const cardElement = await payments.card();
      await cardElement.attach('#card-container');

      setCard(cardElement);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to initialize payment form');
      console.error('Square initialization error:', error);
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!card) {
      setError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await card.tokenize();

      if (result.status === 'OK') {
        const paymentResult = await processPayment(result.token);

        if (paymentResult.success) {
          onPaymentSuccess?.(paymentResult);
        } else {
          setError(paymentResult.error || 'Payment failed');
          onPaymentError?.(paymentResult.error || 'Payment failed');
        }
      } else {
        const errorMessage =
          result.errors?.[0]?.message || 'Payment tokenization failed';
        setError(errorMessage);
        onPaymentError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Payment processing failed';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (token: string) => {
    try {
      const response = await fetch('/api/payments/square', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'process-payment',
          amount: amount,
          currency: 'USD',
          sourceId: token,
          description: description,
          customerId: customerId,
          orderId: orderId,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error('Network error during payment processing');
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💳</div>
        <h3 style={{ marginBottom: '8px' }}>Loading Payment Form</h3>
        <p style={{ opacity: 0.8 }}>
          Initializing secure payment processing...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#10b981',
          }}
        >
          💳 Secure Payment
        </h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Enter your payment information below
        </p>
      </div>

      {/* Payment Amount */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
          ${amount.toFixed(2)}
        </div>
        {description && (
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '8px' }}>
            {description}
          </div>
        )}
      </div>

      {/* Card Container */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div
          id='card-container'
          style={{
            minHeight: '100px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
         />
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#fca5a5',
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || !card}
        style={{
          background:
            isProcessing || !card
              ? '#6b7280'
              : 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: isProcessing || !card ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'all 0.3s ease',
        }}
      >
        {isProcessing
          ? '🔄 Processing Payment...'
          : `💳 Pay $${amount.toFixed(2)}`}
      </button>

      {/* Security Notice */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '0.8rem',
          opacity: 0.7,
        }}
      >
        🔒 Your payment information is secure and encrypted
        <br />
        Powered by Square
      </div>
    </div>
  );
}
