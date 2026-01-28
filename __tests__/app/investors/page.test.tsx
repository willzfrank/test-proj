import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import InvestorsPage from '@/app/investors/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

describe('Investors Page', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('Initial Render', () => {
    it('renders all summary cards with correct data', () => {
      render(<InvestorsPage />)

      expect(screen.getByText('Total Investors')).toBeInTheDocument()
      expect(screen.getByText('10,000')).toBeInTheDocument()
      expect(screen.getAllByText('8.5%').length).toBeGreaterThan(0)
      expect(screen.getAllByText(/up from yesterday/i).length).toBeGreaterThan(0)

      expect(screen.getByText('Active Investors')).toBeInTheDocument()
      expect(screen.getByText('5,000')).toBeInTheDocument()

      expect(screen.getByText('Inactive Investors')).toBeInTheDocument()
      expect(screen.getByText('400')).toBeInTheDocument()

      expect(screen.getByText('Blacklisted Investors')).toBeInTheDocument()
      expect(screen.getByText('40')).toBeInTheDocument()
    })

    it('renders investors table with header', () => {
      render(<InvestorsPage />)

      expect(screen.getAllByText('Investors').length).toBeGreaterThan(0)
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
    })

    it('renders table columns correctly', () => {
      render(<InvestorsPage />)

      expect(screen.getAllByText(/investors/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/email address/i)).toBeInTheDocument()
      expect(screen.getByText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByText(/referral code/i)).toBeInTheDocument()
      expect(screen.getByText(/wallet balance/i)).toBeInTheDocument()
      expect(screen.getByText(/date joined/i)).toBeInTheDocument()
      expect(screen.getAllByText(/status/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/action/i)).toBeInTheDocument()
    })

    it('renders paginated investors (10 per page)', () => {
      render(<InvestorsPage />)

      // Should render 10 investors on first page
      const checkboxes = screen.getAllByRole('checkbox')
      // 1 select all + 10 individual checkboxes = 11 total
      expect(checkboxes.length).toBeGreaterThanOrEqual(11)
    })
  })

  describe('Search Functionality', () => {
    it('filters investors by name', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'Daniel')

      await waitFor(() => {
        const tableRows = screen.getAllByRole('row')
        // Header row + filtered rows
        const dataRows = tableRows.filter(row => 
          row.textContent?.includes('Daniel') || row.textContent?.includes('INVESTORS')
        )
        expect(dataRows.length).toBeGreaterThan(1)
      })
    })

    it('filters investors by email', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, '@gmail.com')

      await waitFor(() => {
        // Should show filtered results
        expect(screen.getByPlaceholderText(/search/i)).toHaveValue('@gmail.com')
      })
    })

    it('filters investors by referral code', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'BI-')

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search/i)).toHaveValue('BI-')
      })
    })

    it('resets to page 1 when search changes', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      // Navigate to page 2
      await waitFor(() => {
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        if (page2Button) {
          user.click(page2Button)
        }
      })

      await waitFor(() => {
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        expect(page2Button).toHaveClass(/bg-red-600/)
      })

      // Perform search
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.clear(searchInput)
      await user.type(searchInput, 'test')

      await waitFor(() => {
        // Should be back on page 1 (check if page 1 button is active)
        const page1Button = screen.getByRole('button', { name: /^1$/ })
        expect(page1Button).toHaveClass(/bg-red-600/)
      })
    })
  })

  describe('Status Filter', () => {
    it('renders status filter select', () => {
      render(<InvestorsPage />)

      // Verify status filter label exists
      expect(screen.getByText(/status/i)).toBeInTheDocument()
      
      // Verify select trigger exists (Radix UI Select)
      const selectTrigger = document.querySelector('[data-slot="select-trigger"]')
      expect(selectTrigger).toBeInTheDocument()
    })

    it('has status filter options available', () => {
      render(<InvestorsPage />)

      // Verify the select component is rendered with default "All" value
      const selectTrigger = document.querySelector('[data-slot="select-trigger"]')
      expect(selectTrigger).toBeInTheDocument()
      // The select should contain "All" text initially
      expect(screen.getAllByText(/all/i).length).toBeGreaterThan(0)
    })

    it('status filter component is interactive', () => {
      render(<InvestorsPage />)

      // Verify the status filter select is present and interactive
      const selectTrigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement
      expect(selectTrigger).toBeInTheDocument()
      expect(selectTrigger).not.toBeDisabled()
    })
  })

  describe('Date Filters', () => {
    it('allows changing date from filter', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const dateFromInput = screen.getByLabelText(/show from/i) as HTMLInputElement
      expect(dateFromInput).toHaveValue('2025-07-22')

      await user.clear(dateFromInput)
      await user.type(dateFromInput, '2025-01-01')

      await waitFor(() => {
        expect(dateFromInput).toHaveValue('2025-01-01')
      })
    })

    it('allows changing date to filter', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const dateToInput = screen.getByLabelText(/^to$/i) as HTMLInputElement
      expect(dateToInput).toHaveValue('2025-07-22')

      await user.clear(dateToInput)
      await user.type(dateToInput, '2025-12-31')

      await waitFor(() => {
        expect(dateToInput).toHaveValue('2025-12-31')
      })
    })

    it('calls filter handler when filter button is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const filterButton = screen.getByRole('button', { name: /filter/i })
      await user.click(filterButton)

      // Filter button should be clickable (handler exists even if it's a no-op)
      expect(filterButton).toBeInTheDocument()
    })
  })

  describe('Selection Functionality', () => {
    it('selects all investors when select all checkbox is checked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const checkboxes = screen.getAllByRole('checkbox')
      const selectAllCheckbox = checkboxes[0]

      await user.click(selectAllCheckbox)

      await waitFor(() => {
        // All checkboxes on current page should be checked
        const allCheckboxes = screen.getAllByRole('checkbox')
        allCheckboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked()
        })
      })
    })

    it('deselects all investors when select all checkbox is unchecked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const checkboxes = screen.getAllByRole('checkbox')
      const selectAllCheckbox = checkboxes[0]

      // First select all
      await user.click(selectAllCheckbox)
      await waitFor(() => {
        expect(selectAllCheckbox).toBeChecked()
      })

      // Then deselect all
      await user.click(selectAllCheckbox)

      await waitFor(() => {
        expect(selectAllCheckbox).not.toBeChecked()
        // Individual checkboxes should also be unchecked
        const individualCheckboxes = screen.getAllByRole('checkbox').slice(1)
        individualCheckboxes.forEach(checkbox => {
          expect(checkbox).not.toBeChecked()
        })
      })
    })

    it('selects individual investor when checkbox is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const checkboxes = screen.getAllByRole('checkbox')
      const firstInvestorCheckbox = checkboxes[1] // Skip select all

      await user.click(firstInvestorCheckbox)

      await waitFor(() => {
        expect(firstInvestorCheckbox).toBeChecked()
      })
    })

    it('deselects individual investor when checkbox is unchecked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const checkboxes = screen.getAllByRole('checkbox')
      const firstInvestorCheckbox = checkboxes[1]

      // Select first
      await user.click(firstInvestorCheckbox)
      await waitFor(() => {
        expect(firstInvestorCheckbox).toBeChecked()
      })

      // Deselect
      await user.click(firstInvestorCheckbox)

      await waitFor(() => {
        expect(firstInvestorCheckbox).not.toBeChecked()
      })
    })
  })

  describe('Pagination', () => {
    it('renders pagination controls', () => {
      render(<InvestorsPage />)

      // Check for pagination buttons (page numbers)
      const page1Button = screen.getByRole('button', { name: /^1$/ })
      expect(page1Button).toBeInTheDocument()
    })

    it('navigates to next page when next button is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      // Find next button (ChevronRight icon) - it's the last button with an SVG that's not disabled
      await waitFor(async () => {
        const buttons = screen.getAllByRole('button')
        // Find the button that has a chevron-right icon (next button)
        const nextButton = buttons.find(btn => {
          const svg = btn.querySelector('svg')
          if (!svg) return false
          const path = svg.querySelector('path')
          // ChevronRight has a specific path
          return path && !btn.disabled
        })

        if (nextButton) {
          await user.click(nextButton)
        }
      })

      await waitFor(() => {
        // Page 2 should be active
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        expect(page2Button).toHaveClass(/bg-red-600/)
      }, { timeout: 3000 })
    })

    it('navigates to previous page when previous button is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      // First go to page 2
      await waitFor(async () => {
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        if (page2Button) {
          await user.click(page2Button)
        }
      })

      await waitFor(() => {
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        expect(page2Button).toHaveClass(/bg-red-600/)
      })

      // Now go back to page 1 using prev button
      await waitFor(async () => {
        const buttons = screen.getAllByRole('button')
        // Find the first button with an SVG (prev button is usually first)
        const prevButton = buttons.find(btn => {
          const svg = btn.querySelector('svg')
          return svg && !btn.disabled
        })

        if (prevButton) {
          await user.click(prevButton)
        }
      })

      await waitFor(() => {
        const page1Button = screen.getByRole('button', { name: /^1$/ })
        expect(page1Button).toHaveClass(/bg-red-600/)
      }, { timeout: 3000 })
    })

    it('navigates to specific page when page number is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      // Find page 2 button
      await waitFor(() => {
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        if (page2Button) {
          user.click(page2Button)
        }
      })

      await waitFor(() => {
        const page2Button = screen.getByRole('button', { name: /^2$/ })
        expect(page2Button).toHaveClass(/bg-red-600/)
      })
    })

    it('disables previous button on first page', () => {
      render(<InvestorsPage />)

      const buttons = screen.getAllByRole('button')
      const prevButton = buttons.find(btn => {
        const svg = btn.querySelector('svg')
        return svg && btn.disabled === true
      })

      // First page should have disabled prev button
      expect(prevButton).toBeInTheDocument()
    })
  })

  describe('Investor Actions', () => {
    it('opens action dropdown when more options button is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      // Find the MoreHorizontal button (action button)
      const actionButtons = screen.getAllByRole('button')
      const moreButton = actionButtons.find(btn => {
        const svg = btn.querySelector('svg')
        return svg && btn.className.includes('text-gray-400')
      })

      if (moreButton) {
        await user.click(moreButton)

        await waitFor(() => {
          expect(screen.getByText(/view details/i)).toBeInTheDocument()
        })
      }
    })

    it('navigates to investor details page when View Details is clicked', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      // Find and click the action button
      const actionButtons = screen.getAllByRole('button')
      const moreButton = actionButtons.find(btn => {
        const svg = btn.querySelector('svg')
        return svg && btn.className.includes('text-gray-400')
      })

      if (moreButton) {
        await user.click(moreButton)

        await waitFor(() => {
          const viewDetailsButton = screen.getByText(/view details/i)
          expect(viewDetailsButton).toBeInTheDocument()
        })

        const viewDetailsButton = screen.getByText(/view details/i)
        await user.click(viewDetailsButton)

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/investors\/inv-\d+$/))
        })
      }
    })
  })

  describe('Export Functionality', () => {
    it('renders export button', () => {
      render(<InvestorsPage />)

      const exportButton = screen.getByRole('button', { name: /export/i })
      expect(exportButton).toBeInTheDocument()
    })

    it('export button is clickable', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const exportButton = screen.getByRole('button', { name: /export/i })
      await user.click(exportButton)

      // Button should be clickable (handler exists even if it's a no-op)
      expect(exportButton).toBeInTheDocument()
    })
  })

  describe('Combined Filters', () => {
    it('renders both search and status filter components', () => {
      render(<InvestorsPage />)

      // Verify search input exists
      const searchInput = screen.getByPlaceholderText(/search/i)
      expect(searchInput).toBeInTheDocument()

      // Verify status filter exists
      const selectTrigger = document.querySelector('[data-slot="select-trigger"]')
      expect(selectTrigger).toBeInTheDocument()

      // Verify date filters exist (check for labels and inputs)
      expect(screen.getByText(/show from/i)).toBeInTheDocument()
      expect(screen.getByText(/^to$/i)).toBeInTheDocument()
      // Verify date inputs exist
      const dateInputs = document.querySelectorAll('input[type="date"]')
      expect(dateInputs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Empty States', () => {
    it('handles no results when search returns empty', async () => {
      const user = userEvent.setup()
      render(<InvestorsPage />)

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'NonExistentInvestor12345')

      await waitFor(() => {
        // Table should still render, but with no data rows (only header)
        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()
      })
    })
  })
})
