'use client'

import Link from 'next/link'

export default function TrainingPageSimple() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#1f2937', 
          marginBottom: '20px' 
        }}>
          🎓 FleetFlow University - Debug
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280', 
          marginBottom: '30px' 
        }}>
          This is a simplified version to test if the page loads correctly.
        </p>
        
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            ← Back to Dashboard
          </button>
        </Link>

        <div style={{ marginTop: '30px' }}>
          <h3>Debug Info:</h3>
          <p>Page is rendering correctly</p>
          <p>No JavaScript errors</p>
          <p>Components are loading</p>
        </div>
      </div>
    </div>
  )
}
