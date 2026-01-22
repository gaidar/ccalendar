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

/**
 * JSON export metadata interface
 */
export interface JsonExportData {
  exportDate: string;
  startDate: string;
  endDate: string;
  totalRecords: number;
  records: Array<{
    date: string;
    countryCode: string;
    countryName: string;
  }>;
}

/**
 * Escapes a CSV field if it contains special characters
 */
function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

class ExportService {
  /**
   * Export travel records to CSV format with true streaming
   * Uses async generator to avoid building entire CSV in memory
   */
  async exportToCsv(
    userId: string,
    start: string,
    end: string
  ): Promise<ExportResult> {
    const records = await reportsService.getRecordsForExport(userId, start, end);

    // Async generator for streaming CSV rows
    async function* generateCsvStream(): AsyncGenerator<string> {
      // Yield header first
      yield 'date,country_code,country_name\n';

      // Yield each record as a CSV row
      for (const record of records) {
        const escapedName = escapeCsvField(record.countryName);
        yield `${record.date},${record.countryCode},${escapedName}\n`;
      }
    }

    const stream = Readable.from(generateCsvStream());

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
   * Export travel records to JSON format
   */
  async exportToJson(
    userId: string,
    start: string,
    end: string
  ): Promise<ExportResult> {
    const records = await reportsService.getRecordsForExport(userId, start, end);

    const jsonData: JsonExportData = {
      exportDate: new Date().toISOString(),
      startDate: start,
      endDate: end,
      totalRecords: records.length,
      records: records.map(record => ({
        date: record.date,
        countryCode: record.countryCode,
        countryName: record.countryName,
      })),
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const stream = Readable.from([jsonString]);

    return {
      stream,
      contentType: 'application/json',
      filename: generateFilename('json', start, end),
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
    if (format === 'json') {
      return this.exportToJson(userId, start, end);
    }
    return this.exportToXlsx(userId, start, end);
  }
}

export const exportService = new ExportService();
