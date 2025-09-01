'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestRedirectPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);

  const testLocalStorage = () => {
    const results: string[] = [];

    // Test 1: Write to localStorage
    try {
      const testData = {
        shipperId: 'ABC-204-070',
        companyName: 'ABC Manufacturing Corp',
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('vendorSession', JSON.stringify(testData));
      results.push('✅ Write to localStorage: SUCCESS');
    } catch (error) {
      results.push('❌ Write to localStorage: FAILED - ' + error);
    }

    // Test 2: Read from localStorage
    try {
      const readData = localStorage.getItem('vendorSession');
      if (readData) {
        const parsed = JSON.parse(readData);
        results.push(
          '✅ Read from localStorage: SUCCESS - ' + JSON.stringify(parsed)
        );
      } else {
        results.push('❌ Read from localStorage: FAILED - No data found');
      }
    } catch (error) {
      results.push('❌ Read from localStorage: FAILED - ' + error);
    }

    // Test 3: Clear localStorage
    try {
      localStorage.removeItem('vendorSession');
      results.push('✅ Clear localStorage: SUCCESS');
    } catch (error) {
      results.push('❌ Clear localStorage: FAILED - ' + error);
    }

    setTestResults(results);
  };

  const testRedirect = () => {
    // Set up test session
    const testData = {
      shipperId: 'ABC-204-070',
      companyName: 'ABC Manufacturing Corp',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('vendorSession', JSON.stringify(testData));

    // Test redirect
    console.info('🧪 Testing redirect to vendor portal...');
    router.push('/vendor-portal');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🧪 Redirect Test Page</h1>
      <p>This page tests the redirect functionality and localStorage.</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={testLocalStorage}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🧪 Test localStorage
        </button>

        <button
          onClick={testRedirect}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🧪 Test Redirect
        </button>
      </div>

      {testResults.length > 0 && (
        <div
          style={{
            background: '#f3f4f6',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3>Test Results:</h3>
          <ul>
            {testResults.map((result, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          background: '#fef3c7',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
        }}
      >
        <h3>Instructions:</h3>
        <ol>
          <li>Click ""Test localStorage"" to verify localStorage is working</li>
          <li>Click ""Test Redirect"" to test the redirect to vendor portal</li>
          <li>Check browser console (F12) for additional debug info</li>
          <li>
            If redirect fails, check if vendor portal page loads at
            /vendor-portal
          </li>
        </ol>
      </div>
    </div>
  );
}
