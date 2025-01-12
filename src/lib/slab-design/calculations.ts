import {
  SlabDesignInput,
  SlabDesignResults,
  SlabCheckResult,
  SlabType,
  SupportType,
} from "./types";

function checkValue(
  value: number,
  limit: number,
  type: "max" | "min" = "max"
): SlabCheckResult {
  const ratio = type === "max" ? value / limit : limit / value;
  return {
    status:
      type === "max"
        ? value <= limit
          ? "OK"
          : "NG"
        : value >= limit
        ? "OK"
        : "NG",
    value,
    limit,
    ratio,
  };
}

// 설계 하중 계산
function calculateDesignLoad(): number {
  const deadLoad = 25; // kN/m² (자중 + 마감하중)
  const liveLoad = 5; // kN/m² (주거용)
  return 1.2 * deadLoad + 1.6 * liveLoad; // kN/m²
}

// 모멘트 계수 계산
function calculateMomentCoefficient(
  slabType: SlabType,
  supportType: SupportType,
  ratio: number
): { short: number; long: number } {
  if (slabType === "ONE_WAY") {
    return {
      short: supportType === "SIMPLE" ? 1 / 8 : 1 / 10,
      long: 0,
    };
  } else {
    // TWO_WAY 슬래브의 경우 단변/장변 비율에 따른 모멘트 계수 적용
    const shortCoef =
      supportType === "SIMPLE" ? 0.062 - 0.01 * ratio : 0.045 - 0.005 * ratio;
    const longCoef =
      supportType === "SIMPLE" ? 0.029 + 0.01 * ratio : 0.02 + 0.005 * ratio;
    return {
      short: shortCoef,
      long: longCoef,
    };
  }
}

// 최소 두께 검토
function checkMinimumThickness(input: SlabDesignInput): SlabCheckResult {
  const ln = input.shortSpan - 250; // 순경간 (mm)
  let minThickness: number;

  if (input.slabType === "ONE_WAY") {
    minThickness = input.supportType === "SIMPLE" ? ln / 20 : ln / 24;
  } else {
    const ratio = input.longSpan / input.shortSpan;
    minThickness =
      input.supportType === "SIMPLE" ? ln / (25 - ratio) : ln / (30 - ratio);
  }

  return checkValue(input.thickness, minThickness, "min");
}

// 처짐 검토
function checkDeflection(input: SlabDesignInput): SlabCheckResult {
  const ln = input.shortSpan - 250; // 순경간 (mm)
  const allowableDeflection = ln / 240; // 허용처짐

  // 간략화된 처짐 계산 (실제로는 더 복잡한 계산이 필요)
  const estimatedDeflection = ln / 350;

  return checkValue(estimatedDeflection, allowableDeflection);
}

// 필요 철근량 계산
function calculateRequiredReinforcement(
  moment: number,
  fc: number,
  fy: number,
  thickness: number
): {
  area: number;
  checks: {
    minimum: SlabCheckResult;
    maximum: SlabCheckResult;
  };
} {
  const d = thickness - 20; // 유효깊이 (피복두께 20mm 가정)
  const b = 1000; // 단위폭 1m

  // 휨 철근량 계산
  const Mn = moment * 1000000; // N·mm/m
  const Rn = Mn / (b * Math.pow(d, 2));
  const rho = ((0.85 * fc) / fy) * (1 - Math.sqrt(1 - (2 * Rn) / (0.85 * fc)));
  const area = rho * b * d;

  // 최소 철근비 검토
  const minRho = Math.max(1.4 / fy, (0.25 * Math.sqrt(fc)) / fy);
  const minArea = minRho * b * d;

  // 최대 철근비 검토
  const maxRho = 0.75 * ((0.85 * fc) / fy) * (3 / 8);
  const maxArea = maxRho * b * d;

  return {
    area,
    checks: {
      minimum: checkValue(area, minArea, "min"),
      maximum: checkValue(area, maxArea, "max"),
    },
  };
}

// 철근 배치 제안
function suggestReinforcement(area: number): string {
  const D10_AREA = 71.33;
  const D13_AREA = 126.7;
  const D16_AREA = 198.6;

  // 철근 간격 옵션 (mm)
  const spacingOptions = [100, 150, 200, 250];

  let selectedBar: { diameter: number; area: number } | null = null;
  let selectedSpacing = 0;

  // 가능한 철근 조합 찾기
  for (const spacing of spacingOptions) {
    const requiredAreaPerBar = (area * spacing) / 1000;

    if (requiredAreaPerBar <= D10_AREA) {
      selectedBar = { diameter: 10, area: D10_AREA };
      selectedSpacing = spacing;
      break;
    } else if (requiredAreaPerBar <= D13_AREA) {
      selectedBar = { diameter: 13, area: D13_AREA };
      selectedSpacing = spacing;
      break;
    } else if (requiredAreaPerBar <= D16_AREA) {
      selectedBar = { diameter: 16, area: D16_AREA };
      selectedSpacing = spacing;
      break;
    }
  }

  if (!selectedBar) {
    selectedBar = { diameter: 16, area: D16_AREA };
    selectedSpacing = 100;
  }

  return `D${selectedBar.diameter}@${selectedSpacing}`;
}

export function calculateSlabDesign(input: SlabDesignInput): SlabDesignResults {
  // 1. 설계하중 계산
  const designLoad = calculateDesignLoad();

  // 2. 모멘트 계수 계산
  const ratio = input.shortSpan / input.longSpan;
  const momentCoef = calculateMomentCoefficient(
    input.slabType,
    input.supportType,
    ratio
  );

  // 3. 설계 모멘트 계산
  const shortSpanMoment =
    momentCoef.short * designLoad * Math.pow(input.shortSpan / 1000, 2);
  const longSpanMoment =
    momentCoef.long * designLoad * Math.pow(input.longSpan / 1000, 2);

  // 4. 필요 철근량 계산
  const shortSpanReinforcement = calculateRequiredReinforcement(
    shortSpanMoment,
    input.concreteStrength,
    input.reinforcementStrength,
    input.thickness
  );

  const longSpanReinforcement = calculateRequiredReinforcement(
    longSpanMoment,
    input.concreteStrength,
    input.reinforcementStrength,
    input.thickness
  );

  // 5. 두께 및 처짐 검토
  const thicknessCheck = checkMinimumThickness(input);
  const deflectionCheck = checkDeflection(input);

  return {
    shortSpanMoment: Math.round(shortSpanMoment * 100) / 100,
    longSpanMoment: Math.round(longSpanMoment * 100) / 100,
    requiredReinforcementArea: {
      shortSpan: Math.round(shortSpanReinforcement.area * 100) / 100,
      longSpan: Math.round(longSpanReinforcement.area * 100) / 100,
    },
    suggestedReinforcement: {
      shortSpan: suggestReinforcement(shortSpanReinforcement.area),
      longSpan: suggestReinforcement(longSpanReinforcement.area),
    },
    checks: {
      moment: {
        shortSpan: checkValue(shortSpanMoment, shortSpanMoment * 0.9),
        longSpan: checkValue(longSpanMoment, longSpanMoment * 0.9),
      },
      minimumReinforcement: {
        shortSpan: shortSpanReinforcement.checks.minimum,
        longSpan: longSpanReinforcement.checks.minimum,
      },
      maximumReinforcement: {
        shortSpan: shortSpanReinforcement.checks.maximum,
        longSpan: longSpanReinforcement.checks.maximum,
      },
      thickness: thicknessCheck,
      deflection: deflectionCheck,
    },
  };
}
