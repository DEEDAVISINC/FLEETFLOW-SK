#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to analyze a single file
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract key features
    const features = {
      components: [...content.matchAll(/import\s+(\w+)/g)].map(m => m[1]),
      functions: [...content.matchAll(/(?:function\s+(\w+)|const\s+(\w+)\s*=)/g)].map(m => m[1] || m[2]),
      hooks: [...content.matchAll(/use(\w+)/g)].map(m => `use${m[1]}`),
      states: [...content.matchAll(/useState<([^>]+)>/g)].map(m => m[1]),
      routes: [...content.matchAll(/href=['"]([^'"]+)['"]/g)].map(m => m[1]),
      apis: [...content.matchAll(/\/api\/([^'"]+)/g)].map(m => `/api/${m[1]}`),
      styling: content.includes('glassmorphism') || content.includes('backdrop-filter'),
      size: content.length,
      lastModified: fs.statSync(filePath).mtime
    };
    
    return features;
  } catch (error) {
    return { error: error.message };
  }
}

// Function to compare features between versions
function compareVersions(versions) {
  const allFeatures = {};
  
  Object.keys(versions).forEach(version => {
    const features = versions[version];
    if (features.error) return;
    
    ['components', 'functions', 'hooks', 'routes', 'apis'].forEach(category => {
      if (!allFeatures[category]) allFeatures[category] = {};
      
      features[category].forEach(item => {
        if (!allFeatures[category][item]) allFeatures[category][item] = [];
        allFeatures[category][item].push(version);
      });
    });
  });
  
  return allFeatures;
}

// Main analysis function
function analyzePageVersions(directory) {
  const results = {};
  
  try {
    const files = fs.readdirSync(directory);
    const pageFiles = files.filter(f => f.startsWith('page') && f.endsWith('.tsx'));
    
    console.log(`\n🔍 Analyzing ${pageFiles.length} page versions in ${directory}:`);
    
    pageFiles.forEach(file => {
      const filePath = path.join(directory, file);
      const features = analyzeFile(filePath);
      results[file] = features;
      
      if (!features.error) {
        console.log(`  ✅ ${file}: ${features.functions.length} functions, ${features.components.length} imports, ${Math.round(features.size/1000)}KB`);
      } else {
        console.log(`  ❌ ${file}: Error - ${features.error}`);
      }
    });
    
    // Find unique features
    const comparison = compareVersions(results);
    
    console.log(`\n📊 Unique Features Analysis:`);
    
    Object.keys(comparison).forEach(category => {
      const uniqueItems = Object.keys(comparison[category]).filter(item => 
        comparison[category][item].length === 1
      );
      
      if (uniqueItems.length > 0) {
        console.log(`\n  🎯 Unique ${category}:`);
        uniqueItems.forEach(item => {
          const version = comparison[category][item][0];
          console.log(`    - ${item} (only in ${version})`);
        });
      }
    });
    
  } catch (error) {
    console.log(`❌ Error analyzing ${directory}: ${error.message}`);
  }
  
  return results;
}

// Analyze key directories
const directoriesToAnalyze = [
  'app',
  'app/broker',
  'app/broker/dashboard',
  'app/drivers',
  'app/drivers/dashboard',
  'app/accounting',
  'app/resources'
];

console.log('🚀 FleetFlow Page Version Analysis Tool');
console.log('=====================================');

directoriesToAnalyze.forEach(dir => {
  if (fs.existsSync(dir)) {
    analyzePageVersions(dir);
  } else {
    console.log(`⚠️  Directory not found: ${dir}`);
  }
});

console.log('\n✅ Analysis complete! Check results above for unique features to preserve.');
