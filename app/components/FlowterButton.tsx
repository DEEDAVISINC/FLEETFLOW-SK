'use client';

import React, { useState } from 'react';

interface FlowterButtonProps {
  onOpen: () => void;
}

const FlowterButton: React.FC<FlowterButtonProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <button
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: isHovered ? '#be185d' : '#ec4899',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'white',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
        title='Flowter - Your AI assistant for FleetFlow guidance'
      >
        🤖
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0px',
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
          }}
        >
          Flowter AI
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '20px',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1f2937',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FlowterButton;


















