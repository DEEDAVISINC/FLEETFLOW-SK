'use client';

import OpenELDDashboard from '../components/OpenELDDashboard';

export default function OpenELDPage() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <div className='mb-8 text-center'>
          <div className='mb-4 flex items-center justify-center space-x-3'>
            <span className='text-4xl'>📱</span>
            <h1 className='text-4xl font-bold text-gray-900'>OpenELD System</h1>
            <span className='text-4xl'>🚛</span>
          </div>
          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            FleetFlow's Open Source Electronic Logging Device (ELD) Compliance
            System
          </p>
          <div className='mt-4 flex items-center justify-center space-x-4'>
            <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>
              ✅ FMCSA Compliant
            </span>
            <span className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
              🔓 Open Source
            </span>
            <span className='inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800'>
              💰 Zero Licensing Costs
            </span>
          </div>
        </div>

        {/* OpenELD Dashboard */}
        <OpenELDDashboard />

        {/* Additional Information */}
        <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Benefits */}
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-xl font-semibold text-gray-900'>
              🚀 Why OpenELD?
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-green-500'>✓</span>
                <span className='text-gray-700'>
                  Completely free and open source
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-green-500'>✓</span>
                <span className='text-gray-700'>
                  Full FMCSA compliance without vendor lock-in
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-green-500'>✓</span>
                <span className='text-gray-700'>
                  Customizable for your specific needs
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-green-500'>✓</span>
                <span className='text-gray-700'>
                  Real-time monitoring and alerts
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-green-500'>✓</span>
                <span className='text-gray-700'>
                  Professional support and documentation
                </span>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-xl font-semibold text-gray-900'>
              ⚡ Key Features
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-blue-500'>🔧</span>
                <span className='text-gray-700'>
                  Automatic duty status tracking
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-blue-500'>📊</span>
                <span className='text-gray-700'>
                  Real-time compliance monitoring
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-blue-500'>📱</span>
                <span className='text-gray-700'>Mobile device integration</span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-blue-500'>📋</span>
                <span className='text-gray-700'>Automated log generation</span>
              </li>
              <li className='flex items-start space-x-3'>
                <span className='mt-1 text-blue-500'>🚨</span>
                <span className='text-gray-700'>
                  Violation alerts and recommendations
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className='mt-12 rounded-lg bg-white p-6 shadow-lg'>
          <h3 className='mb-4 text-xl font-semibold text-gray-900'>
            🔬 Technical Specifications
          </h3>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div>
              <h4 className='mb-2 font-medium text-gray-900'>
                Hardware Requirements
              </h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• GPS-enabled device</li>
                <li>• Cellular or WiFi connectivity</li>
                <li>• Minimum 8GB storage</li>
                <li>• Android 8.0+ or iOS 12+</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-2 font-medium text-gray-900'>
                Software Features
              </h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• RESTful API endpoints</li>
                <li>• Real-time data synchronization</li>
                <li>• Automated compliance checking</li>
                <li>• Export to FMCSA format</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-2 font-medium text-gray-900'>
                Compliance Standards
              </h4>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• FMCSA ELD mandate</li>
                <li>• 49 CFR Part 395</li>
                <li>• Hours of Service rules</li>
                <li>• Driver qualification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='mt-12 text-center'>
          <div className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white'>
            <h3 className='mb-4 text-2xl font-bold'>
              Ready to Deploy OpenELD?
            </h3>
            <p className='mx-auto mb-6 max-w-2xl text-blue-100'>
              Join the growing community of carriers using open source ELD
              solutions. Get started today with zero licensing fees and full
              compliance.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <button className='rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100'>
                📖 View Documentation
              </button>
              <button className='rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600'>
                🚀 Start Implementation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
