export type Step = {
  id: string;
  stepNumber: number;
  functionName: string;
  conditionProcedure: string;
  checking: string;
  expectedResult: string;
  evidenceLabel: string;
};

export type Scenario = {
  id: string;
  scenarioNo: string;
  menuName: string;
  title: string;
  preparationNote: string;
  steps: Step[];
};

export type BctDocument = {
  phase: string;
  projectName: string;
  documentName: string;
  version: string;
  createdDate: string;
  authorName: string;
  scenarios: Scenario[];
};
