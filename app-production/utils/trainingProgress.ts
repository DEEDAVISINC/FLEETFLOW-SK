// Training Progress Management System

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: string
  timeSpent?: number
}

export interface ModuleProgress {
  moduleId: string
  lessons: LessonProgress[]
  startedAt: string
  completedAt?: string
  totalTimeSpent: number
  isCompleted: boolean
  certificateEligible: boolean
}

export interface TrainingProgress {
  userId: string
  userRole: string
  userName: string
  modules: ModuleProgress[]
  certificates: Certificate[]
  lastAccessed: string
}

export interface Certificate {
  id: string
  moduleId: string
  moduleTitle: string
  recipientName: string
  recipientRole: string
  dateEarned: string
  score: number
  validUntil: string
  prerequisites: string[]
}

class TrainingProgressManager {
  private getCurrentUserId(): string {
    // In production, this would get the current user ID from auth context
    // For now, we'll use a mock user ID based on localStorage or default
    return localStorage.getItem('fleetflow_current_user_id') || 'default_user'
  }

  private getStorageKey(userId?: string): string {
    const currentUserId = userId || this.getCurrentUserId()
    return `fleetflow_university_progress_${currentUserId}`
  }

  // Get user's training progress (individualized)
  getProgress(userId?: string): TrainingProgress {
    const storageKey = this.getStorageKey(userId)
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      // Server-side rendering - return default progress
      const currentUserId = userId || 'default_user'
      return {
        userId: currentUserId,
        userRole: 'trainee',
        userName: 'Current User',
        modules: [],
        certificates: [],
        lastAccessed: new Date().toISOString()
      }
    }
    
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing stored progress:', error)
      }
    }
    
    // Return default progress structure
    const currentUserId = userId || this.getCurrentUserId()
    return {
      userId: currentUserId,
      userRole: 'trainee', // Will be updated when user info is available
      userName: 'Current User',
      modules: [],
      certificates: [],
      lastAccessed: new Date().toISOString()
    }
  }

  // Save progress to storage (individualized)
  saveProgress(progress: TrainingProgress, userId?: string): void {
    const storageKey = this.getStorageKey(userId)
    progress.lastAccessed = new Date().toISOString()
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }

  // Initialize user progress with their role and info
  initializeUserProgress(userId: string, userRole: string, userName: string): void {
    const existing = this.getProgress(userId)
    if (existing.userId === 'default_user' || existing.userRole === 'trainee') {
      const updated = {
        ...existing,
        userId,
        userRole,
        userName,
        lastAccessed: new Date().toISOString()
      }
      this.saveProgress(updated, userId)
    }
  }

  // Start a new module
  startModule(moduleId: string, userId?: string): void {
    const progress = this.getProgress(userId)
    
    const existingModule = progress.modules.find(m => m.moduleId === moduleId)
    if (!existingModule) {
      progress.modules.push({
        moduleId,
        lessons: [],
        startedAt: new Date().toISOString(),
        totalTimeSpent: 0,
        isCompleted: false,
        certificateEligible: false
      })
      this.saveProgress(progress, userId)
    }
  }

  // Complete a lesson
  completeLesson(moduleId: string, lessonId: string, timeSpent: number = 0, userId?: string): void {
    const progress = this.getProgress(userId)
    const module = progress.modules.find(m => m.moduleId === moduleId)
    
    if (module) {
      const existingLesson = module.lessons.find(l => l.lessonId === lessonId)
      if (existingLesson) {
        existingLesson.completed = true
        existingLesson.completedAt = new Date().toISOString()
        if (timeSpent > 0) existingLesson.timeSpent = timeSpent
      } else {
        module.lessons.push({
          lessonId,
          completed: true,
          completedAt: new Date().toISOString(),
          timeSpent
        })
      }
      
      module.totalTimeSpent += timeSpent
      this.checkModuleCompletion(moduleId, userId)
      this.saveProgress(progress, userId)
    }
  }

  // Check if module is completed and eligible for certification
  checkModuleCompletion(moduleId: string, userId?: string): void {
    const progress = this.getProgress(userId)
    const module = progress.modules.find(m => m.moduleId === moduleId)
    
    if (module) {
      // Define required lessons for each module
      const moduleRequirements = this.getModuleRequirements(moduleId)
      
      // Check if all required lessons are completed
      const completedLessons = module.lessons.filter(l => l.completed).length
      const isCompleted = completedLessons >= moduleRequirements.requiredLessons
      
      module.isCompleted = isCompleted
      module.certificateEligible = isCompleted && module.totalTimeSpent >= moduleRequirements.minimumTime
      
      if (isCompleted && !module.completedAt) {
        module.completedAt = new Date().toISOString()
      }
    }
  }

  // Get module requirements (lessons needed, minimum time, etc.)
  getModuleRequirements(moduleId: string) {
    const requirements = {
      'dispatch': { requiredLessons: 4, minimumTime: 30 }, // 30 minutes minimum
      'broker': { requiredLessons: 4, minimumTime: 40 },
      'compliance': { requiredLessons: 3, minimumTime: 20 },
      'safety': { requiredLessons: 4, minimumTime: 25 },
      'technology': { requiredLessons: 4, minimumTime: 20 },
      'customer': { requiredLessons: 4, minimumTime: 20 },
      'workflow': { requiredLessons: 6, minimumTime: 60 }
    }
    
    return requirements[moduleId as keyof typeof requirements] || { requiredLessons: 3, minimumTime: 15 }
  }

  // Check if user is eligible for certification
  isCertificationEligible(moduleId: string, userId?: string): boolean {
    const progress = this.getProgress(userId)
    const module = progress.modules.find(m => m.moduleId === moduleId)
    return module?.certificateEligible || false
  }

  // Get module completion percentage
  getModuleCompletionPercentage(moduleId: string, userId?: string): number {
    const progress = this.getProgress(userId)
    const module = progress.modules.find(m => m.moduleId === moduleId)
    
    if (!module) return 0
    
    const requirements = this.getModuleRequirements(moduleId)
    const completedLessons = module.lessons.filter(l => l.completed).length
    
    return Math.min(100, Math.round((completedLessons / requirements.requiredLessons) * 100))
  }

  // Award certificate
  awardCertificate(certificate: Certificate, userId?: string): void {
    const progress = this.getProgress(userId)
    
    // Update certificate with user info from progress
    const updatedCertificate = {
      ...certificate,
      recipientName: progress.userName,
      recipientRole: progress.userRole
    }
    
    progress.certificates.push(updatedCertificate)
    this.saveProgress(progress, userId)
  }

  // Get earned certificates
  getCertificates(userId?: string): Certificate[] {
    const progress = this.getProgress(userId)
    return progress.certificates
  }

  // Get all user progress (Admin only)
  getAllUsersProgress(): TrainingProgress[] {
    const allProgress: TrainingProgress[] = []
    
    // Scan localStorage for all training progress keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('fleetflow_university_progress_')) {
        const stored = localStorage.getItem(key)
        if (stored) {
          try {
            const progress = JSON.parse(stored)
            allProgress.push(progress)
          } catch (error) {
            console.error('Error parsing stored progress:', error)
          }
        }
      }
    }
    
    return allProgress
  }

  // Reset progress (for development/testing)
  resetProgress(userId?: string): void {
    const storageKey = this.getStorageKey(userId)
    localStorage.removeItem(storageKey)
  }

  // Reset all progress (Admin only)
  resetAllProgress(): void {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('fleetflow_university_progress_')) {
        keys.push(key)
      }
    }
    keys.forEach(key => localStorage.removeItem(key))
  }
}

export const progressManager = new TrainingProgressManager()
