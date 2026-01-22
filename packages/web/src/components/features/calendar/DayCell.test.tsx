import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@/test/utils';
import { DayCell } from './DayCell';
import type { TravelRecord } from '@/types';
import type { Country } from '@/hooks/useCountries';

const mockCountries: Country[] = [
  { code: 'US', name: 'United States', color: '#3b82f6' },
  { code: 'CA', name: 'Canada', color: '#ef4444' },
  { code: 'MX', name: 'Mexico', color: '#22c55e' },
  { code: 'GB', name: 'United Kingdom', color: '#a855f7' },
];

const createMockRecord = (id: string, countryCode: string, date: string): TravelRecord => ({
  id,
  userId: 'user1',
  countryCode,
  date,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

describe('DayCell', () => {
  const defaultProps = {
    date: new Date(2024, 5, 15), // June 15, 2024 (past date)
    currentMonth: 5,
    records: [] as TravelRecord[],
    countries: mockCountries,
    isSelected: false,
    isRangeStart: false,
    isRangeEnd: false,
    isInSelectedRange: false,
    isInHoverRange: false,
    isPendingRangeStart: false,
    onClick: vi.fn(),
    onDoubleClick: vi.fn(),
    onKeyDown: vi.fn(),
    onMouseEnter: vi.fn(),
    onMouseLeave: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 5, 20, 12, 0, 0)); // June 20, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the day number', () => {
    render(<DayCell {...defaultProps} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('calls onClick after double-click delay for single click', async () => {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    render(<DayCell {...defaultProps} onClick={onClick} onDoubleClick={onDoubleClick} />);

    fireEvent.click(screen.getByRole('button'));

    // onClick should not be called immediately
    expect(onClick).not.toHaveBeenCalled();

    // Advance timers past the double-click delay
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onClick).toHaveBeenCalledWith(defaultProps.date);
    expect(onDoubleClick).not.toHaveBeenCalled();
  });

  it('calls onDoubleClick on double-click', () => {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    render(<DayCell {...defaultProps} onClick={onClick} onDoubleClick={onDoubleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);

    expect(onDoubleClick).toHaveBeenCalledWith(defaultProps.date);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick or onDoubleClick for future dates', () => {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    const futureDate = new Date(2024, 5, 25); // June 25, 2024

    render(<DayCell {...defaultProps} date={futureDate} onClick={onClick} onDoubleClick={onDoubleClick} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onClick).not.toHaveBeenCalled();
    expect(onDoubleClick).not.toHaveBeenCalled();
  });

  it('is disabled for future dates', () => {
    const futureDate = new Date(2024, 5, 25);
    render(<DayCell {...defaultProps} date={futureDate} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onKeyDown with event and date', () => {
    const onKeyDown = vi.fn();
    render(<DayCell {...defaultProps} onKeyDown={onKeyDown} />);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(onKeyDown).toHaveBeenCalled();
    expect(onKeyDown.mock.calls[0][1]).toEqual(defaultProps.date);
  });

  it('renders country flags for records', () => {
    const records = [
      createMockRecord('1', 'US', '2024-06-15'),
      createMockRecord('2', 'CA', '2024-06-15'),
    ];

    render(<DayCell {...defaultProps} records={records} />);

    // Check for flag images by alt text
    expect(screen.getByAltText('US flag')).toBeInTheDocument();
    expect(screen.getByAltText('CA flag')).toBeInTheDocument();
  });

  it('shows overflow indicator when more than 3 countries', () => {
    const records = [
      createMockRecord('1', 'US', '2024-06-15'),
      createMockRecord('2', 'CA', '2024-06-15'),
      createMockRecord('3', 'MX', '2024-06-15'),
      createMockRecord('4', 'GB', '2024-06-15'),
    ];

    render(<DayCell {...defaultProps} records={records} />);

    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('shows +2 when 5 countries are present', () => {
    const records = [
      createMockRecord('1', 'US', '2024-06-15'),
      createMockRecord('2', 'CA', '2024-06-15'),
      createMockRecord('3', 'MX', '2024-06-15'),
      createMockRecord('4', 'GB', '2024-06-15'),
      createMockRecord('5', 'FR', '2024-06-15'),
    ];

    render(<DayCell {...defaultProps} records={records} />);

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('has aria-current="date" for today', () => {
    const today = new Date(2024, 5, 20);
    render(<DayCell {...defaultProps} date={today} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'date');
  });

  it('does not have aria-current for non-today dates', () => {
    render(<DayCell {...defaultProps} />);

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });

  it('has aria-selected when selected', () => {
    render(<DayCell {...defaultProps} isSelected={true} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-selected', 'true');
  });

  it('has aria-selected when isPendingRangeStart', () => {
    render(<DayCell {...defaultProps} isPendingRangeStart={true} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-selected', 'true');
  });

  it('has appropriate aria-label', () => {
    const records = [createMockRecord('1', 'US', '2024-06-15')];
    render(<DayCell {...defaultProps} records={records} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('2024-06-15'));
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('1 countries'));
  });

  it('applies different styles for outside month days', () => {
    render(<DayCell {...defaultProps} currentMonth={4} />); // May, but date is June

    // The button should have different styling for outside month
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-muted-foreground');
  });

  it('calls onMouseEnter when hovering', () => {
    const onMouseEnter = vi.fn();
    render(<DayCell {...defaultProps} onMouseEnter={onMouseEnter} />);

    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(onMouseEnter).toHaveBeenCalledWith(defaultProps.date);
  });

  it('calls onMouseLeave when leaving', () => {
    const onMouseLeave = vi.fn();
    render(<DayCell {...defaultProps} onMouseLeave={onMouseLeave} />);

    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('applies pending range start styles', () => {
    render(<DayCell {...defaultProps} isPendingRangeStart={true} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('animate-pulse');
  });

  it('applies hover range styles', () => {
    render(<DayCell {...defaultProps} isInHoverRange={true} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-primary/10');
  });
});
