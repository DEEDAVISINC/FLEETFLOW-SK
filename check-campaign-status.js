// Quick script to check DEPOINTE campaign status
// Run this in your browser console at http://localhost:3001/depointe-dashboard

console.log('=== DEPOINTE CAMPAIGN STATUS ===\n');

// Check Healthcare Tasks
const healthcareTasks = localStorage.getItem('depointe-healthcare-tasks');
if (healthcareTasks) {
  const tasks = JSON.parse(healthcareTasks);
  console.log('🏥 HEALTHCARE CAMPAIGNS:', tasks.length);
  tasks.forEach((task) => {
    console.log(`  - ${task.title}`);
    console.log(`    Status: ${task.status}`);
    console.log(`    Progress: ${task.progress || 0}%`);
    console.log(`    Assigned To: ${task.assignedTo?.join(', ')}`);
    console.log(`    Target: ${task.targetQuantity || 'N/A'} leads`);
  });
}

// Check Shipper Tasks
const shipperTasks = localStorage.getItem('depointe-shipper-tasks');
if (shipperTasks) {
  const tasks = JSON.parse(shipperTasks);
  console.log('\n🚛 SHIPPER CAMPAIGNS:', tasks.length);
  tasks.forEach((task) => {
    console.log(`  - ${task.title}`);
    console.log(`    Status: ${task.status}`);
    console.log(`    Progress: ${task.progress || 0}%`);
    console.log(`    Assigned To: ${task.assignedTo?.join(', ')}`);
    console.log(`    Target: ${task.targetQuantity || 'N/A'} leads`);
  });
}

// Check Desperate Prospects Tasks
const desperateTasks = localStorage.getItem(
  'depointe-desperate-prospects-tasks'
);
if (desperateTasks) {
  const tasks = JSON.parse(desperateTasks);
  console.log('\n🎯 DESPERATE PROSPECTS CAMPAIGNS:', tasks.length);
  tasks.forEach((task) => {
    console.log(`  - ${task.title}`);
    console.log(`    Status: ${task.status}`);
    console.log(`    Progress: ${task.progress || 0}%`);
    console.log(`    Assigned To: ${task.assignedTo?.join(', ')}`);
    console.log(`    Target: ${task.targetQuantity || 'N/A'} leads`);
  });
}

// Check Generated Leads
const crmLeads = localStorage.getItem('depointe-crm-leads');
if (crmLeads) {
  const leads = JSON.parse(crmLeads);
  console.log('\n📋 TOTAL LEADS GENERATED:', leads.length);

  // Group by source
  const bySource = {};
  leads.forEach((lead) => {
    const source = lead.source || 'Unknown';
    bySource[source] = (bySource[source] || 0) + 1;
  });

  console.log('\n📊 LEADS BY SOURCE:');
  Object.entries(bySource).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count} leads`);
  });
}

// Check Activity Feed
const activityFeed = localStorage.getItem('depointe-activity-feed');
if (activityFeed) {
  const activities = JSON.parse(activityFeed);
  console.log(
    '\n⚡ RECENT ACTIVITIES:',
    activities.slice(0, 5).length,
    'shown (of',
    activities.length,
    'total)'
  );
  activities.slice(0, 5).forEach((activity) => {
    console.log(`  - [${activity.staffName}] ${activity.action}`);
    console.log(`    ${activity.details}`);
  });
}

console.log('\n=== END STATUS ===');


