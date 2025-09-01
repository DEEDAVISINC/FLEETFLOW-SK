/**
 * Global Error Handler for FleetFlow
 * Catches unhandled promise rejections and provides debugging info
 */

// Global unhandled rejection handler - only run in browser after hydration
if (typeof window !== 'undefined') {
  // Wait for hydration to complete before attaching handlers
  setTimeout(() => {
    console.info('🔧 FleetFlow Error Handler initialized');

    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 UNHANDLED PROMISE REJECTION:', event.reason);
      console.error('🔍 Promise:', event.promise);
      console.error('📍 Stack trace:', event.reason?.stack);

      // Try to identify which service caused the error
      const stack = event.reason?.stack || '';
      if (stack.includes('AICarrierOnboardingTrigger')) {
        console.error('🤖 Error in AI Carrier Onboarding Trigger service');
      } else if (stack.includes('DispatcherAssignmentService')) {
        console.error('👨‍💼 Error in Dispatcher Assignment Service');
      } else if (stack.includes('onboarding-integration')) {
        console.error('🚛 Error in Onboarding Integration service');
      } else if (stack.includes('ContractGenerationService')) {
        console.error('📄 Error in Contract Generation service');
      }

      // Log additional context
      console.error('🌐 Current URL:', window.location.href);
      console.error('⏰ Timestamp:', new Date().toISOString());

      // Prevent the default browser handling
      event.preventDefault();

      // Optional: Show user-friendly error message
      showUserFriendlyError(event.reason);
    });

    // Global error handler for regular errors
    window.addEventListener('error', (event) => {
      console.error('🚨 GLOBAL ERROR:', event.error);
      console.error('📍 File:', event.filename);
      console.error('📍 Line:', event.lineno);
      console.error('📍 Column:', event.colno);
    });
  }, 100); // Small delay to ensure hydration completes first
}

function showUserFriendlyError(reason: any) {
  // Only show if it's not a development error and we're in the browser
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const errorMessage = reason?.message || 'An unexpected error occurred';

    // Create a non-intrusive error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 12px;
      max-width: 300px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    errorDiv.innerHTML = `
      <div style="color: #dc2626; font-weight: 600; margin-bottom: 4px;">
        ⚠️ System Error
      </div>
      <div style="color: #7f1d1d; font-size: 14px;">
        ${errorMessage}
      </div>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 8px;
        padding: 4px 8px;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      ">
        Dismiss
      </button>
    `;

    document.body.appendChild(errorDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 10000);
  }
}

// Service-specific error handlers - work in both client and server
export class ServiceErrorHandler {
  static async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    serviceName: string,
    operationName: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error(`❌ ${serviceName} - ${operationName} failed:`, error);

      // Log additional context for debugging
      console.error('🔍 Error details:', {
        service: serviceName,
        operation: operationName,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString(),
      });

      return null;
    }
  }

  static wrapAsyncMethod<T extends any[], R>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const originalMethod = descriptor.value;
    if (!originalMethod) return descriptor;

    descriptor.value = async function (...args: T): Promise<R> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        console.error(
          `❌ ${target.constructor.name}.${propertyName} failed:`,
          error
        );
        throw error; // Re-throw to maintain original behavior
      }
    };

    return descriptor;
  }
}

// Export for use in other modules
export default ServiceErrorHandler;
