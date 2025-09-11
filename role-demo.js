// Demo Role Switcher for FleetFlow University Testing
// Add this to your browser console to test different user roles

function switchUserRole(userType) {
  const users = {
    broker: {
      id: 'broker-001',
      name: 'John Smith', 
      email: 'john.smith@globalfreight.com',
      role: 'broker',
      brokerId: 'broker-001',
      companyName: 'Global Freight Solutions'
    },
    dispatcher: {
      id: 'disp-001',
      name: 'Sarah Johnson',
      email: 'sarah@fleetflowapp.com', 
      role: 'dispatcher',
      assignedBrokers: ['broker-001', 'broker-002']
    },
    driver: {
      id: 'driver-001',
      name: 'Mike Rodriguez',
      email: 'mike.r@fleetflowapp.com',
      role: 'driver'
    },
    manager: {
      id: 'mgr-001',
      name: 'Fleet Manager',
      email: 'manager@fleetflowapp.com',
      role: 'manager'
    },
    admin: {
      id: 'admin-001',
      name: 'System Admin',
      email: 'admin@fleetflowapp.com',
      role: 'admin'
    }
  }

  const selectedUser = users[userType]
  if (selectedUser) {
    // Store user info for the session
    localStorage.setItem('fleetflow_current_user_id', selectedUser.id)
    localStorage.setItem('fleetflow_demo_user', JSON.stringify(selectedUser))
    
    console.log(`🎭 Switched to: ${selectedUser.name} (${selectedUser.role.toUpperCase()})`)
    console.log('🔄 Refresh the page to see the new role in action!')
    
    // Refresh the page to apply changes
    window.location.reload()
  } else {
    console.log('❌ Invalid user type. Use: broker, dispatcher, driver, manager, or admin')
  }
}

// Usage examples:
console.log('🎓 FleetFlow University Role Demo')
console.log('Use these commands to test different user roles:')
console.log('👥 switchUserRole("broker")     - Test broker access')
console.log('👥 switchUserRole("dispatcher") - Test dispatcher access') 
console.log('👥 switchUserRole("driver")     - Test driver access')
console.log('👥 switchUserRole("manager")    - Test manager access')
console.log('👥 switchUserRole("admin")      - Test admin access')
