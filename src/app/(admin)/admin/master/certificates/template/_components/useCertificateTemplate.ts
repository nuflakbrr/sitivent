'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getCertificateTemplate,
  upsertCertificateTemplate,
  addSignature,
  updateSignature,
  deleteSignature,
  reorderSignatures,
  type CertTemplateUpsertInput,
  type SignatureInput,
} from '@/services/certificates';
import { uploadImage } from '@/services/uploads';
import { CertNumberMode } from '@/generated/prisma/enums';
import type { CertificateTemplate as CertificateTemplateInterface } from '@/interfaces/features/certificates';

export const useCertificateTemplate = (eventId: string | null) => {
  const queryClient = useQueryClient();
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isUploadingSig, setIsUploadingSig] = useState(false);

  // Fetch template for a specific event
  const { data: templateData, isLoading: isTemplateLoading } = useQuery({
    queryKey: ['certificate-template', eventId],
    queryFn: () => getCertificateTemplate(eventId!),
    enabled: !!eventId,
  });

  const template = (templateData?.data ?? null) as CertificateTemplateInterface | null;

  // Upsert template mutation
  const upsertMutation = useMutation({
    mutationFn: (input: CertTemplateUpsertInput) => upsertCertificateTemplate(eventId!, input),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['certificate-template', eventId] });
      } else {
        toast.error(res.error);
      }
    },
    onError: () => toast.error('Gagal menyimpan template.'),
  });

  // Add signature mutation
  const addSigMutation = useMutation({
    mutationFn: ({ templateId, input }: { templateId: string; input: SignatureInput }) =>
      addSignature(templateId, input),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['certificate-template', eventId] });
      } else {
        toast.error(res.error);
      }
    },
    onError: () => toast.error('Gagal menambahkan TTD.'),
  });

  // Delete signature mutation
  const deleteSigMutation = useMutation({
    mutationFn: (signatureId: string) => deleteSignature(signatureId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['certificate-template', eventId] });
      } else {
        toast.error(res.error);
      }
    },
    onError: () => toast.error('Gagal menghapus TTD.'),
  });

  // Reorder signatures mutation
  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderSignatures(orderedIds),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['certificate-template', eventId] });
      }
    },
  });

  // Update signature mutation
  const updateSigMutation = useMutation({
    mutationFn: ({ signatureId, input }: { signatureId: string; input: Partial<SignatureInput> }) =>
      updateSignature(signatureId, input),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['certificate-template', eventId] });
      } else {
        toast.error(res.error);
      }
    },
    onError: () => toast.error('Gagal memperbarui TTD.'),
  });

  // Upload background image
  const handleBackgroundUpload = async (file: File) => {
    setIsUploadingBg(true);
    try {
      const res = await uploadImage(file, 'certificates/backgrounds');
      if (res.success && res.url) {
        upsertMutation.mutate({
          backgroundUrl: res.url,
          numberTemplate: template?.numberTemplate,
          numberMode: template?.numberMode as CertNumberMode | undefined,
          showIssuedDate: template?.showIssuedDate ?? true,
          titleFont: template?.titleFont,
          titleColor: template?.titleColor,
          contentFont: template?.contentFont,
          contentColor: template?.contentColor,
          primaryColor: template?.primaryColor,
          showEventDate: template?.showEventDate,
          showEventLocation: template?.showEventLocation,
          headerText: template?.headerText,
          headerSubtitle: template?.headerSubtitle,
          headerFont: template?.headerFont,
          headerColor: template?.headerColor,
          showHeader: template?.showHeader ?? true,
          footerMarginBottom: template?.footerMarginBottom ?? 0,
        });
      } else {
        toast.error(res.error || 'Gagal mengupload background.');
      }
    } finally {
      setIsUploadingBg(false);
    }
  };

  // Upload signature image and create entry
  const handleSignatureUpload = async (file: File, name: string, title?: string) => {
    if (!template) {
      // Ensure template exists first
      const upsertRes = await upsertCertificateTemplate(eventId!, {
        numberTemplate: 'CERT/{SLUG}/{REG_NO}',
        numberMode: CertNumberMode.AUTO,
      });
      if (!upsertRes.success) {
        toast.error('Gagal menginisialisasi template.');
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['certificate-template', eventId] });
      // Refetch to get new template id
      const fresh = await getCertificateTemplate(eventId!);
      if (!fresh.data) return;
      await doUploadSignature(file, fresh.data.id, name, title);
    } else {
      await doUploadSignature(file, template.id, name, title);
    }
  };

  const doUploadSignature = async (
    file: File,
    templateId: string,
    name: string,
    title?: string
  ) => {
    setIsUploadingSig(true);
    try {
      const res = await uploadImage(file, 'certificates/signatures');
      if (res.success && res.url) {
        addSigMutation.mutate({
          templateId,
          input: { name, title, signatureUrl: res.url },
        });
      } else {
        toast.error(res.error || 'Gagal mengupload TTD.');
      }
    } finally {
      setIsUploadingSig(false);
    }
  };

  const handleSaveTemplate = (input: CertTemplateUpsertInput) => {
    upsertMutation.mutate(input);
  };

  const handleDeleteSignature = (signatureId: string) => {
    deleteSigMutation.mutate(signatureId);
  };

  const handleReorderSignatures = (orderedIds: string[]) => {
    reorderMutation.mutate(orderedIds);
  };

  const handleUpdateSignature = (signatureId: string, input: Partial<SignatureInput>) => {
    updateSigMutation.mutate({ signatureId, input });
  };

  return {
    template,
    isTemplateLoading,
    isUploadingBg,
    isUploadingSig,
    isSaving: upsertMutation.isPending,
    isAddingSig: addSigMutation.isPending,
    isDeletingSig: deleteSigMutation.isPending,
    isUpdatingSig: updateSigMutation.isPending,
    handleBackgroundUpload,
    handleSignatureUpload,
    handleSaveTemplate,
    handleDeleteSignature,
    handleReorderSignatures,
    handleUpdateSignature,
  };
};
