import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'FleetFlow Pricing Plans - Choose Your Transportation Management Solution',
  description:
    'Compare FleetFlow pricing plans from solo operators to enterprise teams. Start free with our basic plan or scale with professional and enterprise features. 14-day free trial available.',
  keywords: [
    'TMS pricing',
    'transportation software pricing',
    'freight brokerage software cost',
    'logistics platform pricing',
    'fleet management pricing',
    'dispatch software pricing',
    'CRM pricing',
    'logistics CRM cost',
    'transportation management cost',
    'freight software pricing',
  ],
  openGraph: {
    title:
      'FleetFlow Pricing Plans - Choose Your Transportation Management Solution',
    description:
      'Compare FleetFlow pricing plans from solo operators to enterprise teams. Start free with our basic plan or scale with professional and enterprise features.',
    url: 'https://fleetflowapp.com/plans',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Pricing Plans - Choose Your Transportation Management Solution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'FleetFlow Pricing Plans - Choose Your Transportation Management Solution',
    description:
      'Compare FleetFlow pricing plans from solo operators to enterprise teams.',
    images: ['/og-pricing.jpg'],
  },
  alternates: {
    canonical: '/plans',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
