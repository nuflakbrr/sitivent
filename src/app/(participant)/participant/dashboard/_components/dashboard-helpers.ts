export const formatEventDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export interface StatusStyle {
  label: string;
  bg: string;
  color: string;
  border: string;
}

export const getStatusStyle = (status: string): StatusStyle => {
  switch (status) {
    case 'CHECKED_IN':
      return {
        label: 'Hadir',
        bg: 'rgba(120,140,93,0.12)',
        color: '#788C5D',
        border: 'rgba(120,140,93,0.25)',
      };
    case 'REGISTERED':
      return {
        label: 'Terdaftar',
        bg: 'rgba(20,20,19,0.06)',
        color: '#3D3D3A',
        border: 'rgba(20,20,19,0.15)',
      };
    case 'WAITING_PAYMENT':
      return {
        label: 'Menunggu Bayar',
        bg: 'rgba(217,119,87,0.1)',
        color: '#D97757',
        border: 'rgba(217,119,87,0.25)',
      };
    case 'CANCELLED':
      return {
        label: 'Dibatalkan',
        bg: 'rgba(176,74,63,0.1)',
        color: '#B04A3F',
        border: 'rgba(176,74,63,0.2)',
      };
    default:
      return {
        label: status,
        bg: 'rgba(135,134,127,0.1)',
        color: '#87867F',
        border: 'rgba(135,134,127,0.2)',
      };
  }
};

export const canDownloadCertificate = (
  status: string,
  certificateEnabled: boolean,
  certificates: Array<{ id: string; downloadUrl: string }>
): boolean => {
  return status === 'CHECKED_IN' && certificateEnabled && certificates.length > 0;
};
