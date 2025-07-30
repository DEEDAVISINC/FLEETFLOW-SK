module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    // React rules
    'react/no-unescaped-entities': 'warn',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/self-closing-comp': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',

    // Import rules
    'import/no-duplicates': 'error',
  },

  // Override for specific files
  overrides: [
    {
      files: ['app/api/**/*.ts', 'pages/api/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['*.config.js', '*.config.ts', '.eslintrc.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],

  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'build/',
    '.vercel/',
    'public/',
    '*.min.js',
  ],
};
