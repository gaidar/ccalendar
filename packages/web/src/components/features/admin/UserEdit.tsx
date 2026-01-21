import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Shield, Mail, Calendar, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { useAdminUser, useUpdateUser, useDeleteUser } from '@/hooks/useAdmin';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface UserEditProps {
  userId: string;
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

export function UserEdit({ userId }: UserEditProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { data: user, isLoading, isError } = useAdminUser(userId);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);

  // Initialize state when user data loads
  if (user && isAdmin === null) {
    setIsAdmin(user.isAdmin);
    setIsConfirmed(user.isConfirmed);
  }

  const isSelf = currentUser?.id === userId;
  const hasChanges =
    user && ((isAdmin !== null && isAdmin !== user.isAdmin) || (isConfirmed !== null && isConfirmed !== user.isConfirmed));

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      await updateUser.mutateAsync({
        id: userId,
        data: {
          isAdmin: isAdmin ?? undefined,
          isConfirmed: isConfirmed ?? undefined,
        },
      });
      toast.success('User updated successfully');
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      toast.success('User deleted successfully');
      navigate('/admin/users');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">User not found or failed to load</p>
            <Button variant="outline" onClick={() => navigate('/admin/users')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div className="flex gap-2">
          {!isSelf && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteUser.isPending}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this user? This action cannot be undone
                    and will permanently remove the user and all their data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteUser.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || updateUser.isPending}>
            {updateUser.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">User ID: {user.id.slice(0, 8)}...</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDateTime(user.createdAt)}</span>
            </div>

            {user.lastLoginAt && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last login {formatDateTime(user.lastLoginAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Manage user permissions and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="admin-toggle" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administrator
                </Label>
                <p className="text-sm text-muted-foreground">
                  Grant administrative privileges
                </p>
              </div>
              <Switch
                id="admin-toggle"
                checked={isAdmin ?? user.isAdmin}
                onCheckedChange={setIsAdmin}
                disabled={isSelf}
              />
            </div>
            {isSelf && (
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                You cannot modify your own admin status
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="confirmed-toggle">Email Confirmed</Label>
                <p className="text-sm text-muted-foreground">
                  User has verified their email address
                </p>
              </div>
              <Switch
                id="confirmed-toggle"
                checked={isConfirmed ?? user.isConfirmed}
                onCheckedChange={setIsConfirmed}
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        {'recordCount' in user && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Activity and usage data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Travel Records</p>
                  <p className="text-2xl font-bold">{(user as { recordCount: number }).recordCount}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Support Tickets</p>
                  <p className="text-2xl font-bold">{(user as { ticketCount: number }).ticketCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
