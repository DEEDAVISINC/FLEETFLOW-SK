import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Government Contracting Services - WOSB Certified Transportation | FleetFlow',
  description:
    'FleetFlow LLC provides government transportation services as a certified Women Owned Small Business (WOSB). Specialized transportation solutions for federal agencies, defense contractors, and government contracts.',
  keywords: [
    'WOSB government contracts',
    'women owned small business transportation',
    'federal transportation services',
    'government freight services',
    'defense logistics services',
    'SBA certified transportation',
    'federal agency transportation',
    'government contractor transportation',
    'small business set aside contracts',
    'sources sought transportation',
    'SAM.gov transportation services',
    'emergency response logistics',
    'government healthcare logistics',
    'federal compliance transportation',
  ],
  alternates: {
    canonical: 'https://fleetflowapp.com/government-contracts',
  },
  openGraph: {
    title: 'Government Contracting Services - WOSB Certified Transportation',
    description:
      'FleetFlow LLC provides specialized transportation solutions for federal agencies as a certified Women Owned Small Business (WOSB).',
    url: 'https://fleetflowapp.com/government-contracts',
    images: [
      {
        url: '/government-contracts-og.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow WOSB Government Contracting Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Contracting Services - WOSB Certified Transportation',
    description:
      'FleetFlow LLC provides specialized transportation solutions for federal agencies as a certified Women Owned Small Business (WOSB).',
    images: ['/government-contracts-og.jpg'],
  },
};
