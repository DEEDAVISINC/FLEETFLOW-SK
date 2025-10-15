import { SalesCopilotPanel } from '../components/SalesCopilotPanel';

export default function TestCopilotPage() {
  return (
    <div style={{ padding: '20px', background: '#0f172a', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>
        Sales Copilot AI Test Page
      </h1>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
        This is a test page to verify the Sales Copilot AI component renders
        correctly without authentication.
      </p>

      <SalesCopilotPanel agentId='test-agent' currentCallId='test-call-123' />
    </div>
  );
}



