// 🔔 Push Notification Service
// Handles push notifications for workflow alerts and dispatch messages

export interface NotificationPayload {
  id: string
  title: string
  message: string
  type: 'workflow' | 'dispatch' | 'emergency' | 'system' | 'load_update'
  priority: 'high' | 'medium' | 'low'
  timestamp: string
  data?: {
    loadId?: string
    stepId?: string
    actionUrl?: string
    driverId?: string
    [key: string]: any
  }
  requiresAction?: boolean
  expiresAt?: string
}

export interface NotificationSettings {
  workflowAlerts: boolean
  dispatchMessages: boolean
  emergencyAlerts: boolean
  systemUpdates: boolean
  loadUpdates: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export interface PushSubscription {
  endpoint: string
  expirationTime: number | null
  keys: {
    p256dh: string
    auth: string
  }
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private subscription: PushSubscription | null = null
  private settings: NotificationSettings = {
    workflowAlerts: true,
    dispatchMessages: true,
    emergencyAlerts: true,
    systemUpdates: true,
    loadUpdates: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '06:00'
    }
  }

  private listeners: Array<(notification: NotificationPayload) => void> = []
  private notificationQueue: NotificationPayload[] = []

  constructor() {
    this.initializeService()
  }

  private async initializeService() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notification_settings')
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) }
    }

    // Initialize service worker
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw-notifications.js')
        console.log('Notification service worker registered')
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    // Request permission
    await this.requestPermission()

    // Set up push subscription
    await this.setupPushSubscription()

    // Handle messages from service worker
    this.handleServiceWorkerMessages()
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Setup push subscription
  private async setupPushSubscription() {
    if (!this.registration) return

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI80Y1nNHiHqhCBdOGNiTLgXXrmfzJyXdD6gvpKGXdMCsQRJ4U5-rNrVvE'
        )
      })

      this.subscription = subscription
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)
    } catch (error) {
      console.error('Push subscription setup failed:', error)
    }
  }

  // Convert VAPID key
  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          driverId: this.getCurrentDriverId()
        })
      })
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
    }
  }

  // Handle service worker messages
  private handleServiceWorkerMessages() {
    if (!navigator.serviceWorker) return

    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data
      
      switch (type) {
        case 'NOTIFICATION_CLICKED':
          this.handleNotificationClick(data)
          break
        case 'NOTIFICATION_RECEIVED':
          this.handleNotificationReceived(data)
          break
      }
    })
  }

  // Handle notification click
  private handleNotificationClick(data: any) {
    const { notificationId, actionUrl } = data
    
    // Navigate to action URL if provided
    if (actionUrl) {
      window.open(actionUrl, '_blank')
    }
    
    // Mark notification as read
    this.markAsRead(notificationId)
  }

  // Handle notification received
  private handleNotificationReceived(notification: NotificationPayload) {
    // Add to queue
    this.notificationQueue.push(notification)
    
    // Notify listeners
    this.listeners.forEach(listener => listener(notification))
    
    // Show in-app notification if app is focused
    if (document.hasFocus()) {
      this.showInAppNotification(notification)
    }
  }

  // Send notification
  async sendNotification(notification: NotificationPayload): Promise<boolean> {
    try {
      // Check if notification type is enabled
      if (!this.isNotificationTypeEnabled(notification.type)) {
        return false
      }

      // Check quiet hours
      if (this.isQuietHours() && notification.priority !== 'high') {
        this.notificationQueue.push(notification)
        return false
      }

      // Send to server for push notification
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...notification,
          driverId: this.getCurrentDriverId()
        })
      })

      if (response.ok) {
        // Show local notification as fallback
        this.showLocalNotification(notification)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }

  // Show local notification
  private showLocalNotification(notification: NotificationPayload) {
    if (Notification.permission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/truck-icon.png',
        badge: '/icons/badge-icon.png',
        tag: notification.id,
        data: notification.data,
        requireInteraction: notification.requiresAction,
        vibrate: this.settings.vibrationEnabled ? [200, 100, 200] : undefined,
        silent: !this.settings.soundEnabled
      })

      notif.onclick = () => {
        this.handleNotificationClick({
          notificationId: notification.id,
          actionUrl: notification.data?.actionUrl
        })
        notif.close()
      }
    }
  }

  // Show in-app notification
  private showInAppNotification(notification: NotificationPayload) {
    const container = this.getOrCreateNotificationContainer()
    
    const notificationElement = document.createElement('div')
    notificationElement.className = 'in-app-notification'
    notificationElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(notification.type)};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    `

    notificationElement.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <div style="font-size: 20px;">${this.getNotificationIcon(notification.type)}</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">${notification.title}</div>
          <div style="font-size: 14px; opacity: 0.9;">${notification.message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          width: 20px;
          height: 20px;
        ">×</button>
      </div>
    `

    container.appendChild(notificationElement)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notificationElement.parentElement) {
        notificationElement.remove()
      }
    }, 5000)

    // Play sound if enabled
    if (this.settings.soundEnabled) {
      this.playNotificationSound(notification.type)
    }
  }

  // Get or create notification container
  private getOrCreateNotificationContainer(): HTMLElement {
    let container = document.getElementById('notification-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'notification-container'
      container.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        z-index: 10000;
        pointer-events: none;
      `
      document.body.appendChild(container)
    }
    return container
  }

  // Get notification color
  private getNotificationColor(type: string): string {
    switch (type) {
      case 'emergency': return 'linear-gradient(135deg, #ef4444, #dc2626)'
      case 'workflow': return 'linear-gradient(135deg, #3b82f6, #2563eb)'
      case 'dispatch': return 'linear-gradient(135deg, #10b981, #059669)'
      case 'system': return 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      case 'load_update': return 'linear-gradient(135deg, #f59e0b, #d97706)'
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)'
    }
  }

  // Get notification icon
  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'emergency': return '🚨'
      case 'workflow': return '🔄'
      case 'dispatch': return '📢'
      case 'system': return '⚙️'
      case 'load_update': return '📦'
      default: return '🔔'
    }
  }

  // Play notification sound
  private playNotificationSound(type: string) {
    const audio = new Audio()
    switch (type) {
      case 'emergency':
        audio.src = '/sounds/emergency-alert.mp3'
        break
      case 'workflow':
        audio.src = '/sounds/workflow-alert.mp3'
        break
      default:
        audio.src = '/sounds/notification.mp3'
        break
    }
    audio.volume = 0.5
    audio.play().catch(error => console.error('Failed to play sound:', error))
  }

  // Check if notification type is enabled
  private isNotificationTypeEnabled(type: string): boolean {
    switch (type) {
      case 'workflow': return this.settings.workflowAlerts
      case 'dispatch': return this.settings.dispatchMessages
      case 'emergency': return this.settings.emergencyAlerts
      case 'system': return this.settings.systemUpdates
      case 'load_update': return this.settings.loadUpdates
      default: return true
    }
  }

  // Check if it's quiet hours
  private isQuietHours(): boolean {
    if (!this.settings.quietHours.enabled) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number)
    const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      return currentTime >= startTime || currentTime <= endTime
    }
  }

  // Get current driver ID
  private getCurrentDriverId(): string {
    // In real app, get from authentication service
    const driverSession = localStorage.getItem('driver_session')
    if (driverSession) {
      return JSON.parse(driverSession).id
    }
    return 'unknown'
  }

  // Workflow notification helpers
  async sendWorkflowAlert(stepId: string, loadId: string, message: string) {
    await this.sendNotification({
      id: `workflow-${stepId}-${loadId}-${Date.now()}`,
      title: 'Workflow Alert',
      message,
      type: 'workflow',
      priority: 'high',
      timestamp: new Date().toISOString(),
      data: {
        stepId,
        loadId,
        actionUrl: `/drivers/dashboard?load=${loadId}&step=${stepId}`
      },
      requiresAction: true
    })
  }

  async sendDispatchMessage(title: string, message: string, loadId?: string) {
    await this.sendNotification({
      id: `dispatch-${Date.now()}`,
      title,
      message,
      type: 'dispatch',
      priority: 'medium',
      timestamp: new Date().toISOString(),
      data: {
        loadId,
        actionUrl: loadId ? `/drivers/dashboard?load=${loadId}` : '/drivers/dashboard'
      }
    })
  }

  async sendEmergencyAlert(message: string) {
    await this.sendNotification({
      id: `emergency-${Date.now()}`,
      title: 'Emergency Alert',
      message,
      type: 'emergency',
      priority: 'high',
      timestamp: new Date().toISOString(),
      requiresAction: true
    })
  }

  async sendLoadUpdate(loadId: string, message: string) {
    await this.sendNotification({
      id: `load-${loadId}-${Date.now()}`,
      title: 'Load Update',
      message,
      type: 'load_update',
      priority: 'medium',
      timestamp: new Date().toISOString(),
      data: {
        loadId,
        actionUrl: `/drivers/dashboard?load=${loadId}`
      }
    })
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    this.notificationQueue = this.notificationQueue.filter(n => n.id !== notificationId)
  }

  // Get unread notifications
  getUnreadNotifications(): NotificationPayload[] {
    return this.notificationQueue.filter(n => !n.expiresAt || new Date(n.expiresAt) > new Date())
  }

  // Settings management
  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings }
    localStorage.setItem('notification_settings', JSON.stringify(this.settings))
  }

  getSettings(): NotificationSettings {
    return this.settings
  }

  // Event listeners
  addNotificationListener(listener: (notification: NotificationPayload) => void) {
    this.listeners.push(listener)
  }

  removeNotificationListener(listener: (notification: NotificationPayload) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  // Cleanup
  destroy() {
    this.listeners = []
    this.notificationQueue = []
  }
}

// CSS for animations
const injectCSS = () => {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .in-app-notification {
      pointer-events: auto;
      transition: transform 0.3s ease-out;
    }
    
    .in-app-notification:hover {
      transform: translateX(-5px);
    }
  `
  document.head.appendChild(style)
}

// Inject CSS when service loads
if (typeof window !== 'undefined') {
  injectCSS()
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService() 