'use client';

import Link from 'next/link';
import InvitationQuickManager from '../components/InvitationQuickManager';
// ✅ ADD: Platform AI monitoring dashboard
import { PlatformAIMonitor } from '../components/PlatformAIMonitor';

export default function DashboardPage() {
  const quickLinks = [
    {
      href: '/dispatch',
      bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      emoji: '🚛',
      title: 'Dispatch Central',
      color: 'white',
    },
    {
      href: '/drivers',
      bg: 'linear-gradient(135deg, #f7c52d, #f4a832)',
      emoji: '🚛',
      title: 'Driver Management',
      color: '#2d3748',
    },
    {
      href: '/vehicles',
      bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      emoji: '🚚',
      title: 'Fleet Management',
      color: 'white',
    },
    {
      href: '/broker',
      bg: 'linear-gradient(135deg, #f97316, #ea580c)',
      emoji: '🏢',
      title: 'Broker Box',
      color: 'white',
    },
    {
      href: '/routes',
      bg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      emoji: '🗺️',
      title: 'Route Optimization',
      color: 'white',
    },
    {
      href: '/analytics',
      bg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      emoji: '📊',
      title: 'Analytics',
      color: 'white',
    },
    {
      href: '/quoting',
      bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
      emoji: '💰',
      title: 'Freight Quoting',
      color: 'white',
    },
    {
      href: '/compliance',
      bg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      emoji: '✅',
      title: 'Compliance',
      color: 'white',
    },
    {
      href: '/maintenance',
      bg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      emoji: '🔧',
      title: 'Maintenance',
      color: 'white',
    },
    {
      href: '/training',
      bg: 'linear-gradient(135deg, #8b4513, #654321)',
      emoji: '🎓',
      title: 'Training',
      color: 'white',
    },
    {
      href: '/notes',
      bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      emoji: '📝',
      title: 'Notes',
      color: 'white',
    },
  ];

  const stats = [
    { label: 'Active Loads', value: '24', color: '#3b82f6', emoji: '📦' },
    { label: 'Available Drivers', value: '8', color: '#10b981', emoji: '👨‍💼' },
    { label: 'Fleet Vehicles', value: '32', color: '#8b5cf6', emoji: '🚛' },
    { label: 'Revenue (MTD)', value: '$145K', color: '#22c55e', emoji: '💵' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%),
        radial-gradient(circle at 20% 80%, #f093fb 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, #f5576c 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, #4facfe 0%, transparent 50%)
      `,
        backgroundBlendMode: 'multiply, normal, normal, normal',
        padding: '80px 20px 20px 20px',
      }}
    >
      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 12px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            🚛 FleetFlow Dashboard
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              fontWeight: '500',
            }}
          >
            Comprehensive Transportation Management System
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {stat.emoji}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: stat.color,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Carrier Invitation Management */}
        <InvitationQuickManager
          compact={true}
          style={{ marginBottom: '24px' }}
        />

        {/* ✅ Platform AI Monitoring */}
        <div style={{ marginBottom: '24px' }}>
          <PlatformAIMonitor />
        </div>

        {/* Quick Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              style={{
                background: `${link.bg}, rgba(255, 255, 255, 0.1)`,
                backgroundBlendMode: 'multiply, normal',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                display: 'block',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {link.emoji}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: link.color,
                  textShadow:
                    link.color === 'white'
                      ? '0 1px 2px rgba(0,0,0,0.3)'
                      : 'none',
                }}
              >
                {link.title}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
