'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AccountingNavigationProps {
  activeSection: string;
}

export default function AccountingNavigation({
  activeSection,
}: AccountingNavigationProps) {
  const pathname = usePathname();

  // Define navigation links
  const navLinks = [
    {
      key: 'invoices',
      label: 'Invoices',
      href: '/admin/accounting/invoices',
      icon: '📄',
    },
    {
      key: 'late-payment-complaints',
      label: 'Late Payment Complaints',
      href: '/admin/accounting/late-payment-complaints',
      icon: '⚠️',
    },
    {
      key: 'factoring',
      label: 'Factoring',
      href: '/admin/accounting/factoring',
      icon: '💱',
    },
    {
      key: 'payables',
      label: 'Payables',
      href: '/admin/accounting/payables',
      icon: '💸',
    },
  ];

  return (
    <div className='mb-6 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800'>
      <h2 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
        A/R Management
      </h2>

      <div className='flex flex-wrap gap-2'>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.key}
              href={link.href}
              className={`flex items-center space-x-2 rounded-md px-4 py-2 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
