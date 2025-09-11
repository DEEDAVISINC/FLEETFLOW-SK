import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Go With the Flow - AI-Powered Freight Marketplace',
  description:
    'Experience the future of freight transportation with our AI-powered instant marketplace. Connect shippers and carriers instantly with real-time matching, dynamic pricing, and live GPS tracking.',
  keywords: [
    'freight marketplace',
    'instant marketplace',
    'AI freight matching',
    'real-time logistics',
    'dynamic pricing',
    'GPS tracking',
    'freight booking',
    'carrier matching',
    'load board',
    'transportation marketplace',
    'logistics platform',
    'freight technology',
  ],
  openGraph: {
    title: 'Go With the Flow - AI-Powered Freight Marketplace',
    description:
      'Experience the future of freight transportation with our AI-powered instant marketplace. Connect shippers and carriers instantly with real-time matching, dynamic pricing, and live GPS tracking.',
    url: 'https://fleetflowapp.com/go-with-the-flow',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-go-with-the-flow.jpg',
        width: 1200,
        height: 630,
        alt: 'Go With the Flow - AI-Powered Freight Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go With the Flow - AI-Powered Freight Marketplace',
    description:
      'Experience the future of freight transportation with our AI-powered instant marketplace.',
    images: ['/og-go-with-the-flow.jpg'],
  },
  alternates: {
    canonical: '/go-with-the-flow',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GoWithTheFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
