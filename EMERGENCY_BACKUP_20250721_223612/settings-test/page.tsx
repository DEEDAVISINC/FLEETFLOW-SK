'use client';

export default function SettingsTest() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      ✅ SYSTEM IS WORKING - Settings page restored successfully!
      <br />
      <small style={{ fontSize: '16px', marginTop: '20px' }}>
        If you see this, go to /settings - it should work now
      </small>
    </div>
  );
} 