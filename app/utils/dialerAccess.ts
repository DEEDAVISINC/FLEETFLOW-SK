// Dialer Access Control Utility

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  location?: string;
  department: string;
  role: string;
  status: string;
  lastLogin: string;
  permissions: string[];
  createdDate: string;
}

export type DialerAccessLevel =
  | 'required'
  | 'enabled'
  | 'disabled'
  | 'restricted';

/**
 * Determines dialer access level for a user based on role and permissions
 */
export const getDialerAccess = (user: User): DialerAccessLevel => {
  const isCustomerService =
    user.department === 'CS' || user.role === 'Customer Service';
  const isSales = user.department === 'SALES' || user.role === 'Sales';
  const isDispatcher = user.department === 'DC' || user.role === 'Dispatcher';
  const isBroker = user.department === 'BB' || user.role === 'Broker';
  const isDriver = user.department === 'DM' || user.role === 'Driver';

  // Customer Service & Sales: Always required
  if (isCustomerService || isSales) return 'required';

  // Drivers: Always restricted
  if (isDriver) return 'restricted';

  // Dispatchers & Brokers: Optional based on permissions
  if (isDispatcher || isBroker) {
    return user.permissions.includes('dialer_access') ? 'enabled' : 'disabled';
  }

  // Default: disabled
  return 'disabled';
};

/**
 * Checks if a user should have the dialer widget displayed
 */
export const shouldShowDialer = (user: User): boolean => {
  const accessLevel = getDialerAccess(user);
  return accessLevel === 'required' || accessLevel === 'enabled';
};

/**
 * Gets the appropriate dialer access description for UI display
 */
export const getDialerAccessDescription = (user: User): string => {
  const accessLevel = getDialerAccess(user);

  switch (accessLevel) {
    case 'required':
      return 'REQUIRED - Customer Service & Sales roles automatically have dialer access';
    case 'enabled':
      return 'ENABLED - Optional dialer access is currently enabled';
    case 'disabled':
      return 'DISABLED - Optional dialer access is currently disabled';
    case 'restricted':
      return 'RESTRICTED - Drivers do not have access to dialer system';
    default:
      return 'Unknown access level';
  }
};

/**
 * Gets the color scheme for dialer access status display
 */
export const getDialerAccessColors = (user: User) => {
  const accessLevel = getDialerAccess(user);

  switch (accessLevel) {
    case 'required':
      return {
        background: '#dcfce7',
        color: '#166534',
        icon: '✅',
      };
    case 'enabled':
      return {
        background: '#dbeafe',
        color: '#1d4ed8',
        icon: '🟢',
      };
    case 'disabled':
      return {
        background: '#f3f4f6',
        color: '#6b7280',
        icon: '⚪',
      };
    case 'restricted':
      return {
        background: '#fee2e2',
        color: '#dc2626',
        icon: '❌',
      };
    default:
      return {
        background: '#f3f4f6',
        color: '#6b7280',
        icon: '❓',
      };
  }
};

/**
 * Updates user permissions to toggle dialer access for optional roles
 */
export const toggleDialerAccess = (user: User, enabled: boolean): string[] => {
  const accessLevel = getDialerAccess(user);

  // Only allow toggling for dispatchers and brokers
  if (accessLevel !== 'enabled' && accessLevel !== 'disabled') {
    return user.permissions;
  }

  if (enabled) {
    return user.permissions.includes('dialer_access')
      ? user.permissions
      : [...user.permissions, 'dialer_access'];
  } else {
    return user.permissions.filter((p) => p !== 'dialer_access');
  }
};
