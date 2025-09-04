'use client';

import React, { useEffect, useRef, useState } from 'react';
import { twoFactorAuthService } from '../services/TwoFactorAuthService';

interface TwoFactorVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  email,
  onVerified,
  onCancel,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(0);
  const [availableMethods, setAvailableMethods] = useState<('sms' | 'email')[]>(
    []
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize available methods and send initial code
  useEffect(() => {
    const methods = twoFactorAuthService.getAvailableMethods(email);
    setAvailableMethods(methods);

    if (methods.includes('email')) {
      setMethod('email');
      sendInitialCode('email');
    } else if (methods.includes('sms')) {
      setMethod('sms');
      sendInitialCode('sms');
    }

    // Start cleanup interval on client side only
    twoFactorAuthService.startCleanupInterval();

    // Cleanup interval when component unmounts
    return () => {
      twoFactorAuthService.stopCleanupInterval();
    };
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendInitialCode = async (selectedMethod: 'email' | 'sms') => {
    setLoading(true);
    setError('');

    const result = await twoFactorAuthService.sendVerificationCode(
      email,
      selectedMethod
    );

    if (result.success) {
      setSuccess(
        `Verification code sent to your ${selectedMethod === 'email' ? 'email' : 'phone'}`
      );
      setTimeLeft(600); // Reset timer
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (
      newCode.every((digit) => digit !== '') &&
      newCode.join('').length === 6
    ) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      handleVerifyCode(pastedData);
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    if (verificationCode.length !== 6) return;

    setLoading(true);
    setError('');

    const result = twoFactorAuthService.verifyCode(
      email,
      verificationCode,
      method
    );

    if (result.success) {
      setSuccess('Verification successful! Logging you in...');
      setTimeout(onVerified, 1000);
    } else {
      setError(result.message);
      setCode(['', '', '', '', '', '']); // Clear code on failure
      inputRefs.current[0]?.focus(); // Focus first input
    }

    setLoading(false);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');
    setCode(['', '', '', '', '', '']); // Clear current code

    const result = await twoFactorAuthService.sendVerificationCode(
      email,
      method
    );

    if (result.success) {
      setSuccess(
        `New verification code sent to your ${method === 'email' ? 'email' : 'phone'}`
      );
      setTimeLeft(600); // Reset timer
      setResendCooldown(30); // 30 second cooldown
      inputRefs.current[0]?.focus();
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleMethodChange = async (newMethod: 'email' | 'sms') => {
    if (newMethod === method) return;

    setMethod(newMethod);
    setCode(['', '', '', '', '', '']);
    setError('');
    setSuccess('');

    await sendInitialCode(newMethod);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '4px solid #3b82f6',
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
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>🔐</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                }}
              >
                🔐 TWO-STEP VERIFICATION
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                Enter the 6-digit code sent to your{' '}
                {method === 'email' ? 'email' : 'phone'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Verification Form */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Method Selection */}
          {availableMethods.length > 1 && (
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {availableMethods.map((methodOption) => (
                <button
                  key={methodOption}
                  onClick={() => handleMethodChange(methodOption)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background:
                      method === methodOption
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'transparent',
                    color:
                      method === methodOption
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {methodOption === 'email' ? '📧 Email' : '📱 SMS'}
                </button>
              ))}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#10b981',
                fontSize: '14px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '16px' }}>✅</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '14px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Code Input */}
          <div
            style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
            }}
            onPaste={handlePaste}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                maxLength={1}
                inputMode='numeric'
                pattern='[0-9]*'
              />
            ))}
          </div>

          {/* Timer */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            {timeLeft > 0 ? (
              <p
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Code expires in{' '}
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                ⏰ Code expired
              </p>
            )}
          </div>

          {/* Resend Code */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <button
              onClick={handleResendCode}
              disabled={loading || resendCooldown > 0 || timeLeft === 0}
              style={{
                color:
                  resendCooldown > 0 || timeLeft === 0
                    ? 'rgba(255, 255, 255, 0.4)'
                    : '#3b82f6',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor:
                  resendCooldown > 0 || timeLeft === 0 || loading
                    ? 'not-allowed'
                    : 'pointer',
                background: 'none',
                border: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!(resendCooldown > 0 || timeLeft === 0 || loading)) {
                  e.target.style.color = '#60a5fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!(resendCooldown > 0 || timeLeft === 0 || loading)) {
                  e.target.style.color = '#3b82f6';
                }
              }}
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : timeLeft === 0
                  ? 'Request new code'
                  : 'Resend code'}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          )}

          {/* Cancel Button */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: 'none',
                border: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.color = 'rgba(255, 255, 255, 0.6)';
                }
              }}
            >
              ← Back to login
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 0.8;
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
