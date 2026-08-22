export type AssessmentItem = {
  assessmentItemId: string;
  axisName: string;
  componentIdentifier: string;
  componentName: string;
  itemIdentifier: string;
  itemName: string;
  scoreText: string;
  normalizedScore: number | null;
  assessmentComment: string;
  confidentialityStatus: string;
};

export type ComponentScore = {
  componentIdentifier: string;
  componentName: string;
  axisName: string;
  status: "calculavel" | "nao_avaliado" | "sem_itens_avaliados";
  score: number | null;
  eligible: boolean;
  calculation: {
    evaluatedItems: number;
    totalItems: number;
    normalizedAverage: number | null;
    displayScale: "0-4";
  };
  items: AssessmentItem[];
};
