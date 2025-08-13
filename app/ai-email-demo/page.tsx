'use client';

import { Bot, Clock, Mail, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function AIEmailDemoPage() {
  const [emailId] = useState(`EMAIL-${Date.now()}`);
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [leadType, setLeadType] = useState('carrier_inquiry');
  const [tenantId, setTenantId] = useState('fleetflow-default');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [emailHistory, setEmailHistory] = useState<any[]>([]);

  const processEmail = async () => {
    if (!fromEmail || !message) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai/email-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailId,
          from: fromEmail,
          subject: subject || 'Freight Inquiry',
          message,
          leadType,
          tenantId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data);
        setEmailHistory((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            from: fromEmail,
            subject: subject || 'Freight Inquiry',
            originalMessage: message,
            aiResponse: data.emailResponse,
            voiceFollowup: data.voiceFollowup,
          },
        ]);

        // Clear form
        setFromEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      console.error('Email processing failed:', error);
    }

    setIsProcessing(false);
  };

  const sampleEmails = [
    {
      type: 'rate_quote',
      from: 'dispatch@fastfreight.com',
      subject: 'Quote Request - Chicago to Los Angeles',
      message:
        "Hi, need quote for 45,000 lbs electronics from Chicago, IL to Los Angeles, CA. Dry van, 53ft trailer required. Pickup Monday, delivery by Friday. Temperature controlled. What's your best all-in rate? MC-789456.",
    },
    {
      type: 'load_confirmation',
      from: 'john@abctrucking.com',
      subject: 'Confirm Load #FL-2024-12345',
      message:
        'Yes, we accept load FL-2024-12345. Pickup: Atlanta, GA tomorrow 8 AM. Delivery: Miami, FL Thursday 5 PM. Rate: $2,850 all-in confirmed. Driver: John Rodriguez, MC 123456. Please send rate confirmation and BOL.',
    },
    {
      type: 'capacity_inquiry',
      from: 'emergency@logistics.com',
      subject: 'URGENT - Need 3 Reefer Trucks',
      message:
        'URGENT capacity needed: 3 refrigerated trucks from Phoenix, AZ. Pickup: Tomorrow 6 AM. Delivery: Los Angeles, CA by Thursday. Temperature: 34-38°F maintained. Good paying loads, immediate booking. Can you help?',
    },
    {
      type: 'load_status',
      from: 'driver@abctrucking.com',
      subject: 'Load Status Update - FL-2024-12345',
      message:
        'Load FL-2024-12345 status update: Picked up on time at 8:15 AM from Atlanta. Currently in transit on I-75 South. ETA: Thursday 2:30 PM (ahead of schedule). Driver reports no issues.',
    },
    {
      type: 'document_request',
      from: 'dispatch@carrier.com',
      subject: 'Need BOL for Load FL-2024-12345',
      message:
        'Hi, need the Bill of Lading for load FL-2024-12345. Pickup scheduled for tomorrow morning. Also need rate confirmation for our records. Please email documents ASAP.',
    },
    {
      type: 'delivery_confirmation',
      from: 'john@abctrucking.com',
      subject: 'Load FL-2024-12345 Delivered',
      message:
        'Load FL-2024-12345 delivered successfully: Delivered Thursday 2:15 PM at Miami Distribution Center. POD signed by Maria Gonzalez. No damage, customer satisfied. Invoice will follow within 24 hours.',
    },
    {
      type: 'exception_management',
      from: 'driver@emergency.com',
      subject: 'URGENT - Breakdown Load FL-2024-12345',
      message:
        'URGENT: Truck breakdown on load FL-2024-12345. Location: I-75 Exit 234, Valdosta, GA. Issue: Engine overheating, tow truck called. ETA for repair: 4-6 hours. Need backup truck ASAP.',
    },
    {
      type: 'carrier_onboarding',
      from: 'owner@xyztransport.com',
      subject: 'New Carrier Application - MC 789123',
      message:
        'Hello, we would like to set up as a new carrier. Company: XYZ Transport LLC. MC: 789123, DOT: 456789. Equipment: 10 dry vans, 5 reefers. Coverage areas: Southeast and Texas. Please send onboarding requirements.',
    },
    {
      type: 'financial_inquiry',
      from: 'accounting@abctrucking.com',
      subject: 'Invoice Payment Status - INV-2024-5678',
      message:
        'Hi, checking on payment status for invoice INV-2024-5678. Amount: $2,850 for load FL-2024-12345. Invoice sent 25 days ago, payment terms Net 30. Need payment confirmation or expected date.',
    },
    {
      type: 'compliance_notification',
      from: 'safety@abctrucking.com',
      subject: 'Insurance Certificate Expiring',
      message:
        'NOTICE: Our insurance certificate expires in 15 days. Current policy expires January 31, 2024. New certificate will be sent by January 25th. No service interruption expected. Progressive Insurance, same coverage limits.',
    },
  ];

  const loadSampleEmail = (sample: (typeof sampleEmails)[0]) => {
    setFromEmail(sample.from);
    setSubject(sample.subject);
    setMessage(sample.message);
    setLeadType(sample.type);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-white'>
            📧 FleetFlow AI Email Automation
          </h1>
          <p className='text-lg text-white/70'>
            Better than Salesape.ai - Freight-specific email responses with
            voice integration
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Email Input Section */}
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-6 flex items-center gap-3'>
              <Mail className='h-6 w-6 text-blue-400' />
              <h2 className='text-xl font-semibold text-white'>
                Incoming Email Simulator
              </h2>
            </div>

            {/* Email Form */}
            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-white/80'>
                  From Email:
                </label>
                <input
                  type='email'
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder='carrier@trucking.com'
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white/80'>
                  Subject:
                </label>
                <input
                  type='text'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder='Available Capacity - MC-123456'
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white/80'>
                  Tenant Company:
                </label>
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                >
                  <option value='fleetflow-default'>FleetFlow (Default)</option>
                  <option value='tenant-demo-123'>
                    Demo Freight Solutions
                  </option>
                </select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white/80'>
                  Email Type:
                </label>
                <select
                  value={leadType}
                  onChange={(e) => setLeadType(e.target.value)}
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                >
                  <option value='carrier_inquiry'>Carrier Inquiry</option>
                  <option value='shipper_request'>Shipper Request</option>
                  <option value='rate_quote'>Rate Quote</option>
                  <option value='load_inquiry'>Load Inquiry</option>
                  <option value='general'>General Inquiry</option>
                </select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white/80'>
                  Email Message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Hi, this is John from ABC Trucking, MC-123456. We have available capacity...'
                  rows={6}
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                />
              </div>

              <button
                onClick={processEmail}
                disabled={isProcessing || !fromEmail || !message}
                className='flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/20 px-6 py-3 text-blue-300 transition-colors hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isProcessing ? (
                  <div className='h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent' />
                ) : (
                  <Send className='h-5 w-5' />
                )}
                {isProcessing ? 'Processing Email...' : 'Process with AI'}
              </button>
            </div>

            {/* Sample Emails */}
            <div className='mt-6'>
              <h3 className='mb-4 text-lg font-semibold text-white'>
                📝 Sample Emails:
              </h3>
              <div className='space-y-2'>
                {sampleEmails.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSampleEmail(sample)}
                    className='w-full rounded border border-white/10 bg-white/5 p-3 text-left text-sm text-white/70 transition-colors hover:bg-white/10'
                  >
                    <div className='font-medium text-white/90'>
                      {sample.subject}
                    </div>
                    <div className='mt-1 text-xs text-white/60'>
                      {sample.from}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Response Section */}
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-6 flex items-center gap-3'>
              <Bot className='h-6 w-6 text-green-400' />
              <h2 className='text-xl font-semibold text-white'>
                AI Email Response
              </h2>
            </div>

            {!aiResponse ? (
              <div className='py-12 text-center text-white/50'>
                <Mail className='mx-auto mb-4 h-12 w-12 text-white/30' />
                <p>Send an email to see AI response</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Response Preview */}
                <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4'>
                  <div className='mb-2 font-medium text-green-400'>
                    AI Generated Response:
                  </div>
                  <div className='mb-3 text-sm text-white/90'>
                    <strong>Subject:</strong> {aiResponse.emailResponse.subject}
                  </div>
                  <div className='whitespace-pre-wrap text-white/80'>
                    {aiResponse.emailResponse.message}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='rounded border border-blue-500/20 bg-blue-500/10 p-3'>
                    <div className='text-sm font-medium text-blue-400'>
                      Confidence
                    </div>
                    <div className='text-lg text-white'>
                      {Math.round(aiResponse.confidence * 100)}%
                    </div>
                  </div>
                  <div className='rounded border border-purple-500/20 bg-purple-500/10 p-3'>
                    <div className='text-sm font-medium text-purple-400'>
                      Priority
                    </div>
                    <div className='text-lg text-white capitalize'>
                      {aiResponse.emailResponse.priority}
                    </div>
                  </div>
                </div>

                {/* Quote Data (if available) */}
                {aiResponse.emailResponse.quoteData && (
                  <div className='rounded-lg border border-green-500/20 bg-green-500/10 p-4'>
                    <div className='mb-3 font-medium text-green-400'>
                      💰 Official Quote Generated:
                    </div>

                    {/* Quote Number & ID */}
                    <div className='mb-3 flex justify-between text-xs'>
                      <div className='text-white/60'>
                        Quote #:{' '}
                        <span className='font-mono text-green-300'>
                          {aiResponse.emailResponse.quoteData.quoteNumber}
                        </span>
                      </div>
                      <div className='text-white/60'>
                        Quote ID:{' '}
                        <span className='font-mono text-blue-300'>
                          {aiResponse.emailResponse.quoteData.quoteId}
                        </span>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                      <div className='text-center'>
                        <div className='text-white/60'>All-In Rate</div>
                        <div className='text-lg font-bold text-green-300'>
                          $
                          {aiResponse.emailResponse.quoteData.allInRate.toLocaleString()}
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-white/60'>Miles</div>
                        <div className='text-lg font-bold text-white'>
                          {aiResponse.emailResponse.quoteData.miles.toLocaleString()}
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-white/60'>Rate/Mile</div>
                        <div className='text-lg font-bold text-blue-300'>
                          ${aiResponse.emailResponse.quoteData.ratePerMile}
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-white/60'>Market Position</div>
                        <div className='text-sm font-medium text-yellow-300'>
                          {aiResponse.emailResponse.quoteData.marketPosition}
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 grid grid-cols-3 gap-2 text-xs'>
                      <div className='rounded bg-white/5 p-2 text-center'>
                        <div className='text-white/60'>Line Haul</div>
                        <div className='font-medium text-white'>
                          $
                          {aiResponse.emailResponse.quoteData.breakdown.lineHaul.toLocaleString()}
                        </div>
                      </div>
                      <div className='rounded bg-white/5 p-2 text-center'>
                        <div className='text-white/60'>Fuel Surcharge</div>
                        <div className='font-medium text-white'>
                          $
                          {aiResponse.emailResponse.quoteData.breakdown.fuelSurcharge.toLocaleString()}
                        </div>
                      </div>
                      <div className='rounded bg-white/5 p-2 text-center'>
                        <div className='text-white/60'>Accessorials</div>
                        <div className='font-medium text-white'>
                          $
                          {aiResponse.emailResponse.quoteData.breakdown.accessorials.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className='mt-3 text-center text-xs text-green-400'>
                      ✅ Quote saved to{' '}
                      {aiResponse.tenantInfo?.companyName || 'tenant'}'s quote
                      system - trackable via Quote Manager
                    </div>
                  </div>
                )}

                {/* Next Actions */}
                <div className='rounded border border-yellow-500/20 bg-yellow-500/10 p-4'>
                  <div className='mb-2 font-medium text-yellow-400'>
                    Next Actions:
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2 text-white/80'>
                      <Mail className='h-4 w-4' />
                      <span>Email sent automatically</span>
                    </div>
                    {aiResponse.voiceFollowup?.voiceCallScheduled && (
                      <div className='flex items-center gap-2 text-white/80'>
                        <Phone className='h-4 w-4' />
                        <span>
                          Voice call scheduled for{' '}
                          {aiResponse.emailResponse.followUpIn}
                        </span>
                      </div>
                    )}
                    <div className='flex items-center gap-2 text-white/80'>
                      <Clock className='h-4 w-4' />
                      <span>
                        Follow-up in {aiResponse.emailResponse.followUpIn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Processing Stats */}
                <div className='text-center text-xs text-white/50'>
                  ⚡ Processed in {aiResponse.processingTime} | Message ID:{' '}
                  {aiResponse.messageId}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email History */}
        {emailHistory.length > 0 && (
          <div className='mt-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='mb-4 text-xl font-semibold text-white'>
              📬 Email Processing History
            </h3>
            <div className='space-y-4'>
              {emailHistory.map((email, index) => (
                <div
                  key={index}
                  className='rounded border border-white/10 bg-white/5 p-4'
                >
                  <div className='mb-2 flex items-start justify-between'>
                    <div>
                      <div className='font-medium text-white'>
                        {email.subject}
                      </div>
                      <div className='text-sm text-white/60'>
                        From: {email.from} | {email.timestamp}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {email.voiceFollowup?.voiceCallScheduled && (
                        <div className='flex items-center gap-1 rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300'>
                          <Phone className='h-3 w-3' />
                          Voice Scheduled
                        </div>
                      )}
                      <div
                        className={`rounded px-2 py-1 text-xs ${
                          email.aiResponse.priority === 'urgent'
                            ? 'bg-red-500/20 text-red-300'
                            : email.aiResponse.priority === 'high'
                              ? 'bg-orange-500/20 text-orange-300'
                              : 'bg-green-500/20 text-green-300'
                        }`}
                      >
                        {email.aiResponse.priority}
                      </div>
                    </div>
                  </div>
                  <div className='text-sm text-white/70'>
                    <strong>AI Response:</strong> {email.aiResponse.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Comparison */}
        <div className='mt-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-semibold text-white'>
            🚀 FleetFlow vs Salesape.ai
          </h3>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h4 className='mb-3 font-medium text-red-400'>
                ❌ Salesape.ai Limitations:
              </h4>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>• Generic sales automation</li>
                <li>• No freight industry expertise</li>
                <li>• Email only - no voice integration</li>
                <li>• No FMCSA verification</li>
                <li>• No load management</li>
                <li>• $200-500/month cost</li>
              </ul>
            </div>
            <div>
              <h4 className='mb-3 font-medium text-green-400'>
                ✅ FleetFlow Advantages:
              </h4>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>• Freight-specific AI responses</li>
                <li>• Real-time FMCSA verification</li>
                <li>• Email + ElevenLabs voice integration</li>
                <li>• Load matching and rate quotes</li>
                <li>• Complete TMS platform included</li>
                <li>• $22/month ElevenLabs + platform</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Reference */}
        <div className='mt-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-semibold text-white'>
            🔧 API Integration
          </h3>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
            <div className='rounded border border-white/10 bg-white/5 p-3'>
              <div className='mb-2 font-medium text-blue-400'>
                Process Email
              </div>
              <div className='font-mono text-white/70'>
                POST /api/ai/email-automation
              </div>
              <div className='mt-1 text-white/50'>
                Automated email responses
              </div>
            </div>
            <div className='rounded border border-white/10 bg-white/5 p-3'>
              <div className='mb-2 font-medium text-green-400'>
                Email Metrics
              </div>
              <div className='font-mono text-white/70'>
                GET /api/ai/email-automation
              </div>
              <div className='mt-1 text-white/50'>Performance analytics</div>
            </div>
            <div className='rounded border border-white/10 bg-white/5 p-3'>
              <div className='mb-2 font-medium text-purple-400'>
                Voice Integration
              </div>
              <div className='font-mono text-white/70'>
                Email → Voice Pipeline
              </div>
              <div className='mt-1 text-white/50'>
                Automatic call scheduling
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
