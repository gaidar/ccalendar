import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteAccount } from '@/hooks/useProfile';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface DeleteAccountProps {
  profile: Profile | undefined;
}

export function DeleteAccount({ profile }: DeleteAccountProps) {
  const [confirmation, setConfirmation] = useState('');
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const deleteAccount = useDeleteAccount();

  const isConfirmValid = confirmation === 'DELETE';

  const handleDelete = async () => {
    try {
      await deleteAccount.mutateAsync('DELETE');
      toast.success('Account deleted. Goodbye!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
      setShowFinalConfirm(false);
    }
  };

  return (
    <>
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-300">
              <p className="font-medium mb-1">This action cannot be undone.</p>
              <p>Deleting your account will permanently remove:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Your profile and account information</li>
                <li>All {profile?.stats.totalDays ?? 0} travel records</li>
                <li>All connected social accounts</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmDelete">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </Label>
            <Input
              id="confirmDelete"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="font-mono"
            />
          </div>

          <Button
            variant="destructive"
            className="w-full"
            disabled={!isConfirmValid || deleteAccount.isPending}
            onClick={() => setShowFinalConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showFinalConfirm} onOpenChange={setShowFinalConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Final Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete your account? This will permanently delete
              all your data including {profile?.stats.totalDays ?? 0} travel records. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAccount.isPending}
            >
              {deleteAccount.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
