import { useCallback, useMemo } from 'react';
import { CalendarRange, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar, CountryPicker, BulkUpdateModal, formatDateKey } from '@/components/features/calendar';
import { useCalendarStore } from '@/stores/calendarStore';
import { useAuthStore } from '@/stores/authStore';
import {
  useTravelRecords,
  useCreateTravelRecord,
  useDeleteTravelRecord,
  useBulkUpdateTravelRecords,
} from '@/hooks/useTravelRecords';

export default function CalendarPage() {
  const { user } = useAuthStore();
  const {
    viewMonth,
    isPickerOpen,
    pickerTargetDate,
    isRangeMode,
    selectedRange,
    openPicker,
    closePicker,
    toggleRangeMode,
    clearRange,
  } = useCalendarStore();

  const { data: recordsData, isLoading: recordsLoading } = useTravelRecords(viewMonth);
  const createRecord = useCreateTravelRecord();
  const deleteRecord = useDeleteTravelRecord();
  const bulkUpdate = useBulkUpdateTravelRecords();

  // Get records for the target date when picker is open
  const selectedDateRecords = useMemo(() => {
    if (!pickerTargetDate || !recordsData?.records) return [];
    const dateKey = formatDateKey(pickerTargetDate);
    return recordsData.records.filter(r => r.date === dateKey);
  }, [pickerTargetDate, recordsData?.records]);

  const selectedCountryCodes = useMemo(
    () => selectedDateRecords.map(r => r.countryCode),
    [selectedDateRecords]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      openPicker(date);
    },
    [openPicker]
  );

  const handlePickerSave = useCallback(
    async (countryCodes: string[]) => {
      if (!pickerTargetDate) return;

      const dateKey = formatDateKey(pickerTargetDate);
      const existingCodes = new Set(selectedCountryCodes.map(c => c.toUpperCase()));
      const newCodes = new Set(countryCodes.map(c => c.toUpperCase()));

      // Find records to delete (in existing but not in new)
      const toDelete = selectedDateRecords.filter(
        r => !newCodes.has(r.countryCode.toUpperCase())
      );

      // Find codes to add (in new but not in existing)
      const toAdd = countryCodes.filter(c => !existingCodes.has(c.toUpperCase()));

      try {
        // Delete removed countries
        await Promise.all(toDelete.map(r => deleteRecord.mutateAsync(r.id)));

        // Add new countries
        await Promise.all(
          toAdd.map(countryCode =>
            createRecord.mutateAsync({ date: dateKey, countryCode })
          )
        );

        closePicker();
        toast.success('Travel record updated');
      } catch (error) {
        toast.error('Failed to update travel record');
        console.error(error);
      }
    },
    [pickerTargetDate, selectedCountryCodes, selectedDateRecords, createRecord, deleteRecord, closePicker]
  );

  const handleBulkUpdate = useCallback(
    async (countryCodes: string[]) => {
      if (!selectedRange) return;

      try {
        await bulkUpdate.mutateAsync({
          startDate: formatDateKey(selectedRange.start),
          endDate: formatDateKey(selectedRange.end),
          countryCodes,
        });

        clearRange();
        toast.success('Records updated successfully');
      } catch (error) {
        toast.error('Failed to update records');
        console.error(error);
      }
    },
    [selectedRange, bulkUpdate, clearRange]
  );

  const isSaving =
    createRecord.isPending || deleteRecord.isPending || bulkUpdate.isPending;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Track and visualize your journeys</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isRangeMode ? 'default' : 'outline'}
            onClick={toggleRangeMode}
            className="gap-2"
          >
            <CalendarRange className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isRangeMode ? 'Cancel Range' : 'Select Range'}
            </span>
            <span className="sm:hidden">Range</span>
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {recordsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Calendar */}
      {!recordsLoading && <Calendar onDayClick={handleDayClick} />}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full ring-2 ring-primary" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div className="h-2 w-2 rounded-full bg-orange-500" />
          </div>
          <span>Countries visited</span>
        </div>
      </div>

      {/* Country Picker for single date */}
      <CountryPicker
        isOpen={isPickerOpen}
        onClose={closePicker}
        targetDate={pickerTargetDate}
        selectedCountryCodes={selectedCountryCodes}
        onSave={handlePickerSave}
        isLoading={isSaving}
      />

      {/* Bulk Update Modal for date range */}
      <BulkUpdateModal
        isOpen={!!selectedRange}
        onClose={clearRange}
        dateRange={selectedRange}
        onSave={handleBulkUpdate}
        isLoading={bulkUpdate.isPending}
      />
    </div>
  );
}
