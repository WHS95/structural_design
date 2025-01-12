import { BeamDesignForm } from "@/components/beam/beam-design-form";
import { BeamDesignResult } from "@/components/beam/beam-design-result";
import { Separator } from "@/components/ui/separator";

export default function BeamDesignPage() {
  return (
    <div className='container py-6 space-y-8'>
      <div className='flex flex-col space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>보 설계</h1>
        <p className='text-muted-foreground'>
          KDS 기준에 따른 철근콘크리트 보 설계를 수행합니다.
        </p>
      </div>

      <Separator />

      <div className='grid gap-6 md:grid-cols-2'>
        <BeamDesignForm />
        <BeamDesignResult />
      </div>
    </div>
  );
}
