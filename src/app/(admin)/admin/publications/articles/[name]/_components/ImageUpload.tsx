'use client';
import { useState, type FC, useRef, type ChangeEvent, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Image } from '@imagekit/next';

import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import ImageCropperModal from '@/components/Common/Modals/ImageCropperModal';
import { slugify } from '@/lib/slugify';
import { deleteImage } from '@/services/uploads';

type ImageUploadProps = {
  value: string;
  initialValue?: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onSelect: (url: string) => void;
  onRemove: () => void;
  customFileName?: string;
  disabled?: boolean;
  disabledMessage?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload: FC<ImageUploadProps> = ({
  value,
  isUploading,
  onUpload,
  onSelect,
  onRemove,
  customFileName,
  disabled,
  disabledMessage,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated progress state
  const [progress, setProgress] = useState(0);
  const prevUploading = useRef(isUploading);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>('article-cover');

  // Sync preview with value prop
  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  // Simulated progress hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 70) {
            return prev + Math.floor(Math.random() * 8) + 3;
          } else if (prev < 90) {
            return prev + Math.floor(Math.random() * 4) + 1;
          } else if (prev < 95) {
            return prev + 1;
          }
          return prev;
        });
      }, 150);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUploading]);

  // Completion progress hook
  useEffect(() => {
    if (prevUploading.current && !isUploading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setProgress(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    prevUploading.current = isUploading;
  }, [isUploading]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('Ukuran file maksimal 5MB.');
        return;
      }

      // Validasi Dimensi & Rasio
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = width / height;

        URL.revokeObjectURL(img.src);

        if (width < 600 || height < 400) {
          toast.error(`Ukuran gambar terlalu kecil (${width}x${height}px). Minimal 600x400px.`);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        if (ratio < 1.45) {
          toast.error('Rasio gambar minimal 3:2 (Landscape).');
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Jika lolos validasi, lanjut ke cropper
        const originalName = slugify(file.name.split('.')[0]);
        setTempFileName(`${originalName}-cover`);

        const reader = new FileReader();
        reader.onload = () => {
          setCropperImageSrc(reader.result as string);
          setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
      };
    }
  };

  const handleCroppedImage = (croppedFile: File) => {
    setIsCropperOpen(false);
    onUpload(croppedFile);
  };

  const removeImage = async () => {
    if (previewUrl) {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      } else {
        try {
          await deleteImage(previewUrl);
        } catch (err) {
          console.error('Gagal menghapus gambar dari ImageKit:', err);
        }
      }
    }
    setPreviewUrl(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Field>
      <FieldLabel>Logo / Gambar Thumbnail</FieldLabel>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
        disabled={isUploading}
      />

      <div className="mt-2">
        {previewUrl ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed group">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain bg-muted/50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
              <Button
                type="button"
                size="sm"
                className="bg-white hover:bg-zinc-200 text-zinc-950 border-none font-bold shadow-xl"
                onClick={() => {
                  if (disabled && disabledMessage) {
                    toast.error(disabledMessage);
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
              >
                Ganti
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white border-none font-bold shadow-xl"
                onClick={removeImage}
                disabled={isUploading}
              >
                Hapus
              </Button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-2 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">
                  {progress > 0 && progress < 100
                    ? `Mengunggah... ${Math.round(progress)}%`
                    : progress >= 100
                      ? 'Selesai...'
                      : 'Memproses...'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => {
                if (disabled && disabledMessage) {
                  toast.error(disabledMessage);
                  return;
                }
                fileInputRef.current?.click();
              }}
              disabled={isUploading}
              className={`w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {isUploading
                  ? progress > 0 && progress < 100
                    ? `Mengunggah... ${Math.round(progress)}%`
                    : 'Memproses...'
                  : 'Upload Gambar Baru'}
              </span>
            </button>
          </div>
        )}
      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperImageSrc}
        onCrop={handleCroppedImage}
        aspectRatio={3 / 2}
        customFileName={customFileName || tempFileName}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Maksimal 5MB. Minimal 600x400px (Rasio 3:2). Gambar akan dikompres secara otomatis menjadi
        WebP untuk menghemat penyimpanan.
      </p>
    </Field>
  );
};

export default ImageUpload;
