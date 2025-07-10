'use client'

import Link from 'next/link'

export default function ErrorTestPage() {
  console.log('ErrorTestPage component loaded')
  
  const testData = {
    message: 'FleetFlow TMS Error Test',
    timestamp: new Date().toISOString()
  }
  
  console.log('Test data:', testData)
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 20px 0',
          color: '#1f2937'
        }}>
          🚛 FleetFlow TMS
        </h1>
        <h2 style={{
          fontSize: '24px',
          color: '#dc2626',
          margin: '0 0 20px 0'
        }}>
          Runtime Error Diagnostic
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Testing for runtime errors...
        </p>
        <div style={{
          background: '#f3f4f6',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#1f2937', margin: '0 0 10px 0' }}>Console Output</h3>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
            Check browser console for error messages
          </p>
        </div>
        <Link href="/" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600'
        }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
