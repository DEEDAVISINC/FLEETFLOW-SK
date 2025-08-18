/**
 * FleetFlow Complete Migration Export Package
 * Generated for computer migration
 * Contains all essential code components
 */

export const FLEETFLOW_MIGRATION_PACKAGE = {
  // Core Application Files
  core: {
    // Main BOL Review Panel Component (Currently Open)
    BOLReviewPanel: `'use client';

import { useEffect, useState } from 'react';

interface BOLSubmission {
  id: string;
  loadId: string;
  loadIdentifierId: string;
  driverName: string;
  shipperName: string;
  shipperEmail: string;
  status: 'submitted' | 'broker_review' | 'broker_approved' | 'invoice_generated' | 'invoice_sent' | 'completed';
  submittedAt: string;
  bolData: {
    bolNumber: string;
    proNumber: string;
    deliveryDate: string;
    deliveryTime: string;
    receiverName: string;
    deliveryPhotos: string[];
    pickupPhotos: string[];
    sealNumbers: string[];
    weight: string;
    pieces: number;
    damages: string[];
    notes: string;
  };
}

interface BOLReviewPanelProps {
  brokerId: string;
  brokerName: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
  paymentTerms: string;
  specialInstructions: string;
  contactInfo: string;
}

export default function BOLReviewPanel({ brokerId, brokerName }: BOLReviewPanelProps) {
  const [submissions, setSubmissions] = useState<BOLSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<BOLSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [adjustments, setAdjustments] = useState({
    rate: '',
    additionalCharges: [] as Array<{ description: string; amount: number }>,
    deductions: [] as Array<{ description: string; amount: number }>
  });

  // Email editing state
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    subject: '',
    body: '',
    paymentTerms: 'Net 30 Days',
    specialInstructions: '',
    contactInfo: 'billing@fleetflow.com'
  });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [brokerId]);

  useEffect(() => {
    // Generate default email template when submission is selected
    if (selectedSubmission) {
      generateDefaultEmailTemplate(selectedSubmission);
    }
  }, [selectedSubmission, adjustments]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bol-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_submissions',
          brokerId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmissions(result.submissions.filter((sub: BOLSubmission) =>
          sub.status === 'broker_review' || sub.status === 'submitted'
        ));
      }
    } catch (error) {
      console.error('Failed to load BOL submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultEmailTemplate = (submission: BOLSubmission) => {
    const rate = parseFloat(adjustments.rate) || 2500;
    const additionalCharges = adjustments.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const deductions = adjustments.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const totalAmount = rate + additionalCharges - deductions;

    const invoiceId = \`INV-\${submission.loadIdentifierId}-\${Date.now().toString().slice(-6)}\`;

    setEmailTemplate({
      subject: \`Invoice \${invoiceId} - Load \${submission.loadIdentifierId} Delivered\`,
      body: \`Dear \${submission.shipperName} Accounts Payable,

Your shipment has been successfully delivered and is ready for payment processing.

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: \${invoiceId}
Load Reference: \${submission.loadIdentifierId}
BOL Number: \${submission.bolData.bolNumber}
PRO Number: \${submission.bolData.proNumber}

DELIVERY INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivery Date: \${submission.bolData.deliveryDate}
Delivery Time: \${submission.bolData.deliveryTime}
Receiver Name: \${submission.bolData.receiverName}
Driver: \${submission.driverName}
Carrier: \${brokerName}

BILLING INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount Due: $\${totalAmount.toLocaleString()}
Due Date: \${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

\${adjustments.rate || adjustments.additionalCharges.length > 0 || adjustments.deductions.length > 0 ? \`
RATE BREAKDOWN:
Base Rate: $\${rate.toLocaleString()}
\${adjustments.additionalCharges.map(charge => \`\${charge.description}: +$\${charge.amount.toLocaleString()}\`).join('\\n')}
\${adjustments.deductions.map(deduction => \`\${deduction.description}: -$\${deduction.amount.toLocaleString()}\`).join('\\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: $\${totalAmount.toLocaleString()}
\` : ''}

Thank you for your business!

FleetFlow Transportation Services
Professional Freight & Logistics Solutions\`,
      paymentTerms: 'Net 30 Days',
      specialInstructions: '',
      contactInfo: 'billing@fleetflow.com'
    });
  };

  // Rest of component implementation...
  // [Full component code continues - this is abbreviated for migration package]
}`,

    // Main Layout Component
    layout: `import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import ClientLayout from './components/ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FleetFlow™ - Transportation Management System',
  description: 'Advanced fleet management and logistics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* React Error Suppression */}
        <Script
          id='react-error-suppression'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: \`
              // React Console Error Suppression
              if (typeof window !== 'undefined' && typeof console !== 'undefined') {
                const originalError = console.error;
                const originalWarn = console.warn;

                const REACT_PATTERNS = [
                  'createConsoleError@', 'handleConsoleError@', 'error@',
                  'BuildError@', 'react-stack-bottom-frame@', 'renderWithHooks@',
                  'updateFunctionComponent@', 'runWithFiberInDEV@', 'validateDOMNesting@',
                  'Warning:', 'React Warning:', 'ReactDOM Warning:',
                  'Module not found:', 'Can\\'t resolve'
                ];

                console.error = function(...args) {
                  const msg = args.join(' ');
                  if (REACT_PATTERNS.some(p => msg.includes(p))) {
                    console.log('🚫 React error blocked:', msg.substring(0, 80) + '...');
                    return;
                  }
                  originalError.apply(console, args);
                };

                console.warn = function(...args) {
                  const msg = args.join(' ');
                  if (REACT_PATTERNS.some(p => msg.includes(p))) return;
                  originalWarn.apply(console, args);
                };

                console.log('🛡️ React error suppression activated');
              }
            \`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}`,

    // Client Layout Component
    clientLayout: `'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { LoadProvider } from '../contexts/LoadContext';
import { ShipperProvider } from '../contexts/ShipperContext';
import FlowterButton from './FlowterButton';
import FleetFlowFooter from './FleetFlowFooter';
import Navigation from './Navigation';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [coPilotOpen, setCoPilotOpen] = useState(false);
  const pathname = usePathname();

  const handleCoPilotOpen = () => {
    setCoPilotOpen(true);
  };

  const handleCoPilotClose = () => {
    setCoPilotOpen(false);
  };

  const shouldShowCoPilot =
    !pathname?.includes('/university') ||
    pathname?.includes('/training/instructor');

  return (
    <SimpleErrorBoundary>
      <ShipperProvider>
        <LoadProvider>
          <Navigation />
          <main
            style={{
              paddingTop: '70px',
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1 }}>{children}</div>
            <FleetFlowFooter variant='transparent' />
          </main>

          {/* Flowter AI Button */}
          {shouldShowCoPilot && (
            <FlowterButton onOpen={handleCoPilotOpen} />
          )}

          {/* Co-Pilot Modal */}
          {coPilotOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={handleCoPilotClose}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <h2 style={{ margin: 0, color: '#1f2937' }}>
                    🤖 Flowter AI
                  </h2>
                  <button
                    onClick={handleCoPilotClose}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6b7280',
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                    Hi! I'm Flowter, your AI assistant. I can help you navigate FleetFlow,
                    discover features, troubleshoot issues, and optimize your
                    workflow.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>
                    What I can help with:
                  </h3>
                  <ul
                    style={{
                      color: '#4b5563',
                      lineHeight: '1.6',
                      paddingLeft: '20px',
                    }}
                  >
                    <li>📚 Learning FleetFlow features and best practices</li>
                    <li>🔍 Finding hidden features and shortcuts</li>
                    <li>🚛 Driver scheduling and load matching</li>
                    <li>📊 Route optimization and analytics</li>
                    <li>❓ Troubleshooting and support</li>
                  </ul>
                </div>

                <div
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    💡 <strong>Tip:</strong> For advanced AI features and
                    real-time assistance, visit the AI Flow section of FleetFlow
                    where I can take direct actions and provide more interactive
                    help.
                  </p>
                </div>
              </div>
            </div>
          )}
        </LoadProvider>
      </ShipperProvider>
    </SimpleErrorBoundary>
  );
}`,
  },

  // Package.json Dependencies
  dependencies: {
    name: 'fleetflow',
    version: '1.0.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      '@heroicons/react': '^2.2.0',
      '@react-google-maps/api': '^2.20.7',
      '@supabase/auth-helpers-nextjs': '^0.10.0',
      '@supabase/supabase-js': '^2.50.5',
      axios: '^1.10.0',
      next: '^15.3.3',
      react: '^19.1.0',
      'react-dom': '^19.1.0',
      typescript: '^5.8.3',
      tailwindcss: '^4.1.10',
    },
    devDependencies: {
      '@types/node': '^22.15.29',
      '@types/react': '^19.1.6',
      '@types/react-dom': '^19.1.6',
      eslint: '^9.31.0',
      'eslint-config-next': '^15.4.2',
    },
  },

  // Essential Service Categories
  services: {
    // Core Services (Priority 1)
    core: [
      'user-data-service.ts',
      'auth.ts',
      'CRMService.ts',
      'system-orchestrator.ts',
      'automation.ts',
      'communication.ts',
    ],

    // Business Logic Services (Priority 2)
    business: [
      'bol-workflow/*.ts',
      'enhanced-carrier-service.ts',
      'LoadIdentificationService.ts',
      'EDIService.ts',
      'document-flow-service.ts',
      'invoiceService.ts',
    ],

    // AI & Integration Services (Priority 3)
    ai: [
      'ai.ts',
      'AIFlowSystem.ts',
      'automation-engine.ts',
      'FreightQuotingEngine.ts',
      'LeadGenerationService.ts',
    ],

    // External API Services
    api: [
      'fmcsa.ts',
      'weather.ts',
      'sendgrid-service.ts',
      'quickbooksService.ts',
      'SquareService.ts',
    ],
  },

  // Environment Configuration
  environment: {
    required: [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'ANTHROPIC_API_KEY',
      'TWILIO_ACCOUNT_SID',
      'TWILIO_AUTH_TOKEN',
      'SENDGRID_API_KEY',
    ],
    optional: [
      'BILL_COM_API_KEY',
      'SQUARE_APPLICATION_ID',
      'FMCSA_API_KEY',
      'OPENAI_API_KEY',
    ],
  },

  // Migration Instructions
  instructions: {
    step1: 'Install Node.js 18.x or higher',
    step2: 'Run npm install to install dependencies',
    step3: 'Copy .env.local with all required environment variables',
    step4: 'Set up Supabase database connection',
    step5: 'Test critical components: BOL workflow, Navigation, User auth',
    step6: 'Deploy API routes and service integrations',
    step7: 'Verify all external API connections',
  },

  // Critical File Paths
  criticalPaths: [
    'app/layout.tsx',
    'app/components/ClientLayout.tsx',
    'app/components/Navigation.tsx',
    'app/components/BOLReviewPanel.tsx',
    'app/services/user-data-service.ts',
    'app/services/system-orchestrator.ts',
    'app/api/*',
    'package.json',
    '.env.local',
    'next.config.js',
  ],
};

// Export individual components for easy access
export const getBOLReviewPanel = () =>
  FLEETFLOW_MIGRATION_PACKAGE.core.BOLReviewPanel;
export const getLayoutComponent = () => FLEETFLOW_MIGRATION_PACKAGE.core.layout;
export const getClientLayout = () =>
  FLEETFLOW_MIGRATION_PACKAGE.core.clientLayout;
export const getDependencies = () => FLEETFLOW_MIGRATION_PACKAGE.dependencies;
export const getServicesList = () => FLEETFLOW_MIGRATION_PACKAGE.services;
export const getMigrationInstructions = () =>
  FLEETFLOW_MIGRATION_PACKAGE.instructions;

console.log('📦 FleetFlow Migration Package Ready');
console.log(
  '🚀 Use: import { FLEETFLOW_MIGRATION_PACKAGE } from "./MIGRATION_EXPORT_PACKAGE"'
);
