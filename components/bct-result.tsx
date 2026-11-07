import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        ),
      )}
    </>
  );
}

function groupByMenu(scenarios: Scenario[]) {
  const groups: Record<string, Scenario[]> = {};
  for (const s of scenarios) {
    const key = s.menuName || "Tanpa Menu";
    (groups[key] ||= []).push(s);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) =>
      a.scenarioNo.localeCompare(b.scenarioNo, undefined, { numeric: true }),
    );
  }
  return groups;
}

export function BctResult({ doc }: { doc: BctDocument }) {
  const first = doc.scenarios[0];
  const groups = groupByMenu(doc.scenarios);

  const headerRows: [string, string][] = [
    ["Phase / Block Name", doc.phase],
    ["Project Name", doc.projectName],
    [
      "Function Name",
      first ? `Scenario ${first.scenarioNo} - ${first.title}` : "-",
    ],
    ["Document Name", doc.documentName],
    [
      "Version / Created-Updated / By",
      `${doc.version} / ${doc.createdDate} / ${doc.authorName}`,
    ],
  ];

  return (
    <div className="space-y-8">
      {/* Blok header 5 baris */}
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

      {/* Scenario per menu */}
      {Object.entries(groups).map(([menu, scenarios]) => (
        <section key={menu} className="space-y-4">
          <h2 className="text-xl font-semibold">{menu}</h2>

          {scenarios.map((s) => (
            <div key={s.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{s.scenarioNo}</Badge>
                <h3 className="font-medium">{s.title}</h3>
              </div>
              {s.preparationNote && (
                <p className="text-sm text-muted-foreground">
                  Preparation: {s.preparationNote}
                </p>
              )}

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>Function</TableHead>
                    <TableHead className="w-[40%]">
                      Condition/Procedure
                    </TableHead>
                    <TableHead>Checking</TableHead>
                    <TableHead>Expected Result</TableHead>
                    <TableHead>Evidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.steps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell>{step.stepNumber}</TableCell>
                      <TableCell>{step.functionName}</TableCell>
                      <TableCell className="whitespace-normal">
                        <Highlighted text={step.conditionProcedure} />
                      </TableCell>
                      <TableCell>{step.checking}</TableCell>
                      <TableCell>{step.expectedResult}</TableCell>
                      <TableCell>{step.evidenceLabel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
