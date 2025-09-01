import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang=""en"">
      <head>
        <title>FleetFlow - Test</title>
        <meta name="viewport"" content=""width=device-width, initial-scale=1"" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <div style={{ padding: '20px' }}>
          <h1 style={{ color: 'white', marginBottom: '20px' }}>FleetFlow Debug</h1>
          {children}
        </div>
      </body>
    </html>
  )
}
