'use client'

import { useState } from 'react'
import Navigation from '../components/Navigation'
import { CarrierInfo, DriverInfo } from '../../lib/brokersnapshot-service'
import { Tooltip, InfoTooltip } from '../components/ui/tooltip';
import { getTooltipContent } from '../utils/tooltipContent';

export default function CarrierVerificationPage() {
  const [savedCarriers, setSavedCarriers] = useState<CarrierInfo[]>([])
  const [savedDrivers, setSavedDrivers] = useState<DriverInfo[]>([])
  const [monitoringList, setMonitoringList] = useState<string[]>([])

  const handleCarrierFound = (carrier: CarrierInfo) => {
    // Add to saved carriers if not already present
    if (!savedCarriers.find(c => c.mcNumber === carrier.mcNumber)) {
      setSavedCarriers(prev => [...prev, carrier])
    }
  }

  const handleDriverFound = (driver: DriverInfo) => {
    // Add to saved drivers if not already present
    if (!savedDrivers.find(d => d.licenseNumber === driver.licenseNumber)) {
      setSavedDrivers(prev => [...prev, driver])
    }
  }

  const addToMonitoring = (mcNumber: string) => {
    if (!monitoringList.includes(mcNumber)) {
      setMonitoringList(prev => [...prev, mcNumber])
    }
  }

  const removeFromMonitoring = (mcNumber: string) => {
    setMonitoringList(prev => prev.filter(mc => mc !== mcNumber))
  }

  const runMonitoring = async () => {
    if (monitoringList.length === 0) return

    try {
      const response = await fetch('/api/brokersnapshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'monitorCarriers',
          mcNumbers: monitoringList
        })
      })

      const data = await response.json()
      if (data.success && data.data) {
        // Update saved carriers with latest data
        setSavedCarriers(prev => {
          const updated = [...prev]
          data.data.forEach((newCarrier: CarrierInfo) => {
            const index = updated.findIndex(c => c.mcNumber === newCarrier.mcNumber)
            if (index >= 0) {
              updated[index] = newCarrier
            } else {
              updated.push(newCarrier)
            }
          })
          return updated
        })
      }
    } catch (error) {
      console.error('Monitoring failed:', error)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Carrier & Driver Verification</h1>
            <p className="mt-2 text-gray-600">
              Look up and monitor carriers and drivers using your BrokerSnapshot account
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Lookup Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Carrier Verification</h2>
                <div className="text-center text-gray-500">
                  Carrier verification functionality will be implemented here.
                </div>
              </div>
            </div>

            {/* Monitoring Panel */}
            <div className="space-y-6">
              {/* Monitoring List */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Carrier Monitoring</h3>
                
                {monitoringList.length === 0 ? (
                  <p className="text-gray-500 text-sm">No carriers being monitored</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {monitoringList.map(mcNumber => (
                        <div key={mcNumber} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">MC-{mcNumber}</span>
                          <button
                            onClick={() => removeFromMonitoring(mcNumber)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={runMonitoring}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Run Monitoring Check
                    </button>
                  </>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carriers Looked Up:</span>
                    <span className="font-medium">{savedCarriers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drivers Looked Up:</span>
                    <span className="font-medium">{savedDrivers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Being Monitored:</span>
                    <span className="font-medium">{monitoringList.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Carriers */}
          {savedCarriers.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Carrier Lookups</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCarriers.map((carrier, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {carrier.companyName || `MC-${carrier.mcNumber}`}
                      </h3>
                      <button
                        onClick={() => carrier.mcNumber && addToMonitoring(carrier.mcNumber)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        disabled={carrier.mcNumber ? monitoringList.includes(carrier.mcNumber) : true}
                      >
                        {carrier.mcNumber && monitoringList.includes(carrier.mcNumber) ? 'Monitoring' : 'Monitor'}
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><strong>MC:</strong> {carrier.mcNumber}</div>
                      <div><strong>DOT:</strong> {carrier.dotNumber}</div>
                      <div><strong>Status:</strong> {carrier.status}</div>
                      <div><strong>Trucks:</strong> {carrier.trucks}</div>
                      <div><strong>Drivers:</strong> {carrier.drivers}</div>
                      {carrier.safetyRating && (
                        <div><strong>Safety Rating:</strong> {carrier.safetyRating}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Drivers */}
          {savedDrivers.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Driver Lookups</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDrivers.map((driver, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {driver.name || 'Driver'}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>License #:</strong> {driver.licenseNumber}</div>
                      <div><strong>State:</strong> {driver.licenseState}</div>
                      <div><strong>Medical Cert:</strong> {driver.medicalCertStatus}</div>
                      <div><strong>HAZMAT:</strong> {driver.hazmatEndorsement ? 'Yes' : 'No'}</div>
                      {driver.violations && driver.violations.length > 0 && (
                        <div className="text-red-600">
                          <strong>Violations:</strong> {driver.violations.length}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
