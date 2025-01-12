import {
  BeamDesignInput,
  BeamDesignResults,
  BeamType,
  BeamCheckResult,
} from "./types";

function checkValue(
  value: number,
  limit: number,
  type: "max" | "min" = "max"
): BeamCheckResult {
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
function calculateDesignLoad(spanLength: number): number {
  const deadLoad = 25; // kN/m²
  const liveLoad = 5; // kN/m²
  const wu = 1.2 * deadLoad + 1.6 * liveLoad;
  return wu * (spanLength / 1000); // kN/m
}

// 휨모멘트 계산
function calculateBendingMoment(load: number, span: number): number {
  return (load * Math.pow(span / 1000, 2)) / 8;
}

// 전단력 계산
function calculateShearForce(load: number, span: number): number {
  return (load * (span / 1000)) / 2;
}

// 공칭 휨강도 계산
function calculateNominalMomentStrength(
  fc: number,
  fy: number,
  As: number,
  width: number,
  effectiveDepth: number
): number {
  const a = (As * fy) / (0.85 * fc * width);
  return (As * fy * (effectiveDepth - a / 2)) / 1000000; // kN·m
}

// 공칭 전단강도 계산
function calculateNominalShearStrength(
  fc: number,
  width: number,
  effectiveDepth: number
): number {
  // 콘크리트 전단강도
  const Vc = (0.17 * Math.sqrt(fc) * width * effectiveDepth) / 1000; // kN
  return Vc;
}

// 필요 철근량 계산
function calculateRequiredReinforcement(
  moment: number,
  fc: number,
  fy: number,
  width: number,
  effectiveDepth: number
): {
  area: number;
  checks: {
    minimum: BeamCheckResult;
    maximum: BeamCheckResult;
  };
} {
  // 휨 철근량 계산
  const Mn = moment * 1000000; // N·mm
  const Rn = Mn / (width * Math.pow(effectiveDepth, 2));
  const rho = ((0.85 * fc) / fy) * (1 - Math.sqrt(1 - (2 * Rn) / (0.85 * fc)));
  const area = rho * width * effectiveDepth;

  // 최소 철근비 검토
  const minRho = Math.max(1.4 / fy, (0.25 * Math.sqrt(fc)) / fy);
  const minArea = minRho * width * effectiveDepth;

  // 최대 철근비 검토
  const maxRho = 0.75 * ((0.85 * fc) / fy) * (3 / 8);
  const maxArea = maxRho * width * effectiveDepth;

  return {
    area,
    checks: {
      minimum: checkValue(area, minArea, "min"),
      maximum: checkValue(area, maxArea, "max"),
    },
  };
}

// 철근 배치 제안
function suggestReinforcement(
  area: number,
  width: number,
  effectiveDepth: number
): {
  mainBars: string;
  stirrups: string;
} {
  const D10_AREA = 71.33;
  const D13_AREA = 126.7;
  const D16_AREA = 198.6;
  const D19_AREA = 286.5;
  const D22_AREA = 387.1;
  const D25_AREA = 506.7;
  const D29_AREA = 642.4;

  let mainBars = "";
  let numberOfBars = 0;
  let selectedDiameter = 0;

  // 철근 직경 선택
  if (area <= D16_AREA * 2) {
    numberOfBars = Math.ceil(area / D16_AREA);
    selectedDiameter = 16;
  } else if (area <= D19_AREA * 2) {
    numberOfBars = Math.ceil(area / D19_AREA);
    selectedDiameter = 19;
  } else if (area <= D22_AREA * 2) {
    numberOfBars = Math.ceil(area / D22_AREA);
    selectedDiameter = 22;
  } else if (area <= D25_AREA * 2) {
    numberOfBars = Math.ceil(area / D25_AREA);
    selectedDiameter = 25;
  } else {
    numberOfBars = Math.ceil(area / D29_AREA);
    selectedDiameter = 29;
  }

  // 최소 간격 검토 (직경의 1.5배 또는 25mm 중 큰 값)
  const minSpacing = Math.max(selectedDiameter * 1.5, 25);
  const availableWidth = width - 2 * 40 - 2 * 10; // 피복두께와 스터럽 고려
  const maxBarsPerLayer = Math.floor(
    availableWidth / (selectedDiameter + minSpacing)
  );

  // 필요한 층수 계산
  const numberOfLayers = Math.ceil(numberOfBars / maxBarsPerLayer);

  mainBars = `${numberOfBars}-D${selectedDiameter}`;
  if (numberOfLayers > 1) {
    mainBars += ` (${numberOfLayers}단)`;
  }

  // 스터럽 간격 결정 (유효깊이의 1/2 또는 600mm 중 작은 값)
  const stirrupSpacing = Math.min(Math.floor(effectiveDepth / 2), 600);
  const stirrups = `D10@${stirrupSpacing}`;

  return {
    mainBars,
    stirrups,
  };
}

// 폭/춤 비율 검토
function checkWidthHeightRatio(width: number, height: number): BeamCheckResult {
  const ratio = width / height;
  const minRatio = 0.3; // 일반적인 최소 폭/춤 비율
  const maxRatio = 0.7; // 일반적인 최대 폭/춤 비율

  return {
    status: ratio >= minRatio && ratio <= maxRatio ? "OK" : "NG",
    value: ratio,
    limit: ratio < minRatio ? minRatio : maxRatio,
    ratio: ratio < minRatio ? minRatio / ratio : ratio / maxRatio,
    message:
      ratio < minRatio
        ? "폭이 너무 작습니다. 최소 폭/춤 비율은 0.3입니다."
        : ratio > maxRatio
        ? "폭이 너무 큽니다. 최대 폭/춤 비율은 0.7입니다."
        : undefined,
  };
}

export function calculateBeamDesign(input: BeamDesignInput): BeamDesignResults {
  const effectiveDepth = input.height - input.coverDepth;

  // 1. 설계하중 계산
  const designLoad = calculateDesignLoad(input.spanLength);

  // 2. 휨모멘트 계산
  const bendingMoment = calculateBendingMoment(designLoad, input.spanLength);

  // 3. 전단력 계산
  const shearForce = calculateShearForce(designLoad, input.spanLength);

  // 4. 필요 철근량 계산
  const reinforcementResult = calculateRequiredReinforcement(
    bendingMoment,
    input.concreteStrength,
    input.reinforcementStrength,
    input.width,
    effectiveDepth
  );

  // 5. 철근 배치 제안
  const suggestedReinforcement = suggestReinforcement(
    reinforcementResult.area,
    input.width,
    effectiveDepth
  );

  // 6. 강도 검토
  const nominalMoment = calculateNominalMomentStrength(
    input.concreteStrength,
    input.reinforcementStrength,
    reinforcementResult.area,
    input.width,
    effectiveDepth
  );

  const nominalShear = calculateNominalShearStrength(
    input.concreteStrength,
    input.width,
    effectiveDepth
  );

  const momentCheck = checkValue(bendingMoment, nominalMoment * 0.85);
  const shearCheck = checkValue(shearForce, nominalShear * 0.75);
  const widthHeightRatioCheck = checkWidthHeightRatio(
    input.width,
    input.height
  );

  return {
    bendingMoment: Math.round(bendingMoment * 100) / 100,
    shearForce: Math.round(shearForce * 100) / 100,
    requiredReinforcementArea: Math.round(reinforcementResult.area * 100) / 100,
    suggestedReinforcement,
    checks: {
      moment: momentCheck,
      shear: shearCheck,
      minimumReinforcement: reinforcementResult.checks.minimum,
      maximumReinforcement: reinforcementResult.checks.maximum,
      widthHeightRatio: widthHeightRatioCheck,
    },
  };
}
