import Link from 'next/link';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>Test Page - FleetFlow is Working!</h1>
      <p>If you can see this, the Next.js app is running correctly.</p>
      <Link href='/'>← Back to Home</Link>
    </div>
  );
}
