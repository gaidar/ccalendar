import { describe, it, expect, beforeEach } from 'vitest';
import { useCalendarStore } from './calendarStore';
import { act } from '@testing-library/react';

describe('calendarStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { getState } = useCalendarStore;
    act(() => {
      getState().clearSelection();
      getState().clearRange();
    });
  });

  describe('viewMonth', () => {
    it('has current date as initial view month', () => {
      const { viewMonth } = useCalendarStore.getState();
      const now = new Date();
      expect(viewMonth.getFullYear()).toBe(now.getFullYear());
      expect(viewMonth.getMonth()).toBe(now.getMonth());
    });

    it('setViewMonth updates the view month', () => {
      const newMonth = new Date(2023, 5, 1);
      act(() => {
        useCalendarStore.getState().setViewMonth(newMonth);
      });
      expect(useCalendarStore.getState().viewMonth).toEqual(newMonth);
    });

    it('goToNextMonth increments the month', () => {
      const initialMonth = new Date(2024, 0, 15); // January 2024
      act(() => {
        useCalendarStore.getState().setViewMonth(initialMonth);
        useCalendarStore.getState().goToNextMonth();
      });
      const { viewMonth } = useCalendarStore.getState();
      expect(viewMonth.getMonth()).toBe(1); // February
    });

    it('goToPrevMonth decrements the month', () => {
      const initialMonth = new Date(2024, 5, 15); // June 2024
      act(() => {
        useCalendarStore.getState().setViewMonth(initialMonth);
        useCalendarStore.getState().goToPrevMonth();
      });
      const { viewMonth } = useCalendarStore.getState();
      expect(viewMonth.getMonth()).toBe(4); // May
    });

    it('goToToday sets view month and selected date to today', () => {
      const pastMonth = new Date(2020, 0, 1);
      act(() => {
        useCalendarStore.getState().setViewMonth(pastMonth);
        useCalendarStore.getState().goToToday();
      });
      const { viewMonth, selectedDate } = useCalendarStore.getState();
      const now = new Date();
      expect(viewMonth.getFullYear()).toBe(now.getFullYear());
      expect(viewMonth.getMonth()).toBe(now.getMonth());
      expect(selectedDate).not.toBeNull();
    });
  });

  describe('selectedDate', () => {
    it('has no selected date initially', () => {
      const { selectedDate } = useCalendarStore.getState();
      expect(selectedDate).toBeNull();
    });

    it('selectDate sets the selected date when not in range mode', () => {
      const date = new Date(2024, 5, 15);
      act(() => {
        useCalendarStore.getState().selectDate(date);
      });
      expect(useCalendarStore.getState().selectedDate).toEqual(date);
    });

    it('clearSelection clears the selected date', () => {
      const date = new Date(2024, 5, 15);
      act(() => {
        useCalendarStore.getState().selectDate(date);
        useCalendarStore.getState().clearSelection();
      });
      expect(useCalendarStore.getState().selectedDate).toBeNull();
    });
  });

  describe('range mode', () => {
    it('isRangeMode is false initially', () => {
      const { isRangeMode } = useCalendarStore.getState();
      expect(isRangeMode).toBe(false);
    });

    it('toggleRangeMode toggles the mode', () => {
      act(() => {
        useCalendarStore.getState().toggleRangeMode();
      });
      expect(useCalendarStore.getState().isRangeMode).toBe(true);

      act(() => {
        useCalendarStore.getState().toggleRangeMode();
      });
      expect(useCalendarStore.getState().isRangeMode).toBe(false);
    });

    it('toggleRangeMode clears selection state', () => {
      const date = new Date(2024, 5, 15);
      act(() => {
        useCalendarStore.getState().selectDate(date);
        useCalendarStore.getState().toggleRangeMode();
      });
      const state = useCalendarStore.getState();
      expect(state.selectedDate).toBeNull();
      expect(state.selectedRange).toBeNull();
      expect(state.rangeStart).toBeNull();
    });

    it('selectDate sets rangeStart in range mode', () => {
      const date = new Date(2024, 5, 15);
      act(() => {
        useCalendarStore.getState().toggleRangeMode();
        useCalendarStore.getState().selectDate(date);
      });
      const { rangeStart, selectedRange } = useCalendarStore.getState();
      expect(rangeStart).toEqual(date);
      expect(selectedRange).toBeNull();
    });

    it('selectDate completes range selection with second date', () => {
      const start = new Date(2024, 5, 10);
      const end = new Date(2024, 5, 20);
      act(() => {
        useCalendarStore.getState().toggleRangeMode();
        useCalendarStore.getState().selectDate(start);
        useCalendarStore.getState().selectDate(end);
      });
      const { selectedRange, rangeStart } = useCalendarStore.getState();
      expect(rangeStart).toBeNull();
      expect(selectedRange).not.toBeNull();
      expect(selectedRange?.start).toEqual(start);
      expect(selectedRange?.end).toEqual(end);
    });

    it('selectDate orders range correctly when end is before start', () => {
      const first = new Date(2024, 5, 20);
      const second = new Date(2024, 5, 10);
      act(() => {
        useCalendarStore.getState().toggleRangeMode();
        useCalendarStore.getState().selectDate(first);
        useCalendarStore.getState().selectDate(second);
      });
      const { selectedRange } = useCalendarStore.getState();
      expect(selectedRange?.start).toEqual(second);
      expect(selectedRange?.end).toEqual(first);
    });

    it('clearRange resets all range state', () => {
      const start = new Date(2024, 5, 10);
      const end = new Date(2024, 5, 20);
      act(() => {
        useCalendarStore.getState().toggleRangeMode();
        useCalendarStore.getState().selectDate(start);
        useCalendarStore.getState().selectDate(end);
        useCalendarStore.getState().clearRange();
      });
      const state = useCalendarStore.getState();
      expect(state.selectedRange).toBeNull();
      expect(state.rangeStart).toBeNull();
      expect(state.isRangeMode).toBe(false);
    });
  });

  describe('picker', () => {
    it('picker is closed initially', () => {
      const { isPickerOpen, pickerTargetDate } = useCalendarStore.getState();
      expect(isPickerOpen).toBe(false);
      expect(pickerTargetDate).toBeNull();
    });

    it('openPicker opens picker with target date', () => {
      const date = new Date(2024, 5, 15);
      act(() => {
        useCalendarStore.getState().openPicker(date);
      });
      const { isPickerOpen, pickerTargetDate } = useCalendarStore.getState();
      expect(isPickerOpen).toBe(true);
      expect(pickerTargetDate).toEqual(date);
    });

    it('closePicker closes picker and clears target date', () => {
      const date = new Date(2024, 5, 15);
      act(() => {
        useCalendarStore.getState().openPicker(date);
        useCalendarStore.getState().closePicker();
      });
      const { isPickerOpen, pickerTargetDate } = useCalendarStore.getState();
      expect(isPickerOpen).toBe(false);
      expect(pickerTargetDate).toBeNull();
    });
  });
});
