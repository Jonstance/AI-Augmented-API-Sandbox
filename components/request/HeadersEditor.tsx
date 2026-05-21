"use client";

import { useState } from "react";
import type { HeaderPair } from "@/lib/types";

interface HeadersEditorProps {
  headers: HeaderPair[];
  onChange: (headers: HeaderPair[]) => void;
}

export default function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const addRow = () => {
    onChange([...headers, { key: "", value: "", enabled: true }]);
    setExpanded(true);
  };

  const updateRow = (index: number, field: keyof HeaderPair, value: string | boolean) => {
    const updated = headers.map((h, i) =>
      i === index ? { ...h, [field]: value } : h
    );
    onChange(updated);
  };

  const removeRow = (index: number) => {
    onChange(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <span
            className="inline-block transition-transform"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▶
          </span>
          HEADERS {headers.length > 0 && `(${headers.length})`}
        </button>
        <button
          onClick={addRow}
          className="text-xs px-2 py-0.5 rounded transition-colors"
          style={{ color: "var(--accent)", background: "var(--accent-dim)" }}
        >
          + Add
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-1.5">
          {headers.map((header, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={(e) => updateRow(index, "enabled", e.target.checked)}
                className="w-3.5 h-3.5 shrink-0 accent-[#00c4b0]"
              />
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateRow(index, "key", e.target.value)}
                className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                style={{
                  background: "var(--bg-page)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  opacity: header.enabled ? 1 : 0.5,
                }}
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateRow(index, "value", e.target.value)}
                className="flex-1 text-xs px-2 py-1 rounded border outline-none"
                style={{
                  background: "var(--bg-page)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  opacity: header.enabled ? 1 : 0.5,
                }}
              />
              <button
                onClick={() => removeRow(index)}
                className="text-xs w-5 h-5 flex items-center justify-center rounded shrink-0"
                style={{ color: "var(--method-delete-text)" }}
              >
                ✕
              </button>
            </div>
          ))}
          {headers.length === 0 && (
            <div className="text-xs py-1" style={{ color: "var(--text-muted)" }}>
              No headers added
            </div>
          )}
        </div>
      )}
    </div>
  );
}
