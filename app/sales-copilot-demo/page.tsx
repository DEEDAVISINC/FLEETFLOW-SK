/**
 * Sales Copilot AI Demo Page
 * Demonstrates real-time sales guidance capabilities
 */

'use client';

import { useState } from 'react';
import { SalesCopilotPanel } from '../components/SalesCopilotPanel';

export default function SalesCopilotDemo() {
  const [currentCallId, setCurrentCallId] = useState<string>('');
  const [isDemoActive, setIsDemoActive] = useState(false);

  const startDemo = () => {
    const callId = `demo_call_${Date.now()}`;
    setCurrentCallId(callId);
    setIsDemoActive(true);
  };

  const endDemo = () => {
    setCurrentCallId('');
    setIsDemoActive(false);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Sales Copilot AI Demo
          </h1>
          <p className='text-lg text-gray-600'>
            Experience real-time sales guidance that rivals yurp.ai with
            DEPOINTE AI staff expertise
          </p>
        </div>

        {/* Demo Controls */}
        <div className='mb-8 rounded-lg border bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>
            Demo Controls
          </h2>

          {!isDemoActive ? (
            <div>
              <p className='mb-4 text-gray-600'>
                Start a demo call to see real-time sales guidance in action. The
                system will provide:
              </p>
              <ul className='mb-6 list-inside list-disc space-y-1 text-gray-600'>
                <li>
                  <strong>Discovery Questions:</strong> Intelligent probing
                  questions based on prospect responses
                </li>
                <li>
                  <strong>Objection Handling:</strong> Psychology-based
                  responses using DEPOINTE AI staff expertise
                </li>
                <li>
                  <strong>FAQ Answers:</strong> Instant answers to common
                  transportation logistics questions
                </li>
                <li>
                  <strong>Deal Closing:</strong> Proven closing scripts and
                  techniques
                </li>
                <li>
                  <strong>Transportation Intelligence:</strong> Market data and
                  industry insights from FreightBrainAI
                </li>
              </ul>

              <button
                onClick={startDemo}
                className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
              >
                🚀 Start Demo Call
              </button>
            </div>
          ) : (
            <div>
              <div className='mb-4 flex items-center space-x-2'>
                <div className='h-3 w-3 animate-pulse rounded-full bg-green-500'></div>
                <span className='font-medium text-green-700'>
                  Demo Call Active
                </span>
                <span className='text-gray-500'>({currentCallId})</span>
              </div>

              <p className='mb-4 text-gray-600'>
                Use the conversation input below to simulate a sales call. Try
                phrases like:
              </p>

              <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 font-medium text-gray-900'>
                    Discovery Triggers:
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• "I'm spending too much on shipping"</li>
                    <li>• "My current carrier is unreliable"</li>
                    <li>• "I need to reduce logistics costs"</li>
                  </ul>
                </div>
                <div>
                  <h4 className='mb-2 font-medium text-gray-900'>
                    Objection Triggers:
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• "Your prices are too high"</li>
                    <li>• "I'm happy with my current provider"</li>
                    <li>• "I don't have time for this right now"</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={endDemo}
                className='rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700'
              >
                🏁 End Demo Call
              </button>
            </div>
          )}
        </div>

        {/* Sales Copilot Panel */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <SalesCopilotPanel
              agentId='demo_agent'
              currentCallId={currentCallId}
              className='h-fit'
            />
          </div>

          {/* Feature Showcase */}
          <div className='space-y-6'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                🎯 Key Features
              </h3>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100'>
                    <span className='text-sm text-blue-600'>🔍</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      Discovery Intelligence
                    </h4>
                    <p className='text-sm text-gray-600'>
                      Asks the right questions at the right time based on
                      prospect responses
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                    <span className='text-sm text-green-600'>🛡️</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      Objection Handling
                    </h4>
                    <p className='text-sm text-gray-600'>
                      Psychology-based responses using Resistance Removal Sales
                      System
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100'>
                    <span className='text-sm text-yellow-600'>💡</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Instant FAQ</h4>
                    <p className='text-sm text-gray-600'>
                      Real-time answers to common transportation and logistics
                      questions
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100'>
                    <span className='text-sm text-purple-600'>🎯</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Deal Closing</h4>
                    <p className='text-sm text-gray-600'>
                      Proven closing techniques and scripts tailored to
                      transportation sales
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                🤖 AI Staff Integration
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                    <span className='text-orange-600'>🎯</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Desiree</h4>
                    <p className='text-sm text-gray-600'>
                      Desperate Prospects Specialist
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <span className='text-blue-600'>⛰️</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Cliff</h4>
                    <p className='text-sm text-gray-600'>
                      Desperate Prospects Hunter
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                    <span className='text-green-600'>📈</span>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Gary</h4>
                    <p className='text-sm text-gray-600'>
                      Lead Generation Specialist
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                🚀 Production Ready
              </h3>
              <p className='mb-4 text-sm text-gray-600'>
                This system is designed for production use with:
              </p>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• Real-time WebSocket guidance delivery</li>
                <li>• Integration with FreeSWITCH call center</li>
                <li>• Performance tracking and analytics</li>
                <li>• Adaptive learning from successful calls</li>
                <li>• Transportation industry intelligence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


