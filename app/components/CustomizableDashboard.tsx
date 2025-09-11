'use client';

import {
  Download,
  Keyboard,
  Layout,
  Monitor,
  Moon,
  RotateCcw,
  Settings,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  DashboardWidget,
  HelpTooltip,
  KeyboardShortcut,
  UIPreferences,
  brokerUIPreferencesService,
} from '../services/BrokerUIPreferencesService';

interface CustomizableDashboardProps {
  brokerId: string;
  children: React.ReactNode;
  onTabChange?: (tabId: string) => void;
}

interface WidgetProps {
  widget: DashboardWidget;
  onUpdate: (widget: DashboardWidget) => void;
  onRemove: (widgetId: string) => void;
  isDragging: boolean;
  isEditing: boolean;
}

const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  brokerId,
  children,
  onTabChange,
}) => {
  const [preferences, setPreferences] = useState<UIPreferences | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [tooltips, setTooltips] = useState<HelpTooltip[]>([]);

  useEffect(() => {
    loadPreferences();
    loadShortcuts();
    loadTooltips();
    setupEventListeners();

    return () => {
      cleanupEventListeners();
    };
  }, [brokerId]);

  const loadPreferences = async () => {
    try {
      const prefs =
        await brokerUIPreferencesService.getUserPreferences(brokerId);
      setPreferences(prefs);
      applyTheme(prefs.theme);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadShortcuts = () => {
    const allShortcuts = brokerUIPreferencesService.getKeyboardShortcuts();
    setShortcuts(allShortcuts);
  };

  const loadTooltips = () => {
    const allTooltips = brokerUIPreferencesService.getHelpTooltips();
    setTooltips(allTooltips);
  };

  const setupEventListeners = () => {
    // Listen for navigation events
    document.addEventListener('navigate-to-tab', handleNavigateToTab);
    document.addEventListener('trigger-action', handleTriggerAction);

    // Listen for preference changes
    brokerUIPreferencesService.addChangeListener(handlePreferencesChange);
  };

  const cleanupEventListeners = () => {
    document.removeEventListener('navigate-to-tab', handleNavigateToTab);
    document.removeEventListener('trigger-action', handleTriggerAction);
    brokerUIPreferencesService.removeChangeListener(handlePreferencesChange);
  };

  const handleNavigateToTab = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (onTabChange) {
      onTabChange(customEvent.detail.tabId);
    }
  };

  const handleTriggerAction = async (event: Event) => {
    const customEvent = event as CustomEvent;
    const { actionId } = customEvent.detail;

    switch (actionId) {
      case 'toggle-theme':
        await toggleTheme();
        break;
      case 'show-help':
        setShowShortcuts(true);
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'new-load':
        // Trigger new load modal/form
        break;
      case 'new-quote':
        // Trigger new quote modal/form
        break;
      case 'search':
        // Focus search input
        const searchInput = document.querySelector(
          'input[type="search""]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        break;
    }
  };

  const handlePreferencesChange = (newPreferences: UIPreferences) => {
    setPreferences(newPreferences);
    applyTheme(newPreferences.theme);
  };

  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;

    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  const toggleTheme = async () => {
    if (!preferences) return;

    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(preferences.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    await brokerUIPreferencesService.updatePreferences(brokerId, {
      theme: nextTheme,
    });
  };

  const toggleCompactMode = async () => {
    if (!preferences) return;

    await brokerUIPreferencesService.updatePreferences(brokerId, {
      compactMode: !preferences.compactMode,
    });
  };

  const toggleAnimations = async () => {
    if (!preferences) return;

    await brokerUIPreferencesService.updatePreferences(brokerId, {
      animationsEnabled: !preferences.animationsEnabled,
    });
  };

  const toggleTooltips = async () => {
    if (!preferences) return;

    await brokerUIPreferencesService.updatePreferences(brokerId, {
      tooltipsEnabled: !preferences.tooltipsEnabled,
    });
  };

  const toggleKeyboardShortcuts = async () => {
    if (!preferences) return;

    await brokerUIPreferencesService.updatePreferences(brokerId, {
      keyboardShortcutsEnabled: !preferences.keyboardShortcutsEnabled,
    });
  };

  const exportPreferences = async () => {
    try {
      const data = await brokerUIPreferencesService.exportPreferences(brokerId);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `broker-preferences-${brokerId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting preferences:', error);
    }
  };

  const importPreferences = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await brokerUIPreferencesService.importPreferences(brokerId, text);
      loadPreferences();
    } catch (error) {
      console.error('Error importing preferences:', error);
      alert('Error importing preferences. Please check the file format.');
    }
  };

  const resetToDefaults = async () => {
    if (
      confirm(
        'Are you sure you want to reset all preferences to defaults? This cannot be undone.'
      )
    ) {
      try {
        await brokerUIPreferencesService.resetToDefaults(brokerId);
        loadPreferences();
      } catch (error) {
        console.error('Error resetting preferences:', error);
      }
    }
  };

  const getThemeIcon = () => {
    if (!preferences) return <Monitor className='h-4 w-4' />;

    switch (preferences.theme) {
      case 'light':
        return <Sun className='h-4 w-4' />;
      case 'dark':
        return <Moon className='h-4 w-4' />;
      case 'auto':
        return <Monitor className='h-4 w-4' />;
      default:
        return <Monitor className='h-4 w-4' />;
    }
  };

  if (!preferences) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500' />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        preferences.compactMode ? 'text-sm' : ''
      } ${preferences.animationsEnabled ? 'transition-all duration-300' : ''}`}
    >
      {/* Floating Control Panel */}
      <div className='fixed top-4 right-4 z-50 flex flex-col gap-2'>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className='rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'
          title={`Current theme: ${preferences.theme}`}
        >
          {getThemeIcon()}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className='rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'
          title='Dashboard Settings'
        >
          <Settings className='h-4 w-4' />
        </button>

        {/* Shortcuts Help */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className='rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'
          title='Keyboard Shortcuts (Press ? or click)'
        >
          <Keyboard className='h-4 w-4' />
        </button>

        {/* Customization Toggle */}
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`rounded-full border p-3 shadow-lg transition-all duration-200 hover:shadow-xl ${
            isCustomizing
              ? 'border-blue-600 bg-blue-500 text-white'
              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
          }`}
          title='Customize Dashboard Layout'
        >
          <Layout className='h-4 w-4' />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-xl dark:bg-gray-800'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Dashboard Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className='rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='space-y-6'>
                {/* Theme Settings */}
                <div>
                  <h3 className='mb-3 text-lg font-medium text-gray-900 dark:text-white'>
                    Theme
                  </h3>
                  <div className='flex gap-2'>
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'auto', label: 'Auto', icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() =>
                          brokerUIPreferencesService.updatePreferences(
                            brokerId,
                            { theme: value as any }
                          )
                        }
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                          preferences.theme === value
                            ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className='h-4 w-4' />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <h3 className='mb-3 text-lg font-medium text-gray-900 dark:text-white'>
                    Display Options
                  </h3>
                  <div className='space-y-3'>
                    <label className='flex items-center justify-between'>
                      <span className='text-gray-700 dark:text-gray-300'>
                        Compact Mode
                      </span>
                      <input
                        type='checkbox'
                        checked={preferences.compactMode}
                        onChange={toggleCompactMode}
                        className='h-4 w-4 rounded text-blue-600'
                      />
                    </label>
                    <label className='flex items-center justify-between'>
                      <span className='text-gray-700 dark:text-gray-300'>
                        Animations
                      </span>
                      <input
                        type='checkbox'
                        checked={preferences.animationsEnabled}
                        onChange={toggleAnimations}
                        className='h-4 w-4 rounded text-blue-600'
                      />
                    </label>
                    <label className='flex items-center justify-between'>
                      <span className='text-gray-700 dark:text-gray-300'>
                        Tooltips
                      </span>
                      <input
                        type='checkbox'
                        checked={preferences.tooltipsEnabled}
                        onChange={toggleTooltips}
                        className='h-4 w-4 rounded text-blue-600'
                      />
                    </label>
                    <label className='flex items-center justify-between'>
                      <span className='text-gray-700 dark:text-gray-300'>
                        Keyboard Shortcuts
                      </span>
                      <input
                        type='checkbox'
                        checked={preferences.keyboardShortcutsEnabled}
                        onChange={toggleKeyboardShortcuts}
                        className='h-4 w-4 rounded text-blue-600'
                      />
                    </label>
                  </div>
                </div>

                {/* Data Management */}
                <div>
                  <h3 className='mb-3 text-lg font-medium text-gray-900 dark:text-white'>
                    Data Management
                  </h3>
                  <div className='flex gap-3'>
                    <button
                      onClick={exportPreferences}
                      className='flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                    >
                      <Download className='h-4 w-4' />
                      Export
                    </button>
                    <label className='flex cursor-pointer items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'>
                      <Upload className='h-4 w-4' />
                      Import
                      <input
                        type='file'
                        accept='.json'
                        onChange={importPreferences}
                        className='hidden'
                      />
                    </label>
                    <button
                      onClick={resetToDefaults}
                      className='flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                    >
                      <RotateCcw className='h-4 w-4' />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-xl dark:bg-gray-800'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className='rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {['navigation', 'actions', 'data'].map((category) => (
                  <div key={category}>
                    <h3 className='mb-3 text-lg font-medium text-gray-900 capitalize dark:text-white'>
                      {category}
                    </h3>
                    <div className='space-y-2'>
                      {shortcuts
                        .filter((shortcut) => shortcut.category === category)
                        .map((shortcut, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700'
                          >
                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                              {shortcut.description}
                            </span>
                            <kbd className='rounded border bg-white px-2 py-1 font-mono text-xs dark:border-gray-500 dark:bg-gray-600'>
                              {shortcut.key}
                            </kbd>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Mode Overlay */}
      {isCustomizing && (
        <div className='fixed top-0 right-0 left-0 z-40 flex items-center justify-between bg-blue-600 p-3 text-white'>
          <div className='flex items-center gap-3'>
            <Layout className='h-5 w-5' />
            <span className='font-medium'>Customization Mode</span>
            <span className='text-sm text-blue-200'>
              Drag widgets to rearrange, click to configure
            </span>
          </div>
          <button
            onClick={() => setIsCustomizing(false)}
            className='rounded bg-blue-700 px-4 py-1 hover:bg-blue-800'
          >
            Done
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isCustomizing ? 'pt-16' : ''}`}>{children}</div>

      {/* Status Indicator */}
      <div className='fixed bottom-4 left-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
        <div
          className={`h-2 w-2 rounded-full ${
            preferences.theme === 'dark'
              ? 'bg-blue-500'
              : preferences.theme === 'light'
                ? 'bg-yellow-500'
                : 'bg-purple-500'
          }`}
        />
        <span>{preferences.theme} theme</span>
        {preferences.compactMode && <span>• compact</span>}
        {!preferences.animationsEnabled && <span>• no animations</span>}
      </div>
    </div>
  );
};

export default CustomizableDashboard;
