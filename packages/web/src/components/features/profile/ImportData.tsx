import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  FileJson,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useImportPreview, useImport, isRateLimitError, formatRetryTime } from '@/hooks/useReports';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { ImportPreviewResponse } from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImportData() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    deleted: number;
    startDate: string;
    endDate: string;
  } | null>(null);
  const [rateLimitError, setRateLimitError] = useState<{
    message: string;
    retryAfterSeconds: number;
  } | null>(null);

  const previewMutation = useImportPreview();
  const importMutation = useImport();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (ext !== 'csv' && ext !== 'json') {
      return 'Only CSV and JSON files are supported';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit';
    }
    return null;
  };

  const processFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    setRateLimitError(null);
    setImportResult(null);

    try {
      const preview = await previewMutation.mutateAsync(file);
      setPreviewData(preview);
      setShowConfirmDialog(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to preview import file');
      setSelectedFile(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      const result = await importMutation.mutateAsync(selectedFile);
      setImportResult(result);
      setShowConfirmDialog(false);
      setSelectedFile(null);
      setPreviewData(null);
      toast.success(`Successfully imported ${result.imported} records`);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['travel-records'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err) {
      if (isRateLimitError(err)) {
        setRateLimitError({
          message: err.message,
          retryAfterSeconds: err.retryAfterSeconds,
        });
        setShowConfirmDialog(false);
      } else {
        toast.error(err instanceof Error ? err.message : 'Import failed');
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setSelectedFile(null);
    setPreviewData(null);
  };

  const clearResults = () => {
    setImportResult(null);
    setRateLimitError(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Travel Data
          </CardTitle>
          <CardDescription>
            Upload a CSV or JSON file to import your travel records. Existing records in the
            import date range will be replaced.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File upload area */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              ${previewMutation.isPending ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewMutation.isPending ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Processing file...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-4 mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <FileJson className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  CSV or JSON files up to 5MB
                </p>
              </>
            )}
          </div>

          {/* Format info */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>CSV format:</strong> Headers must include <code>date</code> and{' '}
              <code>country_code</code> columns
            </p>
            <p>
              <strong>JSON format:</strong> Array of objects with <code>date</code> and{' '}
              <code>countryCode</code> fields
            </p>
          </div>

          {/* Rate limit error */}
          {rateLimitError && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Import limit reached</p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Try again in {formatRetryTime(rateLimitError.retryAfterSeconds)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearResults}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Success message */}
          {importResult && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-green-500/10 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Import completed successfully!</p>
                <p className="text-sm mt-1">
                  Imported {importResult.imported} records
                  {importResult.deleted > 0 && `, replaced ${importResult.deleted} existing records`}
                </p>
                <p className="text-sm">
                  Date range: {importResult.startDate} to {importResult.endDate}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearResults}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            You can import up to 10 times per hour.
          </p>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Import</DialogTitle>
            <DialogDescription>
              Review the data before importing
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="space-y-4 py-4">
              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Data will be overwritten</p>
                  <p>
                    All existing records from {previewData.startDate} to {previewData.endDate}{' '}
                    will be replaced with the imported data.
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total records:</span>
                  <span className="font-medium">{previewData.totalRecords}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date range:</span>
                  <span className="font-medium">
                    {previewData.startDate} to {previewData.endDate}
                  </span>
                </div>
                {selectedFile && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File:</span>
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                )}
              </div>

              {/* Sample records */}
              {previewData.sampleRecords.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sample records:</p>
                  <div className="max-h-32 overflow-y-auto rounded-md border">
                    <table className="w-full text-xs">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="px-2 py-1 text-left">Date</th>
                          <th className="px-2 py-1 text-left">Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.sampleRecords.map((record, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1">{record.date}</td>
                            <td className="px-2 py-1">{record.countryCode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={importMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={importMutation.isPending}>
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
