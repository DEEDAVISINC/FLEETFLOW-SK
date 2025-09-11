import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Freight Network - Connected Transportation Ecosystem',
  description:
    'Comprehensive freight network connecting shippers, carriers, and brokers. Real-time load visibility, instant matching, and seamless transportation coordination across North America.',
  keywords: [
    'freight network',
    'transportation network',
    'freight marketplace',
    'load network',
    'carrier network',
    'shipper network',
    'freight connectivity',
    'transportation ecosystem',
    'logistics network',
    'freight platform',
    'load matching network',
    'transportation marketplace',
  ],
  openGraph: {
    title: 'Freight Network - Connected Transportation Ecosystem',
    description:
      'Comprehensive freight network connecting shippers, carriers, and brokers. Real-time load visibility, instant matching, and seamless transportation coordination.',
    url: 'https://fleetflowapp.com/freight-network',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-freight-network.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Freight Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freight Network - Connected Transportation Ecosystem',
    description:
      'Comprehensive freight network connecting shippers, carriers, and brokers.',
    images: ['/og-freight-network.jpg'],
  },
  alternates: {
    canonical: '/freight-network',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FreightNetworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
