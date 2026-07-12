'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
} from 'lucide-react';

import Heading from '@/components/Common/Heading';
import { Separator } from '@/components/ui/separator';
import { getSupportMessagesAction, updateSupportMessageStatusAction } from '@/services/support';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#B04A3F',
    bg: 'rgba(176,74,63,0.08)',
    border: 'rgba(176,74,63,0.25)',
    icon: AlertCircle,
  },
  PROCESS: {
    label: 'Diproses',
    color: '#D97757',
    bg: 'rgba(217,119,87,0.08)',
    border: 'rgba(217,119,87,0.25)',
    icon: Clock,
  },
  RESOLVED: {
    label: 'Selesai',
    color: '#788C5D',
    bg: 'rgba(120,140,93,0.08)',
    border: 'rgba(120,140,93,0.25)',
    icon: CheckCircle2,
  },
} as const;

const SupportMessagesPage: FC = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch support messages
  const { data: response, isLoading } = useQuery({
    queryKey: ['support-messages'],
    queryFn: async () => {
      const res = await getSupportMessagesAction();
      if (!res.success) {
        throw new Error(res.error ?? 'Gagal mengambil data.');
      }
      return res.data ?? [];
    },
  });

  const messages = response ?? [];

  // Mutation to update message status
  const { mutate: handleUpdateStatus } = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'PENDING' | 'PROCESS' | 'RESOLVED';
    }) => {
      const res = await updateSupportMessageStatusAction(id, status);
      if (!res.success) {
        throw new Error(res.error ?? 'Gagal memperbarui status.');
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success('Status pengaduan berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

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

  const filteredMessages = messages.filter((msg) => {
    const matchesStatus = selectedStatus === 'ALL' || msg.status === selectedStatus;
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Inbox Pengaduan"
          description="Kelola aduan bantuan pelanggan dan hubungi langsung via WhatsApp."
        />
      </div>
      <Separator />

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'PROCESS', 'RESOLVED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedStatus === status
                  ? 'bg-[#141413] text-white border-transparent'
                  : 'bg-white text-[#3D3D3A] border-[#D1CFC5] hover:border-[#141413]'
              }`}
            >
              {status === 'ALL'
                ? 'Semua'
                : status === 'PENDING'
                  ? 'Pending'
                  : status === 'PROCESS'
                    ? 'Diproses'
                    : 'Selesai'}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87867F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, issue..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#E3DACC] bg-white text-[#3D3D3A] placeholder-[#87867F] text-xs outline-none focus:border-[#D97757]"
          />
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="py-20 text-center text-sm font-mono text-[#87867F]">
          Memuat pesan masuk...
        </div>
      ) : filteredMessages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredMessages.map((msg) => {
            const statusInfo =
              STATUS_CONFIG[msg.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={msg.id}
                className="rounded-3xl p-6 bg-white border border-[#E3DACC] space-y-4 hover:shadow-lg transition-all duration-200"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#87867F] block">
                      KATEGORI: {msg.category.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#141413]">{msg.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Pill */}
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: statusInfo.bg,
                        borderColor: statusInfo.border,
                        color: statusInfo.color,
                      }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </div>

                    {/* Status Changer Select */}
                    <select
                      value={msg.status}
                      onChange={(e) =>
                        handleUpdateStatus({
                          id: msg.id,
                          status: e.target.value as 'PENDING' | 'PROCESS' | 'RESOLVED',
                        })
                      }
                      className="px-2.5 py-1 text-xs rounded-xl border border-[#D1CFC5] bg-white outline-none focus:border-[#D97757]"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESS">Proses</option>
                      <option value="RESOLVED">Selesai</option>
                    </select>
                  </div>
                </div>

                {/* Sender details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E3DACC] text-xs">
                  <div>
                    <span className="text-[#87867F] block uppercase tracking-wider text-[9px] font-bold">
                      Pengirim
                    </span>
                    <span className="font-semibold text-[#3D3D3A]">{msg.name}</span>
                  </div>
                  <div>
                    <span className="text-[#87867F] block uppercase tracking-wider text-[9px] font-bold">
                      Email
                    </span>
                    <span className="font-semibold text-[#3D3D3A]">{msg.email}</span>
                  </div>
                  <div>
                    <span className="text-[#87867F] block uppercase tracking-wider text-[9px] font-bold">
                      Waktu Laporan
                    </span>
                    <span className="font-semibold text-[#3D3D3A]">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Chronology Textbox */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#87867F]">
                    Kronologi Kejadian
                  </span>
                  <div
                    className="p-4 rounded-2xl text-sm leading-relaxed text-[#3D3D3A] whitespace-pre-wrap"
                    style={{ background: '#F0EEE6', border: '1.5px solid #E3DACC' }}
                  >
                    {msg.chronology}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-[10px] text-[#87867F]">
                    Nomor Telepon: <strong className="text-[#141413]">{msg.phone}</strong>
                  </div>

                  <a
                    href={getWhatsAppLink(msg.phone, msg.name, msg.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: '#788C5D' }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hubungi via WhatsApp
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#E3DACC]">
          <p className="text-sm font-semibold text-[#3D3D3A]">
            Tidak ada pesan pengaduan ditemukan
          </p>
          <p className="text-xs text-[#87867F] mt-1">
            Belum ada user yang melaporkan kendala atau hasil filter kosong.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportMessagesPage;
