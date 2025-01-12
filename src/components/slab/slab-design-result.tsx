"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  useSlabDesignStore,
  selectResults,
  selectLastInput,
} from "@/lib/slab-design/store";
import { SlabCheckResult } from "@/lib/slab-design/types";

function formatNumber(num: number) {
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function CheckResultBadge({ result }: { result: SlabCheckResult }) {
  return (
    <Badge
      variant={result.status === "OK" ? "default" : "destructive"}
      className='ml-2'
    >
      {result.status}
    </Badge>
  );
}

function CheckResultRow({
  label,
  result,
  unit,
}: {
  label: string;
  result: SlabCheckResult;
  unit: string;
}) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{label}</TableCell>
      <TableCell className='text-right'>
        {formatNumber(result.value)} {unit}
      </TableCell>
      <TableCell className='text-right'>
        {formatNumber(result.limit)} {unit}
      </TableCell>
      <TableCell className='text-right'>{formatNumber(result.ratio)}</TableCell>
      <TableCell>
        <CheckResultBadge result={result} />
      </TableCell>
    </TableRow>
  );
}

export function SlabDesignResult() {
  const results = useSlabDesignStore(selectResults);
  const input = useSlabDesignStore(selectLastInput);

  return (
    <Card>
      <CardHeader>
        <CardTitle>설계 결과</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='calculation' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='calculation'>계산서</TabsTrigger>
            <TabsTrigger value='diagram'>배근도</TabsTrigger>
            <TabsTrigger value='references'>참고기준</TabsTrigger>
          </TabsList>

          <TabsContent value='calculation'>
            {results && input ? (
              <div className='space-y-6'>
                <div>
                  <h3 className='mb-4 text-lg font-medium'>강도 검토</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>검토 항목</TableHead>
                        <TableHead className='text-right'>설계값</TableHead>
                        <TableHead className='text-right'>한계값</TableHead>
                        <TableHead className='text-right'>비율</TableHead>
                        <TableHead>판정</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <CheckResultRow
                        label='단변방향 휨강도'
                        result={results.checks.moment.shortSpan}
                        unit='kN·m/m'
                      />
                      {input.slabType === "TWO_WAY" && (
                        <CheckResultRow
                          label='장변방향 휨강도'
                          result={results.checks.moment.longSpan}
                          unit='kN·m/m'
                        />
                      )}
                      <CheckResultRow
                        label='최소 두께'
                        result={results.checks.thickness}
                        unit='mm'
                      />
                      <CheckResultRow
                        label='처짐'
                        result={results.checks.deflection}
                        unit='mm'
                      />
                    </TableBody>
                  </Table>
                </div>

                <Accordion type='single' collapsible className='w-full'>
                  <AccordionItem value='design-load'>
                    <AccordionTrigger>1. 설계하중 산정</AccordionTrigger>
                    <AccordionContent className='space-y-4 text-sm'>
                      <div className='space-y-2'>
                        <p>• 고정하중 (DL)</p>
                        <div className='pl-4 space-y-1'>
                          <p>- 자중: 25 kN/m²</p>
                          <p>- 마감하중: 1.5 kN/m²</p>
                          <p>∴ 총 고정하중 = 26.5 kN/m²</p>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <p>• 활하중 (LL)</p>
                        <div className='pl-4'>
                          <p>- KDS 41 10 15 : 5.0 kN/m² (주거용)</p>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <p>• 설계하중 조합</p>
                        <div className='pl-4'>
                          <p>wu = 1.2DL + 1.6LL</p>
                          <p>wu = 1.2(26.5) + 1.6(5.0)</p>
                          <p>
                            wu = {formatNumber(26.5 * 1.2 + 5.0 * 1.6)} kN/m²
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value='section'>
                    <AccordionTrigger>2. 단면 정보</AccordionTrigger>
                    <AccordionContent className='space-y-4'>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className='font-medium'>두께</TableCell>
                            <TableCell>{input.thickness} mm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className='font-medium'>
                              단변 길이
                            </TableCell>
                            <TableCell>{input.shortSpan} mm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className='font-medium'>
                              장변 길이
                            </TableCell>
                            <TableCell>{input.longSpan} mm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className='font-medium'>
                              콘크리트 강도
                            </TableCell>
                            <TableCell>{input.concreteStrength} MPa</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className='font-medium'>
                              철근 항복강도
                            </TableCell>
                            <TableCell>
                              {input.reinforcementStrength} MPa
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value='reinforcement'>
                    <AccordionTrigger>3. 철근 상세</AccordionTrigger>
                    <AccordionContent className='space-y-4'>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className='font-medium'>
                              단변방향 소요 철근량
                            </TableCell>
                            <TableCell>
                              {formatNumber(
                                results.requiredReinforcementArea.shortSpan
                              )}{" "}
                              mm²/m
                            </TableCell>
                          </TableRow>
                          {input.slabType === "TWO_WAY" && (
                            <TableRow>
                              <TableCell className='font-medium'>
                                장변방향 소요 철근량
                              </TableCell>
                              <TableCell>
                                {formatNumber(
                                  results.requiredReinforcementArea.longSpan
                                )}{" "}
                                mm²/m
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell className='font-medium'>
                              단변방향 철근 배치
                            </TableCell>
                            <TableCell>
                              {results.suggestedReinforcement.shortSpan}
                            </TableCell>
                          </TableRow>
                          {input.slabType === "TWO_WAY" && (
                            <TableRow>
                              <TableCell className='font-medium'>
                                장변방향 철근 배치
                              </TableCell>
                              <TableCell>
                                {results.suggestedReinforcement.longSpan}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : (
              <div className='py-8 text-center text-muted-foreground'>
                설계 계산을 실행하면 상세한 계산 과정이 표시됩니다
              </div>
            )}
          </TabsContent>

          <TabsContent value='diagram' className='space-y-4'>
            <div className='flex items-center justify-center w-full rounded-lg aspect-video bg-muted'>
              {results ? (
                <div className='space-y-2 text-center'>
                  <p>제안된 철근 배치:</p>
                  <p className='font-medium'>
                    단변방향: {results.suggestedReinforcement.shortSpan}
                  </p>
                  {input?.slabType === "TWO_WAY" && (
                    <p className='font-medium'>
                      장변방향: {results.suggestedReinforcement.longSpan}
                    </p>
                  )}
                </div>
              ) : (
                <span className='text-muted-foreground'>
                  설계 결과에 따른 배근도가 표시됩니다
                </span>
              )}
            </div>
          </TabsContent>

          <TabsContent value='references' className='space-y-4'>
            <div className='space-y-4 text-sm'>
              <div className='space-y-2'>
                <h4 className='font-medium'>참고 기준</h4>
                <ul className='pl-4 space-y-2 list-disc'>
                  <li>
                    <p>KDS 14 20 00 콘크리트구조 설계기준</p>
                    <p className='pl-4 text-muted-foreground'>
                      - 4.2 휨 부재 설계
                      <br />- 4.4 처짐 검토
                    </p>
                  </li>
                  <li>
                    <p>KDS 41 10 15 건축구조기준</p>
                    <p className='pl-4 text-muted-foreground'>
                      - 표 4.3-1 기본등분포활하중
                    </p>
                  </li>
                </ul>
              </div>
              <div className='space-y-2'>
                <h4 className='font-medium'>설계 가정</h4>
                <ul className='pl-4 space-y-1 list-disc'>
                  <li>등분포 하중 적용</li>
                  <li>콘크리트 탄성계수: 8500√f'ck</li>
                  <li>피복두께: 20mm</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
