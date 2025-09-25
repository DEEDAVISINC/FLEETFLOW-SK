'use client'

import { ReactNode, useState } from 'react'

interface InfoTooltipProps {
  text: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  maxWidth?: string
  showDelay?: number
  hideDelay?: number
  className?: string
}

export default function InfoTooltip({
  text,
  children,
  position = 'top',
  maxWidth = '200px',
  showDelay = 500,
  hideDelay = 100,
  className = ''
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId)
    const id = setTimeout(() => setIsVisible(true), showDelay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId)
    const id = setTimeout(() => setIsVisible(false), hideDelay)
    setTimeoutId(id)
  }

  const getTooltipPosition = () => {
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        }
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px'
        }
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px'
        }
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px'
        }
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        }
    }
  }

  const getArrowStyle = () => {
    const arrowSize = '6px'
    const arrowColor = 'rgba(0, 0, 0, 0.9)'

    switch (position) {
      case 'top':
        return {
          position: 'absolute' as const,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid transparent`,
          borderTop: `${arrowSize} solid ${arrowColor}`
        }
      case 'bottom':
        return {
          position: 'absolute' as const,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid transparent`,
          borderBottom: `${arrowSize} solid ${arrowColor}`
        }
      case 'left':
        return {
          position: 'absolute' as const,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: `${arrowSize} solid transparent`,
          borderBottom: `${arrowSize} solid transparent`,
          borderLeft: `${arrowSize} solid ${arrowColor}`
        }
      case 'right':
        return {
          position: 'absolute' as const,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: `${arrowSize} solid transparent`,
          borderBottom: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid ${arrowColor}`
        }
      default:
        return {
          position: 'absolute' as const,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid transparent`,
          borderTop: `${arrowSize} solid ${arrowColor}`
        }
    }
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '10px 12px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          maxWidth: maxWidth,
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          ...getTooltipPosition()
        }}>
          {text}
          <div style={getArrowStyle()} />
        </div>
      )}
    </div>
  )
}

// Specialized tooltip for feature explanations
export function FeatureTooltip({
  feature,
  description,
  children,
  position = 'top',
  className = ''
}: {
  feature: string
  description: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  const tooltipText = `${feature}: ${description}`

  return (
    <InfoTooltip
      text={tooltipText}
      position={position}
      maxWidth="250px"
      className={className}
    >
      {children}
    </InfoTooltip>
  )
}

// Specialized tooltip for help icons
export function HelpTooltip({
  text,
  position = 'top',
  className = ''
}: {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  return (
    <InfoTooltip
      text={text}
      position={position}
      maxWidth=""300px""
      className={className}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        cursor: 'help',
        marginLeft: '4px'
      }}>
        ?
      </div>
    </InfoTooltip>
  )
}

// Specialized tooltip for status indicators
export function StatusTooltip({
  status,
  description,
  color = '#6b7280',
  children,
  position = 'top',
  className = ''
}: {
  status: string
  description: string
  color?: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  const tooltipText = `Status: ${status} - ${description}`

  return (
    <InfoTooltip
      text={tooltipText}
      position={position}
      maxWidth=""200px""
      className={className}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color
        }} />
        {children}
      </div>
    </InfoTooltip>
  )
}
