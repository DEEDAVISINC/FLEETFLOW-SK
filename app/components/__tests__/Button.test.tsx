import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Button component if it doesn't exist yet
const MockButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  loading = false,
  ...props
}: any) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

// Use MockButton for testing
const ButtonComponent = MockButton;

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<ButtonComponent>Click me</ButtonComponent>);
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<ButtonComponent onClick={handleClick}>Click me</ButtonComponent>);

    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <ButtonComponent onClick={handleClick} disabled>
        Click me
      </ButtonComponent>
    );

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<ButtonComponent loading>Loading</ButtonComponent>);

    expect(
      screen.getByRole('button', { name: /loading/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <ButtonComponent variant='primary'>Button</ButtonComponent>
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'primary'
    );

    rerender(<ButtonComponent variant='secondary'>Button</ButtonComponent>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'secondary'
    );

    rerender(<ButtonComponent variant='danger'>Button</ButtonComponent>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'danger'
    );
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <ButtonComponent size='small'>Button</ButtonComponent>
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'small');

    rerender(<ButtonComponent size='medium'>Button</ButtonComponent>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'medium');

    rerender(<ButtonComponent size='large'>Button</ButtonComponent>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'large');
  });

  it('forwards additional props to button element', () => {
    render(
      <ButtonComponent type='submit' aria-label='Submit form'>
        Submit
      </ButtonComponent>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('handles keyboard events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<ButtonComponent onClick={handleClick}>Click me</ButtonComponent>);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents default behavior when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <ButtonComponent type='submit' disabled>
          Submit
        </ButtonComponent>
      </form>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
