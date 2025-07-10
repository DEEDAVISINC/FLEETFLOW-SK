// Example Implementation: Dashboard Component with Granular Access Control
'use client';

import React from 'react';
import { AccessControlled, PageAccess, FeatureAccess, useAccessControl } from '../utils/accessControl';
import { UserWithGranularPermissions } from '../config/granularAccess';

interface ExampleDashboardProps {
  user: UserWithGranularPermissions;
}

export default function ExampleDashboard({ user }: ExampleDashboardProps) {
  const accessControl = useAccessControl(user);

  // Early return if user cannot access dashboard at all
  if (!accessControl.canAccessPage('dashboard')) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Access Denied</h2>
        <p style={{ color: '#7f1d1d' }}>You do not have permission to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px', color: '#1f2937' }}>
        FleetFlow Dashboard - Granular Access Control Demo
      </h1>

      {/* User info with role and permissions */}
      <div style={{ 
        background: '#f3f4f6', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '24px' 
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Current User: {user.name}</h3>
        <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>Role: {user.role}</p>
        <p style={{ margin: '0', color: '#6b7280' }}>
          Permissions: {user.assignedPermissions?.join(', ') || 'None assigned'}
        </p>
      </div>

      {/* Revenue Metrics Section - Only visible to users with revenue permission */}
      <AccessControlled
        user={user}
        requiredPermission="dashboard.revenue"
        fallbackComponent={
          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #fbbf24',
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px' 
          }}>
            <p style={{ margin: 0, color: '#92400e' }}>
              💰 Revenue metrics are restricted. Contact admin for financial data access.
            </p>
          </div>
        }
      >
        <div style={{ 
          background: '#dcfce7', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#166534' }}>💰 Revenue Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>$125,450</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Monthly Revenue</div>
            </div>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>$18,200</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Weekly Revenue</div>
            </div>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>$2,840</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Daily Revenue</div>
            </div>
          </div>
        </div>
      </AccessControlled>

      {/* Load Management Section - Visible to dispatchers and managers */}
      <AccessControlled
        user={user}
        requiredPermissions={['dashboard.loads', 'dispatch.view']}
        fallbackComponent={
          <div style={{ 
            background: '#fee2e2', 
            border: '1px solid #fca5a5',
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px' 
          }}>
            <p style={{ margin: 0, color: '#dc2626' }}>
              🚛 Load management requires dispatch permissions.
            </p>
          </div>
        }
      >
        <div style={{ 
          background: '#dbeafe', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1e40af' }}>🚛 Load Management</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>24</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Active Loads</div>
            </div>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>12</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>In Transit</div>
            </div>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>8</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Pending Pickup</div>
            </div>
            <div style={{ background: 'white', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>4</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Delayed</div>
            </div>
          </div>
          
          {/* Action buttons with individual permission checks */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            {FeatureAccess.Buttons.canShowCreateButton(user, 'dashboard') && (
              <button style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Create New Load
              </button>
            )}
            
            {accessControl.can('dashboard.edit_status') && (
              <button style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Update Status
              </button>
            )}
            
            {FeatureAccess.Buttons.canShowExportButton(user, 'dashboard') && (
              <button style={{ 
                background: '#6b7280', 
                color: 'white', 
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Export Data
              </button>
            )}
          </div>
        </div>
      </AccessControlled>

      {/* Performance Charts - Manager/Admin only */}
      <AccessControlled
        user={user}
        requiredPermission="dashboard.performance"
        fallbackComponent={
          <div style={{ 
            background: '#f3f4f6', 
            border: '1px solid #d1d5db',
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>📊 Performance Analytics</h3>
            <p style={{ margin: 0, color: '#9ca3af' }}>
              Performance charts require manager-level access or higher.
            </p>
          </div>
        }
      >
        <div style={{ 
          background: '#fef3c7', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#92400e' }}>📊 Performance Analytics</h3>
          <div style={{ background: 'white', padding: '16px', borderRadius: '6px' }}>
            <p style={{ margin: 0, color: '#6b7280', textAlign: 'center' }}>
              📈 Performance charts and metrics would be displayed here
            </p>
          </div>
        </div>
      </AccessControlled>

      {/* Quick Actions Section - Role-based visibility */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #e5e7eb' 
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Training access for all users */}
          {PageAccess.Training.canView(user) && (
            <button style={{ 
              background: '#8b5cf6', 
              color: 'white', 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              🎓 FleetFlow University
            </button>
          )}

          {/* Analytics access for managers */}
          {FeatureAccess.Navigation.shouldShowAnalyticsMenu(user) && (
            <button style={{ 
              background: '#06b6d4', 
              color: 'white', 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              📈 Analytics
            </button>
          )}

          {/* Financial access for managers/admins */}
          {FeatureAccess.Navigation.shouldShowFinancialMenu(user) && (
            <button style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              💳 Financial
            </button>
          )}

          {/* Settings access for admins */}
          {FeatureAccess.Navigation.shouldShowSettingsMenu(user) && (
            <button style={{ 
              background: '#ef4444', 
              color: 'white', 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              ⚙️ Settings
            </button>
          )}
        </div>
      </div>

      {/* Debug Information - Admin only */}
      {accessControl.isAdmin() && (
        <div style={{ 
          background: '#1f2937', 
          color: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          marginTop: '20px',
          fontSize: '12px' 
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>🔧 Debug Information (Admin Only)</h4>
          <p style={{ margin: '0 0 4px 0' }}>User Role: {user.role}</p>
          <p style={{ margin: '0 0 4px 0' }}>Assigned Permissions: {JSON.stringify(user.assignedPermissions)}</p>
          <p style={{ margin: '0' }}>Access Control Status: Active</p>
        </div>
      )}
    </div>
  );
}
