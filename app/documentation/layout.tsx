import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FleetFlow Documentation - Complete TMS Platform Guide',
  description:
    'Comprehensive documentation for FleetFlow Transportation Management System. Learn about freight brokerage, carrier management, driver portals, compliance, and advanced TMS features.',
  keywords: [
    'FleetFlow documentation',
    'TMS documentation',
    'transportation management guide',
    'freight brokerage guide',
    'carrier management documentation',
    'driver portal guide',
    'compliance documentation',
    'TMS user guide',
    'logistics platform documentation',
    'freight software help',
    'transportation documentation',
  ],
  openGraph: {
    title: 'FleetFlow Documentation - Complete TMS Platform Guide',
    description:
      'Comprehensive documentation for FleetFlow Transportation Management System. Learn about freight brokerage, carrier management, driver portals, and compliance.',
    url: 'https://fleetflowapp.com/documentation',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-documentation.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FleetFlow Documentation - Complete TMS Platform Guide',
    description: 'Comprehensive documentation for FleetFlow TMS platform.',
    images: ['/og-documentation.jpg'],
  },
  alternates: {
    canonical: '/documentation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
