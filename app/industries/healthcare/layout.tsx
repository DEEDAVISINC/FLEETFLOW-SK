import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Logistics - FleetFlow TMS for Medical Transportation',
  description:
    'Specialized transportation management system for healthcare logistics. Temperature-controlled shipping, pharmaceutical transport, medical equipment delivery, and regulatory compliance for healthcare providers.',
  keywords: [
    'healthcare logistics',
    'medical transportation',
    'pharmaceutical shipping',
    'medical equipment transport',
    'healthcare TMS',
    'temperature controlled logistics',
    'pharma transportation',
    'medical supply chain',
    'healthcare compliance',
    'HIPAA compliant logistics',
    'medical courier services',
  ],
  openGraph: {
    title: 'Healthcare Logistics - FleetFlow TMS for Medical Transportation',
    description:
      'Specialized transportation management system for healthcare logistics, pharmaceutical transport, and medical equipment delivery.',
    url: 'https://fleetflowapp.com/industries/healthcare',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-healthcare.jpg',
        width: 1200,
        height: 630,
        alt: 'Healthcare Logistics with FleetFlow TMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Logistics - Medical Transportation TMS',
    description:
      'Specialized TMS for healthcare logistics and pharmaceutical transport.',
    images: ['/og-healthcare.jpg'],
  },
  alternates: {
    canonical: '/industries/healthcare',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HealthcareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
