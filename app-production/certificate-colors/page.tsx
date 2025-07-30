'use client'

import { useState } from 'react'
import { MODULE_COLOR_SCHEMES, getModuleColorScheme } from '../utils/moduleColors'

export default function CertificateColorsPage() {
  const [selectedModule, setSelectedModule] = useState('dispatch')
  
  const modules = [
    { id: 'dispatch', title: '🚛 Dispatch Operations' },
    { id: 'broker', title: '🤝 Freight Brokerage' },
    { id: 'compliance', title: '⚖️ DOT Compliance' },
    { id: 'safety', title: '🦺 Safety Management' },
    { id: 'technology', title: '💻 Technology Systems' },
    { id: 'customer', title: '🤝 Customer Service' },
    { id: 'workflow', title: '🔄 Workflow Ecosystem' },
    { id: 'sms-workflow', title: '📱 SMS Notification System' }
  ]

  const colors = getModuleColorScheme(selectedModule)
  const selectedModuleData = modules.find(m => m.id === selectedModule)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Certificate Color Schemes</h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '30px'
          }}>Preview how certificates look with different training module color schemes</p>

          {/* Module Selector */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {modules.map(module => {
              const moduleColors = getModuleColorScheme(module.id)
              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  style={{
                    padding: '12px 20px',
                    border: selectedModule === module.id ? `3px solid ${moduleColors.primary}` : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: selectedModule === module.id ? moduleColors.light : 'white',
                    color: selectedModule === module.id ? moduleColors.primary : '#374151',
                    fontSize: '14px',
                    fontWeight: selectedModule === module.id ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedModule === module.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: selectedModule === module.id ? `0 4px 12px ${moduleColors.light}` : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {module.title}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Color Palette */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#1f2937'
            }}>Color Palette</h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: key === 'gradient' ? value : value,
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}></div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      textTransform: 'capitalize'
                    }}>{key}</div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontFamily: 'monospace'
                    }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Preview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#1f2937'
            }}>Certificate Preview</h2>
            
            {/* Mini Certificate */}
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              background: colors.gradient,
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Certificate Content */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '20px',
                width: '90%',
                height: '85%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
                border: `3px solid ${colors.border}`
              }}>
                {/* Logo */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: colors.gradient,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  marginBottom: '10px',
                  border: `2px solid ${colors.border}`
                }}>🚛</div>
                
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '5px'
                }}>FleetFlow University</div>
                
                <div style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  marginBottom: '15px'
                }}>Certificate of Completion</div>
                
                <div style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: colors.primary,
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>{selectedModuleData?.title}</div>
                
                <div style={{
                  fontSize: '10px',
                  color: '#374151',
                  marginBottom: '10px'
                }}>John Doe</div>
                
                <div style={{
                  height: '2px',
                  width: '60%',
                  background: colors.gradient,
                  marginBottom: '8px'
                }}></div>
                
                <div style={{
                  fontSize: '8px',
                  color: '#6b7280'
                }}>{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: colors.light,
              borderRadius: '8px',
              border: `1px solid ${colors.border}`
            }}>
              <p style={{
                fontSize: '14px',
                color: colors.primary,
                fontWeight: 'bold',
                margin: 0
              }}>✨ This certificate uses the {selectedModuleData?.title} color scheme</p>
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '5px 0 0 0'
              }}>The colors automatically match the training module's branding for consistent visual identity.</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginTop: '30px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#1f2937'
          }}>🎨 Color Coordination System</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#3b82f6',
                marginBottom: '10px'
              }}>🎯 Automatic Detection</h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5'
              }}>Certificates automatically detect the training module and apply the corresponding color scheme from the training module definitions.</p>
            </div>
            
            <div style={{
              padding: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '10px'
              }}>🔄 Consistent Branding</h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5'
              }}>Each certificate maintains visual consistency with its training module's quick link colors and overall branding theme.</p>
            </div>
            
            <div style={{
              padding: '20px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#f59e0b',
                marginBottom: '10px'
              }}>📱 Professional Design</h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5'
              }}>Gradient backgrounds, elegant typography, and module-specific accents create professional, personalized certificates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
