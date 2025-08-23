'use client';

import React, { useState } from 'react';

interface AIAgentSetupProps {
  onComplete?: () => void;
  className?: string;
}

export default function AIAgentSetup({ onComplete, className = '' }: AIAgentSetupProps) {
  const [selectedAgent, setSelectedAgent] = useState('dispatcher');

  const agentTypes = [
    {
      id: 'dispatcher',
      name: 'AI Dispatcher',
      description: 'Handles load assignments and carrier coordination',
      icon: '🎯'
    },
    {
      id: 'broker',
      name: 'AI Broker',
      description: 'Manages freight brokerage and customer relations',
      icon: '🤝'
    },
    {
      id: 'support',
      name: 'AI Support',
      description: 'Provides customer support and issue resolution',
      icon: '🛠️'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">AI Agent Setup</h3>
        <p className="text-gray-600">Select your preferred AI agent configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agentTypes.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAgent === agent.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{agent.icon}</div>
            <h4 className="font-medium text-gray-900">{agent.name}</h4>
            <p className="text-sm text-gray-600">{agent.description}</p>
          </div>
        ))}
      </div>

      {onComplete && (
        <button
          onClick={onComplete}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Setup
        </button>
      )}
    </div>
  );
}
