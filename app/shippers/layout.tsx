import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipper Portal - FleetFlow Shipper Management Platform',
  description:
    'Complete shipper portal for freight booking, load tracking, carrier selection, rate comparison, and supply chain visibility. Connect with reliable carriers instantly.',
  keywords: [
    'shipper portal',
    'freight booking',
    'load tracking',
    'shipper dashboard',
    'freight shipping',
    'carrier selection',
    'rate comparison',
    'supply chain visibility',
    'freight management',
    'logistics shipper',
    'shipping platform',
    'freight forwarding platform',
  ],
  openGraph: {
    title: 'Shipper Portal - FleetFlow Shipper Management Platform',
    description:
      'Complete shipper portal for freight booking, load tracking, carrier selection, rate comparison, and supply chain visibility.',
    url: 'https://fleetflowapp.com/shippers',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-shipper-portal.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Shipper Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipper Portal - FleetFlow Shipper Management Platform',
    description:
      'Complete shipper portal for freight booking and load tracking.',
    images: ['/og-shipper-portal.jpg'],
  },
  alternates: {
    canonical: '/shippers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShippersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
