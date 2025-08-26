'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { FREIGHT_CLASSES, getFreightClassOptions, calculateFreightClassFromDensity, type FreightClass } from '../utils/freightClass'

interface LoadData {
  id: string
  pickupLocation: string
  deliveryLocation: string
  pickupDate: string
  deliveryDate: string
  weight: string
  commodity: string
  freightClass?: string
  rate: string
  distance: string
  equipment: string
  transportMode: 'truckload' | 'ltl' | 'parcel' | 'vtl' | 'bulk' | 'rail' | 'intermodal' | 'ocean' | 'air'
  specialRequirements: string
  contactInfo: string
  postedBy: string
  postedAt: string
  status: 'available' | 'assigned' | 'in-transit' | 'delivered'
  multimodalQuotes?: MultimodalQuote[]
}

interface MultimodalQuote {
  mode: string
  carrier: string
  rate: number
  transitTime: number
  confidence: number
  advantages: string[]
}

interface LoadUploadProps {
  onLoadPosted?: (load: LoadData) => void
}

export default function LoadUpload({ onLoadPosted }: LoadUploadProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showPalletCalculator, setShowPalletCalculator] = useState(false)
  const [calculatorData, setCalculatorData] = useState({
    weight: '',
    length: '',
    width: '',
    height: ''
  })
  const [palletData, setPalletData] = useState({
    numberOfPallets: '',
    weightPerPallet: '',
    palletWeight: '40' // Standard pallet weight in lbs
  })
  const [loadData, setLoadData] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    deliveryDate: '',
    weight: '',
    commodity: '',
    freightClass: '',
    pieces: '',
    rate: '',
    distance: '',
    equipment: 'dry-van',
    transportMode: 'truckload' as 'truckload' | 'ltl' | 'parcel' | 'vtl' | 'bulk' | 'rail' | 'intermodal' | 'ocean' | 'air',
    specialRequirements: '',
    contactInfo: ''
  })
  const [multimodalQuotes, setMultimodalQuotes] = useState<MultimodalQuote[]>([])
  const [showModeComparison, setShowModeComparison] = useState(false)
  const [isGettingQuotes, setIsGettingQuotes] = useState(false)

  const transportModes = [
    { value: 'truckload', label: '🚛 Truckload (FTL)', description: 'Full truck dedicated to your shipment' },
    { value: 'ltl', label: '📦 Less Than Truckload (LTL)', description: 'Share truck space with other shipments' },
    { value: 'parcel', label: '📮 Parcel', description: 'Small packages via FedEx, UPS, USPS' },
    { value: 'vtl', label: '📊 Volume Truckload (VTL)', description: 'Between LTL and FTL pricing' },
    { value: 'bulk', label: '🛢️ Bulk Transport', description: 'Tank, hopper, pneumatic bulk cargo' },
    { value: 'rail', label: '🚂 Rail Freight', description: 'Cost-effective for long distances' },
    { value: 'intermodal', label: '🚛🚂 Intermodal', description: 'Rail + truck combination' },
    { value: 'ocean', label: '🚢 Ocean Freight', description: 'International container shipping' },
    { value: 'air', label: '✈️ Air Freight', description: 'Fast international/time-sensitive' }
  ]

  const getEquipmentTypes = (transportMode: string) => {
    const equipmentOptions = {
      truckload: [
        { value: 'dry-van', label: '🚛 Dry Van' },
        { value: 'reefer', label: '🧊 Refrigerated' },
        { value: 'flatbed', label: '📦 Flatbed' },
        { value: 'step-deck', label: '📐 Step Deck' },
        { value: 'lowboy', label: '🚜 Lowboy' },
        { value: 'auto-carrier', label: '🚗 Auto Carrier' }
      ],
      ltl: [
        { value: 'ltl-standard', label: '📦 Standard LTL' },
        { value: 'ltl-guaranteed', label: '⚡ Guaranteed LTL' }
      ],
      parcel: [
        { value: 'ground', label: '📦 Ground Service' },
        { value: 'express', label: '⚡ Express Service' },
        { value: 'overnight', label: '🌙 Overnight' }
      ],
      vtl: [
        { value: 'vtl-standard', label: '📊 Standard VTL' }
      ],
      bulk: [
        { value: 'tank', label: '🛢️ Liquid Tank' },
        { value: 'hopper', label: '📦 Dry Bulk Hopper' },
        { value: 'pneumatic', label: '💨 Pneumatic' }
      ],
      rail: [
        { value: 'boxcar', label: '🚂 Boxcar' },
        { value: 'flatcar', label: '🚂 Flatcar' },
        { value: 'tank-car', label: '🚂 Tank Car' }
      ],
      intermodal: [
        { value: '53ft-container', label: '📦 53ft Container' },
        { value: '40ft-container', label: '📦 40ft Container' }
      ],
      ocean: [
        { value: '20ft-container', label: '📦 20ft Container' },
        { value: '40ft-container', label: '📦 40ft Container' },
        { value: '40ft-hc', label: '📦 40ft High Cube' }
      ],
      air: [
        { value: 'standard-air', label: '✈️ Standard Air Cargo' },
        { value: 'express-air', label: '⚡ Express Air' }
      ]
    }
    return equipmentOptions[transportMode as keyof typeof equipmentOptions] || equipmentOptions.truckload
  }

  const handleInputChange = (field: string, value: string) => {
    setLoadData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Reset equipment when transport mode changes
    if (field === 'transportMode') {
      const newEquipmentTypes = getEquipmentTypes(value)
      setLoadData(prev => ({
        ...prev,
        [field]: value,
        equipment: newEquipmentTypes[0]?.value || 'standard'
      }))
    }
  }

  const getMultimodalQuotes = async () => {
    if (!loadData.pickupLocation || !loadData.deliveryLocation || !loadData.weight) {
      alert('Please fill in pickup location, delivery location, and weight to get quotes')
      return
    }

    setIsGettingQuotes(true)
    setShowModeComparison(true)

    // Simulate API call to multimodal service
    try {
      const mockQuotes: MultimodalQuote[] = [
        {
          mode: 'Truckload',
          carrier: 'FleetFlow Network',
          rate: 2500,
          transitTime: 48,
          confidence: 95,
          advantages: ['Direct delivery', 'Exclusive use', 'Flexible scheduling']
        },
        {
          mode: 'LTL',
          carrier: 'YRC Freight',
          rate: 850,
          transitTime: 72,
          confidence: 90,
          advantages: ['Cost effective for partial loads', 'Freight class flexibility']
        },
        {
          mode: 'Parcel',
          carrier: 'FedEx',
          rate: 125,
          transitTime: 24,
          confidence: 98,
          advantages: ['Next day delivery', 'Tracking included', 'Residential delivery']
        },
        {
          mode: 'Rail',
          carrier: 'BNSF Railway',
          rate: 1200,
          transitTime: 120,
          confidence: 82,
          advantages: ['Environmentally friendly', 'Cost effective for long distances']
        },
        {
          mode: 'Intermodal',
          carrier: 'Intermodal Network',
          rate: 1800,
          transitTime: 96,
          confidence: 85,
          advantages: ['Cost effective for long distances', 'Reliable capacity']
        }
      ]

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMultimodalQuotes(mockQuotes)
    } catch (error) {
      console.error('Error getting quotes:', error)
      alert('Error getting quotes. Please try again.')
    } finally {
      setIsGettingQuotes(false)
    }
  }

  const selectTransportMode = (quote: MultimodalQuote) => {
    const modeMapping: { [key: string]: string } = {
      'Truckload': 'truckload',
      'LTL': 'ltl', 
      'Parcel': 'parcel',
      'Rail': 'rail',
      'Intermodal': 'intermodal'
    }
    
    const transportMode = modeMapping[quote.mode] || 'truckload'
    handleInputChange('transportMode', transportMode)
    handleInputChange('rate', quote.rate.toString())
    setShowModeComparison(false)
  }

  const handleCalculatorChange = (field: string, value: string) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePalletChange = (field: string, value: string) => {
    setPalletData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateTotalWeight = () => {
    const { numberOfPallets, weightPerPallet, palletWeight } = palletData
    if (numberOfPallets && weightPerPallet) {
      const totalCargoWeight = parseFloat(numberOfPallets) * parseFloat(weightPerPallet)
      const totalPalletWeight = parseFloat(numberOfPallets) * parseFloat(palletWeight)
      const totalWeight = totalCargoWeight + totalPalletWeight
      
      handleInputChange('weight', totalWeight.toString())
      setShowPalletCalculator(false)
      
      // Also update pieces field with pallet count
      handleInputChange('pieces', `${numberOfPallets} pallets`)
    }
  }

  const calculateClass = () => {
    const { weight, length, width, height } = calculatorData
    if (weight && length && width && height) {
      const suggestedClass = calculateFreightClassFromDensity(
        parseFloat(weight),
        parseFloat(length),
        parseFloat(width), 
        parseFloat(height)
      )
      handleInputChange('freightClass', suggestedClass)
      setShowCalculator(false)
    }
  }

  const calculateDistance = async (pickup: string, delivery: string) => {
    // In production, this would use Google Maps Distance Matrix API
    // For now, return a mock distance
    if (pickup && delivery) {
      return Math.floor(Math.random() * 2000) + 100 // Random distance between 100-2100 miles
    }
    return 0
  }

  const sendNotifications = async (load: LoadData) => {
    // Mock notification system - in production, this would integrate with:
    // - SMS service (Twilio, AWS SNS)
    // - Push notifications
    // - Email notifications
    // - In-app messaging

    try {
      // Simulate SMS notification
      console.log('Sending SMS notifications to drivers and carriers...')
      
      // Mock SMS content
      const smsMessage = `🚛 NEW LOAD AVAILABLE
From: ${load.pickupLocation}
To: ${load.deliveryLocation}
Rate: $${load.rate}
Equipment: ${load.equipment}
Contact: ${load.contactInfo}
Load ID: ${load.id}`

      // In production, you'd call your SMS API here
      // await sendSMS(carrierPhoneNumbers, smsMessage)
      
      // Simulate in-app notifications
      const notification = {
        id: Date.now().toString(),
        type: 'new-load',
        title: 'New Load Available',
        message: `New ${load.equipment} load from ${load.pickupLocation} to ${load.deliveryLocation}`,
        loadId: load.id,
        timestamp: new Date().toISOString()
      }

      // Store notification in localStorage (in production, use real-time messaging)
      const existingNotifications = JSON.parse(localStorage.getItem('fleetflow-notifications') || '[]')
      existingNotifications.unshift(notification)
      localStorage.setItem('fleetflow-notifications', JSON.stringify(existingNotifications.slice(0, 50)))

      return true
    } catch (error) {
      console.error('Failed to send notifications:', error)
      return false
    }
  }

  const postLoad = async () => {
    if (!user) {
      alert('You must be logged in to post loads')
      return
    }

    // Validate required fields
    const required = ['pickupLocation', 'deliveryLocation', 'pickupDate', 'deliveryDate', 'rate', 'commodity']
    const missing = required.filter(field => !loadData[field as keyof typeof loadData])
    
    if (missing.length > 0) {
      alert(`Please fill in the following required fields: ${missing.join(', ')}`)
      return
    }

    setLoading(true)

    try {
      // Calculate distance if not provided
      let distance = loadData.distance
      if (!distance) {
        distance = (await calculateDistance(loadData.pickupLocation, loadData.deliveryLocation)).toString()
      }

      const newLoad: LoadData = {
        id: `LOAD-${Date.now()}`,
        ...loadData,
        distance,
        postedBy: user.name,
        postedAt: new Date().toISOString(),
        status: 'available'
      }

      // Save load to localStorage (in production, save to database)
      const existingLoads = JSON.parse(localStorage.getItem('fleetflow-loads') || '[]')
      existingLoads.unshift(newLoad)
      localStorage.setItem('fleetflow-loads', JSON.stringify(existingLoads))

      // Send notifications to drivers and carriers
      const notificationsSent = await sendNotifications(newLoad)

      // Reset form
      setLoadData({
        pickupLocation: '',
        deliveryLocation: '',
        pickupDate: '',
        deliveryDate: '',
        weight: '',
        commodity: '',
        freightClass: '',
        pieces: '',
        rate: '',
        distance: '',
        equipment: 'dry-van',
        transportMode: 'truckload' as 'truckload' | 'ltl' | 'parcel' | 'vtl' | 'bulk' | 'rail' | 'intermodal' | 'ocean' | 'air',
        specialRequirements: '',
        contactInfo: ''
      })

      onLoadPosted?.(newLoad)

      alert(`Load posted successfully! ${notificationsSent ? 'Notifications sent to drivers and carriers.' : 'Note: Notification system is in demo mode.'}`)
      setIsExpanded(false)

    } catch (error) {
      console.error('Error posting load:', error)
      alert('Failed to post load. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="load-upload bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h3 className="font-semibold text-gray-900">Post New Load</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center gap-2"
        >
          <span>+</span>
          {isExpanded ? 'Cancel' : 'Add Load'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={loadData.pickupLocation}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                placeholder="City, State or ZIP"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={loadData.deliveryLocation}
                onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                placeholder="City, State or ZIP"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={loadData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={loadData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={loadData.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
                placeholder="2500"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={loadData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="40000"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPalletCalculator(!showPalletCalculator)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  📦 Calculate by pallets
                </button>

                {showPalletCalculator && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-xs">
                    <h5 className="font-medium text-green-800 mb-2">Pallet Weight Calculator</h5>
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Number of pallets"
                        value={palletData.numberOfPallets}
                        onChange={(e) => handlePalletChange('numberOfPallets', e.target.value)}
                        className="border border-green-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Weight per pallet (lbs)"
                        value={palletData.weightPerPallet}
                        onChange={(e) => handlePalletChange('weightPerPallet', e.target.value)}
                        className="border border-green-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Empty pallet weight (lbs)"
                        value={palletData.palletWeight}
                        onChange={(e) => handlePalletChange('palletWeight', e.target.value)}
                        className="border border-green-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    {palletData.numberOfPallets && palletData.weightPerPallet && (
                      <div className="mb-2 text-green-700">
                        <div>Cargo weight: {(parseFloat(palletData.numberOfPallets || '0') * parseFloat(palletData.weightPerPallet || '0')).toLocaleString()} lbs</div>
                        <div>Pallet weight: {(parseFloat(palletData.numberOfPallets || '0') * parseFloat(palletData.palletWeight || '0')).toLocaleString()} lbs</div>
                        <div className="font-medium">Total weight: {(parseFloat(palletData.numberOfPallets || '0') * (parseFloat(palletData.weightPerPallet || '0') + parseFloat(palletData.palletWeight || '0'))).toLocaleString()} lbs</div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={calculateTotalWeight}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Calculate Total Weight
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pieces/Units
                <span className="text-xs text-gray-500 ml-1">- Optional</span>
              </label>
              <input
                type="text"
                value={loadData.pieces}
                onChange={(e) => handleInputChange('pieces', e.target.value)}
                placeholder="12 pallets, 5 crates, etc."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* Transport Mode Selection */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport Mode <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                {transportModes.map(mode => (
                  <div 
                    key={mode.value} 
                    className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                      loadData.transportMode === mode.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleInputChange('transportMode', mode.value)}
                  >
                    <div className="font-medium text-sm">{mode.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{mode.description}</div>
                  </div>
                ))}
              </div>
              
              {/* Multimodal Quote Comparison Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={getMultimodalQuotes}
                  disabled={isGettingQuotes}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-sm font-medium transition-all"
                >
                  {isGettingQuotes ? '🔄 Getting Quotes...' : '📊 Compare All Modes'}
                </button>
                {multimodalQuotes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowModeComparison(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-sm font-medium transition-all"
                  >
                    📈 View Quotes ({multimodalQuotes.length})
                  </button>
                )}
              </div>
            </div>

            {/* Equipment Type (based on selected transport mode) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment/Service Type <span className="text-red-500">*</span>
              </label>
              <select
                value={loadData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {getEquipmentTypes(loadData.transportMode).map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (miles)
              </label>
              <input
                type="number"
                value={loadData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                placeholder="Auto-calculated"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commodity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={loadData.commodity}
                onChange={(e) => handleInputChange('commodity', e.target.value)}
                placeholder="General freight, Electronics, Food products, etc."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Freight Class (NMFC)
                <span className="text-xs text-gray-500 ml-1">- Optional but recommended</span>
              </label>
              <div className="space-y-2">
                <select
                  value={loadData.freightClass}
                  onChange={(e) => handleInputChange('freightClass', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Select freight class (optional)</option>
                  {getFreightClassOptions().map(option => (
                    <option key={option.value} value={option.value} title={option.examples}>
                      Class {option.value} - {option.label.split(' - ')[1]}
                    </option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  🧮 Need help? Use density calculator
                </button>

                {showCalculator && (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                    <h5 className="font-medium text-gray-800 mb-2">Freight Class Calculator</h5>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Weight (lbs)"
                        value={calculatorData.weight}
                        onChange={(e) => handleCalculatorChange('weight', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Length (in)"
                        value={calculatorData.length}
                        onChange={(e) => handleCalculatorChange('length', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Width (in)"
                        value={calculatorData.width}
                        onChange={(e) => handleCalculatorChange('width', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Height (in)"
                        value={calculatorData.height}
                        onChange={(e) => handleCalculatorChange('height', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={calculateClass}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Calculate Class
                    </button>
                  </div>
                )}
              </div>
              
              {loadData.freightClass && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <div className="font-medium text-blue-900">
                    Class {loadData.freightClass} Details:
                  </div>
                  <div className="text-blue-700">
                    {FREIGHT_CLASSES.find(fc => fc.code === loadData.freightClass)?.characteristics}
                  </div>
                  <div className="text-blue-600 mt-1">
                    <strong>Examples:</strong> {FREIGHT_CLASSES.find(fc => fc.code === loadData.freightClass)?.examples}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Information
            </label>
            <input
              type="text"
              value={loadData.contactInfo}
              onChange={(e) => handleInputChange('contactInfo', e.target.value)}
              placeholder="Phone number or email for carrier contact"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requirements
            </label>
            <textarea
              value={loadData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              placeholder="HAZMAT, temp control, special handling, etc."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          {/* Freight Class Information Panel */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
              📦 Freight Class (NMFC) Quick Reference
            </h4>
            <div className="text-sm text-amber-700 space-y-1">
              <p><strong>Class 50-85:</strong> Dense, durable goods (metals, machinery, food products)</p>
              <p><strong>Class 92.5-125:</strong> Medium density items (appliances, electronics, auto parts)</p>
              <p><strong>Class 150-200:</strong> Lower density goods (clothing, furniture, sheet metal)</p>
              <p><strong>Class 250-500:</strong> Low density, fragile, or high-value items (artwork, specialty items)</p>
              <p className="text-amber-600 mt-2 italic">
                💡 Tip: Selecting the correct freight class helps carriers provide accurate quotes and ensures proper handling.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 className="font-medium text-blue-900 mb-2">📱 Notification System</h4>
            <p className="text-sm text-blue-700">
              When you post this load, notifications will be sent to:
            </p>
            <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
              <li>SMS messages to registered drivers and carriers</li>
              <li>In-app notifications to active users</li>
              <li>Email alerts to subscribed partners</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              onClick={postLoad}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Posting...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Post Load & Notify
                </>
              )}
            </button>
            
            <button
              onClick={() => setIsExpanded(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Multimodal Quote Comparison Modal */}
      {showModeComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  🚛 Multimodal Transport Comparison
                </h3>
                <button
                  onClick={() => setShowModeComparison(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {isGettingQuotes ? (
                <div className="text-center py-12">
                  <div className="animate-spin text-4xl mb-4">🔄</div>
                  <p className="text-gray-600">Getting quotes from all transport modes...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {multimodalQuotes.map((quote, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300"
                      onClick={() => selectTransportMode(quote)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">{quote.mode}</h4>
                          <p className="text-sm text-gray-600">{quote.carrier}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${quote.rate.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{quote.transitTime}h transit</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${quote.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{quote.confidence}%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Advantages:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {quote.advantages.slice(0, 2).map((advantage, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-500 mt-0.5">✓</span>
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium transition-all">
                        Select {quote.mode}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {multimodalQuotes.length > 0 && !isGettingQuotes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">💡 AI Recommendation:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Based on your shipment details, we recommend <strong>{multimodalQuotes[0]?.mode}</strong> for the best balance of cost, speed, and reliability.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
