import FleetFlowLandingPage from './components/FleetFlowLandingPage';

export default function HomePage() {
  // FORCE: Completely isolated homepage with ZERO authentication interference
  console.log('🚨 FORCE CLEAN HOMEPAGE - ZERO AUTH INTERFERENCE');
  
  // Add anti-auth CSS to prevent any overlays
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* KILL ALL AUTH OVERLAYS AND MODALS */
          .modal-overlay, .auth-overlay, .signin-overlay { display: none !important; }
          .modal, .auth-modal, .signin-modal { display: none !important; }
          [class*="auth"], [class*="signin"], [class*="login"] { display: none !important; }
          body { overflow: auto !important; }
        `
      }} />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 9999
        }}
      >
        <FleetFlowLandingPage />
      </div>
    </>
  );
}
