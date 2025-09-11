import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'FleetFlow University - Transportation Industry Training & Certification',
  description:
    'Professional training and certification programs for transportation professionals. Learn freight brokerage, dispatch operations, compliance, and advanced TMS platform usage.',
  keywords: [
    'FleetFlow University',
    'transportation training',
    'freight brokerage certification',
    'TMS training',
    'logistics training',
    'dispatch training',
    'compliance training',
    'carrier training',
    'driver training',
    'freight training',
    'transportation certification',
    'logistics education',
  ],
  openGraph: {
    title:
      'FleetFlow University - Transportation Industry Training & Certification',
    description:
      'Professional training and certification programs for transportation professionals. Learn freight brokerage, dispatch operations, compliance, and TMS platform usage.',
    url: 'https://fleetflowapp.com/university',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-university.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow University Training Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FleetFlow University - Transportation Industry Training',
    description:
      'Professional training programs for transportation professionals.',
    images: ['/og-university.jpg'],
  },
  alternates: {
    canonical: '/university',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
