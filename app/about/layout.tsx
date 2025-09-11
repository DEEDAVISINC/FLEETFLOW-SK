import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About FleetFlow - Leading Transportation Management System',
  description:
    'Learn about FleetFlow, the leading AI-powered transportation management system serving freight brokers, carriers, and shippers worldwide. Discover our mission, technology, and proven results.',
  keywords: [
    'about FleetFlow',
    'transportation management company',
    'freight brokerage software',
    'logistics technology company',
    'TMS provider',
    'freight software company',
    'logistics platform company',
    'supply chain technology',
    'transportation software company',
    'fleet management company',
  ],
  openGraph: {
    title: 'About FleetFlow - Leading Transportation Management System',
    description:
      'Learn about FleetFlow, the leading AI-powered transportation management system serving freight brokers, carriers, and shippers worldwide.',
    url: 'https://fleetflowapp.com/about',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About FleetFlow - Leading Transportation Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FleetFlow - Leading Transportation Management System',
    description:
      'Learn about FleetFlow, the leading AI-powered transportation management system.',
    images: ['/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
