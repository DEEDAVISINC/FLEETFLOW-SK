'use client'

import Link from 'next/link'

// Professional Navigation Component with Dropdowns - RESTORED ORIGINAL
const Navigation = ({ showLogo = true }: { showLogo?: boolean }) => {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Hide navigation on dedicated pages where it wasn't specifically requested
  const hiddenPaths = [
    '/drivers/dashboard',
    '/dispatch',
    '/driver-portal'
  ]
  
  if (pathname && hiddenPaths.includes(pathname)) {
    return null
  }
  
  const { user } = getCurrentUser()
  const hasManagementAccess = checkPermission('hasManagementAccess')
  const userId = user.role

  // Navigation tabs that match the dashboard quick links exactly
  const navItems = [
    { id: 'dashboard', label: '🏠 Dashboard', href: '/' },
    { id: 'dispatch', label: '🚛 Dispatch Central', href: '/dispatch' },
    { id: 'drivers', label: '🚛 Driver Management', href: '/drivers' },
    { id: 'vehicles', label: '� Fleet Management', href: '/vehicles' },
    { id: 'broker', label: '🏢 Broker Box', href: '/broker' },
    { id: 'routes', label: '🗺️ Route Optimization', href: '/routes' },
    { id: 'analytics', label: '📊 Analytics', href: '/analytics' },
    { id: 'quoting', label: '💰 Freight Quoting', href: '/quoting' },
    { id: 'compliance', label: '✅ Compliance', href: '/compliance' },
    { id: 'maintenance', label: '🔧 Maintenance', href: '/maintenance' },
    { id: 'training', label: '🎓 Training', href: '/training' },
    { id: 'notes', label: '📝 Notes', href: '/notes' },
  ]

  return (
    <nav className="nav-2d" style={{ position: 'relative', zIndex: 100000 }}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              {showLogo && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img 
                    src="/images/new fleetflow logo.png" 
                    alt="FleetFlow Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to old logo if new one fails
                      e.currentTarget.src = "/images/fleet-flow-logo.png";
                    }}
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                FleetFlow
              </h1>
            </Link>
          </div>
          
          {/* Navigation Items - Horizontal Layout */}
          <div className="flex items-center gap-1">
            <NotificationBell userId={userId} />
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={item.href}
                className={`nav-item-2d ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            <Link 
              href="/settings"
              className="btn btn-secondary"
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
