'use client';

import { extendedShipperService } from '../services/shipperService';

export default function TestAuthPage() {
  const testCredentials = [
    { username: 'abcmfg', password: 'temp123', company: 'ABC Manufacturing Corp' },
    { username: 'retaildist', password: 'temp456', company: 'Retail Distribution Inc' },
    { username: 'techsolutions', password: 'temp789', company: 'Tech Solutions LLC' },
  ];

  const runTests = () => {
    console.log('🧪 Starting authentication tests...');
    
    testCredentials.forEach((cred, index) => {
      console.log(`\n🧪 Test ${index + 1}: ${cred.company}`);
      console.log(`Username: ${cred.username}`);
      console.log(`Password: ${cred.password}`);
      
      const result = extendedShipperService.authenticateShipper(cred.username, cred.password);
      
      console.log('Result:', result);
      
      if (result.success) {
        console.log('✅ SUCCESS - Authentication working');
        console.log('Shipper found:', result.shipper);
      } else {
        console.log('❌ FAILED - Authentication not working');
        console.log('Error:', result.error);
      }
    });
    
    // Test with invalid credentials
    console.log('\n🧪 Test 4: Invalid credentials');
    const invalidResult = extendedShipperService.authenticateShipper('invalid', 'wrong');
    console.log('Invalid credentials result:', invalidResult);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🧪 Authentication Test Page</h1>
      <p>This page tests the vendor login authentication service.</p>
      
      <button 
        onClick={runTests}
        style={{
          background: '#10b981',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🧪 Run Authentication Tests
      </button>
      
      <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
        <h3>Test Credentials:</h3>
        <ul>
          {testCredentials.map((cred, index) => (
            <li key={index}>
              <strong>{cred.company}</strong><br/>
              Username: {cred.username}<br/>
              Password: {cred.password}
            </li>
          ))}
        </ul>
        
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Click "Run Authentication Tests" button</li>
          <li>Open browser console (F12)</li>
          <li>Check console output for test results</li>
          <li>All tests should show "✅ SUCCESS" if authentication is working</li>
        </ol>
      </div>
    </div>
  );
} 