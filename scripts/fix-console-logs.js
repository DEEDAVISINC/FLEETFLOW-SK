#!/usr/bin/env node

/**
 * Script to replace console.log statements with proper logging
 * This fixes the production security risk of console statements
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to process (excluding test files and development utilities)
const patterns = [
  'app/services/**/*.ts',
  'app/utils/**/*.ts',
  'lib/**/*.ts',
  '!**/*.test.ts',
  '!**/*.spec.ts',
  '!**/test-*.ts',
  '!**/debug-*.ts',
];

// Logging replacements
const replacements = [
  {
    pattern: /console\.log\(/g,
    replacement: 'logger.debug(',
  },
  {
    pattern: /console\.warn\(/g,
    replacement: 'logger.warn(',
  },
  {
    pattern: /console\.error\(/g,
    replacement: 'logger.error(',
  },
  {
    pattern: /console\.info\(/g,
    replacement: 'logger.info(',
  },
];

// Import statement to add
const loggerImport = "import { logger } from '../utils/logger';\n";

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Check if file has console statements
    const hasConsole = /console\.(log|warn|error|info)\s*\(/.test(content);

    if (!hasConsole) {
      return false; // No changes needed
    }

    // Add logger import if not present
    if (
      !content.includes("from '../utils/logger'") &&
      !content.includes("from '@/app/utils/logger'")
    ) {
      // Find the right place to add import
      const importMatch = content.match(/^import.*?from.*?;$/gm);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content =
          content.slice(0, lastImportIndex) +
          '\n' +
          loggerImport +
          content.slice(lastImportIndex);
        hasChanges = true;
      }
    }

    // Replace console statements
    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed console statements in: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing console.log statements for production...\n');

  let totalFiles = 0;
  let processedFiles = 0;

  patterns.forEach((pattern) => {
    const files = glob.sync(pattern, {
      ignore: patterns.filter((p) => p.startsWith('!')),
    });

    files.forEach((file) => {
      totalFiles++;
      if (processFile(file)) {
        processedFiles++;
      }
    });
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files updated: ${processedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - processedFiles}`);

  if (processedFiles > 0) {
    console.log('\n✅ Console statement fixes completed!');
    console.log('🔍 Run "npm run lint" to check remaining issues.');
  } else {
    console.log('\n✨ No console statements found in production files.');
  }
}

if (require.main === module) {
  main();
}
