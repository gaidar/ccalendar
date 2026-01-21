import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Trash2,
  User,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAdminTicket, useUpdateTicket, useDeleteTicket } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import type { TicketStatus } from '@/types';

interface TicketDetailProps {
  referenceId: string;
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <Card>
        <CardContent className="pt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function TicketDetail({ referenceId }: TicketDetailProps) {
  const navigate = useNavigate();
  const { data: ticket, isLoading, isError } = useAdminTicket(referenceId);
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();

  const [status, setStatus] = useState<TicketStatus | null>(null);
  const [adminNotes, setAdminNotes] = useState<string | null>(null);

  // Initialize state when ticket data loads
  if (ticket && status === null) {
    setStatus(ticket.status);
    setAdminNotes(ticket.adminNotes || '');
  }

  const hasChanges =
    ticket &&
    ((status !== null && status !== ticket.status) ||
      (adminNotes !== null && adminNotes !== (ticket.adminNotes || '')));

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      await updateTicket.mutateAsync({
        referenceId,
        data: {
          status: status ?? undefined,
          adminNotes: adminNotes ?? undefined,
        },
      });
      toast.success('Ticket updated successfully');
    } catch {
      toast.error('Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicket.mutateAsync(referenceId);
      toast.success('Ticket deleted successfully');
      navigate('/admin/tickets');
    } catch {
      toast.error('Failed to delete ticket');
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !ticket) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Ticket not found or failed to load</p>
            <Button variant="outline" onClick={() => navigate('/admin/tickets')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStatusConfig = getStatusConfig(status ?? ticket.status);
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/admin/tickets')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteTicket.isPending}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this ticket? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteTicket.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave} disabled={!hasChanges || updateTicket.isPending}>
            {updateTicket.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ticket Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ticket Details</CardTitle>
                <CardDescription>
                  <code className="text-sm font-mono">{ticket.referenceId}</code>
                </CardDescription>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.className}`}
              >
                <StatusIcon className="h-4 w-4" />
                {currentStatusConfig.label}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Subject</Label>
              <p className="font-medium mt-1">{ticket.subject}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Message</Label>
              <div className="mt-1 p-3 rounded-lg bg-muted/50 whitespace-pre-wrap">
                {ticket.message}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDateTime(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated {formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Ticket submitter details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{ticket.userName}</p>
                {ticket.userId && (
                  <p className="text-sm text-muted-foreground">User ID: {ticket.userId.slice(0, 8)}...</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{ticket.userEmail}</span>
            </div>

            {ticket.userId && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/admin/users/${ticket.userId}`)}
              >
                View User Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Admin Actions Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Update ticket status and add notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status ?? ticket.status}
                  onValueChange={(value) => setStatus(value as TicketStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add internal notes about this ticket..."
                value={adminNotes ?? ticket.adminNotes ?? ''}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                These notes are only visible to administrators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
