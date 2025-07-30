'use client';

import { useState } from 'react';

export default function TestErrorHandling() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testAIWorkflowAPIs = async () => {
    addResult('🧪 Testing AI Workflow APIs...');

    try {
      // Test the AI dispatcher workflow demo API
      const response = await fetch('/api/ai-dispatcher-workflow/demo');
      const data = await response.json();
      addResult(`✅ AI Workflow Status API: ${data.success ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      addResult(`❌ AI Workflow Status API: FAIL - ${error}`);
    }

    try {
      // Test AI onboarding trigger
      const response = await fetch('/api/ai-onboarding/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_ai_onboardings' }),
      });
      const data = await response.json();
      addResult(`✅ AI Onboarding API: ${data.success ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      addResult(`❌ AI Onboarding API: FAIL - ${error}`);
    }

    try {
      // Test dispatcher assignments
      const response = await fetch(
        '/api/dispatcher-assignments?status=pending'
      );
      const data = await response.json();
      addResult(
        `✅ Dispatcher Assignments API: ${data.assignments ? 'PASS' : 'FAIL'}`
      );
    } catch (error) {
      addResult(`❌ Dispatcher Assignments API: FAIL - ${error}`);
    }
  };

  const testUnhandledRejection = () => {
    addResult('🧪 Testing unhandled promise rejection handling...');

    // Create an unhandled promise rejection
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Test unhandled promise rejection'));
      }, 100);
    });

    addResult(
      '⚠️ Unhandled promise rejection created - check console for proper handling'
    );
  };

  const testDOMNesting = () => {
    addResult('🧪 Testing DOM nesting validation...');

    // Check for common DOM nesting issues
    const nestedButtons = document.querySelectorAll(
      'button button, a button, button a'
    );
    if (nestedButtons.length > 0) {
      addResult(`❌ Found ${nestedButtons.length} nested interactive elements`);
    } else {
      addResult('✅ No nested interactive elements found');
    }

    const invalidNesting = document.querySelectorAll('span div, span p');
    if (invalidNesting.length > 0) {
      addResult(
        `❌ Found ${invalidNesting.length} invalid block/inline nestings`
      );
    } else {
      addResult('✅ No invalid block/inline nesting found');
    }
  };

  const runFullWorkflowDemo = async () => {
    addResult('🎬 Starting full AI dispatcher workflow demo...');

    try {
      const response = await fetch('/api/ai-dispatcher-workflow/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_complete_demo' }),
      });
      const data = await response.json();

      if (data.success) {
        addResult('✅ Full workflow demo completed successfully');
        addResult(`📄 ${data.description}`);
      } else {
        addResult(`❌ Full workflow demo failed: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Full workflow demo failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

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
        🧪 Error Handling & API Test Page
      </h1>

      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        This page tests our new AI workflow system and error handling to ensure
        unhandled promise rejections and DOM nesting errors are properly
        handled.
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
          onClick={testAIWorkflowAPIs}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🤖 Test AI APIs
        </button>

        <button
          onClick={testUnhandledRejection}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ⚠️ Test Error Handling
        </button>

        <button
          onClick={testDOMNesting}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🏗️ Test DOM Nesting
        </button>

        <button
          onClick={runFullWorkflowDemo}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🎬 Full Workflow Demo
        </button>

        <button
          onClick={clearResults}
          style={{
            background: 'linear-gradient(135deg, #6b7280, #4b5563)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      <div
        style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'auto',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        <div
          style={{ color: '#10b981', fontWeight: '600', marginBottom: '10px' }}
        >
          📊 Test Results Console:
        </div>
        {testResults.length === 0 ? (
          <div style={{ color: '#6b7280' }}>
            Click any test button above to see results...
          </div>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>

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
          📋 What This Tests:
        </h3>
        <ul style={{ color: '#1e40af', marginBottom: '0' }}>
          <li>
            <strong>AI APIs:</strong> Tests all new AI workflow endpoints for
            proper error handling
          </li>
          <li>
            <strong>Error Handling:</strong> Creates intentional unhandled
            promise rejection to test our global handler
          </li>
          <li>
            <strong>DOM Nesting:</strong> Checks for common DOM validation
            issues that cause React warnings
          </li>
          <li>
            <strong>Full Workflow:</strong> Tests the complete AI → Onboarding →
            Assignment → Contract flow
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f0fdf4',
          border: '1px solid #dcfce7',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#16a34a', marginTop: '0' }}>
          ✅ Success Indicators:
        </h3>
        <ul style={{ color: '#15803d', marginBottom: '0' }}>
          <li>All API tests return "PASS"</li>
          <li>Unhandled promise rejection is caught and logged properly</li>
          <li>No DOM nesting violations found</li>
          <li>
            Console shows detailed error information instead of cryptic stack
            traces
          </li>
        </ul>
      </div>
    </div>
  );
}
