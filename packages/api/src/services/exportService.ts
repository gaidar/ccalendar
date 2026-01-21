import { Readable } from 'stream';
import ExcelJS from 'exceljs';
import { reportsService } from './reportsService.js';
import type { ExportFormat } from '../validators/reportsValidator.js';

export interface ExportResult {
  stream: Readable;
  contentType: string;
  filename: string;
}

/**
 * Formats a date string for Excel (returns the date value as a Date object)
 */
function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Generates a filename for the export
 */
function generateFilename(format: ExportFormat, start: string, end: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `travel-records_${start}_to_${end}_exported_${timestamp}.${format}`;
}

class ExportService {
  /**
   * Export travel records to CSV format with streaming
   */
  async exportToCsv(
    userId: string,
    start: string,
    end: string
  ): Promise<ExportResult> {
    const records = await reportsService.getRecordsForExport(userId, start, end);

    // Create a readable stream for CSV
    const csvHeader = 'date,country_code,country_name\n';
    let csvContent = csvHeader;

    for (const record of records) {
      // Escape fields that might contain commas or quotes
      const escapedName = record.countryName.includes(',') || record.countryName.includes('"')
        ? `"${record.countryName.replace(/"/g, '""')}"`
        : record.countryName;

      csvContent += `${record.date},${record.countryCode},${escapedName}\n`;
    }

    const stream = Readable.from([csvContent]);

    return {
      stream,
      contentType: 'text/csv',
      filename: generateFilename('csv', start, end),
    };
  }

  /**
   * Export travel records to XLSX format
   */
  async exportToXlsx(
    userId: string,
    start: string,
    end: string
  ): Promise<ExportResult> {
    const records = await reportsService.getRecordsForExport(userId, start, end);

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Country Calendar';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Travel Records');

    // Define columns with proper widths
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Country Code', key: 'countryCode', width: 15 },
      { header: 'Country Name', key: 'countryName', width: 30 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    for (const record of records) {
      worksheet.addRow({
        date: parseDate(record.date),
        countryCode: record.countryCode,
        countryName: record.countryName,
      });
    }

    // Format date column
    worksheet.getColumn('date').numFmt = 'yyyy-mm-dd';

    // Create a buffer stream
    const buffer = await workbook.xlsx.writeBuffer();
    const stream = Readable.from([Buffer.from(buffer)]);

    return {
      stream,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: generateFilename('xlsx', start, end),
    };
  }

  /**
   * Export travel records in the specified format
   */
  async export(
    userId: string,
    format: ExportFormat,
    start: string,
    end: string
  ): Promise<ExportResult> {
    if (format === 'csv') {
      return this.exportToCsv(userId, start, end);
    }
    return this.exportToXlsx(userId, start, end);
  }
}

export const exportService = new ExportService();
