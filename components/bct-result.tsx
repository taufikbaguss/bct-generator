"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addStep,
  deleteStep,
  updateScenarioField,
  updateStepField,
  type EditableStepField,
} from "@/lib/doc-utils";
import type { BctDocument, Scenario } from "@/lib/types";

// Sorot nama tabel (TB_R_...) dan klausa WHERE dengan warna kuning
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(TB_R_\w+|WHERE\s[^.]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^(TB_R_\w+|WHERE\s[^.]+)$/.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-black">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Teks biasa; kalau diklik berubah jadi kotak ketik; klik di luar = simpan
function EditableCell({
  value,
  onSave,
  highlight = false,
  placeholder = "Klik untuk mengisi",
}: {
  value: string;
  onSave: (value: string) => void;
  highlight?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function startEdit() {
    setDraft(value);
    setEditing(true);
  }

  if (editing) {
    return (
      <Textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== value) onSave(draft);
        }}
        className="min-h-20"
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={startEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter") startEdit();
      }}
      className="min-h-8 cursor-text whitespace-pre-wrap rounded px-1 py-1 hover:bg-muted"
    >
      {value ? (
        highlight ? (
          <Highlighted text={value} />
        ) : (
          value
        )
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  );
}

function groupByMenu(scenarios: Scenario[]) {
  const groups: Record<string, Scenario[]> = {};
  for (const s of scenarios) {
    const key = s.menuName.trim() || "Tanpa Menu";
    (groups[key] ||= []).push(s);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) =>
      a.scenarioNo.localeCompare(b.scenarioNo, undefined, { numeric: true })
    );
  }
  return groups;
}

const columns: {
  field: EditableStepField;
  label: string;
  className?: string;
  highlight?: boolean;
}[] = [
  { field: "functionName", label: "Function" },
  {
    field: "conditionProcedure",
    label: "Condition/Procedure",
    className: "w-[40%]",
    highlight: true,
  },
  { field: "checking", label: "Checking" },
  { field: "expectedResult", label: "Expected Result" },
  { field: "evidenceLabel", label: "Evidence" },
];

type Props = {
  doc: BctDocument;
  onChange: (doc: BctDocument) => void;
};

export function BctResult({ doc, onChange }: Props) {
  const [pendingDelete, setPendingDelete] = useState<{
    scenarioId: string;
    stepId: string;
  } | null>(null);

  if (doc.scenarios.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Belum ada scenario. Jalankan Generate ulang untuk membuatnya.
      </div>
    );
  }

  const first = doc.scenarios[0];
  const groups = groupByMenu(doc.scenarios);

  const headerRows: [string, string][] = [
    ["Phase / Block Name", doc.phase],
    ["Project Name", doc.projectName],
    ["Function Name", `Scenario ${first.scenarioNo} - ${first.title}`],
    ["Document Name", doc.documentName],
    [
      "Version / Created-Updated / By",
      `${doc.version} / ${doc.createdDate} / ${doc.authorName}`,
    ],
  ];

  return (
    <div className="space-y-8">
      <table className="w-full border text-sm">
        <tbody>
          {headerRows.map(([label, value]) => (
            <tr key={label} className="border-b">
              <td className="w-64 border-r bg-muted px-3 py-2 font-medium">
                {label}
              </td>
              <td className="px-3 py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-muted-foreground">
        Klik teks di tabel untuk mengubahnya. Klik di luar kotak untuk menyimpan.
      </p>

      {Object.entries(groups).map(([menu, scenarios]) => (
        <section key={menu} className="space-y-4">
          <h2 className="text-xl font-semibold">{menu}</h2>

          {scenarios.map((s) => (
            <div key={s.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{s.scenarioNo}</Badge>
                <div className="min-w-48 flex-1 font-medium">
                  <EditableCell
                    value={s.title}
                    placeholder="Judul scenario"
                    onSave={(v) =>
                      onChange(updateScenarioField(doc, s.id, "title", v))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Menu:</span>
                  <EditableCell
                    value={s.menuName}
                    placeholder="Tanpa Menu"
                    onSave={(v) =>
                      onChange(updateScenarioField(doc, s.id, "menuName", v))
                    }
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Preparation:</span>
                  <EditableCell
                    value={s.preparationNote}
                    onSave={(v) =>
                      onChange(
                        updateScenarioField(doc, s.id, "preparationNote", v)
                      )
                    }
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="w-12">No.</TableHead>
                    {columns.map((col) => (
                      <TableHead key={col.field} className={col.className}>
                        {col.label}
                      </TableHead>
                    ))}
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.steps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell className="align-top">
                        {step.stepNumber}
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell
                          key={col.field}
                          className="whitespace-normal align-top"
                        >
                          <EditableCell
                            value={step[col.field]}
                            highlight={col.highlight}
                            onSave={(v) =>
                              onChange(
                                updateStepField(
                                  doc,
                                  s.id,
                                  step.id,
                                  col.field,
                                  v
                                )
                              )
                            }
                          />
                        </TableCell>
                      ))}
                      <TableCell className="align-top">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPendingDelete({
                              scenarioId: s.id,
                              stepId: step.id,
                            })
                          }
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(addStep(doc, s.id))}
              >
                + Tambah langkah
              </Button>
            </div>
          ))}
        </section>
      ))}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus langkah ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Langkah akan dihapus dan nomor langkah lainnya dirapikan otomatis.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  onChange(
                    deleteStep(
                      doc,
                      pendingDelete.scenarioId,
                      pendingDelete.stepId
                    )
                  );
                }
                setPendingDelete(null);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}