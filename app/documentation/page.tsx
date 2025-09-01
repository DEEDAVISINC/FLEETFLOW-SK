'use client';

import { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';

export default function DocumentationPage() {
  // Always call hook-using functions at the top
  const { user } = getCurrentUser();
  const hasManagementAccess = checkPermission('hasManagementAccess');

  const [selectedDoc, setSelectedDoc] = useState('user-guide');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Only redirect if we're in the browser and don't have access
    if (typeof window !== 'undefined' && !hasManagementAccess) {
      window.location.href = '/?error=access_denied';
      return;
    }
    setIsLoading(false);
  }, [hasManagementAccess]);

  // Show loading state initially
  if (isLoading) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>📚</div>
          <p>Loading Documentation...</p>
        </div>
      </div>
    );
  }

  // If no access, don't render anything (will redirect)
  if (!hasManagementAccess) {
    return (
      <div>
        <h1>Access Denied</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Documentation</h1>
    </div>
  );
}
