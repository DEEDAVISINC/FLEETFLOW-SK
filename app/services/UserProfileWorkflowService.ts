/**
 * User Profile Workflow Service
 * Complete profile workflow system that connects:
 * 1. User Management (admin creation/assignment)
 * 2. User Profile (individual progress tracking)
 * 3. Instructor Portal (training monitoring)
 * 4. Training System (FleetFlow University℠)
 */

import UserDataService, { UserProfile } from './user-data-service';

export interface TrainingModule {
  id: string;
  name: string;
  category: string;
  instructor: string;
  duration: number; // minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  description: string;
}

export interface TrainingAssignment {
  moduleId: string;
  moduleName: string;
  assignedDate: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedBy: string; // User ID who assigned it
  instructor: string;
  status: 'assigned' | 'started' | 'completed' | 'overdue';
}

export interface TrainingProgress {
  moduleId: string;
  moduleName: string;
  status: 'not_started' | 'in_progress' | 'completed';
  startedDate?: string;
  completedDate?: string;
  progress: number; // 0-100
  score?: number; // Final score if completed
  instructor: string;
  timeSpent: number; // minutes
  attempts: number;
  lastAccessed?: string;
}

export interface InstructorDashboardData {
  instructorId: string;
  instructorName: string;
  assignedModules: string[];
  students: {
    userId: string;
    userName: string;
    department: string;
    assignedTraining: TrainingAssignment[];
    progressData: TrainingProgress[];
    overallProgress: number;
    completedModules: number;
    totalModules: number;
  }[];
  performanceMetrics: {
    totalStudents: number;
    averageCompletion: number;
    overdueAssignments: number;
    recentCompletions: number;
  };
}

export interface UserProfileWorkflowData {
  user: UserProfile;
  trainingAssignments: TrainingAssignment[];
  trainingProgress: TrainingProgress[];
  icaOnboardingStatus: {
    currentStep: number;
    completedSteps: string[];
    overallProgress: number;
  };
  carrierOnboardingStatus?: {
    currentStep: number;
    completedSteps: string[];
    overallProgress: number;
  };
  workflowStatus: 'onboarding' | 'training' | 'active' | 'suspended';
}

class UserProfileWorkflowService {
  private static instance: UserProfileWorkflowService;
  private userDataService: UserDataService;

  // FleetFlow University℠ Training Modules - System-specific training
  private readonly AVAILABLE_MODULES: TrainingModule[] = [
    {
      id: 'fleetflow_dispatch_mastery',
      name: 'FleetFlow Dispatcher Operations Mastery',
      category: 'FleetFlow System',
      instructor: 'Sarah Johnson',
      duration: 180,
      difficulty: 'Advanced',
      prerequisites: [],
      description:
        'Complete FleetFlow dispatcher training including load matching, carrier coordination, route optimization, and performance management',
    },
    {
      id: 'fleetflow_broker_mastery',
      name: 'FleetFlow Broker Business Mastery',
      category: 'FleetFlow System',
      instructor: 'Mike Chen',
      duration: 180,
      difficulty: 'Advanced',
      prerequisites: [],
      description:
        'Comprehensive FleetFlow broker training covering rate negotiations, customer acquisition, and sales pipeline management',
    },
    {
      id: 'fleetflow_compliance_training',
      name: 'FleetFlow DOT Compliance & Safety',
      category: 'Compliance',
      instructor: 'Lisa Rodriguez',
      duration: 120,
      difficulty: 'Intermediate',
      prerequisites: [],
      description:
        'FleetFlow compliance tools, DOT regulations, safety management, and audit preparation within the platform',
    },
    {
      id: 'fleetflow_technology_systems',
      name: 'FleetFlow Technology Systems',
      category: 'Technology',
      instructor: 'Robert Davis',
      duration: 90,
      difficulty: 'Beginner',
      prerequisites: [],
      description:
        'FleetFlow platform navigation, integrations, mobile apps, and technical features for daily operations',
    },
    {
      id: 'fleetflow_customer_service',
      name: 'FleetFlow Customer Service Excellence',
      category: 'Customer Relations',
      instructor: 'Jennifer Wilson',
      duration: 75,
      difficulty: 'Intermediate',
      prerequisites: [],
      description:
        'Using FleetFlow CRM, communication tools, and customer management features for superior service delivery',
    },
    {
      id: 'fleetflow_workflow_ecosystem',
      name: 'FleetFlow Workflow Ecosystem',
      category: 'Operations',
      instructor: 'Mark Thompson',
      duration: 150,
      difficulty: 'Advanced',
      prerequisites: ['fleetflow_technology_systems'],
      description:
        'Advanced FleetFlow workflow management, automation features, and system integration for maximum efficiency',
    },
    {
      id: 'fleetflow_sms_notifications',
      name: 'FleetFlow SMS Notification System',
      category: 'Technology',
      instructor: 'Amanda Garcia',
      duration: 60,
      difficulty: 'Beginner',
      prerequisites: [],
      description:
        'FleetFlow SMS system setup, automated notifications, and communication management for drivers and customers',
    },
    {
      id: 'fleetflow_financial_management',
      name: 'FleetFlow Financial Management',
      category: 'Finance',
      instructor: 'David Martinez',
      duration: 120,
      difficulty: 'Intermediate',
      prerequisites: [],
      description:
        'FleetFlow billing, invoicing, financial reporting, and integration with accounting systems',
    },
    {
      id: 'fleetflow_analytics_reporting',
      name: 'FleetFlow Analytics & Reporting',
      category: 'Analytics',
      instructor: 'Emily Brown',
      duration: 105,
      difficulty: 'Intermediate',
      prerequisites: ['fleetflow_technology_systems'],
      description:
        'FleetFlow dashboard analytics, custom reports, KPI tracking, and data-driven decision making',
    },
    {
      id: 'fleetflow_admin_management',
      name: 'FleetFlow Administrative Management',
      category: 'Management',
      instructor: 'Frank Miller',
      duration: 200,
      difficulty: 'Advanced',
      prerequisites: ['fleetflow_workflow_ecosystem'],
      description:
        'Complete FleetFlow admin training including user management, system configuration, and company-wide settings',
    },
  ];

  private constructor() {
    this.userDataService = UserDataService.getInstance();
  }

  public static getInstance(): UserProfileWorkflowService {
    if (!UserProfileWorkflowService.instance) {
      UserProfileWorkflowService.instance = new UserProfileWorkflowService();
    }
    return UserProfileWorkflowService.instance;
  }

  /**
   * WORKFLOW STEP 1: Create user profile in User Management
   * This triggers the complete workflow chain
   */
  public createUserProfile(
    userData: Omit<
      UserProfile,
      'id' | 'createdDate' | 'lastLogin' | 'lastActive'
    >
  ): UserProfile {
    // Create the user profile
    const newUser = this.userDataService.createUser(userData);

    // Initialize workflow data for the new user
    this.initializeUserWorkflow(newUser);

    // Auto-assign role-based training
    this.assignRoleBasedTraining(newUser);

    // Create instructor notifications
    this.notifyInstructorsOfNewStudent(newUser);

    return newUser;
  }

  /**
   * WORKFLOW STEP 2: Initialize complete workflow for new user
   */
  private initializeUserWorkflow(user: UserProfile): void {
    // Create workflow tracking record
    const workflowData: UserProfileWorkflowData = {
      user,
      trainingAssignments: [],
      trainingProgress: [],
      icaOnboardingStatus: {
        currentStep: 1,
        completedSteps: [],
        overallProgress: 0,
      },
      workflowStatus: 'onboarding',
    };

    // Initialize driver/carrier onboarding if applicable
    if (user.departmentCode === 'DM') {
      workflowData.carrierOnboardingStatus = {
        currentStep: 1,
        completedSteps: [],
        overallProgress: 0,
      };
    }

    // Store workflow data (in real app, this would be in database)
    this.storeUserWorkflowData(user.id, workflowData);
  }

  /**
   * WORKFLOW STEP 3: Auto-assign role-based training modules
   * DM users get driver onboarding workflow, others get FleetFlow University training
   */
  private assignRoleBasedTraining(user: UserProfile): void {
    // DM (Driver/Carrier) users should complete driver onboarding workflow
    // instead of FleetFlow University training
    if (user.departmentCode === 'DM') {
      console.info(
        `🚛 DM User ${user.name}: Driver onboarding workflow will be handled by carrier onboarding system`
      );
      // Driver onboarding will be managed by OnboardingIntegrationService
      // No FleetFlow University training assigned - they get Driver OTR Flow access instead
      return;
    }

    // For non-DM users: Assign FleetFlow University training
    const roleTrainingMap: Record<string, string[]> = {
      DC: [
        'fleetflow_technology_systems',
        'fleetflow_dispatch_mastery',
        'fleetflow_workflow_ecosystem',
        'fleetflow_compliance_training',
      ], // Dispatcher - FleetFlow system training for dispatch operations
      BB: [
        'fleetflow_technology_systems',
        'fleetflow_broker_mastery',
        'fleetflow_customer_service',
        'fleetflow_financial_management',
      ], // Broker - FleetFlow system training for brokerage operations
      MGR: [
        'fleetflow_admin_management',
        'fleetflow_analytics_reporting',
        'fleetflow_workflow_ecosystem',
        'fleetflow_financial_management',
      ], // Manager - FleetFlow system training for management
    };

    const moduleIds = roleTrainingMap[user.departmentCode] || [];
    const assignments: TrainingAssignment[] = [];

    moduleIds.forEach((moduleId, index) => {
      const moduleItem = this.AVAILABLE_MODULES.find((m) => m.id === moduleId);
      if (moduleItem) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30 * (index + 1)); // Stagger due dates

        assignments.push({
          moduleId: moduleItem.id,
          moduleName: moduleItem.name,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          priority: index === 0 ? 'Critical' : index === 1 ? 'High' : 'Medium',
          assignedBy: 'SYSTEM_AUTO_ASSIGN',
          instructor: moduleItem.instructor,
          status: 'assigned',
        });
      }
    });

    // Store training assignments for non-DM users
    if (assignments.length > 0) {
      this.assignTrainingToUser(user.id, assignments);
    }
  }

  /**
   * WORKFLOW STEP 4: Assign training modules to user (from User Management)
   */
  public assignTrainingToUser(
    userId: string,
    assignments: TrainingAssignment[]
  ): void {
    const workflowData = this.getUserWorkflowData(userId);
    if (!workflowData) return;

    // Add new assignments
    workflowData.trainingAssignments.push(...assignments);

    // Initialize progress tracking for each assignment
    assignments.forEach((assignment) => {
      workflowData.trainingProgress.push({
        moduleId: assignment.moduleId,
        moduleName: assignment.moduleName,
        status: 'not_started',
        progress: 0,
        instructor: assignment.instructor,
        timeSpent: 0,
        attempts: 0,
      });
    });

    // Update workflow status
    workflowData.workflowStatus = 'training';

    // Store updated data
    this.storeUserWorkflowData(userId, workflowData);

    // Notify instructors
    this.notifyInstructorsOfAssignment(workflowData.user, assignments);
  }

  /**
   * WORKFLOW STEP 5: Update training progress (from User Profile or Training System)
   */
  public updateTrainingProgress(
    userId: string,
    moduleId: string,
    progressData: Partial<TrainingProgress>
  ): void {
    const workflowData = this.getUserWorkflowData(userId);
    if (!workflowData) return;

    const progressIndex = workflowData.trainingProgress.findIndex(
      (p) => p.moduleId === moduleId
    );
    if (progressIndex === -1) return;

    // Update progress
    workflowData.trainingProgress[progressIndex] = {
      ...workflowData.trainingProgress[progressIndex],
      ...progressData,
      lastAccessed: new Date().toISOString(),
    };

    // Update assignment status if completed
    if (progressData.status === 'completed') {
      const assignmentIndex = workflowData.trainingAssignments.findIndex(
        (a) => a.moduleId === moduleId
      );
      if (assignmentIndex !== -1) {
        workflowData.trainingAssignments[assignmentIndex].status = 'completed';
      }
    }

    // Check if all training is complete
    const allCompleted = workflowData.trainingProgress.every(
      (p) => p.status === 'completed'
    );
    if (allCompleted && workflowData.workflowStatus === 'training') {
      workflowData.workflowStatus = 'active';
    }

    // Store updated data
    this.storeUserWorkflowData(userId, workflowData);

    // Notify instructor of progress
    this.notifyInstructorOfProgress(
      workflowData.user,
      workflowData.trainingProgress[progressIndex]
    );
  }

  /**
   * WORKFLOW STEP 6: Get complete user profile workflow data (for User Profile page)
   */
  public getUserProfileWorkflow(
    userId: string
  ): UserProfileWorkflowData | null {
    return this.getUserWorkflowData(userId);
  }

  /**
   * WORKFLOW STEP 7: Get instructor dashboard data (for Instructor Portal)
   */
  public getInstructorDashboard(instructorId: string): InstructorDashboardData {
    const allWorkflowData = this.getAllUserWorkflowData();
    const instructorName = this.getInstructorName(instructorId);

    // Find all students assigned to this instructor
    const students = allWorkflowData
      .filter((data) =>
        data.trainingAssignments.some((a) => a.instructor === instructorName)
      )
      .map((data) => ({
        userId: data.user.id,
        userName: data.user.name,
        department: data.user.department,
        assignedTraining: data.trainingAssignments.filter(
          (a) => a.instructor === instructorName
        ),
        progressData: data.trainingProgress.filter(
          (p) => p.instructor === instructorName
        ),
        overallProgress: this.calculateOverallProgress(
          data.trainingProgress.filter((p) => p.instructor === instructorName)
        ),
        completedModules: data.trainingProgress.filter(
          (p) => p.instructor === instructorName && p.status === 'completed'
        ).length,
        totalModules: data.trainingProgress.filter(
          (p) => p.instructor === instructorName
        ).length,
      }));

    // Calculate performance metrics
    const totalStudents = students.length;
    const averageCompletion =
      students.reduce((sum, s) => sum + s.overallProgress, 0) /
      (totalStudents || 1);
    const overdueAssignments = students.reduce(
      (sum, s) =>
        sum +
        s.assignedTraining.filter(
          (a) => a.status === 'assigned' && new Date(a.dueDate) < new Date()
        ).length,
      0
    );
    const recentCompletions = students.reduce(
      (sum, s) =>
        sum +
        s.progressData.filter(
          (p) =>
            p.status === 'completed' &&
            p.completedDate &&
            new Date(p.completedDate) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
      0
    );

    return {
      instructorId,
      instructorName,
      assignedModules: this.AVAILABLE_MODULES.filter(
        (m) => m.instructor === instructorName
      ).map((m) => m.id),
      students,
      performanceMetrics: {
        totalStudents,
        averageCompletion,
        overdueAssignments,
        recentCompletions,
      },
    };
  }

  /**
   * Get available training modules
   */
  public getAvailableModules(): TrainingModule[] {
    return this.AVAILABLE_MODULES;
  }

  /**
   * Get modules by category
   */
  public getModulesByCategory(category: string): TrainingModule[] {
    return this.AVAILABLE_MODULES.filter((m) => m.category === category);
  }

  /**
   * Get modules by instructor
   */
  public getModulesByInstructor(instructor: string): TrainingModule[] {
    return this.AVAILABLE_MODULES.filter((m) => m.instructor === instructor);
  }

  /**
   * Update driver onboarding progress (for DM users)
   * This integrates with the OnboardingIntegrationService
   */
  public updateDriverOnboardingProgress(
    userId: string,
    currentStep: number,
    completedSteps: string[],
    overallProgress: number
  ): void {
    const workflowData = this.getUserWorkflowData(userId);
    if (!workflowData || workflowData.user.departmentCode !== 'DM') return;

    // Update carrier onboarding status
    if (workflowData.carrierOnboardingStatus) {
      workflowData.carrierOnboardingStatus = {
        currentStep,
        completedSteps,
        overallProgress,
      };

      // Update workflow status based on onboarding progress
      if (overallProgress === 100) {
        workflowData.workflowStatus = 'active'; // Driver gets Driver OTR Flow access
        console.info(
          `🚛 Driver ${workflowData.user.name} completed onboarding - Driver OTR Flow access granted`
        );
      } else if (overallProgress > 0) {
        workflowData.workflowStatus = 'onboarding';
      }

      // Store updated data
      this.storeUserWorkflowData(userId, workflowData);
    }
  }

  /**
   * Check if user should use driver onboarding workflow
   */
  public isDriverUser(userId: string): boolean {
    const workflowData = this.getUserWorkflowData(userId);
    return workflowData?.user.departmentCode === 'DM' || false;
  }

  /**
   * Integrate with OnboardingIntegrationService for driver onboarding
   * This method syncs driver onboarding progress from the carrier onboarding system
   */
  public async syncDriverOnboardingFromCarrierSystem(
    userId: string,
    carrierId: string
  ): Promise<void> {
    const workflowData = this.getUserWorkflowData(userId);
    if (!workflowData || workflowData.user.departmentCode !== 'DM') return;

    try {
      // Import OnboardingIntegrationService dynamically to avoid circular dependencies
      const { OnboardingIntegrationService } = await import(
        './onboarding-integration'
      );
      const onboardingService = OnboardingIntegrationService.getInstance();

      // Get carrier onboarding record
      const onboardingRecord = onboardingService.getOnboardingRecord(carrierId);
      if (!onboardingRecord) return;

      // Map carrier onboarding steps to driver onboarding progress
      const stepMapping: Record<string, string> = {
        verification: 'FMCSA Verification',
        travel_limits: 'Travel Limits',
        documents: 'Documents',
        factoring: 'Factoring',
        agreements: 'Agreements',
        portal: 'Portal Setup',
      };

      const completedSteps: string[] = [];
      let currentStep = 1;
      let overallProgress = 0;

      // Check which steps are completed in the carrier onboarding
      Object.entries(onboardingRecord.steps).forEach(
        ([stepKey, stepData], index) => {
          const stepName = stepMapping[stepKey];
          if (stepName && stepData && (stepData as any).completed) {
            completedSteps.push(stepName);
            overallProgress = ((index + 1) / 6) * 100;
            currentStep = Math.min(index + 2, 6); // Next step
          }
        }
      );

      // If all steps completed, mark as 100%
      if (completedSteps.length === 6) {
        overallProgress = 100;
        currentStep = 6;
      }

      // Update driver onboarding progress
      this.updateDriverOnboardingProgress(
        userId,
        currentStep,
        completedSteps,
        overallProgress
      );

      console.info(
        `🔄 Synced driver onboarding progress for ${workflowData.user.name}: ${overallProgress}% complete`
      );
    } catch (error) {
      console.error('Failed to sync driver onboarding progress:', error);
    }
  }

  /**
   * Grant Driver OTR Flow access once onboarding is complete
   */
  public grantDriverOTRAccess(userId: string): boolean {
    const workflowData = this.getUserWorkflowData(userId);
    if (!workflowData || workflowData.user.departmentCode !== 'DM')
      return false;

    const isOnboardingComplete =
      workflowData.carrierOnboardingStatus?.overallProgress === 100;

    if (isOnboardingComplete && workflowData.workflowStatus !== 'active') {
      workflowData.workflowStatus = 'active';
      this.storeUserWorkflowData(userId, workflowData);

      console.info(
        `🚛 Driver OTR Flow access granted to ${workflowData.user.name}`
      );
      return true;
    }

    return isOnboardingComplete;
  }

  // Private helper methods
  private calculateOverallProgress(progressData: TrainingProgress[]): number {
    if (progressData.length === 0) return 0;
    const totalProgress = progressData.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(totalProgress / progressData.length);
  }

  private getInstructorName(instructorId: string): string {
    // Map instructor IDs to names (in real app, this would be from database)
    const instructorMap: Record<string, string> = {
      sarah_johnson: 'Sarah Johnson',
      mike_chen: 'Mike Chen',
      lisa_rodriguez: 'Lisa Rodriguez',
      robert_davis: 'Robert Davis',
      jennifer_wilson: 'Jennifer Wilson',
      mark_thompson: 'Mark Thompson',
      amanda_garcia: 'Amanda Garcia',
      david_martinez: 'David Martinez',
      emily_brown: 'Emily Brown',
      frank_miller: 'Frank Miller',
    };
    return instructorMap[instructorId] || 'Unknown Instructor';
  }

  private notifyInstructorsOfNewStudent(user: UserProfile): void {
    // In real app, this would send notifications to instructors
    console.info(`🎓 New student enrolled: ${user.name} (${user.department})`);
  }

  private notifyInstructorsOfAssignment(
    user: UserProfile,
    assignments: TrainingAssignment[]
  ): void {
    // In real app, this would send notifications to assigned instructors
    assignments.forEach((assignment) => {
      console.info(
        `📚 New training assigned: ${assignment.moduleName} to ${user.name} (Instructor: ${assignment.instructor})`
      );
    });
  }

  private notifyInstructorOfProgress(
    user: UserProfile,
    progress: TrainingProgress
  ): void {
    // In real app, this would send progress notifications to instructors
    console.info(
      `📈 Progress update: ${user.name} - ${progress.moduleName}: ${progress.progress}% (Instructor: ${progress.instructor})`
    );
  }

  // Data storage methods (in real app, these would be database operations)
  private storeUserWorkflowData(
    userId: string,
    data: UserProfileWorkflowData
  ): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`user_workflow_${userId}`, JSON.stringify(data));
    }
  }

  private getUserWorkflowData(userId: string): UserProfileWorkflowData | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`user_workflow_${userId}`);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  private getAllUserWorkflowData(): UserProfileWorkflowData[] {
    if (typeof window !== 'undefined') {
      const allData: UserProfileWorkflowData[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_workflow_')) {
          const data = localStorage.getItem(key);
          if (data) {
            allData.push(JSON.parse(data));
          }
        }
      }
      return allData;
    }
    return [];
  }
}

export default UserProfileWorkflowService;
