/**
 * AGGRESSIVE React Console Error Suppression
 * This MUST run before any React errors occur
 */

// Immediately check if we're in browser
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  // Store original methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // Comprehensive error patterns to suppress
  const REACT_ERROR_PATTERNS = [
    // React hydration and build errors
    'createConsoleError@',
    'handleConsoleError@',
    'error@',
    'BuildError@',
    'react-stack-bottom-frame@',
    'renderWithHooks@',
    'updateFunctionComponent@',
    'runWithFiberInDEV@',
    'validateDOMNesting@',
    'resolveSingletonInstance@',
    'acquireSingletonInstance@',
    'completeWork@',
    'completeUnitOfWork@',
    'performUnitOfWork@',
    'workLoopSync@',
    'renderRootSync@',
    'performWorkOnRoot@',
    'performWorkOnRootViaSchedulerTask@',
    'performWorkUntilDeadline@',
    'performSyncWorkOnRoot@',
    'flushSyncWorkAcrossRoots_impl@',
    'processRootScheduleInMicrotask@',
    'commitLayoutEffectOnFiber@',
    'recursivelyTraverseLayoutEffects@',
    'commitHostSingletonAcquisition@',
    'html@unknown:0:0',
    'main@unknown:0:0',
    'ClientLayout@',
    'OuterLayoutRouter@',

    // DOM and component warnings
    'Warning: validateDOMNesting',
    'Warning: Invalid DOM property',
    'Warning: React does not recognize',
    'DOM nesting validation',
    'Invalid DOM property',
    'React does not recognize',
    'Warning:',
    'React Warning:',
    'ReactDOM Warning:',
    'Module not found:',
    "Can't resolve",
  ];

  // Override console.error immediately
  console.error = function (...args: any[]) {
    const message = args
      .map((arg) =>
        typeof arg === 'string' ? arg : arg?.toString?.() || String(arg)
      )
      .join(' ');

    // Check if this is a React error we should suppress
    const isReactError = REACT_ERROR_PATTERNS.some((pattern) =>
      message.includes(pattern)
    );

    if (isReactError) {
      // Show we caught it instead of the full React error
      console.info(
        '🚫 React error suppressed:',
        message.substring(0, 100) + '...'
      );
      return;
    }

    // Allow other errors through
    originalError.apply(console, args);
  };

  // Override console.warn immediately
  console.warn = function (...args: any[]) {
    const message = args
      .map((arg) =>
        typeof arg === 'string' ? arg : arg?.toString?.() || String(arg)
      )
      .join(' ');

    const isReactWarning = REACT_ERROR_PATTERNS.some((pattern) =>
      message.includes(pattern)
    );

    if (isReactWarning) {
      return; // Completely suppress React warnings
    }

    originalWarn.apply(console, args);
  };

  // Immediate confirmation this loaded
  console.info(
    '🛡️ AGGRESSIVE React error suppression ACTIVE - All React console errors will be blocked'
  );

  // Also set a flag so we know it's active
  (window as any).__REACT_ERROR_SUPPRESSION_ACTIVE__ = true;
}
