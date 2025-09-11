'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className='flex items-center space-x-2'>
        <li>
          <Link
            href='/'
            className='flex items-center text-gray-500 transition-colors hover:text-gray-700'
            aria-label='Home'
          >
            <Home className='h-4 w-4' />
            <span className='sr-only'>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className='flex items-center'>
            <ChevronRight
              className='mx-2 h-4 w-4 text-gray-400'
              aria-hidden='true'
            />
            {item.current ? (
              <span className='font-medium text-gray-900' aria-current='page'>
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className='text-gray-500 transition-colors hover:text-gray-700'
              >
                {item.label}
              </Link>
            ) : (
              <span className='text-gray-500'>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Structured data for breadcrumbs
export function generateBreadcrumbStructuredData(
  items: BreadcrumbItem[],
  baseUrl: string = 'https://fleetflowapp.com'
) {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `${baseUrl}${item.href}` : undefined,
      })),
    ].filter((item) => item.item || item.position === 1),
  };

  return breadcrumbList;
}
