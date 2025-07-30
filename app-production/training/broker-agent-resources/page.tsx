'use client'

import { useState } from 'react'
import { ArrowLeft, Download, Play, FileText, Video, Clipboard } from 'lucide-react'
import Link from 'next/link'

export default function BrokerAgentResourcesPage() {
  const [activeTab, setActiveTab] = useState('sales-scripts')

  const tabs = [
    { id: 'sales-scripts', label: 'Sales Scripts', icon: '🎯' },
    { id: 'rfx-process', label: 'RFx Mastery', icon: '📋' },
    { id: 'compliance', label: 'Regulatory Guide', icon: '⚖️' },
    { id: 'objection-handling', label: 'Objection Handling', icon: '💬' },
    { id: 'market-intelligence', label: 'Market Intelligence', icon: '📊' }
  ]

  const salesScripts = [
    {
      title: "Initial Prospect Qualification Call",
      script: `"Hi [Name], this is [Your Name] from FleetFlow. I understand you ship freight regularly. I'm calling to see if we might be able to help improve your shipping operations.

      Can you tell me about your current shipping challenges?
      
      [Listen actively, then ask:]
      
      • What's your biggest frustration with your current freight setup?
      • How often do you deal with capacity issues or service failures?
      • What would ideal freight service look like for your business?
      
      [Based on their responses, transition to value proposition]"`
    },
    {
      title: "Handling the 'We Already Have a Broker' Objection",
      script: `"I completely understand - many successful companies work with existing brokers. That's actually why I'm calling.

      Can I ask - are there any service gaps or challenges you experience with your current setup? Perhaps during peak seasons or with specific lanes?
      
      What I find is that even companies with great primary brokers often benefit from a backup relationship for:
      • Emergency coverage situations
      • Capacity during peak periods  
      • Competitive rate benchmarking
      • Specialized equipment needs
      
      Would it make sense to explore how we could complement your existing setup?"`
    },
    {
      title: "Value-Based Pricing Conversation",
      script: `"I understand price is important. Let me ask you this - what does a delayed shipment or service failure typically cost your business?

      [Listen to their response, then:]
      
      Here's what our service includes for that rate:
      • Real-time tracking and proactive communication
      • Vetted carrier network with 99.2% on-time performance
      • Dedicated account management
      • Emergency coverage and problem resolution
      
      When you factor in the cost of delays, customer complaints, and management time, what's more expensive - a slightly higher freight rate or the disruption from service failures?"`
    }
  ]

  const rfxContent = [
    {
      title: "RFQ (Request for Quote) Best Practices",
      content: [
        "Gather complete freight details before quoting",
        "Confirm pickup/delivery requirements and timing",
        "Identify any special handling or equipment needs",
        "Understand customer's service priorities vs. price sensitivity",
        "Provide detailed quote breakdown with value justification"
      ]
    },
    {
      title: "RFP (Request for Proposal) Response Strategy",
      content: [
        "Analyze customer's current pain points and service gaps",
        "Develop comprehensive service solution beyond just pricing",
        "Include technology capabilities and reporting features",
        "Provide references and case studies from similar customers",
        "Present clear implementation timeline and onboarding process"
      ]
    }
  ]

  const complianceGuide = [
    {
      title: "Broker Authority Requirements",
      content: [
        "FMCSA Property Broker Authority (MC Number)",
        "BMC-84 Surety Bond ($75,000) or Trust Fund",
        "Process Agent designation in each state",
        "Biennial Update filing (BOC-3)",
        "Annual UCR registration"
      ]
    },
    {
      title: "Insurance Requirements",
      content: [
        "General Liability: Minimum $1M per occurrence",
        "Contingent Cargo: $100,000 minimum coverage",
        "Errors & Omissions: Professional liability protection",
        "Cyber Liability: Data breach and system failure coverage",
        "Auto Liability: If operating company vehicles"
      ]
    },
    {
      title: "Carrier Vetting Requirements",
      content: [
        "Valid Operating Authority verification",
        "Insurance certificate validation ($1M Auto Liability minimum)",
        "CSA Safety rating and BASIC scores review",
        "Credit and payment history assessment",
        "Equipment inspection and maintenance records"
      ]
    }
  ]

  const objectionHandling = [
    {
      objection: "Your price is too high",
      response: "I understand price is a key consideration. Can you help me understand what specific value you need to see to justify the investment? Let me break down what drives our pricing and see where we might find alternatives that work for your budget."
    },
    {
      objection: "We need to think about it",
      response: "I completely understand - this is an important decision. To help you in your evaluation, can you share what specific concerns or questions you have? I'd rather address those now than leave you with uncertainty."
    },
    {
      objection: "We're happy with our current provider",
      response: "That's great to hear! Maintaining good relationships is important. Even with a strong primary provider, many companies find value in having a backup relationship. What would you need to see from an alternative provider to consider them for specific situations?"
    }
  ]

  const marketIntelligence = [
    {
      title: "Rate Analysis Factors",
      content: [
        "Seasonal demand patterns and capacity fluctuations",
        "Lane-specific market conditions and competition",
        "Equipment availability and specialized requirements",
        "Fuel costs and economic indicators impact",
        "Regulatory changes affecting pricing"
      ]
    },
    {
      title: "Competitive Positioning",
      content: [
        "Service differentiation beyond pricing",
        "Technology capabilities and reporting",
        "Geographic coverage and carrier network",
        "Customer service and account management",
        "Industry expertise and specialized services"
      ]
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'sales-scripts':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-4">🎯 Sales Accelerator Scripts</h3>
              <p className="text-orange-700">
                Proven scripts and conversation frameworks for freight broker agents. Each script includes real-world 
                language patterns that build trust, uncover needs, and drive decisions.
              </p>
            </div>
            
            {salesScripts.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Clipboard className="w-5 h-5 mr-2 text-orange-500" />
                  {item.title}
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                    {item.script}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'rfx-process':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">📋 RFx Process Mastery</h3>
              <p className="text-blue-700">
                Master the art of responding to RFQs, RFPs, and RFIs with strategic approaches that win business 
                and build long-term partnerships.
              </p>
            </div>
            
            {rfxContent.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      
      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">⚖️ Regulatory Compliance Guide</h3>
              <p className="text-green-700">
                Essential regulatory requirements and compliance standards for freight broker operations. 
                Stay legally compliant and protect your business.
              </p>
            </div>
            
            {complianceGuide.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      
      case 'objection-handling':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4">💬 Objection Handling Mastery</h3>
              <p className="text-purple-700">
                Professional responses to common customer objections. Turn resistance into opportunity 
                with proven conversation techniques.
              </p>
            </div>
            
            {objectionHandling.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-red-600 mb-3">
                  Objection: "{item.objection}"
                </h4>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-2">Professional Response:</h5>
                  <p className="text-green-700 italic">"{item.response}"</p>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'market-intelligence':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">📊 Market Intelligence & Pricing</h3>
              <p className="text-indigo-700">
                Strategic market analysis and competitive intelligence tools for informed decision-making 
                and competitive positioning.
              </p>
            </div>
            
            {marketIntelligence.map((section, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/training" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Training
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Freight Broker Agent Resources</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
