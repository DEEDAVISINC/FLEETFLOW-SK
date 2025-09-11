import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrier Portal - FleetFlow Carrier Management System',
  description:
    'Advanced carrier portal for fleet management, load opportunities, compliance tracking, payment processing, and direct communication with brokers. Join the FleetFlow carrier network.',
  keywords: [
    'carrier portal',
    'carrier management',
    'fleet management software',
    'carrier dashboard',
    'load opportunities',
    'carrier compliance',
    'truck carrier',
    'freight carrier',
    'carrier payment',
    'carrier communication',
    'carrier verification',
    'carrier onboarding',
  ],
  openGraph: {
    title: 'Carrier Portal - FleetFlow Carrier Management System',
    description:
      'Advanced carrier portal for fleet management, load opportunities, compliance tracking, payment processing, and direct communication.',
    url: 'https://fleetflowapp.com/carriers',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-carrier-portal.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Carrier Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carrier Portal - FleetFlow Carrier Management System',
    description:
      'Advanced carrier portal for fleet management and load opportunities.',
    images: ['/og-carrier-portal.jpg'],
  },
  alternates: {
    canonical: '/carriers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CarriersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
