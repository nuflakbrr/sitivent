# Component Rules & Conventions - SITIVENT

## Component Rules

Component harus:

Single Responsibility.

Jika component lebih dari ±250 baris, pecah menjadi component kecil.

Gunakan:

```tsx
Props Interface
```

untuk seluruh component.

## Existing Components

AI wajib menggunakan component yang sudah tersedia pada project.

Contoh:

```text
Heading
DataTable
ApiAlert
ApiListAlert
Loader
Spinner
Modal
ImagePreviewModal
ImageCropperModal
ThemeToggle
RichTextEditor
EmptyState
```

Jangan membuat komponen baru apabila fungsi yang sama sudah tersedia.

## Form Components

Gunakan komponen UI bawaan project.

Contoh:

```text
Input
Textarea
Select
Checkbox
Switch
Calendar
Button
Dialog
Popover
Tooltip
Pagination
Badge
Avatar
Table
```

## Data Table Convention

Semua halaman management menggunakan: TanStack Table.

Struktur:

```text
Columns.tsx
CellAction.tsx
DataTable.tsx
```

CellAction hanya berisi aksi:

- Detail
- Edit
- Delete

## Empty State

Apabila data kosong gunakan:

```tsx
<EmptyState />
```

Jangan membuat tampilan kosong baru.

## Loading State

Saat mengambil data: Gunakan:

```tsx
<Loader />
```

atau

```tsx
<Spinner />
```

Jangan menggunakan text: `Loading...`

## Notification

Gunakan: Sonner untuk seluruh notifikasi.

Contoh:

```ts
toast.success()
toast.error()
toast.warning()
```
