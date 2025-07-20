// Demo script to populate training data for testing
// Run this in the browser console on the training page

// Import the progress manager (assuming it's available globally)
const { progressManager } = window;

// Demo users data
const demoUsers = [
  {
    userId: 'driver_001',
    userName: 'John Smith',
    userEmail: 'john.smith@fleetflow.com',
    userRole: 'driver',
    assignedModules: ['safety', 'compliance'],
    completedModules: ['safety'],
    quizScores: [
      { moduleId: 'safety', score: 92, totalQuestions: 10, timeSpent: 300 },
      { moduleId: 'compliance', score: 78, totalQuestions: 15, timeSpent: 420 }
    ]
  },
  {
    userId: 'dispatcher_001',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.johnson@fleetflow.com',
    userRole: 'dispatcher',
    assignedModules: ['dispatch', 'compliance', 'workflow'],
    completedModules: ['dispatch', 'workflow'],
    quizScores: [
      { moduleId: 'dispatch', score: 88, totalQuestions: 12, timeSpent: 450 },
      { moduleId: 'workflow', score: 95, totalQuestions: 8, timeSpent: 280 },
      { moduleId: 'compliance', score: 82, totalQuestions: 15, timeSpent: 380 }
    ]
  },
  {
    userId: 'broker_001',
    userName: 'Mike Rodriguez',
    userEmail: 'mike.rodriguez@fleetflow.com',
    userRole: 'broker',
    assignedModules: ['broker', 'compliance'],
    completedModules: ['broker'],
    quizScores: [
      { moduleId: 'broker', score: 91, totalQuestions: 20, timeSpent: 600 },
      { moduleId: 'compliance', score: 76, totalQuestions: 15, timeSpent: 400 }
    ]
  },
  {
    userId: 'driver_002',
    userName: 'Lisa Chen',
    userEmail: 'lisa.chen@fleetflow.com',
    userRole: 'driver',
    assignedModules: ['safety', 'compliance', 'sms-workflow'],
    completedModules: [],
    quizScores: [
      { moduleId: 'safety', score: 65, totalQuestions: 10, timeSpent: 250 }
    ]
  },
  {
    userId: 'manager_001',
    userName: 'David Wilson',
    userEmail: 'david.wilson@fleetflow.com',
    userRole: 'manager',
    assignedModules: ['dispatch', 'broker', 'compliance', 'safety', 'workflow'],
    completedModules: ['dispatch', 'broker', 'compliance'],
    quizScores: [
      { moduleId: 'dispatch', score: 94, totalQuestions: 12, timeSpent: 320 },
      { moduleId: 'broker', score: 89, totalQuestions: 20, timeSpent: 480 },
      { moduleId: 'compliance', score: 96, totalQuestions: 15, timeSpent: 290 },
      { moduleId: 'safety', score: 72, totalQuestions: 10, timeSpent: 350 }
    ]
  }
];

function populateDemoData() {
  console.log('Populating demo training data...');
  
  demoUsers.forEach(user => {
    console.log(`Setting up user: ${user.userName}`);
    
    // Initialize user progress
    progressManager.initializeUserProgress(
      user.userId,
      user.userRole,
      user.userName,
      user.userEmail
    );
    
    // Assign training modules
    progressManager.assignTrainingModules(user.userId, user.assignedModules);
    
    // Record quiz attempts
    user.quizScores.forEach(quiz => {
      progressManager.recordQuizAttempt(
        quiz.moduleId,
        quiz.score,
        quiz.totalQuestions,
        quiz.timeSpent,
        user.userId
      );
    });
    
    // Mark completed modules
    user.completedModules.forEach(moduleId => {
      const userProgress = progressManager.getProgress(user.userId);
      const module = userProgress.modules.find(m => m.moduleId === moduleId);
      if (module) {
        module.isCompleted = true;
        module.completedAt = new Date().toISOString();
        progressManager.saveProgress(userProgress, user.userId);
      }
    });
  });
  
  console.log('Demo data populated successfully!');
  console.log('You can now test the admin dashboard at /training/admin');
}

// Run the population
populateDemoData();
