'use client';

export default function ErrorTestPage() {
  console.info('ErrorTestPage component loaded');

  const testData = {
    message: 'FleetFlow TMS Error Test',
    timestamp: new Date().toISOString(),
  };

  console.info('Test data:', testData);

  return (
    <div>
      <h1>Error Test Page</h1>
    </div>
  );
}
