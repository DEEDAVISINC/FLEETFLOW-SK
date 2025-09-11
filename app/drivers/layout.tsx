import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Portal - FleetFlow Driver Management Platform',
  description:
    'Professional driver portal with real-time load assignments, GPS tracking, electronic logging, route optimization, and direct communication with dispatchers. Join the FleetFlow driver network.',
  keywords: [
    'driver portal',
    'truck driver app',
    'driver management',
    'ELD system',
    'electronic logging device',
    'load assignments',
    'driver dispatch',
    'truck driver platform',
    'freight driver',
    'carrier driver portal',
    'GPS tracking driver',
    'driver communication',
  ],
  openGraph: {
    title: 'Driver Portal - FleetFlow Driver Management Platform',
    description:
      'Professional driver portal with real-time load assignments, GPS tracking, electronic logging, route optimization, and direct communication.',
    url: 'https://fleetflowapp.com/drivers',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-driver-portal.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Driver Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Driver Portal - FleetFlow Driver Management Platform',
    description:
      'Professional driver portal with real-time load assignments and GPS tracking.',
    images: ['/og-driver-portal.jpg'],
  },
  alternates: {
    canonical: '/drivers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DriversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
