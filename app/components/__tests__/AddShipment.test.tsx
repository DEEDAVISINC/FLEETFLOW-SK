import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMockShipper,
  createMockUser,
  mockFetchResponse,
  render,
} from '../../test-utils';
import AddShipment from '../AddShipment';

// Mock the services
jest.mock('../../services/loadService', () => ({
  createLoad: jest.fn(),
  generateLoadId: jest.fn(() => 'FLT-TEST-001'),
}));

jest.mock('../../services/shipperService', () => ({
  getShipperById: jest.fn(),
  getShippersByBroker: jest.fn(() => []),
}));

jest.mock('../../config/access', () => ({
  getCurrentUser: jest.fn(() => ({
    user: createMockUser(),
  })),
  getAvailableDispatchers: jest.fn(() => [
    {
      id: 'dispatcher-1',
      name: 'John Dispatcher',
      email: 'john@broker.com',
    },
  ]),
}));

const mockCreateLoad = require('../../services/loadService').createLoad;
const mockGetShippersByBroker =
  require('../../services/shipperService').getShippersByBroker;

describe('AddShipment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchResponse({ success: true });
  });

  it('renders the shipment form correctly', () => {
    render(<AddShipment />);

    expect(screen.getByText('Create New Shipment')).toBeInTheDocument();
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/equipment type/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<AddShipment />);

    const submitButton = screen.getByRole('button', {
      name: /create shipment/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Origin is required')).toBeInTheDocument();
      expect(screen.getByText('Destination is required')).toBeInTheDocument();
      expect(screen.getByText('Rate is required')).toBeInTheDocument();
    });
  });

  it('successfully creates a shipment with valid data', async () => {
    const user = userEvent.setup();
    const mockOnLoadCreated = jest.fn();

    mockCreateLoad.mockResolvedValue({
      id: 'load-123',
      loadId: 'FLT-TEST-001',
      status: 'created',
    });

    render(<AddShipment onLoadCreated={mockOnLoadCreated} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/origin/i), 'Los Angeles, CA');
    await user.type(screen.getByLabelText(/destination/i), 'New York, NY');
    await user.type(screen.getByLabelText(/rate/i), '2500');
    await user.type(screen.getByLabelText(/weight/i), '45000');
    await user.selectOptions(
      screen.getByLabelText(/equipment type/i),
      'Dry Van'
    );

    // Set dates
    const pickupDate = screen.getByLabelText(/pickup date/i);
    const deliveryDate = screen.getByLabelText(/delivery date/i);

    fireEvent.change(pickupDate, { target: { value: '2024-01-15' } });
    fireEvent.change(deliveryDate, { target: { value: '2024-01-18' } });

    // Submit the form
    const submitButton = screen.getByRole('button', {
      name: /create shipment/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateLoad).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: 'Los Angeles, CA',
          destination: 'New York, NY',
          rate: 2500,
          weight: '45000',
          equipment: 'Dry Van',
          pickupDate: '2024-01-15',
          deliveryDate: '2024-01-18',
        })
      );
      expect(mockOnLoadCreated).toHaveBeenCalled();
    });
  });

  it('loads and displays shippers for the broker', async () => {
    const mockShippers = [
      createMockShipper({ id: 'shipper-1', name: 'Shipper One' }),
      createMockShipper({ id: 'shipper-2', name: 'Shipper Two' }),
    ];

    mockGetShippersByBroker.mockReturnValue(mockShippers);

    render(<AddShipment />);

    await waitFor(() => {
      expect(screen.getByText('Shipper One')).toBeInTheDocument();
      expect(screen.getByText('Shipper Two')).toBeInTheDocument();
    });
  });

  it('shows tracking setup when enabled', async () => {
    const user = userEvent.setup();
    render(<AddShipment />);

    const trackingCheckbox = screen.getByLabelText(/enable tracking/i);
    await user.click(trackingCheckbox);

    expect(screen.getByText('GPS Tracking Setup')).toBeInTheDocument();
  });

  it('handles form submission errors gracefully', async () => {
    const user = userEvent.setup();

    mockCreateLoad.mockRejectedValue(new Error('Failed to create load'));

    render(<AddShipment />);

    // Fill minimal required fields
    await user.type(screen.getByLabelText(/origin/i), 'Los Angeles, CA');
    await user.type(screen.getByLabelText(/destination/i), 'New York, NY');
    await user.type(screen.getByLabelText(/rate/i), '2500');

    fireEvent.change(screen.getByLabelText(/pickup date/i), {
      target: { value: '2024-01-15' },
    });

    const submitButton = screen.getByRole('button', {
      name: /create shipment/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create shipment')).toBeInTheDocument();
    });
  });

  it('prevents multiple submissions while processing', async () => {
    const user = userEvent.setup();

    mockCreateLoad.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AddShipment />);

    // Fill minimal required fields
    await user.type(screen.getByLabelText(/origin/i), 'Los Angeles, CA');
    await user.type(screen.getByLabelText(/destination/i), 'New York, NY');
    await user.type(screen.getByLabelText(/rate/i), '2500');

    fireEvent.change(screen.getByLabelText(/pickup date/i), {
      target: { value: '2024-01-15' },
    });

    const submitButton = screen.getByRole('button', {
      name: /create shipment/i,
    });
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });
});
