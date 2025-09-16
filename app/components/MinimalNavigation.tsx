'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';

export default function MinimalNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/loads', label: 'Loads' },
    { href: '/dispatchers', label: 'Dispatchers' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      zIndex: 1000,
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo />
      </div>

      {/* Navigation Items */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        color: 'white'
      }}>
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            style={{
              color: pathname === item.href ? '#ffd700' : 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: pathname === item.href ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            {item.label}
          </Link>
        ))}

        {/* Simple FleetFlow Brand */}
        <div style={{
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          FleetFlow™
        </div>

        {/* Session Info */}
        {session?.user && (
          <div style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'white'
          }}>
            {session.user.email}
          </div>
        )}
      </div>
    </nav>
  );
}
