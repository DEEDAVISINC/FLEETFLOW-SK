// Test script for FleetFlow University Role-Based Access
// Open browser console and paste this script to test different user roles

console.log('FleetFlow University Role Testing Script');
console.log('=====================================');

// Function to switch user roles for testing
function switchToRole(role) {
  console.log(`\n🔄 Switching to ${role.toUpperCase()} role...`);
  
  // Store the new role in localStorage (this simulates the role switching)
  localStorage.setItem('currentUserRole', role);
  
  // Reload the page to see role-based changes
  window.location.reload();
}

// Available roles to test
const roles = ['admin', 'manager', 'dispatcher', 'broker', 'driver'];

console.log('\n📋 Available roles to test:');
roles.forEach((role, index) => {
  console.log(`${index + 1}. ${role.charAt(0).toUpperCase() + role.slice(1)}`);
});

console.log('\n🎯 Usage:');
console.log('switchToRole("admin")    - Full access to all modules');
console.log('switchToRole("manager")  - Access to all modules, can view progress');
console.log('switchToRole("dispatcher") - Dispatch, workflow, compliance, safety, tech, customer');
console.log('switchToRole("broker")   - Broker, workflow, compliance, customer modules');
console.log('switchToRole("driver")   - Safety, compliance, technology modules only');

console.log('\n🔍 Current role:', localStorage.getItem('currentUserRole') || 'driver (default)');

// Make functions available globally
window.switchToRole = switchToRole;
window.testRoles = roles;

console.log('\n✅ Functions loaded! Use switchToRole("rolename") to test different access levels.');
