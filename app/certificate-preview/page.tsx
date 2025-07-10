'use client'

import { useState } from 'react'
import { CertificateGenerator, CertificateData } from '../components/CertificateGenerator'

export default function CertificatePreview() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateGenerated, setCertificateGenerated] = useState(false)

  // Sample certificate data for preview
  const sampleCertificateData: CertificateData = {
    id: 'cert_sms_workflow_1704560400000',
    moduleTitle: 'SMS Notification System Certification',
    recipientName: 'John Smith',
    recipientEmail: 'john.smith@example.com',
    recipientRole: 'Transportation Professional',
    dateEarned: new Date().toLocaleDateString(),
    score: 92,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    instructorName: 'FleetFlow University Director',
    companyName: 'FleetFlow University'
  }

  const handleGenerateSampleCertificate = async () => {
    setIsGenerating(true)
    try {
      const pdfBlob = await CertificateGenerator.generateCertificatePDF(sampleCertificateData)
      const filename = `FleetFlow_Certificate_Sample.pdf`
      CertificateGenerator.downloadCertificate(pdfBlob, filename)
      setCertificateGenerated(true)
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert('Error generating certificate. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          🎓 FleetFlow University Certificate Preview
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.6' }}>
          Preview the professional certificate design that users will receive upon completing training modules.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Certificate Preview Card */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            📄 Certificate Design Preview
          </h2>

          {/* Visual representation of the certificate */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            borderRadius: '15px',
            padding: '40px',
            marginBottom: '25px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '500px',
            transform: 'scale(0.8)',
            transformOrigin: 'top left',
            width: '125%'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>

            {/* Certificate Content */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.98)',
              border: '8px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Header */}
              <div style={{ marginBottom: '30px' }}>
                {/* Logo and Company Name */}
                <div style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px'
                }}>
                  {/* Logo Placeholder */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white',
                    fontWeight: 'bold',
                    border: '2px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    🚛
                  </div>
                  {/* Company Name */}
                  <div>
                    <div style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                      lineHeight: '1'
                    }}>
                      FleetFlow University
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                      textAlign: 'center',
                      marginTop: '3px'
                    }}>
                      Transportation Excellence Institute
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  color: '#6b7280',
                  fontWeight: '600',
                  letterSpacing: '2px'
                }}>
                  CERTIFICATE OF COMPLETION
                </div>
              </div>

              {/* Decorative Line */}
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6)',
                margin: '20px auto',
                width: '200px',
                borderRadius: '2px'
              }}></div>

              {/* Main Content */}
              <div style={{ margin: '30px 0' }}>
                <div style={{
                  fontSize: '18px',
                  color: '#374151',
                  marginBottom: '15px',
                  fontStyle: 'italic'
                }}>
                  This is to certify that
                </div>
                
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '15px 0',
                  padding: '12px 25px',
                  borderBottom: '3px solid #3b82f6',
                  display: 'inline-block'
                }}>
                  {sampleCertificateData.recipientName}
                </div>
                
                <div style={{
                  fontSize: '16px',
                  color: '#374151',
                  margin: '15px 0'
                }}>
                  has successfully completed the training program
                </div>
                
                <div style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#1d4ed8',
                  margin: '20px 0',
                  padding: '15px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  border: '2px solid rgba(59, 130, 246, 0.2)'
                }}>
                  {sampleCertificateData.moduleTitle}
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  marginTop: '15px'
                }}>
                  with a score of <strong style={{ color: '#10b981', fontSize: '18px' }}>{sampleCertificateData.score}%</strong>
                </div>
              </div>

              {/* Footer Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '2px solid #e5e7eb',
                fontSize: '12px'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>Date Issued:</div>
                  <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{sampleCertificateData.dateEarned}</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>Certificate ID:</div>
                  <div style={{ fontWeight: 'bold', color: '#1f2937', fontFamily: 'monospace', fontSize: '11px' }}>
                    {sampleCertificateData.id}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>Valid Until:</div>
                  <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{sampleCertificateData.validUntil}</div>
                </div>
              </div>

              {/* Signature Section */}
              <div style={{
                marginTop: '25px',
                textAlign: 'center'
              }}>
                <div style={{
                  height: '2px',
                  background: '#374151',
                  width: '150px',
                  margin: '0 auto 8px auto'
                }}></div>
                <div style={{
                  fontSize: '12px',
                  color: '#374151',
                  fontWeight: '600'
                }}>
                  FleetFlow University Director
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  marginTop: '4px'
                }}>
                  Transportation Excellence Institute
                </div>
              </div>

              {/* Security Features */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '60px',
                height: '60px',
                border: '2px solid #3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(59, 130, 246, 0.1)',
                fontSize: '20px',
                color: '#1d4ed8',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              
              {/* Security Watermark */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '15px',
                fontSize: '10px',
                color: '#9ca3af',
                transform: 'rotate(-45deg)',
                opacity: 0.7
              }}>
                AUTHENTICATED
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleGenerateSampleCertificate}
              disabled={isGenerating}
              style={{
                background: isGenerating 
                  ? 'rgba(107, 114, 128, 0.5)' 
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '15px'
              }}
            >
              {isGenerating ? '⏳ Generating PDF...' : '📄 Generate Sample Certificate PDF'}
            </button>

            {certificateGenerated && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.95rem',
                color: '#059669',
                fontWeight: '600'
              }}>
                ✅ Sample certificate generated and downloaded!
              </div>
            )}
          </div>
        </div>

        {/* Certificate Details */}
        <div style={{
          width: '350px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            📋 Certificate Details
          </h3>

          <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Recipient:</strong>
              <div style={{ color: '#6b7280' }}>{sampleCertificateData.recipientName}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Module:</strong>
              <div style={{ color: '#6b7280' }}>{sampleCertificateData.moduleTitle}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Role:</strong>
              <div style={{ color: '#6b7280' }}>{sampleCertificateData.recipientRole}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Score:</strong>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>{sampleCertificateData.score}%</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Date Earned:</strong>
              <div style={{ color: '#6b7280' }}>{sampleCertificateData.dateEarned}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Valid Until:</strong>
              <div style={{ color: '#6b7280' }}>{sampleCertificateData.validUntil}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#374151' }}>Certificate ID:</strong>
              <div style={{ 
                color: '#6b7280', 
                fontFamily: 'monospace', 
                fontSize: '0.8rem',
                wordBreak: 'break-all'
              }}>
                {sampleCertificateData.id}
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '20px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
              🎨 Certificate Features
            </h4>
            <ul style={{ 
              paddingLeft: '16px', 
              margin: 0, 
              fontSize: '0.9rem', 
              color: '#374151',
              lineHeight: '1.6'
            }}>
              <li>Professional gradient background</li>
              <li>FleetFlow branding and logo space</li>
              <li>Security verification badge</li>
              <li>Unique certificate ID</li>
              <li>Digital signature elements</li>
              <li>High-resolution PDF output</li>
              <li>Print-ready format</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '15px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              🎨 Logo Integration
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>
              The blue circle with truck icon is a placeholder.<br/>
              Replace with your FleetFlow logo following the integration guide.
            </div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '15px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              📧 Delivery Options
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>
              • Instant PDF download<br/>
              • Email delivery with attachment<br/>
              • Professional email template<br/>
              • Delivery confirmation
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
