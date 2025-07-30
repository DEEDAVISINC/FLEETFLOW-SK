'use client';

export default function TestBackground() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white">Background Test</h1>
        <p className="text-white">This should have a blue gradient background</p>
      </div>
    </div>
  );
}
