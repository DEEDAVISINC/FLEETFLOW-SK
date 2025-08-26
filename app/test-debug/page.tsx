import Link from 'next/link';

export default function TestDebugPage() {
  return (
    <div
      style={{
        padding: '20px',
        background: 'red',
        minHeight: '100vh',
        fontSize: '18px',
        color: 'white',
      }}
    >
      <h1>🚨 EMERGENCY DEBUG PAGE 🚨</h1>
      <p>If you can see this RED page, Next.js routing is working!</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <div
        style={{
          background: 'darkred',
          padding: '20px',
          margin: '20px 0',
          borderRadius: '8px',
        }}
      >
        <h2>Navigation Test</h2>
        <Link href='/' style={{ color: 'yellow', textDecoration: 'underline' }}>
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
}
