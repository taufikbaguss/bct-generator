"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadBox } from "@/components/upload-box";
import { BctResult } from "@/components/bct-result";
import { mockDocument } from "@/lib/mock-data";
import type { BctDocument } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export default function GeneratePage() {
  const [procedure, setProcedure] = useState<File | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [sourceCode, setSourceCode] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<BctDocument | null>(null);

  const ready = procedure && screenshot && sourceCode;

  async function handleGenerate() {
    setStatus("loading");
    setResult(null);
    try {
      // MOCK: pura-pura memproses 2 detik. Nanti diganti panggilan API beneran.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResult(mockDocument);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Generate Scenario BCT</h1>
        <p className="text-muted-foreground">
          Unggah tiga acuan, lalu tekan Generate.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <UploadBox
          label="File Prosedur"
          description="Stored procedure sebagai acuan alur bisnis."
          accept={[".sql", ".txt"]}
          maxSizeMB={2}
          file={procedure}
          onChange={setProcedure}
        />
        <UploadBox
          label="Screenshot Menu"
          description="Tampilan layar menu yang dipakai user."
          accept={[".png", ".jpg", ".jpeg"]}
          maxSizeMB={5}
          file={screenshot}
          onChange={setScreenshot}
          showPreview
        />
        <UploadBox
          label="Source Code"
          description="Kode program sebagai pendukung."
          accept={[".js", ".php", ".java"]}
          maxSizeMB={2}
          file={sourceCode}
          onChange={setSourceCode}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!ready || status === "loading"}
        >
          {status === "loading" ? "Memproses..." : "Generate"}
        </Button>
        {!ready && (
          <span className="text-sm text-muted-foreground">
            Lengkapi ketiga file dulu.
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600">
            Generate gagal. Silakan coba lagi.
          </span>
        )}
        {status === "success" && (
          <span className="text-sm text-green-600">Generate berhasil.</span>
        )}
      </div>

            {result ? (
        <BctResult doc={result} onChange={setResult} />
      ) : (
        status !== "loading" && (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Scenario belum tersedia. Unggah ketiga file lalu tekan Generate.
          </div>
        )
      )}
    </main>
  );
}
