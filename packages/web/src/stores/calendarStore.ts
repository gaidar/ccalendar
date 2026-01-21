import { create } from 'zustand';

interface DateRange {
  start: Date;
  end: Date;
}

interface CalendarState {
  // Current view state
  viewMonth: Date;
  selectedDate: Date | null;

  // Range selection
  isRangeMode: boolean;
  selectedRange: DateRange | null;
  rangeStart: Date | null;

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

  toggleRangeMode: () => void;
  setRangeStart: (date: Date) => void;
  setRangeEnd: (date: Date) => void;
  clearRange: () => void;

  openPicker: (date: Date) => void;
  closePicker: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  viewMonth: new Date(),
  selectedDate: null,
  isRangeMode: false,
  selectedRange: null,
  rangeStart: null,
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
    const { isRangeMode, rangeStart } = get();

    if (isRangeMode) {
      if (!rangeStart) {
        set({ rangeStart: date });
      } else {
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        set({
          selectedRange: { start, end },
          rangeStart: null,
        });
      }
    } else {
      set({ selectedDate: date });
    }
  },

  clearSelection: () => set({ selectedDate: null }),

  toggleRangeMode: () => {
    const { isRangeMode } = get();
    set({
      isRangeMode: !isRangeMode,
      selectedRange: null,
      rangeStart: null,
      selectedDate: null,
    });
  },

  setRangeStart: (date: Date) => set({ rangeStart: date }),

  setRangeEnd: (date: Date) => {
    const { rangeStart } = get();
    if (!rangeStart) return;

    const start = rangeStart < date ? rangeStart : date;
    const end = rangeStart < date ? date : rangeStart;
    set({
      selectedRange: { start, end },
      rangeStart: null,
    });
  },

  clearRange: () =>
    set({
      selectedRange: null,
      rangeStart: null,
      isRangeMode: false,
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
