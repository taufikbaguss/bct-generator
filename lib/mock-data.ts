import type { BctDocument } from "./types";

export const mockDocument: BctDocument = {
  phase: "ST",
  projectName: "G-TOPAS Local App (Spex)",
  documentName: "BCT",
  version: "0.1",
  createdDate: "13-Jul-25",
  authorName: "FID) Bagus",
  scenarios: [
    {
      id: "s1",
      scenarioNo: "1.1",
      menuName: "Invoice",
      title: "Create Invoice by Sea",
      preparationNote: "Ready Cargo Data in SPEX DB",
      steps: [
        {
          id: "s1-1",
          stepNumber: 1,
          functionName: "Create Invoice",
          conditionProcedure:
            "Klik tombol Create, isi Invoice No. Data disimpan ke TB_R_INVOICE WHERE INVOICE_NO = 'INV-001'",
          checking: "Status invoice",
          expectedResult: "Status invoice = DRAFT",
          evidenceLabel: "",
        },
        {
          id: "s1-2",
          stepNumber: 2,
          functionName: "Submit Invoice",
          conditionProcedure:
            "Klik tombol Submit. Cek TB_R_INVOICE WHERE INVOICE_NO = 'INV-001'",
          checking: "Status invoice",
          expectedResult: "Status invoice = SUBMITTED",
          evidenceLabel: "",
        },
      ],
    },
    {
      id: "s2",
      scenarioNo: "2.1",
      menuName: "Cargo",
      title: "Register Cargo",
      preparationNote: "Ready Vessel Data in SPEX DB",
      steps: [
        {
          id: "s2-1",
          stepNumber: 1,
          functionName: "Register Cargo",
          conditionProcedure:
            "Isi form cargo lalu klik Save. Cek TB_R_CARGO WHERE CARGO_ID = 'C-001'",
          checking: "Data cargo",
          expectedResult: "Data cargo tersimpan",
          evidenceLabel: "",
        },
      ],
    },
  ],
};
