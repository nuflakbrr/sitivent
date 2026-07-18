import { AlertCircle } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  emailVerified: boolean;
}

export default function DashboardHeader({ userName, emailVerified }: DashboardHeaderProps) {
  return (
    <>
      {/* Alert Email Belum Diverifikasi */}
      {!emailVerified && (
        <div
          className="p-5 rounded-xl border flex items-start gap-3.5 transition-all duration-200"
          style={{
            background: 'rgba(217,119,87,0.06)',
            borderColor: 'rgba(217,119,87,0.3)',
            boxShadow: '0 2px 8px rgba(217,119,87,0.03)',
          }}
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#D97757' }} />
          <div className="space-y-1">
            <h4
              className="text-sm font-semibold"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                color: '#141413',
              }}
            >
              Verifikasi Email Diperlukan
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: '#87867F' }}>
              Akun Anda belum memverifikasi alamat email. Silakan periksa kotak masuk utama
              (Primary) atau folder spam/promosi email Anda untuk melakukan verifikasi akun.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b"
        style={{ borderColor: '#E3DACC' }}
      >
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-widest block mb-2"
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              color: '#87867F',
            }}
          >
            Dashboard Peserta
          </span>
          <h1
            id="dashboard-title"
            className="leading-tight"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: '#141413',
              letterSpacing: '-0.01em',
            }}
          >
            Halo, {userName}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: '#87867F' }}>
            Selamat datang kembali di dashboard peserta SITIVENT.
          </p>
        </div>
      </div>
    </>
  );
}
