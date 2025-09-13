import { Metadata } from 'next';
import './globals.css';

// Clean layout with ZERO authentication - for landing page only
export const metadata: Metadata = {
  title: {
    default: 'FleetFlow™ - Advanced Transportation Management System',
    template: '%s | FleetFlow™ - Freight Brokerage Platform',
  },
  description:
    'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance.',
  keywords: [
    'transportation management system',
    'TMS',
    'freight brokerage',
    'logistics platform',
    'fleet management',
  ],
  metadataBase: new URL('https://fleetflowapp.com'),
};

export default function CleanLayout({
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
      </head>
      <body>
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
