import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';
import React, { ReactElement } from 'react';

// Mock providers and contexts
const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface TestProviderProps {
  children: React.ReactNode;
}

function TestProvider({ children }: TestProviderProps) {
  return (
    <QueryClientProvider client={mockQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestProvider, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'dispatcher',
  brokerId: 'broker-123',
  ...overrides,
});

export const createMockLoad = (overrides = {}) => ({
  id: 'load-123',
  loadId: 'FLT-001',
  origin: 'Los Angeles, CA',
  destination: 'New York, NY',
  rate: 2500,
  distance: '2800 miles',
  weight: '45000 lbs',
  equipment: 'Dry Van',
  pickupDate: '2024-01-15',
  deliveryDate: '2024-01-18',
  status: 'available',
  shipperId: 'shipper-123',
  dispatcherId: 'dispatcher-123',
  ...overrides,
});

export const createMockShipper = (overrides = {}) => ({
  id: 'shipper-123',
  name: 'Test Shipper Inc',
  email: 'contact@testshipper.com',
  phone: '(555) 123-4567',
  address: '123 Main St, Los Angeles, CA',
  mcNumber: 'MC123456',
  ...overrides,
});

export const createMockCarrier = (overrides = {}) => ({
  id: 'carrier-123',
  name: 'Test Carrier LLC',
  email: 'dispatch@testcarrier.com',
  phone: '(555) 987-6543',
  mcNumber: 'MC789012',
  equipment: ['Dry Van', 'Reefer'],
  operatingStates: ['CA', 'NV', 'AZ'],
  ...overrides,
});

// Mock API responses
export const mockApiResponse = {
  success: (data: any) => ({
    data,
    error: null,
    status: 200,
  }),
  error: (message: string, status = 400) => ({
    data: null,
    error: { message },
    status,
  }),
};

// Test helpers
export const waitForNextTick = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const mockFetchResponse = (data: any, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    } as Response)
  );
};

export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Form testing helpers
export const fillFormField = async (field: HTMLElement, value: string) => {
  await userEvent.clear(field);
  await userEvent.type(field, value);
};

export const submitForm = async (form: HTMLElement) => {
  const submitButton = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );
  if (submitButton) {
    await userEvent.click(submitButton);
  }
};

// Async testing helpers
export const waitForCondition = (condition: () => boolean, timeout = 1000) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    const checkCondition = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Condition not met within timeout'));
      } else {
        setTimeout(checkCondition, 10);
      }
    };

    checkCondition();
  });
};

// Database testing helpers
export const createTestDatabase = () => {
  const db = new Map();

  return {
    get: (key: string) => db.get(key),
    set: (key: string, value: any) => {
      db.set(key, value);
      return db;
    },
    delete: (key: string) => db.delete(key),
    clear: () => db.clear(),
    has: (key: string) => db.has(key),
    get size() {
      return db.size;
    },
  };
};

// Component testing helpers
export const renderWithRouter = (
  component: ReactElement,
  initialEntries = ['/']
) => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  return {
    ...customRender(component),
    mockRouter,
  };
};
