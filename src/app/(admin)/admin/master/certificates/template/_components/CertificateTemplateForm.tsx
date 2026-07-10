'use client';
import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import {
  Image as ImageIcon,
  Hash,
  Loader2,
  CheckCircle2,
  X,
  Upload,
  CalendarDays,
  PenLine,
  Type,
  Palette,
  MapPin,
  Heading1,
  Heading2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignatureUploadList from './SignatureUploadList';
import { useCertificateTemplate } from './useCertificateTemplate';
import { CertNumberMode } from '@/generated/prisma/enums';
import { toast } from 'sonner';
import CertificatePreview from './CertificatePreview';
import type { CertificateTemplate as CertificateTemplateInterface } from '@/interfaces/features/certificates';

type CertificateTemplateFormProps = {
  eventId: string;
  eventTitle: string;
  eventStartDate?: Date | string;
  eventLocation?: string;
};

const NUMBER_PRESETS = [
  { value: 'CERT/{SLUG}/{REG_NO}' },
  { value: '{YEAR}/{SLUG}/{SEQ}' },
  { value: 'SITI/{YEAR}/{MONTH}/{DAY}/{SEQ}' },
  { value: '{SLUG}-{EVENT_ID}-{REG_NO}' },
  { value: 'E-CERT/{YEAR}/{SLUG}/{RAND}' },
  { value: 'NO.{SEQ}/EVENT-{SLUG}/{MONTH}/{YEAR}' },
  { value: '{SLUG}.{YEAR}.{MONTH}.{DAY}.{SEQ}' },
  { value: 'CERT-{REG_ID}-{RAND}' },
  { value: '{YEAR}/SITIVENT/{SLUG}/{SEQ}-{RAND}' },
];
const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
];
const MAX_BG_SIZE = 10 * 1024 * 1024;

export default function CertificateTemplateForm({
  eventId,
  eventTitle,
  eventStartDate,
  eventLocation,
}: CertificateTemplateFormProps) {
  const {
    template,
    isTemplateLoading,
    isUploadingBg,
    isUploadingSig,
    isSaving,
    isAddingSig,
    isDeletingSig,
    isUpdatingSig,
    handleBackgroundUpload,
    handleSignatureUpload,
    handleSaveTemplate,
    handleDeleteSignature,
    handleReorderSignatures,
    handleUpdateSignature,
  } = useCertificateTemplate(eventId);

  const bgInputRef = useRef<HTMLInputElement>(null);
  const [numberTemplate, setNumberTemplate] = useState('CERT/{SLUG}/{REG_NO}');
  const [numberMode, setNumberMode] = useState<CertNumberMode>(CertNumberMode.AUTO);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [showIssuedDate, setShowIssuedDate] = useState(true);
  const [titleFont, setTitleFont] = useState('Inter');
  const [titleColor, setTitleColor] = useState('#000000');
  const [contentFont, setContentFont] = useState('Inter');
  const [contentColor, setContentColor] = useState('#333333');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [showEventDate, setShowEventDate] = useState(true);
  const [showEventLocation, setShowEventLocation] = useState(false);
  const [headerText, setHeaderText] = useState('SITIVENT');
  const [headerSubtitle, setHeaderSubtitle] = useState('Sertifikat Partisipasi Resmi');
  const [headerFont, setHeaderFont] = useState('Times New Roman');
  const [headerColor, setHeaderColor] = useState('#000000');
  const [showHeader, setShowHeader] = useState(true);
  const [footerMarginBottom, setFooterMarginBottom] = useState(0);

  useEffect(() => {
    if (template) {
      setNumberTemplate(template.numberTemplate);
      setNumberMode(template.numberMode as CertNumberMode);
      setBgPreview(template.backgroundUrl ?? null);
      setShowIssuedDate(template.showIssuedDate ?? true);
      setTitleFont(template.titleFont ?? 'Inter');
      setTitleColor(template.titleColor ?? '#000000');
      setContentFont(template.contentFont ?? 'Inter');
      setContentColor(template.contentColor ?? '#333333');
      setPrimaryColor(template.primaryColor ?? '#3b82f6');
      setShowEventDate(template.showEventDate ?? true);
      setShowEventLocation(template.showEventLocation ?? false);
      setHeaderText(template.headerText ?? 'SITIVENT');
      setHeaderSubtitle(template.headerSubtitle ?? 'Sertifikat Partisipasi Resmi');
      setHeaderFont(template.headerFont ?? 'Times New Roman');
      setHeaderColor(template.headerColor ?? '#000000');
      setShowHeader(template.showHeader ?? true);
      setFooterMarginBottom(template.footerMarginBottom ?? 0);
    }
  }, [template]);

  const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('File harus berupa gambar.');
    if (file.size > MAX_BG_SIZE) return toast.error('Ukuran file maksimal 10MB.');
    setBgPreview(URL.createObjectURL(file));
    handleBackgroundUpload(file);
  };

  const handleSave = () => {
    handleSaveTemplate({
      backgroundUrl: template?.backgroundUrl,
      numberTemplate,
      numberMode,
      showIssuedDate,
      titleFont,
      titleColor,
      contentFont,
      contentColor,
      primaryColor,
      showEventDate,
      showEventLocation,
      headerText,
      headerSubtitle,
      headerFont,
      headerColor,
      showHeader,
      footerMarginBottom,
    });
  };

  if (isTemplateLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Memuat konfigurasi...</span>
      </div>
    );
  }

  const signatures = template?.signatures ?? [];

  return (
    <div className="space-y-6">
      {/* Event badge */}
      <div className="flex items-center gap-2 px-1">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
        <span className="text-sm text-muted-foreground">
          Konfigurasi untuk: <strong className="text-foreground">{eventTitle}</strong>
        </span>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Tampilan</TabsTrigger>
          <TabsTrigger value="numbering">Penomoran</TabsTrigger>
          <TabsTrigger value="signatures">Tanda Tangan</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Background */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-semibold">Background Sertifikat</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gambar background landscape (A4). PNG/JPG/WebP — maks. 10MB.
              </p>

              {/* Upload zone */}
              <div
                className="relative w-full aspect-video rounded-xl border-2 border-dashed border-foreground/15 overflow-hidden cursor-pointer hover:border-primary/40 transition-colors bg-muted/30 group"
                onClick={() => bgInputRef.current?.click()}
              >
                {bgPreview ? (
                  <>
                    <img src={bgPreview} alt="bg preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Upload className="h-5 w-5 text-white" />
                      <span className="text-white text-sm font-medium">Ganti</span>
                    </div>
                    {isUploadingBg && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-7 w-7 text-white animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    {isUploadingBg ? (
                      <>
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        <span className="text-xs">Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-7 w-7" />
                        <span className="text-xs font-medium">Klik untuk upload background</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={bgInputRef}
                className="hidden"
                onChange={handleBgChange}
              />

              {bgPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={() => {
                    setBgPreview(null);
                    handleSaveTemplate({
                      backgroundUrl: null,
                      numberTemplate,
                      numberMode,
                      showIssuedDate,
                      titleFont,
                      titleColor,
                      contentFont,
                      contentColor,
                      primaryColor,
                      showEventDate,
                      showEventLocation,
                    });
                  }}
                >
                  <X className="h-3 w-3 mr-1.5" /> Hapus Background
                </Button>
              )}
            </div>

            {/* Header Customization */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heading1 className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-semibold">Header Sertifikat</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-foreground/10 bg-muted/30">
                <div className="flex flex-col items-start gap-2">
                  <p className="text-xs font-semibold">Tampilkan Header</p>
                  <p className="text-[11px] text-muted-foreground">Di bagian atas sertifikat</p>
                </div>
                <Switch id="show-header" checked={showHeader} onCheckedChange={setShowHeader} />
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Teks Header</Label>
                  <Input
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="SITIVENT"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Subtitle Header</Label>
                  <Input
                    value={headerSubtitle}
                    onChange={(e) => setHeaderSubtitle(e.target.value)}
                    placeholder="Sertifikat Partisipasi Resmi"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Font Header</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <Button
                        key={font.value}
                        variant={headerFont === font.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs justify-start px-3"
                        onClick={() => setHeaderFont(font.value)}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Warna Header</Label>
                    <span className="text-xs font-mono text-muted-foreground">{headerColor}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="h-9 w-16 p-1"
                    />
                    <Input
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="font-mono h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colors & Fonts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm font-semibold">Tipografi & Warna</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Font Judul Sertifikat</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <Button
                        key={font.value}
                        variant={titleFont === font.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs justify-start px-3"
                        onClick={() => setTitleFont(font.value)}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Warna Judul Sertifikat</Label>
                    <span className="text-xs font-mono text-muted-foreground">{titleColor}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="h-9 w-16 p-1"
                    />
                    <Input
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="font-mono h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Font Isi</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <Button
                        key={font.value}
                        variant={contentFont === font.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs justify-start px-3"
                        onClick={() => setContentFont(font.value)}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Warna Isi</Label>
                    <span className="text-xs font-mono text-muted-foreground">{contentColor}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={contentColor}
                      onChange={(e) => setContentColor(e.target.value)}
                      className="h-9 w-16 p-1"
                    />
                    <Input
                      value={contentColor}
                      onChange={(e) => setContentColor(e.target.value)}
                      className="font-mono h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Warna Primer</Label>
                    <span className="text-xs font-mono text-muted-foreground">{primaryColor}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-9 w-16 p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="font-mono h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm font-semibold">Elemen yang Ditampilkan</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-foreground/10 bg-muted/30">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Tanggal Terbit</p>
                    <p className="text-[11px] text-muted-foreground">Di footer sertifikat</p>
                  </div>
                </div>
                <Switch
                  id="show-issued-date"
                  checked={showIssuedDate}
                  onCheckedChange={setShowIssuedDate}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-foreground/10 bg-muted/30">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Tanggal Event</p>
                    <p className="text-[11px] text-muted-foreground">Di body sertifikat</p>
                  </div>
                </div>
                <Switch
                  id="show-event-date"
                  checked={showEventDate}
                  onCheckedChange={setShowEventDate}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-foreground/10 bg-muted/30">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Lokasi Event</p>
                    <p className="text-[11px] text-muted-foreground">Di body sertifikat</p>
                  </div>
                </div>
                <Switch
                  id="show-event-location"
                  checked={showEventLocation}
                  onCheckedChange={setShowEventLocation}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Jarak Margin Bawah Footer</Label>
                <Input
                  type="number"
                  value={footerMarginBottom}
                  onChange={(e) => setFooterMarginBottom(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="numbering" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm font-semibold">Template Nomor Sertifikat</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed flex flex-wrap gap-1 items-center">
              <span>Placeholder:</span>
              {[
                '{SLUG}',
                '{REG_NO}',
                '{YEAR}',
                '{MONTH}',
                '{DAY}',
                '{SEQ}',
                '{EVENT_ID}',
                '{REG_ID}',
                '{RAND}',
              ].map((p) => (
                <code
                  key={p}
                  className="text-primary font-mono text-[11px] bg-primary/5 px-1 py-0.5 rounded"
                >
                  {p}
                </code>
              ))}
            </p>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {NUMBER_PRESETS.map((ex) => (
                <button
                  key={ex.value}
                  type="button"
                  disabled={numberMode === CertNumberMode.AUTO}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors font-mono ${
                    numberTemplate === ex.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-foreground/20 text-muted-foreground hover:border-primary/50 hover:text-foreground bg-transparent'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => setNumberTemplate(ex.value)}
                >
                  {ex.value}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Custom template</Label>
              <Input
                value={numberTemplate}
                onChange={(e) => setNumberTemplate(e.target.value)}
                placeholder="CERT/{SLUG}/{REG_NO}"
                disabled={numberMode === CertNumberMode.AUTO}
                className="font-mono text-sm h-9"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Mode Penomoran</Label>
              <RadioGroup
                value={numberMode}
                onValueChange={(v) => {
                  const mode = v as CertNumberMode;
                  setNumberMode(mode);
                  if (mode === CertNumberMode.AUTO) {
                    setNumberTemplate('CERT/{SLUG}/{REG_NO}');
                  }
                }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-foreground/10 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value={CertNumberMode.AUTO} id="mode-auto" />
                  <Label htmlFor="mode-auto" className="text-xs cursor-pointer leading-tight">
                    <span className="font-semibold block">Otomatis (Sistem)</span>
                    <span className="text-muted-foreground">
                      Generate otomatis menggunakan format bawaan sistem
                    </span>
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-foreground/10 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value={CertNumberMode.MANUAL} id="mode-manual" />
                  <Label htmlFor="mode-manual" className="text-xs cursor-pointer leading-tight">
                    <span className="font-semibold block">Kustom Manual</span>
                    <span className="text-muted-foreground">
                      Tentukan dan buat sendiri format template nomor sertifikat Anda
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="signatures" className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">E-Signature Penandatangan</p>
            </div>
            <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {signatures.length} TTD
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload TTD lebih dari 1 orang. Drag untuk mengubah urutan tampil di sertifikat.
          </p>

          <SignatureUploadList
            signatures={signatures}
            isUploadingSig={isUploadingSig}
            isAddingSig={isAddingSig}
            isDeletingSig={isDeletingSig}
            isUpdatingSig={isUpdatingSig}
            onAddSignature={(file, name, title) => handleSignatureUpload(file, name, title)}
            onDeleteSignature={handleDeleteSignature}
            onReorder={handleReorderSignatures}
            onUpdateSignature={handleUpdateSignature}
          />
        </TabsContent>
      </Tabs>

      {/* Live preview */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Preview</p>
          <p className="text-xs text-muted-foreground">
            Tampilan sertifikat akan terupdate secara langsung
          </p>
        </div>
        <CertificatePreview
          backgroundUrl={bgPreview ?? template?.backgroundUrl ?? null}
          numberTemplate={numberTemplate}
          numberMode={numberMode}
          showIssuedDate={showIssuedDate}
          signatures={signatures}
          eventTitle={eventTitle}
          titleFont={titleFont}
          titleColor={titleColor}
          contentFont={contentFont}
          contentColor={contentColor}
          primaryColor={primaryColor}
          showEventDate={showEventDate}
          showEventLocation={showEventLocation}
          headerText={headerText}
          headerSubtitle={headerSubtitle}
          headerFont={headerFont}
          headerColor={headerColor}
          showHeader={showHeader}
          footerMarginBottom={footerMarginBottom}
          eventStartDate={eventStartDate}
          eventLocation={eventLocation}
        />
      </div>

      <Separator className="mt-4" />

      {/* Save */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving || isUploadingBg} className="min-w-35">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Simpan Konfigurasi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
