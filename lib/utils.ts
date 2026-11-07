import type { BctDocument, Scenario, Step } from "./types";

export type EditableStepField =
  | "functionName"
  | "conditionProcedure"
  | "checking"
  | "expectedResult"
  | "evidenceLabel";

export type EditableScenarioField = "menuName" | "title" | "preparationNote";

// Nomori ulang langkah: 1, 2, 3, ... sesuai urutan
function renumber(steps: Step[]): Step[] {
  return steps.map((step, index) => ({ ...step, stepNumber: index + 1 }));
}

// Ubah satu scenario saja, scenario lain dibiarkan
function mapScenario(
  doc: BctDocument,
  scenarioId: string,
  fn: (scenario: Scenario) => Scenario
): BctDocument {
  return {
    ...doc,
    scenarios: doc.scenarios.map((s) => (s.id === scenarioId ? fn(s) : s)),
  };
}

export function updateStepField(
  doc: BctDocument,
  scenarioId: string,
  stepId: string,
  field: EditableStepField,
  value: string
): BctDocument {
  return mapScenario(doc, scenarioId, (s) => ({
    ...s,
    steps: s.steps.map((step) =>
      step.id === stepId ? { ...step, [field]: value } : step
    ),
  }));
}

export function addStep(doc: BctDocument, scenarioId: string): BctDocument {
  return mapScenario(doc, scenarioId, (s) => ({
    ...s,
    steps: renumber([
      ...s.steps,
      {
        id: crypto.randomUUID(),
        stepNumber: 0,
        functionName: "",
        conditionProcedure: "",
        checking: "",
        expectedResult: "",
        evidenceLabel: "",
      },
    ]),
  }));
}

export function deleteStep(
  doc: BctDocument,
  scenarioId: string,
  stepId: string
): BctDocument {
  return mapScenario(doc, scenarioId, (s) => ({
    ...s,
    steps: renumber(s.steps.filter((step) => step.id !== stepId)),
  }));
}

export function updateScenarioField(
  doc: BctDocument,
  scenarioId: string,
  field: EditableScenarioField,
  value: string
): BctDocument {
  return mapScenario(doc, scenarioId, (s) => ({ ...s, [field]: value }));
}