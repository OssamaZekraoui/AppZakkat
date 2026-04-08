"use client";

import { useState, useRef, useCallback } from "react";
import type { UploadedDocument, DocumentCategory } from "@/types/demandes";

interface DocumentUploaderProps {
  label: string;
  required: boolean;
  category: DocumentCategory;
  onUpload: (doc: UploadedDocument) => void;
  onRemove: (id: string) => void;
  uploaded?: UploadedDocument;
  locale: string;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUploader({
  label,
  required,
  category,
  onUpload,
  onRemove,
  uploaded,
  locale,
}: DocumentUploaderProps) {
  const isAr = locale === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(
          isAr
            ? "صيغة غير مقبولة (PDF, JPG, PNG, HEIC)"
            : "Format non accepté (PDF, JPG, PNG, HEIC)"
        );
        return;
      }

      if (file.size > MAX_SIZE) {
        setError(
          isAr ? "حجم الملف يتجاوز 5MB" : "Le fichier dépasse 5 MB"
        );
        return;
      }

      setUploading(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 20, 90));
      }, 200);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        clearInterval(interval);
        setProgress(100);

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();
        onUpload({
          id: data.id || crypto.randomUUID(),
          filename: data.filename || file.name,
          originalName: file.name,
          url: data.url || URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
          category,
          uploadedAt: new Date().toISOString(),
        });
      } catch {
        setError(isAr ? "فشل الرفع — حاول مجدداً" : "Échec de l'upload — réessayez");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [category, isAr, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const isImage = uploaded?.mimeType?.startsWith("image/");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-cairo text-sm font-semibold text-green-deep">
          {label}
        </span>
        {required && <span className="text-red-500 text-xs">*</span>}
      </div>

      {uploaded ? (
        /* Uploaded file preview */
        <div className="flex items-center gap-3 p-3 rounded-xl border border-green-medium/20 bg-green-pale/10">
          {isImage ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={uploaded.url}
                alt={uploaded.originalName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <span className="text-red-500 text-xl">PDF</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-lato text-sm text-green-deep truncate">
              {uploaded.originalName}
            </p>
            <p className="font-lato text-xs text-green-deep/40">
              {formatSize(uploaded.size)}
            </p>
          </div>
          <button
            onClick={() => onRemove(uploaded.id)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
            title={isAr ? "حذف" : "Supprimer"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        /* Upload zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all text-center ${
            dragOver
              ? "border-gold bg-gold/5"
              : "border-green-deep/15 hover:border-green-deep/30 bg-white"
          }`}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="w-full h-2 bg-green-deep/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-cairo text-xs text-green-deep/50">
                {isAr ? "جاري الرفع..." : "Upload en cours..."}
              </p>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2 text-green-deep/30">
                {category === "PHOTOS" ? "📸" : "📄"}
              </div>
              <p className="font-cairo text-sm text-green-deep/50">
                {isAr
                  ? "اسحب الملف هنا أو انقر للاختيار"
                  : "Glissez un fichier ou cliquez pour choisir"}
              </p>
              <p className="font-lato text-xs text-green-deep/30 mt-1">
                PDF, JPG, PNG — max 5 MB
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.heic"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-cairo">{error}</p>
      )}
    </div>
  );
}
