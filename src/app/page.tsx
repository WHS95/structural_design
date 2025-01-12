import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    title: "보 설계",
    description: "KDS 기준에 따른 철근콘크리트 보의 설계를 수행합니다.",
    href: "/beam",
  },
  {
    title: "슬래브 설계",
    description: "KDS 기준에 따른 철근콘크리트 슬래브의 설계를 수행합니다.",
    href: "/slab",
  },
  {
    title: "기둥 설계",
    description: "KDS 기준에 따른 철근콘크리트 기둥의 설계를 수행합니다.",
    href: "/column",
  },
];

export default function HomePage() {
  return (
    <div className='container py-6 space-y-8'>
      <div className='flex flex-col space-y-2'>
        <h1 className='text-4xl font-bold tracking-tight'>구조설계 도구</h1>
        <p className='text-xl text-muted-foreground'>
          KDS 기준에 따른 구조설계 자동화 도구입니다.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {features.map((feature) => (
          <Card key={feature.href} className='p-6'>
            <h2 className='mb-2 text-2xl font-semibold'>{feature.title}</h2>
            <p className='mb-4 text-muted-foreground'>{feature.description}</p>
            <Button asChild>
              <Link href={feature.href}>시작하기</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
