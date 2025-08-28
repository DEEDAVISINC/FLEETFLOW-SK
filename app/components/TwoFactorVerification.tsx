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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4'>
      <div className='w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='mb-4 text-4xl'>🔐</div>
          <h1 className='mb-2 text-2xl font-bold text-slate-800'>
            Two-Step Verification
          </h1>
          <p className='text-slate-600'>
            Enter the 6-digit code sent to your{' '}
            {method === 'email' ? 'email' : 'phone'}
          </p>
        </div>

        {/* Method Selection */}
        {availableMethods.length > 1 && (
          <div className='mb-6 flex rounded-lg bg-slate-100 p-1'>
            {availableMethods.map((methodOption) => (
              <button
                key={methodOption}
                onClick={() => handleMethodChange(methodOption)}
                disabled={loading}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  method === methodOption
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {methodOption === 'email' ? '📧 Email' : '📱 SMS'}
              </button>
            ))}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className='mb-4 rounded-lg border border-green-200 bg-green-50 p-3'>
            <p className='flex items-center text-sm text-green-700'>
              <span className='mr-2'>✅</span>
              {success}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3'>
            <p className='flex items-center text-sm text-red-700'>
              <span className='mr-2'>❌</span>
              {error}
            </p>
          </div>
        )}

        {/* Code Input */}
        <div className='mb-6 flex justify-center gap-2' onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className='h-12 w-12 rounded-lg border-2 border-slate-200 text-center text-xl font-bold focus:border-blue-500 focus:outline-none disabled:bg-slate-100'
              maxLength={1}
              inputMode='numeric'
              pattern='[0-9]*'
            />
          ))}
        </div>

        {/* Timer */}
        <div className='mb-6 text-center'>
          {timeLeft > 0 ? (
            <p className='text-sm text-slate-500'>
              Code expires in{' '}
              <span className='font-medium text-orange-600'>
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className='text-sm font-medium text-red-600'>⏰ Code expired</p>
          )}
        </div>

        {/* Resend Code */}
        <div className='mb-6 text-center'>
          <button
            onClick={handleResendCode}
            disabled={loading || resendCooldown > 0 || timeLeft === 0}
            className='text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400'
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
          <div className='mb-4 flex justify-center'>
            <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
          </div>
        )}

        {/* Cancel Button */}
        <div className='text-center'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='text-sm text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed'
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
};
