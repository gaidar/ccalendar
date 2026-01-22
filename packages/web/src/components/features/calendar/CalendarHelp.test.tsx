import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarHelp } from './CalendarHelp';

describe('CalendarHelp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows help block when not dismissed', () => {
    render(<CalendarHelp initialDismissed={false} />);

    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(screen.getByText('How to use the calendar')).toBeInTheDocument();
    expect(screen.getByText('Double-click a day')).toBeInTheDocument();
    expect(screen.getByText('Click two different days')).toBeInTheDocument();
  });

  it('shows help icon when dismissed', () => {
    render(<CalendarHelp initialDismissed={true} />);

    expect(screen.getByRole('button', { name: /how it works/i })).toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('dismisses help block when close button is clicked', () => {
    render(<CalendarHelp initialDismissed={false} />);

    expect(screen.getByRole('note')).toBeInTheDocument();

    const dismissButton = screen.getByRole('button', { name: /dismiss help/i });
    fireEvent.click(dismissButton);

    // UI should update
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /how it works/i })).toBeInTheDocument();
  });

  it('shows help block again when help icon is clicked', () => {
    render(<CalendarHelp initialDismissed={true} />);

    expect(screen.getByRole('button', { name: /how it works/i })).toBeInTheDocument();

    const helpButton = screen.getByRole('button', { name: /how it works/i });
    fireEvent.click(helpButton);

    // UI should update
    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /how it works/i })).not.toBeInTheDocument();
  });

  it('contains keyboard shortcut information', () => {
    render(<CalendarHelp initialDismissed={false} />);

    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(screen.getByText('Esc')).toBeInTheDocument();
  });
});
