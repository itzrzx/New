export interface ImageAnalysisProblem {
  category: string;
  detail: string;
  intensity: number; // 1 to 5
}

export interface ImageAnalysisFix {
  title: string;
  action: string;
  impact: string;
}

export interface ImageAnalysisResult {
  aiScore: number;
  verdict: string;
  problems: ImageAnalysisProblem[];
  fixes: ImageAnalysisFix[];
  retentionPotential: number;
}

export interface RetentionNode {
  timestampPercent: number;
  tension: number;
  energy: number;
  label: string;
}

export interface DangerZone {
  section: string;
  issue: string;
  solution: string;
}

export interface NarrativeAnalysisResult {
  curiosityScore: number;
  retentionGraph: RetentionNode[];
  dangerZones: DangerZone[];
  psychologyBreakdown: {
    curiosityGap: string;
    emotionalResonance: string;
  };
}

export interface FrictionPoint {
  element: string;
  frictionType: string;
  whyItFails: string;
  improvement: string;
}

export interface LandingAnalysisResult {
  contrastScore: number;
  premiumPerception: string;
  frictionPoints: FrictionPoint[];
  valuePropEvaluation: {
    clarity: string;
    psychologicalAngle: string;
  };
}

export type AnalysisType = 'image' | 'narrative' | 'landing';
