"use client";

import { SlabDesignForm } from "@/components/slab/slab-design-form";
import { SlabDesignResult } from "@/components/slab/slab-design-result";
import { Separator } from "@/components/ui/separator";

export default function SlabDesignPage() {
  return (
    <div className='container py-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>슬래브 설계</h1>
        <p className='text-muted-foreground'>
          KDS 기준에 따른 철근콘크리트 슬래브 설계를 수행합니다
        </p>
      </div>
      <Separator />
      <div className='grid gap-6 lg:grid-cols-2'>
        <SlabDesignForm />
        <SlabDesignResult />
      </div>
    </div>
  );
}
