import { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FleetFlow™ - Advanced Transportation Management System',
    template: '%s | FleetFlow™ - Freight Brokerage Platform',
  },
  description:
    'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
          rel='stylesheet'
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            }
          `,
          }}
        />
        <Script
          src='https://js.squareup.com/v2/paymentform'
          strategy='beforeInteractive'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
