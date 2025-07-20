'use client';

import React, { useState } from 'react';

interface TrainingDashboardProps {
  onStartTraining: (userName: string, userRole: 'dispatcher' | 'broker') => void;
}

export const CarrierOnboardWorkflowTrainingDashboard: React.FC<TrainingDashboardProps> = ({
  onStartTraining
}) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'dispatcher' | 'broker'>('all');

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '12px' 
        }}>
          🎓 Training Dashboard
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Monitor and manage training progress for the Carrier Onboard Workflow
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>25</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Total Trainees</div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>18</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Completed</div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>5</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>In Progress</div>
        </div>

        <div style={{
          background: 'rgba(107, 114, 128, 0.1)',
          border: '1px solid rgba(107, 114, 128, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>92%</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Average Score</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>Start New Training Session</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
          Assign training to dispatchers and brokers for the Carrier Onboard Workflow
        </p>
        
        <button
          onClick={() => onStartTraining('Demo User', 'dispatcher')}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '12px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
          }}
        >
          Start Training
        </button>
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          💡 <strong>Training Requirements:</strong> Dispatchers need 80%+ to pass • Brokers need 90%+ to pass • 
          Certificates valid for 12 months
        </p>
      </div>
    </div>
  );
};
