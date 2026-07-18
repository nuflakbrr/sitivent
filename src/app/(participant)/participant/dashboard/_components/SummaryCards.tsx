import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface SummaryCardsProps {
  summary: {
    totalRegistered: number;
    totalCheckedIn: number;
    totalPendingPayment: number;
  };
}

const cards = [
  {
    key: 'totalRegistered',
    label: 'Total Terdaftar',
    icon: Calendar,
    iconColor: '#D97757',
    bg: 'rgba(217,119,87,0.1)',
    border: 'rgba(217,119,87,0.2)',
  },
  {
    key: 'totalCheckedIn',
    label: 'Hadir (Check-In)',
    icon: CheckCircle2,
    iconColor: '#788C5D',
    bg: 'rgba(120,140,93,0.1)',
    border: 'rgba(120,140,93,0.2)',
  },
  {
    key: 'totalPendingPayment',
    label: 'Menunggu Pembayaran',
    icon: Clock,
    iconColor: '#B04A3F',
    bg: 'rgba(176,74,63,0.08)',
    border: 'rgba(176,74,63,0.18)',
  },
] as const;

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key as keyof SummaryCardsProps['summary']];

        return (
          <div
            key={card.key}
            className="p-6 rounded-xl flex items-center justify-between transition-all duration-200"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #D1CFC5',
              boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
            }}
          >
            <div className="space-y-1">
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: '#87867F',
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                }}
              >
                {card.label}
              </p>
              <h3
                className="text-4xl font-medium mt-1"
                style={{
                  fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                  color: '#141413',
                }}
              >
                {value}
              </h3>
            </div>
            <div
              className="p-3.5 rounded-xl"
              style={{
                background: card.bg,
                border: `1.5px solid ${card.border}`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
