"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  label: string;
  description: string;
  accept: string[]; // contoh: [".sql", ".txt"]
  maxSizeMB: number;
  file: File | null;
  onChange: (file: File | null) => void;
  showPreview?: boolean;
};

export function UploadBox({
  label,
  description,
  accept,
  maxSizeMB,
  file,
  onChange,
  showPreview = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih ulang
    if (!selected) return;

    const ext = "." + (selected.name.split(".").pop() ?? "").toLowerCase();
    if (!accept.includes(ext)) {
      setError(`Format tidak didukung. Gunakan: ${accept.join(", ")}`);
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file melebihi ${maxSizeMB} MB.`);
      return;
    }

    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (showPreview) setPreviewUrl(URL.createObjectURL(selected));
    onChange(selected);
  }

  function handleRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    onChange(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          className="hidden"
          onChange={handleSelect}
        />

        {file ? (
          <div className="space-y-3">
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={file.name}
                className="max-h-40 rounded-md border object-contain"
              />
            )}
            <p className="text-sm">
              <span className="font-medium">{file.name}</span>{" "}
              <span className="text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Ganti
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRemove}>
                Hapus
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            Pilih file ({accept.join(", ")})
          </Button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
