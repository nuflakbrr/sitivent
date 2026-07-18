'use client';
import { useState, type FC } from 'react';
import { Copy, Eye, MessageCircle, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import type { SupportMessage } from '@/interfaces/features/support';
import { copyToClipboard } from '@/lib/clipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Modal from '@/components/Common/Modals/Modal';

interface CellActionProps {
  data: SupportMessage;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const [openDetail, setOpenDetail] = useState(false);

  const getWhatsAppLink = (phone: string, name: string, title: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    const text = encodeURIComponent(
      `Halo ${name},\n\nKami dari tim Support Sitivent ingin menindaklanjuti laporan Anda mengenai "${title}".\n\nBagaimana kami bisa membantu Anda?`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <>
      {/* Detail Modal */}
      <Modal
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        title="Detail Pengaduan"
        description="Informasi lengkap mengenai laporan pengaduan bantuan pelanggan."
        className="sm:max-w-xl"
      >
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border">
            <div>
              <span className="text-muted-foreground block font-semibold uppercase text-[10px]">
                Pengirim
              </span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-semibold uppercase text-[10px]">
                Kategori
              </span>
              <span className="font-medium">{data.category}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-semibold uppercase text-[10px]">
                Email
              </span>
              <span className="font-medium">{data.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block font-semibold uppercase text-[10px]">
                Telepon
              </span>
              <span className="font-medium">{data.phone}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase text-[10px]">
              Subjek
            </span>
            <p className="text-sm font-semibold">{data.title}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase text-[10px]">
              Kronologi Kejadian
            </span>
            <div className="p-4 rounded-xl text-sm bg-muted/60 border whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {data.chronology}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpenDetail(false)}>
              Tutup
            </Button>
            <Button asChild>
              <a
                href={getWhatsAppLink(data.phone, data.name, data.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Hubungi WhatsApp
              </a>
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
          <DropdownMenuItem
            onClick={() => {
              copyToClipboard(data.id);
              toast.success('ID disalin ke clipboard.');
            }}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDetail(true)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={getWhatsAppLink(data.phone, data.name, data.title)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4 text-emerald-500" /> WhatsApp
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
