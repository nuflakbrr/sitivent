# Folder Structure - SITIVENT

Project menggunakan Feature Based Architecture.

```text
src/
├── app/
├── components/
├── hooks/
├── interfaces/
├── lib/
├── providers/
├── schemas/
├── services/
├── types/
└── data/
```

## Feature Structure

Setiap fitur wajib mengikuti pola berikut:

```text
feature/
├── _components/
│   ├── Columns.tsx
│   ├── CellAction.tsx
│   └── FeatureTable.tsx
│
├── [id]/
│   ├── _components/
│   │   └── FeatureForm.tsx
│   └── page.tsx
│
└── page.tsx
```
