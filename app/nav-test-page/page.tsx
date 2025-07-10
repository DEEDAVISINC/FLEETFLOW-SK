'use client'

import TestNavigation from '../components/TestNavigation'

export default function NavigationTestPage() {
  return (
    <div>
      <TestNavigation />
      <div style={{
        marginTop: '100px',
        padding: '20px',
        maxWidth: '800px',
        margin: '100px auto 0',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1>🚛 Navigation Test Page</h1>
        <p>This page is for testing the navigation dropdown functionality.</p>
        <p>Open your browser's developer console to see the debug logs.</p>
        
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>Test Instructions:</h3>
          <ol>
            <li>Click on "OPERATIONS" dropdown button</li>
            <li>The dropdown menu should appear with Dispatch Central and Broker Box</li>
            <li>Click on "DRIVER MANAGEMENT" dropdown button</li>
            <li>The dropdown menu should appear with driver-related options</li>
            <li>Click outside the dropdown to close it</li>
            <li>Only one dropdown should be open at a time</li>
          </ol>
          
          <h3>Debug:</h3>
          <p>Check the browser console for debug messages showing dropdown state changes.</p>
        </div>
      </div>
    </div>
  )
}
