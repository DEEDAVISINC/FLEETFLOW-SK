'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TwoFactorVerification } from '../../components/TwoFactorVerification';
import { twoFactorAuthService } from '../../services/TwoFactorAuthService';

type AuthStep = 'credentials' | 'two-factor';

export default function SignIn() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [authStep, setAuthStep] = useState<AuthStep>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState<{
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const router = useRouter();

  // Step 1: Validate credentials and initiate 2FA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First verify credentials with NextAuth but don't complete login yet
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Credentials are valid - check available 2FA methods
      const availableMethods = twoFactorAuthService.getAvailableMethods(
        credentials.email
      );

      if (availableMethods.length === 0) {
        setError('2FA not configured for this account. Contact administrator.');
        setIsLoading(false);
        return;
      }

      // Store pending user info for 2FA step
      const userInfo = getUserInfo(credentials.email);
      setPendingUser(userInfo);

      // Move to 2FA step
      setAuthStep('two-factor');
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle successful 2FA verification
  const handleTwoFactorVerified = async () => {
    if (!pendingUser) return;

    try {
      // Complete the NextAuth signin process
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Authentication error after 2FA');
        setAuthStep('credentials');
        return;
      }

      // Success - redirect to dashboard
      router.push('/');
    } catch (error) {
      setError('Failed to complete authentication');
      setAuthStep('credentials');
    }
  };

  // Handle 2FA cancellation - go back to credentials step
  const handleTwoFactorCancel = () => {
    setAuthStep('credentials');
    setPendingUser(null);
    setError('');
  };

  // Get user info for demo accounts
  const getUserInfo = (email: string) => {
    const userMap = {
      'admin@fleetflow.com': { email, name: 'FleetFlow Admin', role: 'admin' },
      'dispatch@fleetflow.com': {
        email,
        name: 'Dispatch Manager',
        role: 'dispatcher',
      },
      'driver@fleetflow.com': { email, name: 'John Smith', role: 'driver' },
      'broker@fleetflow.com': { email, name: 'Sarah Wilson', role: 'broker' },
      // VENDOR ACCOUNTS - Unified into main FleetFlow system
      'vendor@abcmanufacturing.com': {
        email,
        name: 'ABC Manufacturing Corp',
        role: 'vendor',
      },
      'vendor@retaildist.com': {
        email,
        name: 'Retail Distribution Inc',
        role: 'vendor',
      },
      'vendor@techsolutions.com': {
        email,
        name: 'Tech Solutions LLC',
        role: 'vendor',
      },
    };
    return (
      userMap[email as keyof typeof userMap] || {
        email,
        name: 'User',
        role: 'user',
      }
    );
  };

  // Render 2FA verification if on that step
  if (authStep === 'two-factor' && pendingUser) {
    return (
      <TwoFactorVerification
        email={pendingUser.email}
        onVerified={handleTwoFactorVerified}
        onCancel={handleTwoFactorCancel}
      />
    );
  }

  // Default: Render credentials form
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <div className='w-full max-w-md'>
        <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-xl'>
          {/* Logo */}
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'>
              <span className='text-2xl font-bold text-white'>FF</span>
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>FleetFlow</h1>
            <p className='mt-2 text-gray-600'>Sign in to your account</p>
          </div>

          {/* Demo Credentials */}
          <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <h3 className='mb-2 font-semibold text-blue-900'>
              🔐 Demo Accounts (2FA Required):
            </h3>
            <div className='space-y-1 text-sm text-blue-800'>
              <p>
                <strong>Admin:</strong> admin@fleetflow.com / admin123
              </p>
              <p>
                <strong>Dispatcher:</strong> dispatch@fleetflow.com /
                dispatch123
              </p>
              <p>
                <strong>Driver:</strong> driver@fleetflow.com / driver123
              </p>
              <p>
                <strong>Broker:</strong> broker@fleetflow.com / broker123
              </p>
              <hr className='my-2 border-blue-300' />
              <p className='mb-1 text-xs font-medium text-blue-700'>
                VENDOR ACCOUNTS:
              </p>
              <p>
                <strong>ABC Manufacturing:</strong> vendor@abcmanufacturing.com
                / temp123
              </p>
              <p>
                <strong>Retail Distribution:</strong> vendor@retaildist.com /
                temp456
              </p>
              <p>
                <strong>Tech Solutions:</strong> vendor@techsolutions.com /
                temp789
              </p>
            </div>
            <div className='mt-2 text-xs text-blue-600'>
              📧 Verification codes will be sent via email (SMS available for
              some accounts)
            </div>
          </div>

          {error && (
            <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3'>
              <p className='flex items-center text-sm text-red-800'>
                <span className='mr-2'>❌</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your email'
                required
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your password'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading ? (
                <>
                  <div className='mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                  Verifying...
                </>
              ) : (
                <>🔐 Continue to 2FA</>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className='mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3'>
            <p className='text-center text-xs text-amber-800'>
              🛡️ <strong>Enhanced Security:</strong> All FleetFlow accounts
              require two-step verification
            </p>
          </div>

          {/* Sign Up Link */}
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link
                href='/auth/signup'
                className='font-semibold text-blue-600 hover:text-blue-700'
              >
                Start your free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
