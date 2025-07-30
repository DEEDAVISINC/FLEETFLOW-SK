'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, checkPermission } from '../config/access'

// Test with access imports
export default function TrainingPageTest() {
  const [testState, setTestState] = useState('Working')
  
  // Test the access functions
  let accessTest = 'Not tested'
  try {
    const { user } = getCurrentUser()
    const hasAccess = checkPermission('hasManagementAccess')
    accessTest = `User: ${user?.name}, HasAccess: ${hasAccess}`
  } catch (error) {
    accessTest = `Error: ${error}`
  }

  useEffect(() => {
    console.log('Training page test component mounted')
    setTestState('UseEffect working')
  }, [])

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
          🎓 FleetFlow University - Test
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280', 
          marginBottom: '30px' 
        }}>
          Testing basic React functionality: {testState}<br/>
          Access test: {accessTest}
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
      </div>
    </div>
  )
}
