import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Eye, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminUsers } from '@/hooks/useAdmin';
import { useDebounce } from '@/hooks/useDebounce';
import type { AdminUser } from '@/types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface UserRowProps {
  user: AdminUser;
  onView: (id: string) => void;
}

function UserRow({ user, onView }: UserRowProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">
        <div className="font-medium">{user.name}</div>
      </td>
      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          {user.isAdmin && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Shield className="h-3 w-3" />
              Admin
            </span>
          )}
          {user.isConfirmed && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Confirmed
            </span>
          )}
          {!user.isConfirmed && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Pending
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
      <td className="py-3 px-4">
        <Button variant="ghost" size="sm" onClick={() => onView(user.id)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          <td className="py-3 px-4">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-3 px-4">
            <div className="h-5 w-48 bg-muted animate-pulse rounded" />
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

export function UserList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminUsers(page, 20, debouncedSearch || undefined);

  const handleView = useCallback(
    (id: string) => {
      navigate(`/admin/users/${id}`);
    },
    [navigate]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Users</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Email</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Joined</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <tbody>
                {data?.users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  data?.users.map((user) => (
                    <UserRow key={user.id} user={user} onView={handleView} />
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
              users
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
