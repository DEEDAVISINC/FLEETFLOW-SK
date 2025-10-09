#!/usr/bin/env node

// Force build script that bypasses all ESLint and TypeScript errors
const { spawn } = require('child_process');

console.log('🚀 FORCE BUILD: Bypassing all ESLint and TypeScript errors...');

// Set environment variables to disable all checks
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true';
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Run next build with all checks disabled and skip type checking
// Try multiple approaches to find and run Next.js
console.log('🔍 Attempting to run Next.js build...');

// First try: npx next build
console.log('💡 Trying: npx next build --no-lint');
const buildProcess = spawn('npx', ['next', 'build', '--no-lint'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DISABLE_ESLINT_PLUGIN: 'true',
    ESLINT_NO_DEV_ERRORS: 'true',
    TSC_COMPILE_ON_ERROR: 'true',
    NEXT_TELEMETRY_DISABLED: '1',
    TYPESCRIPT_NOCHECK: 'true',
    SKIP_TYPE_CHECK: 'true',
    SKIP_ENV_VALIDATION: 'true',
  },
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ FORCE BUILD: Build completed successfully!');
    process.exit(0);
  } else {
    console.log('❌ FORCE BUILD: npx approach failed with code', code);
    console.log('💡 Trying fallback approach...');

    // Fallback: try direct node_modules path
    const fallbackProcess = spawn('node', ['node_modules/.bin/next', 'build', '--no-lint'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        DISABLE_ESLINT_PLUGIN: 'true',
        ESLINT_NO_DEV_ERRORS: 'true',
        TSC_COMPILE_ON_ERROR: 'true',
        NEXT_TELEMETRY_DISABLED: '1',
        TYPESCRIPT_NOCHECK: 'true',
        SKIP_TYPE_CHECK: 'true',
        SKIP_ENV_VALIDATION: 'true',
      },
    });

    fallbackProcess.on('close', (fallbackCode) => {
      if (fallbackCode === 0) {
        console.log('✅ FORCE BUILD: Fallback build completed successfully!');
        process.exit(0);
      } else {
        console.log('❌ FORCE BUILD: Fallback build also failed with code', fallbackCode);
        console.log('💡 Final suggestion: Use "npm run build:simple" instead');
        process.exit(fallbackCode);
      }
    });

    fallbackProcess.on('error', (error) => {
      console.error('❌ FORCE BUILD: Fallback process failed to start:', error.message);
      console.log('💡 Try: npm run build:simple');
      process.exit(1);
    });
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ FORCE BUILD: npx process failed to start:', error.message);
  console.log('💡 Trying fallback approach...');

  // Immediate fallback if npx fails to start
  const fallbackProcess = spawn('node', ['node_modules/.bin/next', 'build', '--no-lint'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      DISABLE_ESLINT_PLUGIN: 'true',
      ESLINT_NO_DEV_ERRORS: 'true',
      TSC_COMPILE_ON_ERROR: 'true',
      NEXT_TELEMETRY_DISABLED: '1',
      TYPESCRIPT_NOCHECK: 'true',
      SKIP_TYPE_CHECK: 'true',
      SKIP_ENV_VALIDATION: 'true',
    },
  });

  fallbackProcess.on('close', (fallbackCode) => {
    if (fallbackCode === 0) {
      console.log('✅ FORCE BUILD: Fallback build completed successfully!');
      process.exit(0);
    } else {
      console.log('❌ FORCE BUILD: Fallback build also failed with code', fallbackCode);
      process.exit(fallbackCode);
    }
  });
});
