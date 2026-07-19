'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberCellAction } from './MemberCellAction';

export type TenantMemberRow = {
  userId: string;
  tenantId: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

const Columns: ColumnDef<TenantMemberRow>[] = [
  {
    accessorKey: 'user',
    header: 'Pengguna',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback>{(user.name || user.email).slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name || 'Tanpa Nama'}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role Tenant',
    cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => (
      <MemberCellAction
        tenantId={row.original.tenantId}
        userId={row.original.userId}
        userName={row.original.user.name}
      />
    ),
  },
];

export default Columns;
