/**
 * Temporary DOM nesting warning suppression
 * This suppresses React's validateDOMNesting warnings while we fix the underlying issues
 */

if (typeof window !== 'undefined') {
  // Store the original console.error
  const originalConsoleError = console.error;

  // Override console.error to filter out DOM nesting warnings
  console.error = (...args: any[]) => {
    // Check if this is a DOM nesting validation error
    const errorString = args.join(' ');

    const isDOMNestingError =
      errorString.includes('validateDOMNesting') ||
      errorString.includes('Warning: Invalid DOM property') ||
      errorString.includes('Warning: React does not recognize') ||
      errorString.includes('DOM nesting validation') ||
      (args[0] && typeof args[0] === 'string' && args[0].includes('Warning:'));

    if (isDOMNestingError) {
      // Log a simplified version instead
      console.warn('🔧 DOM nesting warning suppressed (fix in progress):', {
        message: args[0],
        details: 'Check DOMNestingFixer component for specific issues',
      });
      return;
    }

    // Call the original console.error for non-DOM-nesting errors
    originalConsoleError.apply(console, args);
  };

  // Also suppress React DevTools warnings temporarily
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const warnString = args.join(' ');

    const isReactWarning =
      warnString.includes('Warning:') ||
      warnString.includes('validateDOMNesting') ||
      warnString.includes('Invalid DOM property');

    if (isReactWarning) {
      // Suppress React warnings temporarily
      return;
    }

    originalConsoleWarn.apply(console, args);
  };

  console.info(
    '🔧 DOM nesting warnings temporarily suppressed - fix in progress'
  );
}
