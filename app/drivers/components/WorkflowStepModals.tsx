'use client'

import { useState, useRef } from 'react'
import { WorkflowStepId } from '../../../lib/workflowManager'

interface WorkflowStepModalProps {
  stepId: WorkflowStepId
  stepName: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  loadData?: any
}

// Photo Upload Component
const PhotoUpload = ({ 
  onPhotosChange, 
  maxPhotos = 5, 
  category = 'general' 
}: { 
  onPhotosChange: (photos: File[]) => void
  maxPhotos?: number
  category?: string
}) => {
  const [photos, setPhotos] = useState<File[]>([])
  const [uploading, setUploading] = useState<boolean[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const newPhotos = Array.from(files).slice(0, maxPhotos - photos.length)
    const updatedPhotos = [...photos, ...newPhotos]
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
    
    // Simulate upload process
    setUploading(prev => [...prev, ...newPhotos.map(() => true)])
    setTimeout(() => {
      setUploading(prev => prev.map(() => false))
    }, 2000)
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: 'white', 
        marginBottom: '8px' 
      }}>
        {category === 'pickup' ? '📦 Pickup Photos' : 
         category === 'delivery' ? '🚚 Delivery Photos' : 
         category === 'inspection' ? '🔍 Inspection Photos' : 
         '📸 Photos'} ({photos.length}/{maxPhotos})
      </label>
      
      <div style={{ 
        border: '2px dashed rgba(255, 255, 255, 0.3)', 
        borderRadius: '8px', 
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        marginBottom: '12px'
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={photos.length >= maxPhotos}
          style={{
            background: photos.length >= maxPhotos ? 'rgba(107, 114, 128, 0.5)' : 'rgba(59, 130, 246, 0.8)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: photos.length >= maxPhotos ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          📷 Select Photos
        </button>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '12px', 
          marginTop: '8px',
          margin: '8px 0 0 0'
        }}>
          Upload clear photos. Max {maxPhotos} photos.
        </p>
      </div>

      {photos.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '8px' 
        }}>
          {photos.map((photo, index) => (
            <div key={index} style={{ 
              position: 'relative', 
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ 
                aspectRatio: '1', 
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '4px'
              }}>
                {uploading[index] ? '⏳' : '🖼️'}
              </div>
              <p style={{ 
                color: 'white', 
                fontSize: '10px', 
                textAlign: 'center',
                margin: '0 0 4px 0',
                wordBreak: 'break-all'
              }}>
                {photo.name.substring(0, 15)}...
              </p>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(239, 68, 68, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Signature Pad Component
const SignaturePad = ({ 
  onSignatureChange, 
  placeholder = 'Sign here' 
}: { 
  onSignatureChange: (signature: string) => void
  placeholder?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (hasSignature) {
      const canvas = canvasRef.current
      if (canvas) {
        const signature = canvas.toDataURL()
        onSignatureChange(signature)
      }
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onSignatureChange('')
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: 'white', 
        marginBottom: '8px' 
      }}>
        ✍️ Digital Signature
      </label>
      <div style={{ 
        border: '2px solid rgba(255, 255, 255, 0.3)', 
        borderRadius: '8px', 
        background: 'white',
        padding: '8px'
      }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          style={{ 
            width: '100%', 
            height: '150px',
            cursor: 'crosshair',
            display: 'block'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <span style={{ 
            color: 'rgba(0, 0, 0, 0.6)', 
            fontSize: '12px' 
          }}>
            {placeholder}
          </span>
          <button
            type="button"
            onClick={clearSignature}
            style={{
              background: 'rgba(239, 68, 68, 0.8)',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Workflow Step Modal Component
export default function WorkflowStepModal({ 
  stepId, 
  stepName, 
  isOpen, 
  onClose, 
  onSubmit, 
  loadData 
}: WorkflowStepModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [signature, setSignature] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submissionData = {
        ...formData,
        photos,
        signature,
        timestamp: new Date().toISOString(),
        stepId
      }

      await onSubmit(submissionData)
      onClose()
    } catch (error) {
      console.error('Step submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const renderStepContent = () => {
    switch (stepId) {
      case 'load_assignment_confirmation':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Please confirm you accept this load assignment and understand the requirements.
            </p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'white', marginBottom: '8px' }}>Load Details:</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                Route: {loadData?.origin} → {loadData?.destination}<br/>
                Equipment: {loadData?.equipment}<br/>
                Rate: ${loadData?.rate}<br/>
                Pickup: {loadData?.pickupDate}<br/>
                Delivery: {loadData?.deliveryDate}
              </p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.confirmed || false}
                  onChange={(e) => handleInputChange('confirmed', e.target.checked)}
                  required
                />
                I confirm acceptance of this load assignment
              </label>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Notes (optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any notes or concerns about this load..."
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        )

      case 'rate_confirmation_review':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Review the rate confirmation document and confirm all details are correct.
            </p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h4 style={{ color: 'white', marginBottom: '8px' }}>Rate Confirmation Details:</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                Rate: ${loadData?.rate}<br/>
                Fuel Surcharge: Included<br/>
                Detention: $50/hr after 2 hours<br/>
                Layover: $100/day<br/>
                Additional Stops: $75 each
              </p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.rateConfirmed || false}
                  onChange={(e) => handleInputChange('rateConfirmed', e.target.checked)}
                  required
                />
                I have reviewed and agree to the rate confirmation
              </label>
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={2}
              category="rate"
            />
          </div>
        )

      case 'bol_receipt_confirmation':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Confirm you have received the Bill of Lading and all required documents.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.bolReceived || false}
                  onChange={(e) => handleInputChange('bolReceived', e.target.checked)}
                  required
                />
                I have received the Bill of Lading
              </label>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.documentsComplete || false}
                  onChange={(e) => handleInputChange('documentsComplete', e.target.checked)}
                  required
                />
                All required documents are complete
              </label>
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={3}
              category="bol"
            />
          </div>
        )

      case 'pickup_arrival':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Confirm your arrival at the pickup location.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Arrival Time
              </label>
              <input
                type="datetime-local"
                value={formData.arrivalTime || ''}
                onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Location Status
              </label>
              <select
                value={formData.locationStatus || ''}
                onChange={(e) => handleInputChange('locationStatus', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="">Select status</option>
                <option value="open">Location is open</option>
                <option value="closed">Location is closed</option>
                <option value="waiting">Waiting for contact</option>
              </select>
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={3}
              category="pickup"
            />
          </div>
        )

      case 'pickup_completion':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Confirm pickup completion and cargo loading.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Pickup Completion Time
              </label>
              <input
                type="datetime-local"
                value={formData.completionTime || ''}
                onChange={(e) => handleInputChange('completionTime', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Pieces Loaded
              </label>
              <input
                type="number"
                value={formData.piecesLoaded || ''}
                onChange={(e) => handleInputChange('piecesLoaded', e.target.value)}
                placeholder="Enter number of pieces"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.cargoSecured || false}
                  onChange={(e) => handleInputChange('cargoSecured', e.target.checked)}
                  required
                />
                Cargo is properly secured
              </label>
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={5}
              category="pickup"
            />
            <SignaturePad 
              onSignatureChange={setSignature}
              placeholder="Shipper signature"
            />
          </div>
        )

      case 'delivery_arrival':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Confirm your arrival at the delivery location.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Delivery Arrival Time
              </label>
              <input
                type="datetime-local"
                value={formData.deliveryArrivalTime || ''}
                onChange={(e) => handleInputChange('deliveryArrivalTime', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={3}
              category="delivery"
            />
          </div>
        )

      case 'delivery_completion':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Confirm delivery completion and cargo unloading.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Delivery Completion Time
              </label>
              <input
                type="datetime-local"
                value={formData.deliveryCompletionTime || ''}
                onChange={(e) => handleInputChange('deliveryCompletionTime', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Receiver Name
              </label>
              <input
                type="text"
                value={formData.receiverName || ''}
                onChange={(e) => handleInputChange('receiverName', e.target.value)}
                placeholder="Enter receiver's name"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.cargoUnloaded || false}
                  onChange={(e) => handleInputChange('cargoUnloaded', e.target.checked)}
                  required
                />
                All cargo has been unloaded
              </label>
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={5}
              category="delivery"
            />
            <SignaturePad 
              onSignatureChange={setSignature}
              placeholder="Receiver signature"
            />
          </div>
        )

      case 'pod_submission':
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Submit your Proof of Delivery with all required documentation.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.allPhotosUploaded || false}
                  onChange={(e) => handleInputChange('allPhotosUploaded', e.target.checked)}
                  required
                />
                All required photos have been uploaded
              </label>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.documentationComplete || false}
                  onChange={(e) => handleInputChange('documentationComplete', e.target.checked)}
                  required
                />
                All documentation is complete
              </label>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                Final Notes
              </label>
              <textarea
                value={formData.finalNotes || ''}
                onChange={(e) => handleInputChange('finalNotes', e.target.value)}
                placeholder="Any final notes about this delivery..."
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        )

      default:
        return (
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Complete this workflow step.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={formData.completed || false}
                  onChange={(e) => handleInputChange('completed', e.target.checked)}
                  required
                />
                Mark as completed
              </label>
            </div>
            <PhotoUpload 
              onPhotosChange={setPhotos}
              maxPhotos={3}
              category="general"
            />
          </div>
        )
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '32px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'white',
            margin: 0
          }}>
            {stepName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '24px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(107, 114, 128, 0.8)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting 
                  ? 'rgba(107, 114, 128, 0.8)' 
                  : 'linear-gradient(135deg, #3b82f6, #10b981)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : (
                'Complete Step'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 