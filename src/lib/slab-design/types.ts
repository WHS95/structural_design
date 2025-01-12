export type SlabType = "ONE_WAY" | "TWO_WAY";
export type SupportType = "SIMPLE" | "CONTINUOUS";

export interface SlabDesignInput {
  concreteStrength: number; // MPa
  reinforcementStrength: number; // MPa
  thickness: number; // mm
  shortSpan: number; // mm (단변)
  longSpan: number; // mm (장변)
  slabType: SlabType;
  supportType: SupportType;
}

export interface SlabCheckResult {
  status: "OK" | "NG";
  value: number;
  limit: number;
  ratio: number;
  message?: string;
}

export interface SlabDesignResults {
  shortSpanMoment: number; // kN·m/m
  longSpanMoment: number; // kN·m/m
  requiredReinforcementArea: {
    shortSpan: number; // mm²/m
    longSpan: number; // mm²/m
  };
  suggestedReinforcement: {
    shortSpan: string; // 예: "D13@200"
    longSpan: string;
  };
  checks: {
    moment: {
      shortSpan: SlabCheckResult;
      longSpan: SlabCheckResult;
    };
    minimumReinforcement: {
      shortSpan: SlabCheckResult;
      longSpan: SlabCheckResult;
    };
    maximumReinforcement: {
      shortSpan: SlabCheckResult;
      longSpan: SlabCheckResult;
    };
    thickness: SlabCheckResult;
    deflection: SlabCheckResult;
  };
}
