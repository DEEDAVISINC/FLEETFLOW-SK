'use client';

import { useState } from 'react';

interface AIAgentSetupProps {
  onComplete?: () => void;
  className?: string;
}

export default function AIAgentSetup({
  onComplete,
  className = '',
}: AIAgentSetupProps) {
  const [selectedAgent, setSelectedAgent] = useState('dispatcher');

  const agentTypes = [
    {
      id: 'dispatcher',
      name: 'AI Dispatcher',
      description: 'Handles load assignments and carrier coordination',
      icon: '🎯',
    },
    {
      id: 'broker',
      name: 'AI Broker',
      description: 'Manages freight brokerage and customer relations',
      icon: '🤝',
    },
    {
      id: 'support',
      name: 'AI Support',
      description: 'Provides customer support and issue resolution',
      icon: '🛠️',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className='text-lg font-semibold text-gray-900'>AI Agent Setup</h3>
        <p className='text-gray-600'>
          Select your preferred AI agent configuration
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {agentTypes.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedAgent === agent.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className='mb-2 text-2xl'>{agent.icon}</div>
            <h4 className='font-medium text-gray-900'>{agent.name}</h4>
            <p className='text-sm text-gray-600'>{agent.description}</p>
          </div>
        ))}
      </div>

      {onComplete && (
        <button
          onClick={onComplete}
          className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
        >
          Continue Setup
        </button>
      )}
    </div>
  );
}
