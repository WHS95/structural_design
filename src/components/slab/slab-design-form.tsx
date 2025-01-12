"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSlabDesignStore } from "@/lib/slab-design/store";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  thickness: z
    .number()
    .min(100, "슬래브 두께는 100mm 이상이어야 합니다")
    .max(500, "슬래브 두께는 500mm 이하여야 합니다"),
  shortSpan: z
    .number()
    .min(1000, "단변 길이는 1000mm 이상이어야 합니다")
    .max(10000, "단변 길이는 10000mm 이하여야 합니다"),
  longSpan: z
    .number()
    .min(1000, "장변 길이는 1000mm 이상이어야 합니다")
    .max(15000, "장변 길이는 15000mm 이하여야 합니다"),
  slabType: z.enum(["ONE_WAY", "TWO_WAY"]),
  supportType: z.enum(["SIMPLE", "CONTINUOUS"]),
});

export function SlabDesignForm() {
  const setInput = useSlabDesignStore((state) => state.setInput);
  const calculate = useSlabDesignStore((state) => state.calculate);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concreteStrength: 24,
      reinforcementStrength: 400,
      thickness: 180,
      shortSpan: 3000,
      longSpan: 4000,
      slabType: "TWO_WAY",
      supportType: "CONTINUOUS",
    },
  });

  const shortSpan = form.watch("shortSpan");
  const longSpan = form.watch("longSpan");
  const spanRatio = longSpan / shortSpan;
  const recommendedType = spanRatio >= 2 ? "ONE_WAY" : "TWO_WAY";

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
                name='thickness'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      슬래브 두께
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>슬래브의 전체 두께</p>
                          <p className='text-sm text-muted-foreground'>
                            일반적으로 180mm ~ 210mm 사용
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
                name='shortSpan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      단변 길이
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>슬래브의 짧은 방향 길이</p>
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
                name='longSpan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      장변 길이
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info className='h-4 w-4' />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p>슬래브의 긴 방향 길이</p>
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
                name='slabType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>슬래브 유형</FormLabel>
                    <div className='mb-2 text-sm'>
                      <span className='font-medium'>장변/단변 비율: </span>
                      <span
                        className={
                          spanRatio >= 2 ? "text-orange-500 font-medium" : ""
                        }
                      >
                        {spanRatio.toFixed(2)}
                      </span>
                      <span className='ml-2 text-muted-foreground'>
                        {spanRatio >= 2
                          ? "(일방향 슬래브 권장)"
                          : "(이방향 슬래브 권장)"}
                      </span>
                    </div>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== recommendedType) {
                          form.setError("slabType", {
                            type: "manual",
                            message: `장변/단변 비율이 ${spanRatio.toFixed(
                              2
                            )}인 경우 ${
                              recommendedType === "ONE_WAY"
                                ? "일방향"
                                : "이방향"
                            } 슬래브가 권장됩니다`,
                          });
                        } else {
                          form.clearErrors("slabType");
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='슬래브 유형 선택' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ONE_WAY'>일방향 슬래브</SelectItem>
                        <SelectItem value='TWO_WAY'>이방향 슬래브</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      장변/단변 비율이 2 이상이면 일방향 슬래브 권장
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='supportType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지지 조건</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='지지 조건 선택' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='SIMPLE'>단순 지지</SelectItem>
                        <SelectItem value='CONTINUOUS'>연속 지지</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      연속 지지는 모멘트가 재분배되어 더 효율적
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
