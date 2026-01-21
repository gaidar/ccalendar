import { Link, useParams } from 'react-router-dom';
import { Globe, CheckCircle2, Copy, Home, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SupportConfirmationPage() {
  const { referenceId } = useParams<{ referenceId: string }>();

  const handleCopyReferenceId = async () => {
    if (referenceId) {
      try {
        await navigator.clipboard.writeText(referenceId);
        toast.success('Reference ID copied to clipboard');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Country Calendar</span>
          </Link>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Ticket Submitted!</CardTitle>
          <CardDescription>
            Thank you for contacting us. We&apos;ve received your support ticket and will get back to
            you soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reference ID Section */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground mb-2">Your Reference ID</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-lg font-bold tracking-wider text-primary">
                {referenceId || 'TKT-XXXXXXXX'}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyReferenceId}
                className="shrink-0"
                aria-label="Copy reference ID"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Please save this ID for future reference
            </p>
          </div>

          {/* Response Time Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>We typically respond within <strong>24-48 hours</strong>.</p>
            <p className="mt-1">Check your email for updates on your ticket.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" className="w-full sm:w-auto">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Submit Another
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
