import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Freight Broker Portal - FleetFlow Brokerage Platform',
  description:
    'Complete freight brokerage platform with AI-powered load matching, carrier management, rate optimization, and real-time tracking. Streamline your brokerage operations with advanced TMS technology.',
  keywords: [
    'freight broker',
    'brokerage platform',
    'freight brokerage software',
    'load matching',
    'carrier management',
    'rate optimization',
    'freight forwarding',
    'logistics brokerage',
    'TMS for brokers',
    'freight broker dashboard',
    'load board software',
    'carrier database',
  ],
  openGraph: {
    title: 'Freight Broker Portal - FleetFlow Brokerage Platform',
    description:
      'Complete freight brokerage platform with AI-powered load matching, carrier management, rate optimization, and real-time tracking.',
    url: 'https://fleetflowapp.com/broker',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-broker-portal.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Freight Broker Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freight Broker Portal - FleetFlow Brokerage Platform',
    description:
      'Complete freight brokerage platform with AI-powered load matching.',
    images: ['/og-broker-portal.jpg'],
  },
  alternates: {
    canonical: '/broker',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BrokerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
