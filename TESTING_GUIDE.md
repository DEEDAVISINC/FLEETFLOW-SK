# FleetFlow Testing Guide

This comprehensive testing guide covers all aspects of testing for the FleetFlow TMS (Transportation
Management System) platform.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Test Categories](#test-categories)
6. [Best Practices](#best-practices)
7. [CI/CD Integration](#cicd-integration)
8. [Debugging Tests](#debugging-tests)

## Testing Overview

FleetFlow uses a comprehensive testing strategy that includes:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components and services
- **End-to-End Tests**: Test complete user workflows
- **Component Tests**: Test UI component behavior and interactions
- **API Tests**: Test backend services and external integrations

### Technology Stack

- **Framework**: Jest
- **React Testing**: React Testing Library
- **UI Testing**: User Event for interaction simulation
- **Mocking**: Jest mocks for external dependencies
- **Coverage**: Istanbul for test coverage reporting

## Test Structure

```
app/
├── __tests__/                    # Test utilities and shared setup
│   ├── utils/
│   │   └── test-utils.tsx       # Test helpers and utilities
│   └── integration/             # Integration tests
├── components/
│   └── __tests__/               # Component unit tests
├── services/
│   └── __tests__/               # Service unit tests
└── pages/
    └── __tests__/               # Page component tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Running Specific Tests

```bash
# Run tests for a specific file
npm test AddShipment.test.tsx

# Run tests for a specific directory
npm test services/

# Run tests matching a pattern
npm test -- --testNamePattern="creates a shipment"
```

## Writing Tests

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    const mockCallback = jest.fn()

    render(<MyComponent onAction={mockCallback} />)

    await user.click(screen.getByRole('button'))
    expect(mockCallback).toHaveBeenCalled()
  })
})
```

### Service Tests

```typescript
import { createLoad, getLoadsByBroker } from '../loadService'

describe('Load Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createLoad', () => {
    it('creates a load successfully', async () => {
      const loadData = {
        origin: 'Los Angeles, CA',
        destination: 'New York, NY',
        rate: 2500,
      }

      const result = await createLoad(loadData)

      expect(result).toBeDefined()
      expect(result.origin).toBe('Los Angeles, CA')
      expect(result.rate).toBe(2500)
    })
  })
})
```

### Integration Tests

```typescript
describe('Carrier Onboarding Flow', () => {
  it('completes full onboarding process', async () => {
    // Test the complete user journey
    // Mock services, render components, simulate user actions
    // Verify end-to-end functionality
  })
})
```

## Test Categories

### 1. Unit Tests

Test individual functions, components, and services in isolation.

**Location**: `app/components/__tests__/`, `app/services/__tests__/`

**Focus**:

- Function logic
- Component rendering
- Error handling
- Edge cases

### 2. Integration Tests

Test interactions between multiple components and services.

**Location**: `app/__tests__/integration/`

**Focus**:

- Component communication
- Service orchestration
- Data flow between layers

### 3. End-to-End Tests

Test complete user workflows from start to finish.

**Location**: `app/__tests__/e2e/`

**Focus**:

- User journeys
- Critical business flows
- System integration

### 4. Component Tests

Test UI component behavior and accessibility.

**Location**: `app/components/__tests__/`

**Focus**:

- User interactions
- Visual states
- Accessibility
- Responsive design

## Best Practices

### Test Organization

1. **One concept per test**: Each test should verify one specific behavior
2. **Descriptive test names**: Use clear, descriptive names that explain what the test verifies
3. **Arrange-Act-Assert pattern**: Structure tests with clear setup, execution, and verification
   phases

### Mocking Strategy

1. **Mock external dependencies**: APIs, databases, third-party services
2. **Use realistic test data**: Create test data that mirrors production data structure
3. **Avoid over-mocking**: Mock only what's necessary for the test

### Test Data

```typescript
// Use factories for consistent test data
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'dispatcher',
  ...overrides,
})
```

### Async Testing

```typescript
it('handles async operations', async () => {
  const user = userEvent.setup()

  render(<AsyncComponent />)

  await user.click(screen.getByRole('button'))

  await waitFor(() => {
    expect(screen.getByText('Operation completed')).toBeInTheDocument()
  })
})
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
```

### Coverage Requirements

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## Debugging Tests

### Common Issues

1. **Async operations not waiting**:

   ```typescript
   // ❌ Wrong
   user.click(button)
   expect(result).toBeVisible()

   // ✅ Correct
   await user.click(button)
   await waitFor(() => {
     expect(result).toBeVisible()
   })
   ```

2. **Missing mocks**:

   ```typescript
   // Mock external dependencies
   jest.mock('../externalService', () => ({
     fetchData: jest.fn(),
   }))
   ```

3. **Component not re-rendering**:
   ```typescript
   // Use rerender for component updates
   const { rerender } = render(<Component prop="old" />)
   rerender(<Component prop="new" />)
   ```

### Debug Tools

```typescript
// Debug component output
screen.debug()

// Debug specific element
screen.debug(screen.getByText('specific text'))

// Log test data
console.log('Test data:', testData)
```

## Critical Test Flows

### 1. Shipment Creation Flow

- Form validation
- Load creation
- Dispatcher assignment
- Tracking setup
- Email notifications

### 2. Carrier Onboarding Flow

- Application submission
- Document validation
- Compliance checking
- Contract generation
- Welcome email

### 3. Payment Processing Flow

- Subscription creation
- Payment processing
- Invoice generation
- Receipt delivery
- Refund handling

### 4. User Authentication Flow

- Login/logout
- Password reset
- Role-based access
- Session management
- Security validation

## Test Maintenance

### Regular Tasks

1. **Update tests after refactoring**: Ensure tests reflect code changes
2. **Add tests for new features**: Maintain test coverage for new functionality
3. **Review and update mocks**: Keep mocks in sync with actual implementations
4. **Performance monitoring**: Track test execution time and optimize slow tests

### Code Review Checklist

- [ ] Tests exist for new functionality
- [ ] Tests follow naming conventions
- [ ] Tests are isolated and don't depend on each other
- [ ] Mocks are appropriate and realistic
- [ ] Test coverage meets requirements
- [ ] Tests run successfully in CI

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new tests:

1. Follow the established naming conventions
2. Place tests in the appropriate `__tests__` directory
3. Use descriptive test names and comments
4. Include both positive and negative test cases
5. Update this guide if new patterns are established


