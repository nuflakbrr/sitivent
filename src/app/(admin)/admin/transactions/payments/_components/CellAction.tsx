'use client';
import { type FC, useState, useTransition } from 'react';
import { Copy, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import type { Payment } from '@/interfaces/features/payments';
import { usePermission } from '@/providers/PermissionProvider';
import { copyToClipboard } from '@/lib/clipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AlertModal from '@/components/Common/Modals/AlertModal';
import Modal from '@/components/Common/Modals/Modal';
import { PaymentStatus } from '@/generated/prisma/enums';
import { verifyPayment } from '@/services/payments';

interface CellActionProps {
  data: Payment;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [openVerify, setOpenVerify] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isPending, startTransition] = useTransition();

  const onVerify = () => {
    startTransition(async () => {
      const res = await verifyPayment(data.id, PaymentStatus.PAID);
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['payments'] });
      } else {
        toast.error(res.error);
      }
      setOpenVerify(false);
    });
  };

  const onReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Alasan penolakan wajib diisi.');
      return;
    }
    startTransition(async () => {
      const res = await verifyPayment(data.id, PaymentStatus.FAILED, rejectReason);
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['payments'] });
      } else {
        toast.error(res.error);
      }
      setOpenReject(false);
    });
  };

  return (
    <>
      <AlertModal
        isOpen={openVerify}
        onClose={() => setOpenVerify(false)}
        onConfirm={onVerify}
        loading={isPending}
        title="Setujui Pembayaran"
        desc="Apakah Anda yakin ingin menyetujui bukti pembayaran ini?"
      />

      <Modal
        isOpen={openReject}
        onClose={() => setOpenReject(false)}
        title="Tolak Pembayaran"
        description="Masukkan alasan penolakan bukti pembayaran ini."
      >
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder="Contoh: Bukti transfer buram atau nominal tidak sesuai."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            disabled={isPending}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-end space-x-2">
            <Button disabled={isPending} variant="outline" onClick={() => setOpenReject(false)}>
              Batal
            </Button>
            <Button disabled={isPending} variant="destructive" onClick={onReject}>
              Tolak Pembayaran
            </Button>
          </div>
        </div>
      </Modal>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyToClipboard(data.registration.registrationNumber)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Salin No. Registrasi
          </DropdownMenuItem>

          {data.status === PaymentStatus.WAITING && hasPermission('payments.verify') && (
            <>
              <DropdownMenuItem
                className="cursor-pointer text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/20"
                onClick={() => setOpenVerify(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Setujui
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20"
                onClick={() => setOpenReject(true)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Tolak
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
