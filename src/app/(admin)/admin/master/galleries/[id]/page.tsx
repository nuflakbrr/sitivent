'use client';
import { use } from 'react';
import { type FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import GalleryForm from './_components/GalleryForm';
import type { Route } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
};

const GalleryFormPage: FC<PageProps> = (props) => {
  const params = use(props.params);
  const isNew = params.id === 'new';

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={isNew ? 'Tambah Foto' : 'Ubah Foto'}
          description={
            isNew ? 'Tambahkan dokumentasi foto baru ke galeri.' : 'Perbarui detail foto galeri.'
          }
        />
        <Button variant="outline" asChild>
          <Link href={'/admin/master/galleries' as Route}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </Link>
        </Button>
      </div>
      <Separator className="mb-6" />
      <GalleryForm id={params.id} />
    </section>
  );
};

export default GalleryFormPage;
