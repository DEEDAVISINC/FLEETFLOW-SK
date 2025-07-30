'use client'

import { useState } from 'react'

export default function NavigationDebugPage() {
  const [testState, setTestState] = useState('Initial')
  const [clickCount, setClickCount] = useState(0)

  const handleTestClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    setTestState(`Clicked ${newCount} times`)
    console.log('Test button clicked:', newCount)
  }

  return (
    <div style={{ 
      padding: '80px 20px 20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ color: '#1e40af', marginBottom: '30px' }}>
        🧪 Navigation Debug Test
      </h1>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>React State Test</h3>
        <p>Current state: <strong>{testState}</strong></p>
        <button 
          onClick={handleTestClick}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test React State ({clickCount})
        </button>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>Navigation Instructions</h3>
        <ol>
          <li>Look at the top navigation bar</li>
          <li>Find the blue "🚛 OPERATIONS ▼" button</li>
          <li>Click it - it should change to "🔽" and show a dropdown</li>
          <li>Click "🚛 Dispatch Central" to navigate</li>
        </ol>
        
        <div style={{ marginTop: '15px', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
          <strong>Expected behavior:</strong>
          <ul>
            <li>Button changes color and scales up when active</li>
            <li>Dropdown appears with blue border</li>
            <li>Console shows click events</li>
            <li>Clicking links navigates and closes dropdown</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3>Troubleshooting</h3>
        <p>If the dropdown doesn't work:</p>
        <ul>
          <li>Open browser console (F12) to check for errors</li>
          <li>Verify React state test above works</li>
          <li>Try clicking directly on the text, not just the button area</li>
          <li>Check if any browser extensions are blocking JavaScript</li>
        </ul>
        
        <button 
          onClick={() => window.location.href = '/dispatch'}
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          🚛 Direct Navigation to Dispatch Central
        </button>
      </div>
    </div>
  )
}
