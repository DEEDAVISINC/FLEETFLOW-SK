import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transportation Management Services - FleetFlow TMS Platform',
  description:
    'Comprehensive transportation management services including freight brokerage, dispatch management, carrier networks, compliance automation, and AI-powered optimization. Trusted by 2,847+ companies worldwide.',
  keywords: [
    'transportation management services',
    'freight brokerage services',
    'dispatch management',
    'carrier management',
    'compliance automation',
    'logistics services',
    'supply chain management',
    'TMS services',
    'freight forwarding',
    'load board services',
  ],
  openGraph: {
    title: 'Transportation Management Services - FleetFlow TMS Platform',
    description:
      'Comprehensive transportation management services including freight brokerage, dispatch management, carrier networks, compliance automation, and AI-powered optimization.',
    url: 'https://fleetflowapp.com/services',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Transportation Management Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation Management Services - FleetFlow TMS Platform',
    description:
      'Comprehensive transportation management services with AI-powered optimization.',
    images: ['/og-services.jpg'],
  },
  alternates: {
    canonical: '/services',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
