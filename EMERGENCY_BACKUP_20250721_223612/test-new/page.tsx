export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🚛 NEW DASHBOARD TEST</h1>
        <p>This is a completely new page to test if changes are visible</p>
        <p style={{ color: '#3b82f6' }}>Dark background should be visible now!</p>
      </div>
    </div>
  )
}
