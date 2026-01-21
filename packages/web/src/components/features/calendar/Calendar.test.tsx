import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { Calendar } from './Calendar';
import { useCalendarStore } from '@/stores/calendarStore';
import { useRecordsByDateMap } from '@/hooks/useTravelRecords';
import { useCountries } from '@/hooks/useCountries';
import { act } from '@testing-library/react';

// Mock the hooks
vi.mock('@/hooks/useTravelRecords', () => ({
  useRecordsByDateMap: vi.fn(),
}));

vi.mock('@/hooks/useCountries', () => ({
  useCountries: vi.fn(),
}));

const mockUseRecordsByDateMap = vi.mocked(useRecordsByDateMap);
const mockUseCountries = vi.mocked(useCountries);

describe('Calendar', () => {
  const mockOnDayClick = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 5, 15, 12, 0, 0)); // June 15, 2024

    // Reset store state
    act(() => {
      const store = useCalendarStore.getState();
      store.setViewMonth(new Date(2024, 5, 1));
      store.clearSelection();
      store.clearRange();
    });

    // Mock hooks
    mockUseRecordsByDateMap.mockReturnValue({
      recordsByDate: new Map(),
      isLoading: false,
      error: null,
    });

    mockUseCountries.mockReturnValue({
      data: {
        countries: [
          { code: 'US', name: 'United States', color: '#3b82f6' },
          { code: 'CA', name: 'Canada', color: '#ef4444' },
        ],
        total: 2,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useCountries>);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the calendar grid', () => {
    render(<Calendar onDayClick={mockOnDayClick} />);

    // Check for weekday headers
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('renders month navigation', () => {
    render(<Calendar onDayClick={mockOnDayClick} />);

    expect(screen.getByText('June 2024')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
  });

  it('navigates to previous month', () => {
    render(<Calendar onDayClick={mockOnDayClick} />);

    fireEvent.click(screen.getByLabelText('Previous month'));

    expect(screen.getByText('May 2024')).toBeInTheDocument();
  });

  it('navigates to next month', () => {
    render(<Calendar onDayClick={mockOnDayClick} />);

    fireEvent.click(screen.getByLabelText('Next month'));

    expect(screen.getByText('July 2024')).toBeInTheDocument();
  });

  it('renders all days of the month', () => {
    render(<Calendar onDayClick={mockOnDayClick} />);

    // June has 30 days - use getAllByText since leading/trailing days may have same numbers
    for (let i = 1; i <= 30; i++) {
      const elements = screen.getAllByText(String(i));
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('calls onDayClick when a day is clicked', () => {
    render(<Calendar onDayClick={mockOnDayClick} />);

    // Click on day 10 (past date)
    const day10Button = screen.getByLabelText(/2024-06-10/);
    fireEvent.click(day10Button);

    expect(mockOnDayClick).toHaveBeenCalled();
    const calledDate = mockOnDayClick.mock.calls[0][0];
    expect(calledDate.getDate()).toBe(10);
  });

  it('shows range mode indicator when in range mode', () => {
    act(() => {
      useCalendarStore.getState().toggleRangeMode();
    });

    render(<Calendar onDayClick={mockOnDayClick} />);

    expect(screen.getByText('Select start date')).toBeInTheDocument();
  });

  it('shows "Select end date" after selecting start', () => {
    act(() => {
      const store = useCalendarStore.getState();
      store.toggleRangeMode();
      store.selectDate(new Date(2024, 5, 10));
    });

    render(<Calendar onDayClick={mockOnDayClick} />);

    expect(screen.getByText('Select end date')).toBeInTheDocument();
  });

  it('shows Today button that navigates to current date', () => {
    // First go to a different month
    act(() => {
      useCalendarStore.getState().setViewMonth(new Date(2024, 0, 1)); // January
    });

    render(<Calendar onDayClick={mockOnDayClick} />);

    expect(screen.getByText('January 2024')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /today/i }));

    expect(screen.getByText('June 2024')).toBeInTheDocument();
  });

  it('applies loading state opacity', () => {
    mockUseRecordsByDateMap.mockReturnValue({
      recordsByDate: new Map(),
      isLoading: true,
      error: null,
    });

    render(<Calendar onDayClick={mockOnDayClick} />);

    // The grid should have opacity class when loading
    const grid = document.querySelector('.grid.grid-cols-7.gap-px');
    expect(grid?.className).toContain('opacity-50');
  });

  it('renders records from recordsByDate map', () => {
    const recordsMap = new Map([
      [
        '2024-06-10',
        [
          {
            id: '1',
            userId: 'u1',
            countryCode: 'US',
            date: '2024-06-10',
            createdAt: '',
            updatedAt: '',
          },
        ],
      ],
    ]);

    mockUseRecordsByDateMap.mockReturnValue({
      recordsByDate: recordsMap,
      isLoading: false,
      error: null,
    });

    render(<Calendar onDayClick={mockOnDayClick} />);

    // The day 10 should have a country indicator
    expect(screen.getByTitle('US')).toBeInTheDocument();
  });
});
