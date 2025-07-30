'use client'

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>FleetFlow Test Page</h1>
      <p>If you can see this, the basic React rendering is working.</p>
      <div style={{ 
        background: '#3b82f6', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        Test Card Component
      </div>
    </div>
  )
}
