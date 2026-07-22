'use client';
import { use } from 'react';
import { type FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import CategoryForm from './_components/CategoryForm';
import type { Route } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

const EventCategoryFormPage: FC<PageProps> = (props) => {
  const params = use(props.params);
  const isNew = params.id === 'new';

  return (
    <section>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <Heading
          title={isNew ? 'Tambah Kategori' : 'Ubah Kategori'}
          description={
            isNew
              ? 'Buat kategori baru untuk mengelompokkan event.'
              : 'Perbarui informasi kategori event.'
          }
        />
        <Button variant="outline" asChild>
          <Link href={'/admin/master/event-categories' as Route}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </Link>
        </Button>
      </div>
      <Separator className="mb-6" />
      <CategoryForm id={params.id} />
    </section>
  );
};

export default EventCategoryFormPage;
