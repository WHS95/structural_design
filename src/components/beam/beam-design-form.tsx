"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useBeamDesignStore } from "@/lib/beam-design/store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const formSchema = z.object({
  concreteStrength: z
    .number()
    .min(21, "콘크리트 강도는 21MPa 이상이어야 합니다")
    .max(50, "콘크리트 강도는 50MPa 이하여야 합니다"),
  reinforcementStrength: z
    .number()
    .min(400, "철근 항복강도는 400MPa 이상이어야 합니다")
    .max(600, "철근 항복강도는 600MPa 이하여야 합니다"),
  spanLength: z
    .number()
    .min(1000, "경간 길이는 1000mm 이상이어야 합니다")
    .max(15000, "경간 길이는 15000mm 이하여야 합니다"),
  width: z
    .number()
    .min(200, "보 폭은 200mm 이상이어야 합니다")
    .max(1000, "보 폭은 1000mm 이하여야 합니다"),
  height: z
    .number()
    .min(300, "보 춤은 300mm 이상이어야 합니다")
    .max(2000, "보 춤은 2000mm 이하여야 합니다"),
  coverDepth: z
    .number()
    .min(30, "피복두께는 30mm 이상이어야 합니다")
    .max(100, "피복두께는 100mm 이하여야 합니다"),
});

export function BeamDesignForm() {
  const setInput = useBeamDesignStore((state) => state.setInput);
  const calculate = useBeamDesignStore((state) => state.calculate);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concreteStrength: 24,
      reinforcementStrength: 400,
      spanLength: 6000,
      width: 300,
      height: 600,
      coverDepth: 40,
    },
  });

  // 폭/춤 비율 계산
  const width = form.watch("width");
  const height = form.watch("height");
  const widthHeightRatio = width / height;
  const isRatioValid = widthHeightRatio >= 0.3 && widthHeightRatio <= 0.7;

  function onSubmit(values: z.infer<typeof formSchema>) {
    setInput(values);
    calculate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>설계 입력</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='concreteStrength'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      콘크리트 강도
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>콘크리트의 28일 압축강도 (f'c)</p>
                          <p className='text-sm text-muted-foreground'>
                            일반적으로 24MPa ~ 30MPa 사용
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>MPa</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reinforcementStrength'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      철근 항복강도
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>철근의 항복강도 (fy)</p>
                          <p className='text-sm text-muted-foreground'>
                            일반적으로 400MPa (SD400) 사용
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>MPa</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='spanLength'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      경간 길이
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>보의 순경간 길이</p>
                          <p className='text-sm text-muted-foreground'>
                            기둥 중심간 거리
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>mm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='width'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      보 폭
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>보의 폭 (b)</p>
                          <p className='text-sm text-muted-foreground'>
                            일반적으로 300mm ~ 500mm 사용
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>mm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='height'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      보 춤
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>보의 춤 (h)</p>
                          <p className='text-sm text-muted-foreground'>
                            일반적으로 경간의 1/12 ~ 1/8
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <div className='flex items-center justify-between'>
                      <FormDescription>mm</FormDescription>
                      <FormDescription>
                        권장 춤: {Math.round(form.watch("spanLength") / 10)} ~{" "}
                        {Math.round(form.watch("spanLength") / 8)} mm
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='coverDepth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      피복두께
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>콘크리트 피복두께</p>
                          <p className='text-sm text-muted-foreground'>
                            일반적으로 40mm ~ 50mm 사용
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>mm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='col-span-2'>
                <div className='mb-2 text-sm'>
                  <span className='font-medium'>폭/춤 비율: </span>
                  <span
                    className={
                      isRatioValid ? "" : "text-orange-500 font-medium"
                    }
                  >
                    {widthHeightRatio.toFixed(2)}
                  </span>
                  <span className='ml-2 text-muted-foreground'>
                    {isRatioValid ? "(적정 범위)" : "(권장 범위: 0.3 ~ 0.7)"}
                  </span>
                </div>
              </div>
            </div>

            <Button type='submit' className='w-full'>
              설계 계산
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
