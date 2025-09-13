import FleetFlowLandingPage from './components/FleetFlowLandingPage';

export default function HomePage() {
  console.log('🏠 CLEAN HOMEPAGE - NO AUTH, NO PROVIDERS, NO INTERFERENCE');

  // Return landing page with clean styling - NO authentication whatsoever
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FleetFlowLandingPage />
    </div>
  );
}
