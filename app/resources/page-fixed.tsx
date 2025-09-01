'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'drivers' | 'dispatch' | 'broker' | 'heavyhaul'>('drivers')

  // Driver Resources Data
  const truckerHotels = [
    {
      name: 'TA Travel Centers',
      description: 'Nationwide truck stops with hotels, parking, and amenities',
      website: 'https://ta-petro.com',
      features: ['Truck Parking', 'Shower Facilities', 'Restaurants', 'Fuel', 'Maintenance']
    },
    {
      name: 'Pilot Flying J',
      description: 'Premier truck stop chain with comprehensive services',
      website: 'https://pilotflyingj.com',
      features: ['myRewards Program', 'Reserve Parking', 'Showers', 'Laundry', 'CAT Scales']
    },
    {
      name: 'Loves Travel Stops',
      description: 'Family-owned travel stops with trucker amenities',
      website: 'https://loves.com',
      features: ['Truck Parking', 'Fresh Food', 'Showers', 'Dog Parks', 'WiFi']
    },
    {
      name: 'Motel 6',
      description: 'Budget-friendly motels with truck parking',
      website: 'https://motel6.com',
      features: ['Truck Parking', 'Pet Friendly', 'WiFi', 'Easy Access']
    },
    {
      name: 'Red Roof Inn',
      description: 'Extended truck parking and driver discounts',
      website: 'https://redroof.com',
      features: ['Truck Parking', 'Driver Rates', 'Pet Friendly', 'Continental Breakfast']
    }
  ]

  const restStops = [
    {
      name: 'Trucker Path App',
      description: 'Find truck stops, parking, and amenities nationwide',
      website: 'https://truckerpath.com',
      type: 'Mobile App'
    },
    {
      name: 'GasBuddy',
      description: 'Find cheapest fuel prices along your route',
      website: 'https://gasbuddy.com',
      type: 'Fuel Finder'
    },
    {
      name: 'iExit Interstate Exit Guide',
      description: 'Know what services are available at upcoming exits',
      website: 'https://iexit.com',
      type: 'Exit Guide'
    },
    {
      name: 'Allstays Truck & Travel',
      description: 'Comprehensive truck stop and parking directory',
      website: 'https://allstays.com',
      type: 'Directory'
    }
  ]

  const driverServices = [
    {
      name: 'OOIDA',
      description: 'Owner-Operator Independent Drivers Association - advocacy and support',
      website: 'https://ooida.com',
      category: 'Advocacy'
    },
    {
      name: 'FMCSA',
      description: 'Federal Motor Carrier Safety Administration - regulations and compliance',
      website: 'https://fmcsa.dot.gov',
      category: 'Compliance'
    },
    {
      name: 'DAT Load Board',
      description: 'Premium load matching platform for owner-operators',
      website: 'https://dat.com',
      category: 'Load Boards'
    }
  ]

  // Dispatch Resources Data
  const dispatchTools = [
    {
      name: 'McLeod Software',
      description: 'Comprehensive transportation management system',
      website: 'https://mcleodsoft.com',
      category: 'TMS'
    },
    {
      name: 'Sylectus',
      description: 'Real-time dispatch and tracking platform',
      website: 'https://sylectus.com',
      category: 'Dispatch'
    },
    {
      name: 'LoadDex',
      description: 'Load board and freight matching system',
      website: 'https://loaddex.com',
      category: 'Load Board'
    }
  ]

  // Broker Resources Data
  const brokerPlatforms = [
    {
      name: 'Carrier411',
      description: 'Carrier verification and monitoring platform',
      website: 'https://carrier411.com',
      category: 'Verification'
    },
    {
      name: 'RMIS',
      description: 'Risk Management Information System for freight brokers',
      website: 'https://rmis.com',
      category: 'Risk Management'
    },
    {
      name: 'FreightPath',
      description: 'Modern TMS built for freight brokers',
      website: 'https://freightpath.com',
      category: 'TMS'
    }
  ]

  // Heavy Haul Resources Data
  const heavyHaulServices = [
    {
      name: 'Heavy Haul Pro',
      description: 'Specialized routing and permitting for oversized loads',
      website: 'https://heavyhaulpro.com',
      category: 'Routing'
    },
    {
      name: 'Permit Service Inc',
      description: 'Nationwide permit processing and route planning',
      website: 'https://permitservice.com',
      category: 'Permits'
    },
    {
      name: 'Pilot Car Services',
      description: 'Directory of certified pilot car operators nationwide',
      website: 'https://pilotcarservices.com',
      category: 'Pilot Cars'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-cyan-800 pt-20"">
      {/* Back Button */}
      <div className="p-6"">
        <Link href="/"" className="inline-block"">
          <button className="bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 text-base hover:bg-opacity-30 hover:-translate-y-1 hover:shadow-lg"">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 pb-20"">
        {/* Header */}
        <div className="bg-white bg-opacity-15 backdrop-blur-2xl rounded-2xl p-10 mb-10 border border-white border-opacity-20 shadow-2xl"">
          <div className="text-center mb-8"">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-4"">
              📚 Resource Library
            </h1>
            <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto leading-relaxed"">
              Comprehensive tools and resources for drivers, dispatchers, brokers, and heavy haul specialists
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-5"">
            <div className="flex gap-2"">
              {(['drivers', 'dispatch', 'broker', 'heavyhaul'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 border-0 cursor-pointer backdrop-blur-md text-sm ${
                    selectedCategory === category 
                      ? 'bg-white bg-opacity-25 text-white' 
                      : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                  }`}
                >
                  {category === 'drivers' && '🚛 Drivers'}
                  {category === 'dispatch' && '📋 Dispatch'}
                  {category === 'broker' && '🏢 Brokers'}
                  {category === 'heavyhaul' && '🏗️ Heavy Haul'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {selectedCategory === 'drivers' && (
          <div className="flex flex-col gap-8"">
            
            {/* Trucker-Friendly Hotels & Motels */}
            <div className="bg-white bg-opacity-12 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl"">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"">
                🏨 Trucker-Friendly Hotels & Motels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"">
                {truckerHotels.map((hotel, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-5 border border-white border-opacity-15 transition-all duration-300 cursor-pointer hover:bg-opacity-15 hover:-translate-y-1 hover:shadow-xl"">
                    <h4 className="text-lg font-semibold text-white mb-3"">
                      {hotel.name}
                    </h4>
                    <p className="text-sm text-white text-opacity-80 mb-4 leading-relaxed"">
                      {hotel.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4"">
                      {hotel.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-blue-500 bg-opacity-30 text-blue-200 border border-blue-500 border-opacity-20"">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <a href={hotel.website} target=""_blank"" rel=""noopener noreferrer"" className="text-white bg-blue-500 bg-opacity-60 no-underline text-sm font-semibold px-3 py-2 rounded-lg inline-block transition-all duration-300 border border-blue-500 border-opacity-80 hover:bg-opacity-80 hover:-translate-y-0.5 hover:shadow-lg"">
                      Visit Website →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Rest Stops & Truck Stops */}
            <div className="bg-white bg-opacity-12 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl"">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"">
                ⛽ Rest Stops & Truck Stop Finders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"">
                {restStops.map((stop, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-5 border border-white border-opacity-15 transition-all duration-300 cursor-pointer hover:bg-opacity-15 hover:-translate-y-1 hover:shadow-xl"">
                    <div className="flex items-center justify-between mb-3"">
                      <h4 className="text-lg font-semibold text-white"">
                        {stop.name}
                      </h4>
                      <span className="px-3 py-1 bg-green-500 bg-opacity-30 text-green-200 rounded-full text-xs font-medium border border-green-500 border-opacity-20"">
                        {stop.type}
                      </span>
                    </div>
                    <p className="text-sm text-white text-opacity-80 mb-4 leading-relaxed"">
                      {stop.description}
                    </p>
                    <a href={stop.website} target=""_blank"" rel=""noopener noreferrer"" className="text-white bg-green-500 bg-opacity-60 no-underline text-sm font-semibold px-3 py-2 rounded-lg inline-block transition-all duration-300 border border-green-500 border-opacity-80 hover:bg-opacity-80 hover:-translate-y-0.5 hover:shadow-lg"">
                      Access Tool →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Services */}
            <div className="bg-white bg-opacity-12 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl"">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"">
                🛠️ Driver Services & Support
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"">
                {driverServices.map((service, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-5 border border-white border-opacity-15 transition-all duration-300 cursor-pointer hover:bg-opacity-15 hover:-translate-y-1 hover:shadow-xl"">
                    <div className="flex items-center justify-between mb-3"">
                      <h4 className="text-lg font-semibold text-white"">
                        {service.name}
                      </h4>
                      <span className="px-3 py-1 bg-purple-500 bg-opacity-30 text-purple-200 rounded-full text-xs font-medium border border-purple-500 border-opacity-20"">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-white text-opacity-80 mb-4 leading-relaxed"">
                      {service.description}
                    </p>
                    <a href={service.website} target=""_blank"" rel=""noopener noreferrer"" className="text-white bg-purple-500 bg-opacity-60 no-underline text-sm font-semibold px-3 py-2 rounded-lg inline-block transition-all duration-300 border border-purple-500 border-opacity-80 hover:bg-opacity-80 hover:-translate-y-0.5 hover:shadow-lg"">
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dispatch Resources */}
        {selectedCategory === 'dispatch' && (
          <div className="flex flex-col gap-8"">
            <div className="bg-white bg-opacity-12 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl"">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"">
                📋 Dispatch Management Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"">
                {dispatchTools.map((tool, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-5 border border-white border-opacity-15 transition-all duration-300 cursor-pointer hover:bg-opacity-15 hover:-translate-y-1 hover:shadow-xl"">
                    <div className="flex items-center justify-between mb-3"">
                      <h4 className="text-lg font-semibold text-white"">
                        {tool.name}
                      </h4>
                      <span className="px-3 py-1 bg-green-500 bg-opacity-30 text-green-200 rounded-full text-xs font-medium border border-green-500 border-opacity-20"">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-sm text-white text-opacity-80 mb-4 leading-relaxed"">
                      {tool.description}
                    </p>
                    <a href={tool.website} target=""_blank"" rel=""noopener noreferrer"" className="text-white bg-green-500 bg-opacity-60 no-underline text-sm font-semibold px-3 py-2 rounded-lg inline-block transition-all duration-300 border border-green-500 border-opacity-80 hover:bg-opacity-80 hover:-translate-y-0.5 hover:shadow-lg"">
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white"">
              <div className="flex items-center justify-between"">
                <div>
                  <h3 className="text-xl font-bold mb-2"">
                    📊 Dispatch Central Hub
                  </h3>
                  <p className="text-white text-opacity-90"">
                    Access your main dispatch dashboard for real-time load management and driver coordination.
                  </p>
                </div>
                <div className="ml-6"">
                  <Link href="/dispatch"" className="inline-block"">
                    <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"">
                      Go to Dispatch
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Broker Resources */}
        {selectedCategory === 'broker' && (
          <div className="flex flex-col gap-8"">
            <div className="bg-white bg-opacity-12 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl"">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"">
                🏢 Broker Platforms & Tools
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"">
                {brokerPlatforms.map((platform, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-5 border border-white border-opacity-15 transition-all duration-300 cursor-pointer hover:bg-opacity-15 hover:-translate-y-1 hover:shadow-xl"">
                    <div className="flex items-center justify-between mb-3"">
                      <h4 className="text-lg font-semibold text-white"">
                        {platform.name}
                      </h4>
                      <span className="px-3 py-1 bg-blue-500 bg-opacity-30 text-blue-200 rounded-full text-xs font-medium border border-blue-500 border-opacity-20"">
                        {platform.category}
                      </span>
                    </div>
                    <p className="text-sm text-white text-opacity-80 mb-4 leading-relaxed"">
                      {platform.description}
                    </p>
                    <a href={platform.website} target=""_blank"" rel=""noopener noreferrer"" className="text-white bg-blue-500 bg-opacity-60 no-underline text-sm font-semibold px-3 py-2 rounded-lg inline-block transition-all duration-300 border border-blue-500 border-opacity-80 hover:bg-opacity-80 hover:-translate-y-0.5 hover:shadow-lg"">
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 text-white"">
              <div className="flex items-center justify-between"">
                <div>
                  <h3 className="text-xl font-bold mb-2"">
                    🤝 Broker Network Hub
                  </h3>
                  <p className="text-white text-opacity-90"">
                    Connect with our broker dashboard for load posting, carrier management, and rate negotiations.
                  </p>
                </div>
                <div className="ml-6"">
                  <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"">
                    Broker Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heavy Haul Resources */}
        {selectedCategory === 'heavyhaul' && (
          <div className="flex flex-col gap-8"">
            <div className="bg-white bg-opacity-12 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl"">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"">
                🏗️ Heavy Haul Specialized Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"">
                {heavyHaulServices.map((service, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-5 border border-white border-opacity-15 transition-all duration-300 cursor-pointer hover:bg-opacity-15 hover:-translate-y-1 hover:shadow-xl"">
                    <div className="flex items-center justify-between mb-3"">
                      <h4 className="text-lg font-semibold text-white"">
                        {service.name}
                      </h4>
                      <span className="px-3 py-1 bg-yellow-500 bg-opacity-30 text-yellow-200 rounded-full text-xs font-medium border border-yellow-500 border-opacity-20"">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-white text-opacity-80 mb-4 leading-relaxed"">
                      {service.description}
                    </p>
                    <a href={service.website} target=""_blank"" rel=""noopener noreferrer"" className="text-white bg-yellow-500 bg-opacity-60 no-underline text-sm font-semibold px-3 py-2 rounded-lg inline-block transition-all duration-300 border border-yellow-500 border-opacity-80 hover:bg-opacity-80 hover:-translate-y-0.5 hover:shadow-lg"">
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white"">
              <div className="flex items-center justify-between"">
                <div>
                  <h3 className="text-xl font-bold mb-2"">
                    🚨 Heavy Haul Emergency Services
                  </h3>
                  <p className="text-white text-opacity-90"">
                    Need immediate permit processing or pilot car services? Access our emergency contact directory for 24/7 heavy haul support.
                  </p>
                </div>
                <div className="ml-6"">
                  <button className="bg-white text-yellow-600 px-6 py-3 rounded-xl font-semibold cursor-pointer border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"">
                    Emergency Contacts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Workflow Navigation Cards */}
        <div className="mt-12 p-8 bg-white bg-opacity-12 backdrop-blur-md rounded-2xl border border-white border-opacity-20 shadow-2xl"">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center"">
            🔗 Continue Your Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"">
            <Link href="/documents"" className="block"">
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-5 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"">
                <div className="text-center"">
                  <div className="text-3xl mb-3"">📄</div>
                  <h4 className="text-lg font-semibold mb-2"">
                    Document Hub
                  </h4>
                  <p className="text-sm opacity-90"">
                    Generate rate confirmations and bills of lading
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/compliance"" className="block"">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-5 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"">
                <div className="text-center"">
                  <div className="text-3xl mb-3"">✅</div>
                  <h4 className="text-lg font-semibold mb-2"">
                    Compliance Hub
                  </h4>
                  <p className="text-sm opacity-90"">
                    Monitor DOT compliance and safety metrics
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/safety"" className="block"">
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-5 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"">
                <div className="text-center"">
                  <div className="text-3xl mb-3"">🚨</div>
                  <h4 className="text-lg font-semibold mb-2"">
                    Safety Resources
                  </h4>
                  <p className="text-sm opacity-90"">
                    Emergency contacts and safety protocols
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/dispatch"" className="block"">
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-5 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"">
                <div className="text-center"">
                  <div className="text-3xl mb-3"">📊</div>
                  <h4 className="text-lg font-semibold mb-2"">
                    Dispatch Hub
                  </h4>
                  <p className="text-sm opacity-90"">
                    Real-time load and driver management
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
