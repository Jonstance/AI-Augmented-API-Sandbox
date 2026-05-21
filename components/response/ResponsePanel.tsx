"use client";

import { useState } from "react";
import type { ApiResponse } from "@/lib/types";
import StatusPill from "./StatusPill";
import JsonHighlighter from "./JsonHighlighter";

interface ResponsePanelProps {
  response: ApiResponse | null;
  loading: boolean;
}

export default function ResponsePanel({ response, loading }: ResponsePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col p-4 gap-3" style={{ background: "var(--bg-surface)" }}>
        <div className="flex items-center gap-3">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-12" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-4"
              style={{ width: `${60 + Math.random() * 35}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}
      >
        <div className="text-center">
          <div className="text-3xl mb-3 opacity-20">{"{ }"}</div>
          <div className="text-sm">Response will appear here</div>
          <div className="text-xs mt-1 opacity-60">Run a request to see the output</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <StatusPill status={response.status} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {response.responseTime}ms
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {formatSize(response.size)}
        </span>
        <div className="flex-1" />
        <button
          onClick={handleCopy}
          className="text-xs px-2.5 py-1 rounded transition-colors"
          style={{
            background: copied ? "var(--method-get-bg)" : "var(--bg-surface-2)",
            color: copied ? "var(--method-get-text)" : "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* JSON output */}
      <div className="flex-1 overflow-auto">
        {typeof response.data === "object" && response.data !== null ? (
          <JsonHighlighter data={response.data} />
        ) : (
          <pre
            className="text-xs p-4 leading-relaxed"
            style={{ color: "var(--text-primary)", fontFamily: "inherit" }}
          >
            {String(response.data)}
          </pre>
        )}
      </div>
    </div>
  );
}
