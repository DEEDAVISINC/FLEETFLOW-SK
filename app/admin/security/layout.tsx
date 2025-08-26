'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { checkPermission } from '../../config/access';

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasSecurityAccess = checkPermission('security.view');
  const hasAISecurityAccess = checkPermission('ai_security.view');

  if (!hasSecurityAccess) {
    return (
      <div className='p-8 text-center'>
        <h1 className='mb-4 text-2xl font-bold text-red-600'>Access Denied</h1>
        <p className='text-gray-700'>
          You do not have permission to access the security section.
        </p>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <div className='flex flex-shrink-0 items-center'>
                <h1 className='text-xl font-bold text-gray-900'>
                  Security Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='flex flex-grow'>
        {/* Sidebar Navigation */}
        <nav className='w-64 flex-shrink-0 bg-gray-800'>
          <div className='px-4 py-5'>
            <p className='font-medium text-white'>Security Controls</p>
            <ul className='mt-4 space-y-2'>
              <li>
                <Link
                  href='/admin/security'
                  className={`block rounded-md px-4 py-2 ${
                    pathname === '/admin/security'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/security/access-control'
                  className={`block rounded-md px-4 py-2 ${
                    pathname === '/admin/security/access-control'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Access Control
                </Link>
              </li>
              {hasAISecurityAccess && (
                <li>
                  <Link
                    href='/admin/security/ai-security'
                    className={`block rounded-md px-4 py-2 ${
                      pathname === '/admin/security/ai-security'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    AI Security
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href='/admin/security/audit-logs'
                  className={`block rounded-md px-4 py-2 ${
                    pathname === '/admin/security/audit-logs'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Audit Logs
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/security/compliance'
                  className={`block rounded-md px-4 py-2 ${
                    pathname === '/admin/security/compliance'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto bg-gray-100'>{children}</main>
      </div>
    </div>
  );
}
