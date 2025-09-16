'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <p className='text-gray-600'>Redirecting...</p>
      </div>
    </div>
  );
}
