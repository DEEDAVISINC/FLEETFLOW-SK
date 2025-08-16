'use client';

// UI Preferences and Customization Service for Broker Dashboard
export interface DashboardLayout {
  id: string;
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  sidebarCollapsed: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'feed' | 'quick-action';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  data?: any;
  config?: any;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'data';
}

export interface HelpTooltip {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'focus';
}

export interface UIPreferences {
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  animationsEnabled: boolean;
  tooltipsEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
  dashboardLayout: DashboardLayout;
  favoriteActions: string[];
  recentlyUsed: string[];
}

export class BrokerUIPreferencesService {
  private static instance: BrokerUIPreferencesService;
  private preferences: Map<string, UIPreferences> = new Map();
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private tooltips: Map<string, HelpTooltip> = new Map();
  private changeListeners: ((prefs: UIPreferences) => void)[] = [];

  public static getInstance(): BrokerUIPreferencesService {
    if (!BrokerUIPreferencesService.instance) {
      BrokerUIPreferencesService.instance = new BrokerUIPreferencesService();
    }
    return BrokerUIPreferencesService.instance;
  }

  constructor() {
    this.initializeShortcuts();
    this.initializeTooltips();
    this.setupEventListeners();
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(brokerId: string): Promise<UIPreferences> {
    let prefs = this.preferences.get(brokerId);

    if (!prefs) {
      // Load from localStorage or API
      const stored = this.loadFromStorage(brokerId);
      if (stored) {
        prefs = stored;
      } else {
        prefs = this.getDefaultPreferences();
      }
      this.preferences.set(brokerId, prefs);
    }

    return prefs;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    brokerId: string,
    updates: Partial<UIPreferences>
  ): Promise<void> {
    const current = await this.getUserPreferences(brokerId);
    const updated = { ...current, ...updates };

    this.preferences.set(brokerId, updated);
    this.saveToStorage(brokerId, updated);

    // Notify listeners
    this.changeListeners.forEach((listener) => listener(updated));
  }

  /**
   * Get dashboard layout
   */
  async getDashboardLayout(brokerId: string): Promise<DashboardLayout> {
    const prefs = await this.getUserPreferences(brokerId);
    return prefs.dashboardLayout;
  }

  /**
   * Update dashboard layout
   */
  async updateDashboardLayout(
    brokerId: string,
    layout: Partial<DashboardLayout>
  ): Promise<void> {
    const prefs = await this.getUserPreferences(brokerId);
    const updatedLayout = { ...prefs.dashboardLayout, ...layout };

    await this.updatePreferences(brokerId, {
      dashboardLayout: updatedLayout,
    });
  }

  /**
   * Toggle theme
   */
  async toggleTheme(brokerId: string): Promise<'light' | 'dark'> {
    const prefs = await this.getUserPreferences(brokerId);
    const newTheme = prefs.theme === 'dark' ? 'light' : 'dark';

    await this.updatePreferences(brokerId, { theme: newTheme });
    this.applyTheme(newTheme);

    return newTheme;
  }

  /**
   * Add widget to dashboard
   */
  async addWidget(brokerId: string, widget: DashboardWidget): Promise<void> {
    const layout = await this.getDashboardLayout(brokerId);
    const updatedWidgets = [...layout.widgets, widget];

    await this.updateDashboardLayout(brokerId, {
      widgets: updatedWidgets,
    });
  }

  /**
   * Remove widget from dashboard
   */
  async removeWidget(brokerId: string, widgetId: string): Promise<void> {
    const layout = await this.getDashboardLayout(brokerId);
    const updatedWidgets = layout.widgets.filter((w) => w.id !== widgetId);

    await this.updateDashboardLayout(brokerId, {
      widgets: updatedWidgets,
    });
  }

  /**
   * Update widget position
   */
  async updateWidgetPosition(
    brokerId: string,
    widgetId: string,
    position: { x: number; y: number; w: number; h: number }
  ): Promise<void> {
    const layout = await this.getDashboardLayout(brokerId);
    const updatedWidgets = layout.widgets.map((w) =>
      w.id === widgetId ? { ...w, position } : w
    );

    await this.updateDashboardLayout(brokerId, {
      widgets: updatedWidgets,
    });
  }

  /**
   * Get keyboard shortcuts
   */
  getKeyboardShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Register keyboard shortcut
   */
  registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.set(shortcut.key, shortcut);
  }

  /**
   * Get help tooltips
   */
  getHelpTooltips(): HelpTooltip[] {
    return Array.from(this.tooltips.values());
  }

  /**
   * Register help tooltip
   */
  registerTooltip(tooltip: HelpTooltip): void {
    this.tooltips.set(tooltip.id, tooltip);
  }

  /**
   * Add change listener
   */
  addChangeListener(listener: (prefs: UIPreferences) => void): void {
    this.changeListeners.push(listener);
  }

  /**
   * Remove change listener
   */
  removeChangeListener(listener: (prefs: UIPreferences) => void): void {
    const index = this.changeListeners.indexOf(listener);
    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  }

  /**
   * Export preferences for backup
   */
  async exportPreferences(brokerId: string): Promise<string> {
    const prefs = await this.getUserPreferences(brokerId);
    return JSON.stringify(prefs, null, 2);
  }

  /**
   * Import preferences from backup
   */
  async importPreferences(brokerId: string, data: string): Promise<void> {
    try {
      const prefs = JSON.parse(data) as UIPreferences;
      await this.updatePreferences(brokerId, prefs);
    } catch (error) {
      throw new Error('Invalid preferences data format');
    }
  }

  /**
   * Reset to defaults
   */
  async resetToDefaults(brokerId: string): Promise<void> {
    const defaults = this.getDefaultPreferences();
    this.preferences.set(brokerId, defaults);
    this.saveToStorage(brokerId, defaults);

    // Notify listeners
    this.changeListeners.forEach((listener) => listener(defaults));
  }

  // Private helper methods

  private getDefaultPreferences(): UIPreferences {
    return {
      theme: 'light',
      compactMode: false,
      animationsEnabled: true,
      tooltipsEnabled: true,
      keyboardShortcutsEnabled: true,
      dashboardLayout: {
        id: 'default',
        widgets: this.getDefaultWidgets(),
        theme: 'light',
        compactMode: false,
        sidebarCollapsed: false,
      },
      favoriteActions: [],
      recentlyUsed: [],
    };
  }

  private getDefaultWidgets(): DashboardWidget[] {
    return [
      {
        id: 'revenue-metric',
        type: 'metric',
        title: 'Monthly Revenue',
        position: { x: 0, y: 0, w: 3, h: 2 },
        visible: true,
        config: { showTrend: true, showPercentage: true },
      },
      {
        id: 'win-rate-metric',
        type: 'metric',
        title: 'Win Rate',
        position: { x: 3, y: 0, w: 3, h: 2 },
        visible: true,
        config: { showTrend: true, showPercentage: true },
      },
      {
        id: 'active-loads-metric',
        type: 'metric',
        title: 'Active Loads',
        position: { x: 6, y: 0, w: 3, h: 2 },
        visible: true,
        config: { showTrend: false, showPercentage: false },
      },
      {
        id: 'performance-chart',
        type: 'chart',
        title: 'Performance Trends',
        position: { x: 0, y: 2, w: 6, h: 4 },
        visible: true,
        config: { chartType: 'line', timeRange: '30d' },
      },
      {
        id: 'recent-activity',
        type: 'feed',
        title: 'Recent Activity',
        position: { x: 6, y: 2, w: 3, h: 4 },
        visible: true,
        config: { itemCount: 10, showTimestamps: true },
      },
    ];
  }

  private loadFromStorage(brokerId: string): UIPreferences | null {
    try {
      const stored = localStorage.getItem(`broker-ui-prefs-${brokerId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading preferences from storage:', error);
      return null;
    }
  }

  private saveToStorage(brokerId: string, prefs: UIPreferences): void {
    try {
      localStorage.setItem(
        `broker-ui-prefs-${brokerId}`,
        JSON.stringify(prefs)
      );
    } catch (error) {
      console.error('Error saving preferences to storage:', error);
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private initializeShortcuts(): void {
    // Navigation shortcuts
    this.registerShortcut({
      key: 'g o',
      description: 'Go to Overview',
      action: () => this.navigateToTab('quotes-workflow'),
      category: 'navigation',
    });

    this.registerShortcut({
      key: 'g l',
      description: 'Go to Loads & Bidding',
      action: () => this.navigateToTab('loads-bids'),
      category: 'navigation',
    });

    this.registerShortcut({
      key: 'g a',
      description: 'Go to Analytics',
      action: () => this.navigateToTab('analytics'),
      category: 'navigation',
    });

    this.registerShortcut({
      key: 'g i',
      description: 'Go to AI Intelligence',
      action: () => this.navigateToTab('ai-intelligence'),
      category: 'navigation',
    });

    // Action shortcuts
    this.registerShortcut({
      key: 'n l',
      description: 'New Load',
      action: () => this.triggerAction('new-load'),
      category: 'actions',
    });

    this.registerShortcut({
      key: 'n q',
      description: 'New Quote',
      action: () => this.triggerAction('new-quote'),
      category: 'actions',
    });

    this.registerShortcut({
      key: 's',
      description: 'Search',
      action: () => this.triggerAction('search'),
      category: 'actions',
    });

    this.registerShortcut({
      key: 'r',
      description: 'Refresh Data',
      action: () => this.triggerAction('refresh'),
      category: 'data',
    });

    // Theme shortcuts
    this.registerShortcut({
      key: 't',
      description: 'Toggle Theme',
      action: () => this.triggerAction('toggle-theme'),
      category: 'actions',
    });

    // Help shortcuts
    this.registerShortcut({
      key: '?',
      description: 'Show Help',
      action: () => this.triggerAction('show-help'),
      category: 'actions',
    });
  }

  private initializeTooltips(): void {
    this.registerTooltip({
      id: 'revenue-metric',
      target: '[data-tooltip="revenue-metric"]',
      title: 'Monthly Revenue',
      content:
        'Total revenue generated this month including all completed loads, bonuses, and additional services.',
      position: 'bottom',
      trigger: 'hover',
    });

    this.registerTooltip({
      id: 'win-rate',
      target: '[data-tooltip="win-rate"]',
      title: 'Win Rate',
      content:
        'Percentage of submitted bids that resulted in awarded loads. Higher rates indicate better pricing strategy.',
      position: 'bottom',
      trigger: 'hover',
    });

    this.registerTooltip({
      id: 'ai-intelligence',
      target: '[data-tooltip="ai-intelligence"]',
      title: 'AI Intelligence Hub',
      content:
        'Access smart load matching, predictive analytics, risk scoring, and automated optimization recommendations.',
      position: 'left',
      trigger: 'hover',
    });

    this.registerTooltip({
      id: 'load-matching',
      target: '[data-tooltip="load-matching"]',
      title: 'Smart Load Matching',
      content:
        'AI-powered system that analyzes your performance history, carrier network, and market conditions to suggest optimal load opportunities.',
      position: 'top',
      trigger: 'click',
    });
  }

  private setupEventListeners(): void {
    // Only set up event listeners on the client side
    if (typeof window === 'undefined') return;

    // Keyboard shortcut handling
    document.addEventListener('keydown', (event) => {
      const activePrefs = Array.from(this.preferences.values())[0]; // Get first user prefs
      if (!activePrefs?.keyboardShortcutsEnabled) return;

      // Handle multi-key shortcuts
      this.handleKeyboardShortcut(event);
    });

    // Theme detection
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        // Auto theme users will get system theme
        Array.from(this.preferences.entries()).forEach(([brokerId, prefs]) => {
          if (prefs.theme === 'auto') {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      });
    }
  }

  private navigateToTab(tabId: string): void {
    // Emit custom event for tab navigation
    const event = new CustomEvent('navigate-to-tab', { detail: { tabId } });
    document.dispatchEvent(event);
  }

  private triggerAction(actionId: string): void {
    // Emit custom event for actions
    const event = new CustomEvent('trigger-action', { detail: { actionId } });
    document.dispatchEvent(event);
  }

  private keySequence: string[] = [];
  private keyTimeout: NodeJS.Timeout | null = null;

  private handleKeyboardShortcut(event: KeyboardEvent): void {
    // Skip if typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    // Build key sequence
    const key = event.key.toLowerCase();
    this.keySequence.push(key);

    // Clear timeout and set new one
    if (this.keyTimeout) {
      clearTimeout(this.keyTimeout);
    }

    this.keyTimeout = setTimeout(() => {
      this.keySequence = [];
    }, 1000); // 1 second timeout for multi-key sequences

    // Check for matching shortcuts
    const sequence = this.keySequence.join(' ');
    const shortcut = this.shortcuts.get(sequence);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
      this.keySequence = [];
      if (this.keyTimeout) {
        clearTimeout(this.keyTimeout);
      }
    }
  }
}

// Export singleton instance
export const brokerUIPreferencesService =
  BrokerUIPreferencesService.getInstance();
