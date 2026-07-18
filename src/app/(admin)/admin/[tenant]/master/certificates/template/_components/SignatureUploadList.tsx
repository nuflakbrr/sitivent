'use client';
import { useState, useRef, type ChangeEvent } from 'react';
import { Trash2, Upload, GripVertical, Loader2, UserCircle2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { CertificateSignature } from '@/interfaces/features/certificates';

type Signature = Pick<CertificateSignature, 'id' | 'name' | 'title' | 'signatureUrl' | 'order'>;

type SignatureUploadListProps = {
  signatures: Signature[];
  isUploadingSig: boolean;
  isAddingSig: boolean;
  isDeletingSig: boolean;
  isUpdatingSig: boolean;
  onAddSignature: (file: File, name: string, title?: string) => void;
  onDeleteSignature: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onUpdateSignature: (id: string, data: { name: string; title?: string }) => void;
};

const MAX_SIG_SIZE = 3 * 1024 * 1024;

export default function SignatureUploadList({
  signatures,
  isUploadingSig,
  isAddingSig,
  isDeletingSig,
  isUpdatingSig,
  onAddSignature,
  onDeleteSignature,
  onReorder,
  onUpdateSignature,
}: SignatureUploadListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingName, setPendingName] = useState('');
  const [pendingTitle, setPendingTitle] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Edit state per-item: id → {name, title}
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Drag-and-drop reorder
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (PNG transparan direkomendasikan).');
      return;
    }
    if (file.size > MAX_SIG_SIZE) {
      toast.error('Ukuran file maksimal 3MB.');
      return;
    }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAdd = () => {
    if (!pendingFile) {
      toast.error('Pilih file gambar TTD terlebih dahulu.');
      return;
    }
    if (!pendingName.trim()) {
      toast.error('Nama penandatangan wajib diisi.');
      return;
    }
    onAddSignature(pendingFile, pendingName.trim(), pendingTitle.trim() || undefined);
    setPendingFile(null);
    setPendingName('');
    setPendingTitle('');
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (sig: Signature) => {
    setEditingId(sig.id);
    setEditName(sig.name);
    setEditTitle(sig.title ?? '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditTitle('');
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) {
      toast.error('Nama tidak boleh kosong.');
      return;
    }
    onUpdateSignature(id, { name: editName.trim(), title: editTitle.trim() || undefined });
    cancelEdit();
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...signatures];
    const [dragged] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, dragged);
    onReorder(reordered.map((s) => s.id));
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const isWorking = isUploadingSig || isAddingSig;

  return (
    <div className="space-y-4">
      {/* Existing signatures */}
      {signatures.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Daftar TTD ({signatures.length})
          </p>
          <div className="space-y-2">
            {signatures.map((sig, index) => (
              <div
                key={sig.id}
                draggable={editingId !== sig.id}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                }}
                className={`rounded-xl border transition-all ${
                  dragOverIndex === index
                    ? 'border-primary bg-primary/5'
                    : 'border-foreground/10 bg-card hover:border-foreground/20'
                } ${editingId === sig.id ? 'p-3 space-y-3' : 'flex items-center gap-3 p-3'}`}
              >
                {editingId === sig.id ? (
                  /* ── Inline edit mode ── */
                  <>
                    <div className="flex items-center gap-3">
                      {/* Signature image (non-editable in this view) */}
                      <div className="w-20 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden border border-foreground/10 shrink-0 flex items-center justify-center">
                        <img
                          src={sig.signatureUrl}
                          alt={sig.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Edit nama & jabatan penandatangan
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Nama <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(sig.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Jabatan</Label>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Opsional"
                          className="h-8 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(sig.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={cancelEdit}
                      >
                        <X className="h-3 w-3 mr-1" /> Batal
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs"
                        disabled={isUpdatingSig}
                        onClick={() => saveEdit(sig.id)}
                      >
                        {isUpdatingSig ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" /> Simpan
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  /* ── Display mode ── */
                  <>
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing" />
                    <div className="w-20 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden border border-foreground/10 shrink-0 flex items-center justify-center">
                      <img
                        src={sig.signatureUrl}
                        alt={sig.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{sig.name}</p>
                      {sig.title && (
                        <p className="text-xs text-muted-foreground truncate">{sig.title}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => startEdit(sig)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        disabled={isDeletingSig}
                        onClick={() => onDeleteSignature(sig.id)}
                      >
                        {isDeletingSig ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new signature form */}
      <div className="rounded-xl border border-dashed border-foreground/20 p-4 space-y-3 bg-muted/30">
        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <UserCircle2 className="h-3.5 w-3.5" /> Tambah TTD Baru
        </p>

        <div
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-foreground/15 hover:border-primary/50 cursor-pointer transition-colors bg-background"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="max-h-16 object-contain rounded" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center">
                Klik untuk upload gambar TTD
                <br />
                <span className="text-[10px]">PNG transparan direkomendasikan</span>
              </span>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">
              Nama <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Dr. Budi Santoso"
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Jabatan (opsional)</Label>
            <Input
              placeholder="Ketua Panitia"
              value={pendingTitle}
              onChange={(e) => setPendingTitle(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <Button
          size="sm"
          className="w-full h-8 text-xs"
          disabled={isWorking || !pendingFile || !pendingName.trim()}
          onClick={handleAdd}
        >
          {isWorking ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Mengupload...
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 mr-2" /> Tambah TTD
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
