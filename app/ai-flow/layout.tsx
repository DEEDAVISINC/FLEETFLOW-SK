import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Flow - Intelligent Transportation Automation Platform',
  description:
    'Advanced AI-powered automation for transportation operations. Intelligent load matching, predictive analytics, automated compliance, and smart route optimization.',
  keywords: [
    'AI transportation',
    'artificial intelligence logistics',
    'automated freight matching',
    'predictive analytics TMS',
    'AI compliance automation',
    'smart route optimization',
    'intelligent load matching',
    'machine learning logistics',
    'automated dispatch',
    'AI freight platform',
    'intelligent transportation',
    'automation logistics',
  ],
  openGraph: {
    title: 'AI Flow - Intelligent Transportation Automation Platform',
    description:
      'Advanced AI-powered automation for transportation operations. Intelligent load matching, predictive analytics, automated compliance, and smart route optimization.',
    url: 'https://fleetflowapp.com/ai-flow',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-ai-flow.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow AI Flow Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Flow - Intelligent Transportation Automation Platform',
    description:
      'Advanced AI-powered automation for transportation operations.',
    images: ['/og-ai-flow.jpg'],
  },
  alternates: {
    canonical: '/ai-flow',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AIFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
