'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addTenantMember, searchAvailableUsers } from '@/services/tenant-members';

export function AddMemberDialog({
  tenantId,
  onSuccess,
}: {
  tenantId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('member');

  const { data } = useQuery({
    queryKey: ['tenant-available-users', tenantId, search],
    queryFn: () => searchAvailableUsers(tenantId, search),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => addTenantMember(tenantId, userId, role),
    onSuccess: (res) => {
      if (!res.success) return toast.error(res.error || 'Gagal menambah member.');
      toast.success(res.message || 'Member ditambahkan.');
      setOpen(false);
      setUserId('');
      setRole('member');
      onSuccess();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah User ke Tenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Cari user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih user" />
            </SelectTrigger>
            <SelectContent>
              {(data?.data || []).map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name || u.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Role tenant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">member</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
              <SelectItem value="manager">manager</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={!userId || mutation.isPending} onClick={() => mutation.mutate()}>
            Tambah
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
