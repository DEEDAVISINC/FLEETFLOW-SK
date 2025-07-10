// Module color mapping for certificates
export interface ModuleColorScheme {
  primary: string
  secondary: string
  gradient: string
  accent: string
  light: string
  border: string
}

export const MODULE_COLOR_SCHEMES: Record<string, ModuleColorScheme> = {
  'dispatch': {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%)',
    accent: '#60a5fa',
    light: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)'
  },
  'broker': {
    primary: '#10b981',
    secondary: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
    accent: '#34d399',
    light: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)'
  },
  'compliance': {
    primary: '#f59e0b',
    secondary: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)',
    accent: '#fbbf24',
    light: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)'
  },
  'safety': {
    primary: '#ef4444',
    secondary: '#dc2626',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #ef4444 100%)',
    accent: '#f87171',
    light: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)'
  },
  'technology': {
    primary: '#9333ea',
    secondary: '#7c3aed',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #9333ea 100%)',
    accent: '#a855f7',
    light: 'rgba(147, 51, 234, 0.15)',
    border: 'rgba(147, 51, 234, 0.3)'
  },
  'customer': {
    primary: '#06b6d4',
    secondary: '#0891b2',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)',
    accent: '#22d3ee',
    light: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.3)'
  },
  'workflow': {
    primary: '#667eea',
    secondary: '#5a67d8',
    gradient: 'linear-gradient(135deg, #667eea 0%, #5a67d8 50%, #667eea 100%)',
    accent: '#7c3aed',
    light: 'rgba(102, 126, 234, 0.15)',
    border: 'rgba(102, 126, 234, 0.3)'
  },
  'sms-workflow': {
    primary: '#22c55e',
    secondary: '#16a34a',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
    accent: '#4ade80',
    light: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.3)'
  }
}

// Default color scheme (fallback)
export const DEFAULT_COLOR_SCHEME: ModuleColorScheme = {
  primary: '#3b82f6',
  secondary: '#1d4ed8',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  accent: '#60a5fa',
  light: 'rgba(59, 130, 246, 0.15)',
  border: 'rgba(59, 130, 246, 0.3)'
}

export function getModuleColorScheme(moduleId: string): ModuleColorScheme {
  return MODULE_COLOR_SCHEMES[moduleId] || DEFAULT_COLOR_SCHEME
}

export function extractModuleIdFromTitle(moduleTitle: string): string {
  // Extract module ID from title
  const titleMappings: Record<string, string> = {
    'Dispatch Operations': 'dispatch',
    'Freight Brokerage': 'broker',
    'DOT Compliance': 'compliance',
    'Safety Management': 'safety',
    'Technology Systems': 'technology',
    'Customer Service': 'customer',
    'Workflow Ecosystem': 'workflow',
    'SMS Notification System': 'sms-workflow'
  }
  
  // Find matching module
  for (const [title, id] of Object.entries(titleMappings)) {
    if (moduleTitle.includes(title)) {
      return id
    }
  }
  
  // Default fallback
  return 'dispatch'
}
