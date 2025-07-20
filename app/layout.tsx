import './globals.css'
import 'leaflet/dist/leaflet.css'
import Navigation from './components/Navigation'
import { LoadProvider } from './contexts/LoadContext'
import { ShipperProvider } from './contexts/ShipperContext'
import { AuthProvider } from './components/AuthProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>FleetFlow - Professional Transportation Management System</title>
        <meta name="description" content="Comprehensive fleet management solution for carriers, brokers, and logistics professionals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚛</text></svg>" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: 'transparent' }}>
        <AuthProvider>
          <LoadProvider>
            <ShipperProvider>
              <Navigation />
              {children}
            </ShipperProvider>
          </LoadProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
