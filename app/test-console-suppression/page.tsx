'use client';

import { useEffect, useState } from 'react';

export default function TestConsoleSuppression() {
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Test if error suppression is active
    const results: string[] = [];

    // Check if our suppression flag is set
    if ((window as any).__REACT_ERROR_SUPPRESSION_ACTIVE__) {
      results.push('✅ Error suppression flag detected');
    } else {
      results.push('❌ Error suppression flag NOT detected');
    }

    // Test console.error override
    const originalError = console.error;
    let errorCaught = false;

    // Temporarily replace console.error to see if our override is working
    console.error = (...args) => {
      if (args.join(' ').includes('validateDOMNesting@')) {
        errorCaught = true;
      }
      originalError.apply(console, args);
    };

    // Trigger a fake React error to test suppression
    try {
      console.error('Test validateDOMNesting@ error - should be suppressed');
      if (errorCaught) {
        results.push('❌ React errors NOT being suppressed');
      } else {
        results.push('✅ React errors being suppressed successfully');
      }
    } catch (e) {
      results.push('⚠️ Error testing suppression');
    }

    // Restore original console.error
    console.error = originalError;

    setTestResults(results);
  }, []);

  const testConsoleError = () => {
    console.error(
      'createConsoleError@ - This React error should be suppressed'
    );
    console.error('Regular error - This should appear in console');
  };

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        🛡️ Console Error Suppression Test
      </h1>

      <div style={{ marginBottom: '30px' }}>
        <h3>Test Results:</h3>
        {testResults.map((result, index) => (
          <div
            key={index}
            style={{
              padding: '8px',
              margin: '4px 0',
              background: result.includes('✅')
                ? '#dcfce7'
                : result.includes('❌')
                  ? '#fee2e2'
                  : '#fef3c7',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {result}
          </div>
        ))}
      </div>

      <button
        onClick={testConsoleError}
        style={{
          padding: '12px 24px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          marginRight: '12px',
        }}
      >
        🧪 Test Console Suppression
      </button>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <strong>How to test:</strong>
        <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Open browser DevTools console</li>
          <li>Click "Test Console Suppression" button</li>
          <li>You should see "Regular error" but NOT "createConsoleError@"</li>
          <li>Navigate to /freightflow-rfx to test real React errors</li>
        </ol>
      </div>
    </div>
  );
}
