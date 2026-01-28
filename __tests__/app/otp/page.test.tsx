import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'
import OTPVerification from '@/app/otp/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { priority, ...restProps } = props
    return <img {...restProps} />
  },
}))

describe('OTP Verification Page', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((key: string) => {
        if (key === 'email') return 'test@example.com'
        return null
      }),
    })
  })

  it('renders OTP verification form', () => {
    render(<OTPVerification />)

    expect(screen.getByText(/otp verification/i)).toBeInTheDocument()
    expect(screen.getByText(/enter the 6 digit/i)).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify otp/i })).toBeInTheDocument()
  })

  it('renders 6 OTP input fields', () => {
    render(<OTPVerification />)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(6)
  })

  it('disables verify button when OTP is incomplete', () => {
    render(<OTPVerification />)

    const verifyButton = screen.getByRole('button', { name: /verify otp/i })
    expect(verifyButton).toBeDisabled()
  })

  it('enables verify button when all 6 digits are entered', async () => {
    const user = userEvent.setup()
    render(<OTPVerification />)

    const inputs = screen.getAllByRole('textbox')
    const verifyButton = screen.getByRole('button', { name: /verify otp/i })

    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1))
    }

    await waitFor(() => {
      expect(verifyButton).not.toBeDisabled()
    })
  })

  it('auto-focuses next input when digit is entered', async () => {
    const user = userEvent.setup()
    render(<OTPVerification />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '1')

    await waitFor(() => {
      expect(document.activeElement).toBe(inputs[1])
    })
  })

  it('handles paste event for OTP code', async () => {
    const user = userEvent.setup()
    render(<OTPVerification />)

    const inputs = screen.getAllByRole('textbox')
    const firstInput = inputs[0]

    await user.click(firstInput)
    // Simulate paste by directly triggering onChange with the full pasted value
    // This mimics what happens when a user pastes into the first input
    fireEvent.change(firstInput, { target: { value: '123456' } })

    await waitFor(() => {
      inputs.forEach((input, index) => {
        expect(input).toHaveValue(String(index + 1))
      })
    })
  })

  it('only accepts numeric input', async () => {
    const user = userEvent.setup()
    render(<OTPVerification />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'a')

    expect(inputs[0]).toHaveValue('')
  })

  it('shows success toast and redirects on verification', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    jest.useFakeTimers()

    render(<OTPVerification />)

    const inputs = screen.getAllByRole('textbox')
    const verifyButton = screen.getByRole('button', { name: /verify otp/i })

    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1))
    }

    await waitFor(() => {
      expect(verifyButton).not.toBeDisabled()
    })

    await user.click(verifyButton)

    await waitFor(() => {
      expect(screen.getByText(/account verification success/i)).toBeInTheDocument()
    })

    // Fast-forward timers using act to ensure state updates are processed
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // After advancing timers, the redirect should have been called
    expect(mockPush).toHaveBeenCalledWith('/dashboard')

    jest.useRealTimers()
  })

  it('renders resend code link', () => {
    render(<OTPVerification />)

    expect(screen.getByText(/didn't get any code/i)).toBeInTheDocument()
    expect(screen.getByText(/resend code/i)).toBeInTheDocument()
  })
})
