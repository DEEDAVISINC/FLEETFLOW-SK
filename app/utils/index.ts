// Export everything from accessControl.tsx (the React component version)
export * from './accessControl';

// Export from the TypeScript service file with permission utilities
export {
  AccessControlService,
  checkAction,
  checkActionSimple,
  checkAllPermissions,
  checkAnyPermission,
  checkPermission,
  checkPermissionSimple,
  getAccessibleFeatures,
} from './accessControl.ts';
