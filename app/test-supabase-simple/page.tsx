'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://nleqplwwothhxgrovnjw.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg'
);

export default function TestSupabaseSimple() {
  const [status, setStatus] = useState<string>('Loading...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        setStatus('Testing connection...');

        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(5);

        if (testError) {
          throw testError;
        }

        setStatus('Connection successful!');
        setData(testData);

        // Test other tables
        const [loads, shippers, carriers, drivers] = await Promise.all([
          supabase.from('loads').select('count').limit(1),
          supabase.from('shippers').select('count').limit(1),
          supabase.from('carriers').select('count').limit(1),
          supabase.from('drivers').select('count').limit(1),
        ]);

        console.info('Table counts:', {
          loads: loads.count,
          shippers: shippers.count,
          carriers: carriers.count,
          drivers: drivers.count,
        });
      } catch (err: any) {
        setError(err.message);
        setStatus('Connection failed');
      }
    }

    testConnection();
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-3xl font-bold text-gray-900'>
          FleetFlow Supabase Test
        </h1>

        <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold'>Connection Status</h2>
          <div
            className={`rounded-lg p-4 ${
              error
                ? 'bg-red-100 text-red-800'
                : status === 'Connection successful!'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status}
          </div>
          {error && (
            <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-4'>
              <p className='font-mono text-sm text-red-800'>{error}</p>
            </div>
          )}
        </div>

        {data && (
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-4 text-xl font-semibold'>
              Sample Data (User Profiles)
            </h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full table-auto'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-4 py-2 text-left'>ID</th>
                    <th className='px-4 py-2 text-left'>Email</th>
                    <th className='px-4 py-2 text-left'>Full Name</th>
                    <th className='px-4 py-2 text-left'>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((profile: any, index: number) => (
                    <tr key={index} className='border-b'>
                      <td className='px-4 py-2'>{profile.id}</td>
                      <td className='px-4 py-2'>{profile.email}</td>
                      <td className='px-4 py-2'>{profile.full_name}</td>
                      <td className='px-4 py-2'>{profile.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className='mt-4 text-sm text-gray-600'>
              Showing {data.length} user profiles from the database
            </p>
          </div>
        )}

        <div className='mt-6 rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-xl font-semibold'>
            Database Tables Created
          </h2>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            {[
              'user_profiles',
              'notifications',
              'loads',
              'shippers',
              'carriers',
              'drivers',
              'vehicles',
              'sticky_notes',
              'load_assignments',
              'driver_assignments',
              'vehicle_assignments',
            ].map((table) => (
              <div key={table} className='rounded-lg bg-blue-50 p-3'>
                <span className='font-mono text-sm text-blue-800'>{table}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
