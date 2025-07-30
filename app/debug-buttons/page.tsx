'use client';

import { useState } from 'react';

export default function DebugButtons() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '50px', background: 'white' }}>
      <h1>🔧 Minimal Button Test</h1>

      {/* Basic HTML button */}
      <button
        onClick={() => {
          console.log('HTML button clicked!');
          alert('HTML button works!');
        }}
        style={{
          padding: '10px 20px',
          margin: '10px',
          background: 'red',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        HTML Button Test
      </button>

      {/* React state button */}
      <button
        onClick={() => {
          console.log('React button clicked!');
          setCount((c) => c + 1);
        }}
        style={{
          padding: '10px 20px',
          margin: '10px',
          background: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        React Button (Count: {count})
      </button>

      {/* Inline event handler */}
      <button
        onMouseDown={() => console.log('Mouse down')}
        onMouseUp={() => console.log('Mouse up')}
        onClick={() => console.log('Click event')}
        style={{
          padding: '10px 20px',
          margin: '10px',
          background: 'green',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Event Test Button
      </button>

      <div
        style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0' }}
      >
        <h3>What do you see?</h3>
        <p>
          Count: <strong>{count}</strong>
        </p>
        <p>Open browser console (F12) and click the buttons above.</p>
        <p>You should see console messages when clicking.</p>
      </div>
    </div>
  );
}
