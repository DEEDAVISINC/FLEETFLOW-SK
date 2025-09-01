'use client';

import { useState } from 'react';
import SquarePaymentForm from '../../components/SquarePaymentForm';

export default function SquarePaymentDemo() {
  const [paymentAmount, setPaymentAmount] = useState(25.0);
  const [paymentDescription, setPaymentDescription] = useState(
    'FleetFlow Service Payment'
  );
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentSuccess = (result: any) => {
    setPaymentResult(result);
    setShowPaymentForm(false);
    console.info('Payment successful:', result);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const resetDemo = () => {
    setPaymentResult(null);
    setShowPaymentForm(false);
    setPaymentAmount(25.0);
    setPaymentDescription('FleetFlow Service Payment');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            💳 Square Payment Integration Demo
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Test Square payment processing in FleetFlow
          </p>
        </div>

        {!showPaymentForm && !paymentResult && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              color: 'white',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: '#10b981',
              }}
            >
              ⚙️ Payment Configuration
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Payment Amount ($)
                </label>
                <input
                  type='number'
                  step='0.01'
                  min='0.01'
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(parseFloat(e.target.value) || 0)
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Payment Description
                </label>
                <input
                  type='text'
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowPaymentForm(true)}
              disabled={paymentAmount <= 0}
              style={{
                background:
                  paymentAmount <= 0
                    ? '#6b7280'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: paymentAmount <= 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              💳 Proceed to Payment
            </button>
          </div>
        )}

        {showPaymentForm && (
          <div>
            <SquarePaymentForm
              amount={paymentAmount}
              description={paymentDescription}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setShowPaymentForm(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                ← Back to Configuration
              </button>
            </div>
          </div>
        )}

        {paymentResult && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#10b981',
              }}
            >
              Payment Successful!
            </h2>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <strong>Payment ID:</strong> {paymentResult.paymentId}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Transaction ID:</strong> {paymentResult.transactionId}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Amount:</strong> $
                {(paymentResult.amount / 100).toFixed(2)}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Status:</strong> {paymentResult.status}
              </div>
              {paymentResult.receiptUrl && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Receipt:</strong>{' '}
                  <a
                    href={paymentResult.receiptUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: '#10b981', textDecoration: 'underline' }}
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={resetDemo}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              🔄 Test Another Payment
            </button>
          </div>
        )}

        {/* API Information */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            color: 'white',
          }}
        >
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#f59e0b',
            }}
          >
            🔧 Square API Integration Details
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Environment
              </div>
              <div style={{ opacity: 0.8 }}>Sandbox (Testing)</div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Application ID
              </div>
              <div
                style={{
                  opacity: 0.8,
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                }}
              >
                sandbox-sq0idb-MrMaJsNyJ4Z5jyKuGctrTw
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Features
              </div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                • Card Processing
                <br />
                • Customer Management
                <br />
                • Order Creation
                <br />
                • Refunds
                <br />• Webhooks
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          >
            <strong>💡 Test Card Numbers:</strong>
            <br />
            • Visa: 4111 1111 1111 1111
            <br />
            • Mastercard: 5555 5555 5555 4444
            <br />
            • American Express: 3782 822463 10005
            <br />• Use any future expiration date and any 3-4 digit CVV
          </div>
        </div>
      </div>
    </div>
  );
}
