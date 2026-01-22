import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight, Filter, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminTickets } from '@/hooks/useAdmin';
import type { AdminTicket, TicketStatus } from '@/types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusConfig(status: TicketStatus) {
  switch (status) {
    case 'open':
      return {
        icon: Clock,
        label: 'Open',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      };
    case 'in_progress':
      return {
        icon: Clock,
        label: 'In Progress',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      };
    case 'resolved':
      return {
        icon: CheckCircle,
        label: 'Resolved',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      };
    case 'closed':
      return {
        icon: XCircle,
        label: 'Closed',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      };
    default:
      return {
        icon: Clock,
        label: status,
        className: 'bg-gray-100 text-gray-800',
      };
  }
}

interface TicketRowProps {
  ticket: AdminTicket;
  onView: (referenceId: string) => void;
}

const TicketRow = memo(function TicketRow({ ticket, onView }: TicketRowProps) {
  const statusConfig = getStatusConfig(ticket.status);
  const StatusIcon = statusConfig.icon;

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
          {ticket.referenceId}
        </code>
      </td>
      <td className="py-3 px-4">
        <div className="max-w-xs truncate font-medium">{ticket.subject}</div>
      </td>
      <td className="py-3 px-4 text-muted-foreground">{ticket.userName}</td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
        >
          <StatusIcon className="h-3 w-3" />
          {statusConfig.label}
        </span>
      </td>
      <td className="py-3 px-4 text-muted-foreground">{formatDate(ticket.createdAt)}</td>
      <td className="py-3 px-4">
        <Button variant="ghost" size="sm" onClick={() => onView(ticket.referenceId)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </td>
    </tr>
  );
});

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          <td className="py-3 px-4">
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-3 px-4">
            <div className="h-5 w-48 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-3 px-4">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-3 px-4">
            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-3 px-4">
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-3 px-4">
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function TicketList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const { data, isLoading } = useAdminTickets(
    page,
    20,
    statusFilter === 'all' ? undefined : statusFilter
  );

  const handleView = useCallback(
    (referenceId: string) => {
      navigate(`/admin/tickets/${referenceId}`);
    },
    [navigate]
  );

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as TicketStatus | 'all');
    setPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Support Tickets</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-4 font-medium text-muted-foreground">Reference</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Subject</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">User</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Created</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <tbody>
                {data?.tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  data?.tickets.map((ticket) => (
                    <TicketRow key={ticket.id} ticket={ticket} onView={handleView} />
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * 20 + 1} to{' '}
              {Math.min(page * 20, data.pagination.total)} of {data.pagination.total}{' '}
              tickets
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
