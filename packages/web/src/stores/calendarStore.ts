import { create } from 'zustand';
import { isSameDay } from '@/components/features/calendar/utils';

interface DateRange {
  start: Date;
  end: Date;
}

interface CalendarState {
  // Current view state
  viewMonth: Date;
  selectedDate: Date | null;

  // Range selection (gesture-based: click-click selects range)
  selectedRange: DateRange | null;
  rangeStart: Date | null;
  hoveredDate: Date | null;

  // Country picker
  isPickerOpen: boolean;
  pickerTargetDate: Date | null;

  // Actions
  setViewMonth: (date: Date) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;

  selectDate: (date: Date) => void;
  clearSelection: () => void;

  // Range actions (gesture-based)
  handleSingleClick: (date: Date) => void;
  handleDoubleClick: (date: Date) => void;
  setHoveredDate: (date: Date | null) => void;
  setRangeStart: (date: Date) => void;
  setRangeEnd: (date: Date) => void;
  clearRange: () => void;

  openPicker: (date: Date) => void;
  closePicker: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  viewMonth: new Date(),
  selectedDate: null,
  selectedRange: null,
  rangeStart: null,
  hoveredDate: null,
  isPickerOpen: false,
  pickerTargetDate: null,

  setViewMonth: (date: Date) => set({ viewMonth: date }),

  goToNextMonth: () => {
    const { viewMonth } = get();
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() + 1);
    set({ viewMonth: next });
  },

  goToPrevMonth: () => {
    const { viewMonth } = get();
    const prev = new Date(viewMonth);
    prev.setMonth(prev.getMonth() - 1);
    set({ viewMonth: prev });
  },

  goToToday: () => {
    set({ viewMonth: new Date(), selectedDate: new Date() });
  },

  selectDate: (date: Date) => {
    set({ selectedDate: date });
  },

  clearSelection: () => set({ selectedDate: null }),

  // Single click: starts range selection or completes it
  handleSingleClick: (date: Date) => {
    const { rangeStart, openPicker } = get();

    if (!rangeStart) {
      // First click: set range start
      set({ rangeStart: date, selectedRange: null });
    } else if (isSameDay(rangeStart, date)) {
      // Clicked same date: clear range start and open picker for single date
      set({ rangeStart: null });
      openPicker(date);
    } else {
      // Second click on different date: complete range
      const start = rangeStart < date ? rangeStart : date;
      const end = rangeStart < date ? date : rangeStart;
      set({
        selectedRange: { start, end },
        rangeStart: null,
        hoveredDate: null,
      });
    }
  },

  // Double click: open picker for single date
  handleDoubleClick: (date: Date) => {
    const { openPicker } = get();
    set({ rangeStart: null, selectedRange: null, hoveredDate: null });
    openPicker(date);
  },

  setHoveredDate: (date: Date | null) => set({ hoveredDate: date }),

  setRangeStart: (date: Date) => set({ rangeStart: date }),

  setRangeEnd: (date: Date) => {
    const { rangeStart } = get();
    if (!rangeStart) return;

    const start = rangeStart < date ? rangeStart : date;
    const end = rangeStart < date ? date : rangeStart;
    set({
      selectedRange: { start, end },
      rangeStart: null,
      hoveredDate: null,
    });
  },

  clearRange: () =>
    set({
      selectedRange: null,
      rangeStart: null,
      hoveredDate: null,
    }),

  openPicker: (date: Date) =>
    set({
      isPickerOpen: true,
      pickerTargetDate: date,
    }),

  closePicker: () =>
    set({
      isPickerOpen: false,
      pickerTargetDate: null,
    }),
}));
