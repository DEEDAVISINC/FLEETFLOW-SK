import FreightBrokerDashboard from '../components/FreightBrokerDashboard'

export default function FreightBrokerDashboardPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      minHeight: '100vh',
      paddingTop: '80px',
      position: 'relative'
    }}>
      {/* Pink whitewash overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.10) 50%, rgba(6, 182, 212, 0.08) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
          <FreightBrokerDashboard />
        </div>
      </div>
    </div>
  )
} 