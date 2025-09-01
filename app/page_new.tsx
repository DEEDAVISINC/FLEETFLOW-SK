'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700"">
      <main className="p-8"">
        {/* Simple Header */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8"">
          <h1 className="text-4xl font-bold text-white"">FleetFlow</h1>
          <p className="text-white/80"">Fleet Operations Dashboard</p>
        </div>

        {/* Simple Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"">
          <Link href="/dispatch"" className="bg-blue-500 hover:bg-blue-600 p-6 rounded-lg text-white text-center transition-colors"">
            <div className="text-3xl mb-2"">🚛</div>
            <h3 className="text-xl font-semibold"">Dispatch Central</h3>
          </Link>
          
          <Link href="/carriers"" className="bg-green-500 hover:bg-green-600 p-6 rounded-lg text-white text-center transition-colors"">
            <div className="text-3xl mb-2"">🚚</div>
            <h3 className="text-xl font-semibold"">Carrier Portal</h3>
          </Link>
          
          <Link href="/broker"" className="bg-orange-500 hover:bg-orange-600 p-6 rounded-lg text-white text-center transition-colors"">
            <div className="text-3xl mb-2"">🏢</div>
            <h3 className="text-xl font-semibold"">Broker Box</h3>
          </Link>
          
          <Link href="/quoting"" className="bg-purple-500 hover:bg-purple-600 p-6 rounded-lg text-white text-center transition-colors"">
            <div className="text-3xl mb-2"">💰</div>
            <h3 className="text-xl font-semibold"">Freight Quoting</h3>
          </Link>
        </div>
      </main>
    </div>
  );
}
