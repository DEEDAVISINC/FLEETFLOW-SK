'use client';

import { useState } from 'react';
import HydrationSafeComponent from '../components/HydrationSafeComponent';

export default function HydrationTestPage() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Test hydration functionality');

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        ✅ Hydration Test Page
      </h1>

      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        This page tests that React hydration is working properly without console
        errors.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Count: {count}
        </button>

        <button
          onClick={() =>
            setMessage('Button clicked at ' + new Date().toLocaleTimeString())
          }
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Update Message
        </button>

        <button
          onClick={() => {
            console.log('✅ Console test - this should appear in console');
            alert('Alert test - if you see this, JavaScript is working!');
          }}
          style={{
            padding: '10px 20px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Console & Alert Test
        </button>
      </div>

      <div
        style={{
          background: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>
          Current Message:
        </h3>
        <p style={{ margin: '0', color: '#6b7280', fontFamily: 'monospace' }}>
          {message}
        </p>
      </div>

      <HydrationSafeComponent
        fallback={<div style={{ color: '#9ca3af' }}>Loading...</div>}
      >
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #d1fae5',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <h3 style={{ color: '#047857', margin: '0 0 10px 0' }}>
            🎉 Hydration Safe Component Test
          </h3>
          <p style={{ color: '#065f46', margin: '0' }}>
            This content only renders after successful hydration!
          </p>
        </div>
      </HydrationSafeComponent>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#2563eb', marginTop: '0' }}>
          ✅ Success Indicators:
        </h3>
        <ul style={{ color: '#1e40af', marginBottom: '0' }}>
          <li>All buttons are clickable and functional</li>
          <li>Count increments when clicked</li>
          <li>Message updates dynamically</li>
          <li>Console test logs without errors</li>
          <li>Green "Hydrated" indicator appears in top-left</li>
          <li>No React hydration errors in console</li>
        </ul>
      </div>
    </div>
  );
}
