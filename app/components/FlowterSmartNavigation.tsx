/**
 * Flowter Smart Navigation Component
 * Handles intelligent navigation actions from Flowter AI
 */

'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface FlowterAction {
  type: 'navigate' | 'action' | 'help';
  label: string;
  url?: string;
  action?: string;
  description: string;
  icon: string;
}

export interface SelectionOption {
  label: string;
  description: string;
  action: string;
  relevanceScore?: number;
  icon?: string;
}

interface FlowterSmartNavigationProps {
  actions?: FlowterAction[];
  options?: SelectionOption[];
  onNavigate?: (url: string) => void;
  onClose?: () => void;
}

// ============================================================================
// SMART NAVIGATION COMPONENT
// ============================================================================

export const FlowterSmartNavigation: React.FC<FlowterSmartNavigationProps> = ({
  actions = [],
  options = [],
  onNavigate,
  onClose,
}) => {
  const router = useRouter();

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const handleNavigationAction = async (action: FlowterAction) => {
    console.log(`🚀 Flowter executing action:`, action);

    try {
      switch (action.type) {
        case 'navigate':
          if (action.url) {
            await navigateToPage(action.url);
          }
          break;

        case 'action':
          if (action.action) {
            await executeCustomAction(action.action);
          }
          break;

        case 'help':
          if (action.url) {
            await navigateToPage(action.url);
          }
          break;

        default:
          console.warn('Unknown action type:', action.type);
      }
    } catch (error) {
      console.error('❌ Navigation action failed:', error);
    }
  };

  const handleSelectionOption = async (option: SelectionOption) => {
    console.log(`🎯 Flowter executing selection:`, option);

    try {
      if (option.action.startsWith('navigate:')) {
        const url = option.action.replace('navigate:', '');
        await navigateToPage(url);
      } else {
        await executeCustomAction(option.action);
      }
    } catch (error) {
      console.error('❌ Selection action failed:', error);
    }
  };

  // ============================================================================
  // NAVIGATION HELPERS
  // ============================================================================

  const navigateToPage = async (url: string) => {
    console.log(`🔗 Navigating to: ${url}`);

    // Add small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Close Flowter modal
    if (onClose) {
      onClose();
    }

    // Navigate to the page
    router.push(url);

    // Call onNavigate callback if provided
    if (onNavigate) {
      onNavigate(url);
    }
  };

  const executeCustomAction = async (actionString: string) => {
    console.log(`⚙️ Executing custom action: ${actionString}`);

    const [actionType, actionValue] = actionString.split(':');

    switch (actionType) {
      case 'navigate':
        await navigateToPage(actionValue);
        break;

      case 'open-tab':
        // Open in new tab
        window.open(actionValue, '_blank');
        break;

      case 'scroll-to':
        // Scroll to element after navigation
        await navigateToPage(actionValue.split('#')[0]);
        setTimeout(() => {
          const elementId = actionValue.split('#')[1];
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
        break;

      case 'modal':
        // Open a specific modal (future enhancement)
        console.log(`📋 Opening modal: ${actionValue}`);
        break;

      case 'help':
        // Open help/tutorial
        await navigateToPage(`/training${actionValue}`);
        break;

      default:
        console.warn('Unknown custom action:', actionString);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderActionButton = (action: FlowterAction, index: number) => (
    <button
      key={index}
      onClick={() => handleNavigationAction(action)}
      className='group mb-2 flex w-full transform items-center gap-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 p-3 text-white transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700'
      style={{
        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
      }}
    >
      <span className='text-xl'>{action.icon}</span>
      <div className='flex-1 text-left'>
        <div className='font-semibold'>{action.label}</div>
        <div className='text-sm text-pink-100 opacity-90'>
          {action.description}
        </div>
      </div>
      <span className='text-pink-200 transition-colors duration-200 group-hover:text-white'>
        →
      </span>
    </button>
  );

  const renderSelectionOption = (option: SelectionOption, index: number) => (
    <button
      key={index}
      onClick={() => handleSelectionOption(option)}
      className='group mb-3 flex w-full transform items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:scale-102 hover:border-pink-300 hover:bg-gray-50'
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {option.icon && <span className='text-2xl'>{option.icon}</span>}
      <div className='flex-1'>
        <div className='font-semibold text-gray-900 transition-colors duration-200 group-hover:text-pink-600'>
          {option.label}
        </div>
        <div className='text-sm text-gray-600'>{option.description}</div>
        {option.relevanceScore && (
          <div className='mt-1 text-xs text-gray-400'>
            Relevance: {Math.round(option.relevanceScore)}%
          </div>
        )}
      </div>
      <span className='text-gray-400 transition-colors duration-200 group-hover:text-pink-500'>
        →
      </span>
    </button>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (actions.length === 0 && options.length === 0) {
    return null;
  }

  return (
    <div className='flowter-smart-navigation'>
      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className='mb-4'>
          <h4 className='mb-3 text-sm font-semibold text-gray-700'>
            Quick Actions:
          </h4>
          {actions.map(renderActionButton)}
        </div>
      )}

      {/* Selection Options */}
      {options.length > 0 && (
        <div className='mb-4'>
          <h4 className='mb-3 text-sm font-semibold text-gray-700'>
            Choose an option:
          </h4>
          <div className='max-h-64 overflow-y-auto'>
            {options.map(renderSelectionOption)}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {(actions.length > 0 || options.length > 0) && (
        <div className='mt-4 rounded-lg bg-gray-50 p-2 text-xs text-gray-500'>
          💡 <strong>Tip:</strong> You can also type commands like "go to
          dispatch" or "find routing" to navigate quickly.
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NAVIGATION ACTION UTILITIES
// ============================================================================

export class FlowterNavigationUtils {
  static createNavigationAction(
    label: string,
    url: string,
    description: string,
    icon: string = '🔗'
  ): FlowterAction {
    return {
      type: 'navigate',
      label,
      url,
      description,
      icon,
    };
  }

  static createCustomAction(
    label: string,
    action: string,
    description: string,
    icon: string = '⚙️'
  ): FlowterAction {
    return {
      type: 'action',
      label,
      action,
      description,
      icon,
    };
  }

  static createHelpAction(
    label: string,
    tutorialPath: string,
    description: string,
    icon: string = '📚'
  ): FlowterAction {
    return {
      type: 'help',
      label,
      url: tutorialPath,
      description,
      icon,
    };
  }

  static createSelectionOption(
    label: string,
    url: string,
    description: string,
    icon?: string,
    relevanceScore?: number
  ): SelectionOption {
    return {
      label,
      action: `navigate:${url}`,
      description,
      icon,
      relevanceScore,
    };
  }

  // Parse URL with query parameters and fragments
  static parseNavigationUrl(url: string): {
    path: string;
    params: Record<string, string>;
    fragment?: string;
  } {
    const [pathAndParams, fragment] = url.split('#');
    const [path, queryString] = pathAndParams.split('?');

    const params: Record<string, string> = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    return { path, params, fragment };
  }

  // Create URL with parameters
  static createNavigationUrl(
    path: string,
    params?: Record<string, string>,
    fragment?: string
  ): string {
    let url = path;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += '?' + searchParams.toString();
    }

    if (fragment) {
      url += '#' + fragment;
    }

    return url;
  }
}

export default FlowterSmartNavigation;
