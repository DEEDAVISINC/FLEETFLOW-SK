'use client';

import { useState } from 'react';
import EDIService from '../services/EDIService';
import EDIWorkflowService from '../services/EDIWorkflowService';

export default function EDIDemoPage() {
  const [demoResults, setDemoResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const runEDIDemo = async () => {
    setIsProcessing(true);
    const results = [];

    // Demo 1: Load Posting with EDI enrichment
    const sampleLoad = {
      id: 'LD999',
      type: 'FTL',
      origin: { city: 'Dallas', state: 'TX', zipCode: '75201' },
      destination: { city: 'Houston', state: 'TX', zipCode: '77002' },
      pickupDate: '2025-07-15',
      deliveryDate: '2025-07-16',
      rate: 1800,
      commodity: 'Electronics',
      weight: 45000,
      equipment: 'Dry Van',
    };

    try {
      const loadResult = await EDIWorkflowService.processWorkflow({
        type: 'load_posting',
        data: sampleLoad,
        userId: 'demo_user',
        timestamp: new Date(),
      });

      results.push({
        title: 'Load Posting EDI Enrichment',
        description:
          'System automatically generates required EDI identifiers for load posting',
        input: sampleLoad,
        output: loadResult,
        ediValidation: loadResult.ediValidation,
        transactionType: '204 - Motor Carrier Load Tender',
      });

      // Demo 2: Quote with EDI integration
      const sampleQuote = {
        type: 'LTL',
        origin: 'Chicago, IL',
        destination: 'Detroit, MI',
        weight: 8500,
        pallets: 6,
        freightClass: 70,
        commodity: 'Auto Parts',
        quote: {
          base: '750',
          fuel: '125',
          accessorials: '75',
          total: '950',
        },
      };

      const quoteResult = await EDIWorkflowService.processWorkflow({
        type: 'quote_generation',
        data: sampleQuote,
        userId: 'demo_user',
        timestamp: new Date(),
      });

      results.push({
        title: 'Quote Generation with EDI',
        description:
          'System prepares quote data for EDI transmission with proper identifiers',
        input: sampleQuote,
        output: quoteResult,
        ediValidation: quoteResult.ediValidation,
        transactionType: '210 - Motor Carrier Freight Details and Invoice',
      });

      // Demo 3: RFx Response with EDI
      const sampleRFx = {
        type: 'RFQ',
        shipper: 'Walmart Distribution',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        commodity: 'Consumer Goods',
        urgency: 'standard',
        requirements: ['temperature_controlled'],
      };

      const rfxResult = await EDIWorkflowService.processWorkflow({
        type: 'rfx_response',
        data: sampleRFx,
        userId: 'demo_user',
        timestamp: new Date(),
      });

      results.push({
        title: 'RFx Response with EDI',
        description:
          'System generates competitive response with EDI-ready identifiers',
        input: sampleRFx,
        output: rfxResult,
        ediValidation: rfxResult.ediValidation,
        transactionType: '990 - Response to a Load Tender',
      });

      // Demo 4: Shipper Identifier Generation
      const shipperId = EDIService.generateShipperIdentifier(
        'Walmart Distribution',
        '204',
        EDIService.getCommodityCode('Consumer Goods')
      );

      results.push({
        title: 'Shipper Identifier Generation',
        description:
          'System creates structured shipper IDs combining EDI codes, commodity codes, and company initials',
        input: {
          company: 'Walmart Distribution',
          transaction: 'Load Tender',
          commodity: 'Consumer Goods',
        },
        output: shipperId,
        ediValidation: {
          isValid: shipperId.isValid,
          missingRequired: [],
          invalidIdentifiers: [],
        },
        transactionType:
          'Shipper ID Format: COMPANY-TRANSACTION-COMMODITY-SEQUENCE-DATE',
      });

      setDemoResults(results);
    } catch (error) {
      console.error('EDI Demo Error:', error);
      results.push({
        title: 'Error',
        description: 'An error occurred during the demo',
        error: error.message,
      });
      setDemoResults(results);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateIdentifier = (type: string, value: string) => {
    return EDIService.validateIdentifier(type, value);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        minHeight: '100vh',
        padding: '80px 20px 20px 20px',
      }}
    >
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px 32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            🔄 EDI Integration Demo
          </h1>
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 16px 0',
              fontWeight: '500',
            }}
          >
            Internal EDI Processing - Hidden from End Users
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
            }}
          >
            This demonstration shows how the system automatically handles EDI
            identifiers, validation, and transaction mapping without exposing
            complexity to users.
          </p>
        </div>

        {/* Demo Controls */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <button
            onClick={runEDIDemo}
            disabled={isProcessing}
            style={{
              padding: '16px 32px',
              background: isProcessing
                ? 'rgba(255, 255, 255, 0.2)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {isProcessing
              ? '🔄 Processing EDI Demo...'
              : '🚀 Run EDI Integration Demo'}
          </button>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '12px',
              fontSize: '14px',
            }}
          >
            This will demonstrate load posting, quote generation, and RFx
            response with automatic EDI enrichment
          </p>
        </div>

        {/* Demo Results */}
        {demoResults.length > 0 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {demoResults.map((result, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  {result.title}
                </h2>

                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '24px',
                  }}
                >
                  {result.description}
                </p>

                {result.transactionType && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <h4
                      style={{
                        color: '#fbbf24',
                        margin: '0 0 8px 0',
                        fontSize: '14px',
                      }}
                    >
                      📋 EDI Transaction Type
                    </h4>
                    <p
                      style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {result.transactionType}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  {/* Input Data */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#fbbf24',
                        marginBottom: '12px',
                        fontSize: '16px',
                      }}
                    >
                      📥 User Input (What Users See)
                    </h3>
                    <pre
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '12px',
                        overflow: 'auto',
                        maxHeight: '300px',
                      }}
                    >
                      {JSON.stringify(result.input, null, 2)}
                    </pre>
                  </div>

                  {/* Enhanced Output */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#10b981',
                        marginBottom: '12px',
                        fontSize: '16px',
                      }}
                    >
                      📤 System Output (Internal EDI-Enhanced)
                    </h3>
                    <pre
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '12px',
                        overflow: 'auto',
                        maxHeight: '300px',
                      }}
                    >
                      {JSON.stringify(result.output, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* EDI Validation Results */}
                {result.ediValidation && (
                  <div
                    style={{
                      background: result.ediValidation.isValid
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      border: `1px solid ${result.ediValidation.isValid ? '#10b981' : '#ef4444'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      marginTop: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: result.ediValidation.isValid
                          ? '#10b981'
                          : '#ef4444',
                        marginBottom: '12px',
                        fontSize: '16px',
                      }}
                    >
                      {result.ediValidation.isValid ? '✅' : '❌'} EDI
                      Validation Results
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      {result.ediValidation.requiredIdentifiers && (
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '14px',
                              marginBottom: '8px',
                            }}
                          >
                            Required Identifiers
                          </h4>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            {result.ediValidation.requiredIdentifiers.map(
                              (id: string) => (
                                <div key={id} style={{ marginBottom: '4px' }}>
                                  ✓ {id}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {result.ediValidation.generatedIdentifiers && (
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '14px',
                              marginBottom: '8px',
                            }}
                          >
                            Auto-Generated IDs
                          </h4>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            {Object.entries(
                              result.ediValidation.generatedIdentifiers
                            ).map(([key, value]) => (
                              <div key={key} style={{ marginBottom: '4px' }}>
                                🔧 {key}: {value as string}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.ediValidation.missingRequired &&
                        result.ediValidation.missingRequired.length > 0 && (
                          <div>
                            <h4
                              style={{
                                color: '#ef4444',
                                fontSize: '14px',
                                marginBottom: '8px',
                              }}
                            >
                              Missing Required
                            </h4>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              {result.ediValidation.missingRequired.map(
                                (id: string) => (
                                  <div key={id} style={{ marginBottom: '4px' }}>
                                    ❌ {id}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EDI Identifier Validation Tool */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            🔍 EDI Identifier Validation Examples
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { type: 'SCAC', validExample: 'FEDX', invalidExample: 'FE1X' },
              {
                type: 'PRO',
                validExample: '12345678901',
                invalidExample: '123456',
              },
              {
                type: 'BOL',
                validExample: 'BOL123456789',
                invalidExample: 'BO',
              },
              {
                type: 'GLN',
                validExample: '1234567890123',
                invalidExample: '12345',
              },
              {
                type: 'DUNS',
                validExample: '123456789',
                invalidExample: '12345',
              },
              {
                type: 'ContainerNumber',
                validExample: 'ABCD1234567',
                invalidExample: 'ABC123',
              },
            ].map((example) => (
              <div
                key={example.type}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#fbbf24',
                    marginBottom: '12px',
                    fontSize: '16px',
                  }}
                >
                  {example.type}
                </h3>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      color: validateIdentifier(
                        example.type,
                        example.validExample
                      )
                        ? '#10b981'
                        : '#ef4444',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    {validateIdentifier(example.type, example.validExample)
                      ? '✅'
                      : '❌'}{' '}
                    Valid: {example.validExample}
                  </div>
                  <div
                    style={{
                      color: validateIdentifier(
                        example.type,
                        example.invalidExample
                      )
                        ? '#10b981'
                        : '#ef4444',
                      fontSize: '14px',
                    }}
                  >
                    {validateIdentifier(example.type, example.invalidExample)
                      ? '✅'
                      : '❌'}{' '}
                    Invalid: {example.invalidExample}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            🎯 Key Benefits of Internal EDI Processing
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                Improved User Experience
              </h3>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Users focus on freight details, not EDI complexity
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                Automatic Validation
              </h3>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                System ensures EDI compliance automatically
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                Faster Processing
              </h3>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Auto-generation of required identifiers
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                Context-Aware
              </h3>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Right EDI transaction type for each operation
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
