import FleetFlowLandingPage from './components/FleetFlowLandingPage';

export default function HomePage() {
  console.log('🏠 HOMEPAGE LOADING - NO AUTH REDIRECT ALLOWED');
  return (
    <div key='force-refresh'>
      <FleetFlowLandingPage />
    </div>
  );
}
