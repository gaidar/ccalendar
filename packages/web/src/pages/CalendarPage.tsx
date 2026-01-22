import { useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { Calendar, CountryPicker, BulkUpdateModal, DateSelectionPanel, formatDateKey } from '@/components/features/calendar';
import { CalendarHelp } from '@/components/features/calendar/CalendarHelp';
import { useCalendarStore } from '@/stores/calendarStore';
import { useAuthStore } from '@/stores/authStore';
import { useCountries } from '@/hooks/useCountries';
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
    selectedRange,
    rangeStart,
    closePicker,
    clearRange,
    openPicker,
  } = useCalendarStore();

  const { data: recordsData, isLoading: recordsLoading } = useTravelRecords(viewMonth);
  const { data: countriesData } = useCountries();
  const countries = countriesData?.countries || [];
  const createRecord = useCreateTravelRecord();
  const deleteRecord = useDeleteTravelRecord();
  const bulkUpdate = useBulkUpdateTravelRecords();

  // Get records for the target date when picker is open
  const selectedDateRecords = useMemo(() => {
    if (!pickerTargetDate || !recordsData?.records) return [];
    const dateKey = formatDateKey(pickerTargetDate);
    return recordsData.records.filter(r => r.date === dateKey);
  }, [pickerTargetDate, recordsData?.records]);

  // Get records for rangeStart date (for inline panel)
  const rangeStartRecords = useMemo(() => {
    if (!rangeStart || !recordsData?.records) return [];
    const dateKey = formatDateKey(rangeStart);
    return recordsData.records.filter(r => r.date === dateKey);
  }, [rangeStart, recordsData?.records]);

  const selectedCountryCodes = useMemo(
    () => selectedDateRecords.map(r => r.countryCode),
    [selectedDateRecords]
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
        logger.error('Operation failed', error);
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
        logger.error('Operation failed', error);
      }
    },
    [selectedRange, bulkUpdate, clearRange]
  );

  // Handle removing a country from the inline panel
  const handleRemoveCountry = useCallback(
    async (recordId: string) => {
      try {
        await deleteRecord.mutateAsync(recordId);
        toast.success('Country removed');
      } catch (error) {
        toast.error('Failed to remove country');
        logger.error('Operation failed', error);
      }
    },
    [deleteRecord]
  );

  // Handle opening picker from inline panel
  const handleOpenPickerFromPanel = useCallback(() => {
    if (rangeStart) {
      openPicker(rangeStart);
    }
  }, [rangeStart, openPicker]);

  const isSaving =
    createRecord.isPending || deleteRecord.isPending || bulkUpdate.isPending;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Track and visualize your journeys</p>
      </div>

      {/* Loading state */}
      {recordsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Calendar */}
      {!recordsLoading && <Calendar />}

      {/* Date selection panel - shows when a date is clicked */}
      {rangeStart && (
        <div className="mt-4">
          <DateSelectionPanel
            date={rangeStart}
            records={rangeStartRecords}
            countries={countries}
            onRemoveCountry={handleRemoveCountry}
            onAddCountries={handleOpenPickerFromPanel}
            onClose={clearRange}
            isLoading={deleteRecord.isPending}
          />
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full ring-2 ring-primary" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          <span>Range start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="h-4 w-5 rounded-sm bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="h-4 w-5 rounded-sm bg-gradient-to-r from-green-500 to-green-600" />
          </div>
          <span>Countries visited</span>
        </div>
      </div>

      {/* Help block */}
      <CalendarHelp />

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
