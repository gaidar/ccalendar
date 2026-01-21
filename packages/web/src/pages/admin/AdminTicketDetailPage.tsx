import { useParams } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { AdminNav, TicketDetail } from '@/components/features/admin';

export default function AdminTicketDetailPage() {
  const { referenceId } = useParams<{ referenceId: string }>();

  if (!referenceId) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Ticket className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ticket Details</h1>
            <p className="text-muted-foreground">View and manage support request</p>
          </div>
        </div>
      </div>

      <AdminNav />
      <TicketDetail referenceId={referenceId} />
    </div>
  );
}
