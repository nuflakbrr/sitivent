import { type FC } from 'react';

type Props = {
  code?: string;
};

export const FailureResultCard: FC<Props> = ({ code }) => {
  return (
    <div className="space-y-3 text-left text-xs bg-white/60 dark:bg-zinc-950/40 p-5 rounded-2xl border text-muted-foreground leading-relaxed">
      <p className="font-bold text-zinc-800 dark:text-zinc-200">Panduan Kegagalan:</p>
      <ul className="list-disc pl-4 space-y-1">
        <li>
          {code === 'QR_ALREADY_USED'
            ? 'QR Code ini sudah pernah dipindai sebelumnya dan tidak dapat digunakan kembali.'
            : code === 'NOT_REGISTERED'
              ? 'Peserta belum terdaftar secara sah atau pembayarannya belum lunas.'
              : 'Pastikan QR Code berasal dari tiket event SITIVENT yang sah dan berstatus aktif.'}
        </li>
        <li>Hubungi administrator atau loket pendaftaran jika terjadi kendala teknis.</li>
      </ul>
    </div>
  );
};
