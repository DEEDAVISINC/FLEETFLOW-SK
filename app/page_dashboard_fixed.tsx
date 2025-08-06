'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedMetrics, setAnimatedMetrics] = useState({
    revenue: 0,
    loads: 0,
    drivers: 0,
    efficiency: 0,
    utilization: 0,
  });

  // Clock and animations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate metrics on load
    const animateMetrics = () => {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          const progress = i / steps;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          setAnimatedMetrics({
            revenue: Math.floor(487520 * easeProgress),
            loads: Math.floor(23 * easeProgress),
            drivers: Math.floor(8 * easeProgress),
            efficiency: Math.floor(6.8 * easeProgress * 10) / 10,
            utilization: Math.floor(89 * easeProgress),
          });
        }, i * stepDuration);
      }
    };

    animateMetrics();

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className='relative min-h-screen overflow-hidden'
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Animated Background */}
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl' />
        <div className='absolute top-3/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000' />
        <div className='absolute top-1/2 left-1/2 h-96 w-96 animate-pulse rounded-full bg-cyan-500/5 blur-3xl delay-2000' />
      </div>

      <main className='relative z-10 space-y-8 p-8'>
        {/* Command Center Header */}
        <div className='relative'>
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-xl' />
          <div className='relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-8'>
                <div className='relative'>
                  <div className='absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-75 blur-lg' />
                  <div className='relative rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4'>
                    <div className='text-3xl font-bold text-white'>🚛</div>
                  </div>
                </div>
                <div className='text-white'>
                  <h1 className='mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-5xl font-bold text-transparent'>
                    FleetFlow Command Center℠
                  </h1>
                  <p className='text-xl text-gray-300'>
                    Real-time fleet operations dashboard
                  </p>
                  <div className='mt-2 flex items-center space-x-4 text-sm text-gray-400'>
                    <span>🕒 {currentTime.toLocaleTimeString()}</span>
                    <span>📅 {currentTime.toLocaleDateString()}</span>
                    <span className='flex items-center space-x-1'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                      <span>System Online</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='mb-2 text-4xl font-bold text-white'>
                  ${animatedMetrics.revenue.toLocaleString()}
                </div>
                <div className='text-sm text-gray-300'>Today's Revenue</div>
                <div className='mt-1 text-sm text-green-300'>
                  ↑ 12.5% from yesterday
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '0 20px',
          }}
        >
          {/* Dispatch Central - Blue */}
          <Link href='/dispatch' style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #2196F3, #1976D2)',
                padding: '35px',
                borderRadius: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 15px 40px rgba(33, 150, 243, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 32px rgba(33, 150, 243, 0.3)';
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🚛</div>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                }}
              >
                Dispatch Central
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem',
                }}
              >
                Load Board & Management
              </p>
            </div>
          </Link>

          {/* Carrier Portal - Green */}
          <Link href='/carriers' style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #4CAF50, #2E7D32)',
                padding: '35px',
                borderRadius: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 15px 40px rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 32px rgba(76, 175, 80, 0.3)';
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🚚</div>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                }}
              >
                Carrier Portal
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem',
                }}
              >
                Driver & Carrier Load Board
              </p>
            </div>
          </Link>

          {/* Broker Box - Orange */}
          <Link href='/broker' style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #FF9800, #F57C00)',
                padding: '35px',
                borderRadius: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 15px 40px rgba(255, 152, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 32px rgba(255, 152, 0, 0.3)';
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🏢</div>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                }}
              >
                Broker Box
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem',
                }}
              >
                Agent Login Portal
              </p>
            </div>
          </Link>

          {/* Freight Quoting - Purple */}
          <Link href='/quoting' style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #9C27B0, #673AB7)',
                padding: '35px',
                borderRadius: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 15px 40px rgba(156, 39, 176, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 32px rgba(156, 39, 176, 0.3)';
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>💵</div>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                }}
              >
                Freight Quoting
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem',
                }}
              >
                Calculate Quotes & Rates
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
