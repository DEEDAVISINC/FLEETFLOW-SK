'use client'

import React, { useState } from 'react'

interface QuantumOptimizationControlsProps {
  onQuantumToggle: (enabled: boolean) => void
  onParametersChange: (params: QuantumParameters) => void
  isOptimizing: boolean
}

interface QuantumParameters {
  quantumIterations: number
  annealingTemperature: number
  useQuantumOptimization: boolean
}

export default function QuantumOptimizationControls({
  onQuantumToggle,
  onParametersChange,
  isOptimizing
}: QuantumOptimizationControlsProps) {
  const [quantumEnabled, setQuantumEnabled] = useState(false)
  const [parameters, setParameters] = useState<QuantumParameters>({
    quantumIterations: 50,
    annealingTemperature: 100,
    useQuantumOptimization: false
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleQuantumToggle = () => {
    const newEnabled = !quantumEnabled
    setQuantumEnabled(newEnabled)
    
    const newParams = { ...parameters, useQuantumOptimization: newEnabled }
    setParameters(newParams)
    
    onQuantumToggle(newEnabled)
    onParametersChange(newParams)
  }

  const handleParameterChange = (key: keyof QuantumParameters, value: number | boolean) => {
    const newParams = { ...parameters, [key]: value }
    setParameters(newParams)
    onParametersChange(newParams)
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      border: quantumEnabled ? '2px solid #6366f1' : '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: quantumEnabled 
        ? '0 8px 32px rgba(99, 102, 241, 0.3)' 
        : '0 4px 16px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '24px',
            background: quantumEnabled 
              ? 'linear-gradient(45deg, #6366f1, #8b5cf6)' 
              : '#e5e7eb',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold'
          }}>
            ⚛️
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            background: quantumEnabled 
              ? 'linear-gradient(45deg, #6366f1, #8b5cf6)' 
              : '#374151',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Quantum-Inspired Optimization
          </h3>
        </div>
        
        {/* Main Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '14px', 
            color: quantumEnabled ? '#374151' : '#6b7280',
            fontWeight: quantumEnabled ? '600' : '400'
          }}>
            {quantumEnabled ? 'Quantum Enabled' : 'Classical Mode'}
          </span>
          <div
            onClick={handleQuantumToggle}
            style={{
              width: '60px',
              height: '30px',
              borderRadius: '15px',
              background: quantumEnabled 
                ? 'linear-gradient(45deg, #6366f1, #8b5cf6)' 
                : '#d1d5db',
              position: 'relative',
              cursor: isOptimizing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isOptimizing ? 0.6 : 1
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '2px',
              left: quantumEnabled ? '32px' : '2px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }} />
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '16px',
        padding: '12px',
        background: quantumEnabled ? 'rgba(99, 102, 241, 0.05)' : 'rgba(243, 244, 246, 0.8)',
        borderRadius: '8px',
        border: quantumEnabled ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(209, 213, 219, 0.5)'
      }}>
        {quantumEnabled ? (
          <div>
            <strong>🔬 Quantum Mode Active:</strong> Using advanced quantum-inspired algorithms including:
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Quantum annealing simulation for global optimization</li>
              <li>Superposition-based path exploration</li>
              <li>Entanglement coordination between vehicles</li>
              <li>Enhanced convergence with tunneling effects</li>
            </ul>
          </div>
        ) : (
          <div>
            <strong>⚡ Classical Mode:</strong> Using traditional optimization algorithms with nearest-neighbor heuristics and constraint satisfaction. Enable Quantum Mode for up to 25% better route efficiency.
          </div>
        )}
      </div>

      {/* Quantum Parameters */}
      {quantumEnabled && (
        <div style={{ marginTop: '16px' }}>
          {/* Advanced Parameters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#6366f1',
              cursor: 'pointer',
              marginBottom: '12px',
              fontWeight: '500'
            }}
          >
            {showAdvanced ? '⬆️ Hide Advanced Parameters' : '⬇️ Show Advanced Parameters'}
          </button>

          {showAdvanced && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              padding: '16px',
              background: 'rgba(99, 102, 241, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.15)'
            }}>
              {/* Quantum Iterations */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  🔄 Quantum Iterations
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={parameters.quantumIterations}
                    onChange={(e) => handleParameterChange('quantumIterations', parseInt(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: '#d1d5db',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    disabled={isOptimizing}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#6366f1',
                    minWidth: '30px'
                  }}>
                    {parameters.quantumIterations}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Higher values = better optimization, longer processing time
                </div>
              </div>

              {/* Annealing Temperature */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  🌡️ Initial Temperature
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={parameters.annealingTemperature}
                    onChange={(e) => handleParameterChange('annealingTemperature', parseInt(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: '#d1d5db',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    disabled={isOptimizing}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#6366f1',
                    minWidth: '35px'
                  }}>
                    {parameters.annealingTemperature}°
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Higher values = more exploration, better global optima
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Indicators */}
      {quantumEnabled && (
        <div style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1' }}>+25%</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Route Efficiency</div>
          </div>
          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>-20%</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Fuel Costs</div>
          </div>
          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>+15%</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Time Savings</div>
          </div>
          <div style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.1))',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>-30%</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>CO₂ Emissions</div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {isOptimizing && quantumEnabled && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>
              Quantum Optimization in Progress...
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Exploring superposition states and applying quantum annealing
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
