import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { priority, ...restProps } = props
    return <img {...restProps} />
  },
}))

describe('Create Account Page (Onboarding)', () => {
  it('renders create account form with all fields', () => {
    render(<Home />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('disables submit button when form is invalid', () => {
    render(<Home />)

    const submitButton = screen.getByRole('button', { name: /create account/i })
    expect(submitButton).toBeDisabled()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for password too short', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, 'Short1!')
    await user.tab()

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/password must be at least 8 characters long/i)
      // Should find the error message (not the requirements text)
      expect(errorMessages.length).toBeGreaterThan(0)
      // The error message should be in a red error paragraph
      const errorMessage = errorMessages.find(msg => 
        msg.className.includes('text-red-500')
      )
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('shows validation error for missing uppercase letter', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, 'lowercase123!')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for missing special character', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    await user.type(passwordInput, 'Password123')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one special character/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    await user.type(passwordInput, 'Test#123456')
    await user.type(confirmPasswordInput, 'Different#123')

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('enables submit button when form is valid', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Test#123456')
    await user.type(confirmPasswordInput, 'Test#123456')
    // Trigger blur to ensure validation completes
    await user.tab()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 3000 })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement
    const toggleButtons = screen.getAllByRole('button', { name: '' })

    expect(passwordInput.type).toBe('password')

    await user.click(toggleButtons[0])
    expect(passwordInput.type).toBe('text')

    await user.click(toggleButtons[0])
    expect(passwordInput.type).toBe('password')
  })

  it('toggles confirm password visibility independently', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement
    const toggleButtons = screen.getAllByRole('button', { name: '' })

    expect(confirmPasswordInput.type).toBe('password')

    await user.click(toggleButtons[1])
    expect(confirmPasswordInput.type).toBe('text')
  })

  it('displays password requirements', () => {
    render(<Home />)

    expect(screen.getByText(/your password must be at least 8 characters long/i)).toBeInTheDocument()
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument()
    expect(screen.getByText(/one special character/i)).toBeInTheDocument()
  })
})
