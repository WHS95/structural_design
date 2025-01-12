export type BeamType = "TYPE_A" | "TYPE_C";

export interface BeamDesignInput {
  concreteStrength: number; // MPa
  reinforcementStrength: number; // MPa
  spanLength: number; // mm
  width: number; // mm (보 폭)
  height: number; // mm (보 춤)
  coverDepth: number; // mm (피복두께)
}

export interface BeamCheckResult {
  status: "OK" | "NG";
  value: number;
  limit: number;
  ratio: number;
  message?: string;
}

export interface BeamDesignResults {
  bendingMoment: number; // kN·m
  shearForce: number; // kN
  requiredReinforcementArea: number; // mm²
  suggestedReinforcement: {
    mainBars: string;
    stirrups: string;
  };
  checks: {
    moment: BeamCheckResult;
    shear: BeamCheckResult;
    minimumReinforcement: BeamCheckResult;
    maximumReinforcement: BeamCheckResult;
    widthHeightRatio: BeamCheckResult; // 폭/춤 비율 검토
  };
}
