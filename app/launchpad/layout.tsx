import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LaunchPad℠ - Professional Transportation Business Launch Services',
  description:
    'Complete business launch services for freight brokers and owner operators. Get licensed, insured, and operational with our comprehensive LaunchPad program. MC Authority, bonding, compliance, and ongoing support.',
  keywords: [
    'freight broker launch',
    'transportation business startup',
    'MC authority application',
    'freight broker license',
    'BMC-84 bond',
    'DOT compliance',
    'business formation',
    'freight brokerage training',
    'logistics business launch',
    'carrier startup',
    'transportation licensing',
    'freight business formation',
  ],
  openGraph: {
    title: 'LaunchPad℠ - Professional Transportation Business Launch Services',
    description:
      'Complete business launch services for freight brokers and owner operators. Get licensed, insured, and operational with our comprehensive LaunchPad program.',
    url: 'https://fleetflowapp.com/launchpad',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-launchpad.jpg',
        width: 1200,
        height: 630,
        alt: 'LaunchPad℠ - Professional Transportation Business Launch Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchPad℠ - Professional Transportation Business Launch Services',
    description:
      'Complete business launch services for freight brokers and owner operators.',
    images: ['/og-launchpad.jpg'],
  },
  alternates: {
    canonical: '/launchpad',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LaunchPadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
