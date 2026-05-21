"use client";

import { useState, useEffect } from "react";
import type { Endpoint, Collection } from "@/lib/types";
import ParamEditor from "./ParamEditor";
import BodyEditor from "./BodyEditor";

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET: { bg: "var(--method-get-bg)", text: "var(--method-get-text)" },
  POST: { bg: "var(--method-post-bg)", text: "var(--method-post-text)" },
  DELETE: { bg: "var(--method-delete-bg)", text: "var(--method-delete-text)" },
  PATCH: { bg: "var(--method-patch-bg)", text: "var(--method-patch-text)" },
  PUT: { bg: "var(--method-put-bg)", text: "var(--method-put-text)" },
};

interface RequestPanelProps {
  endpoint: Endpoint | null;
  collection: Collection | null;
  authKey: string;
  loading: boolean;
  onRun: (params: Record<string, string>, body: string) => void;
}

export default function RequestPanel({
  endpoint,
  collection,
  authKey,
  loading,
  onRun,
}: RequestPanelProps) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!endpoint) return;
    // Reset params with defaults
    const defaults: Record<string, string> = {};
    endpoint.params?.forEach((p) => {
      defaults[p.name] = p.defaultValue;
    });
    setParams(defaults);
    // Reset body with default
    setBody(
      endpoint.defaultBody ? JSON.stringify(endpoint.defaultBody, null, 2) : ""
    );
  }, [endpoint?.id]);

  if (!endpoint || !collection) {
    return (
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="text-center">
          <div className="text-2xl mb-3 opacity-30">⌨</div>
          <div className="text-sm">Select an endpoint to get started</div>
        </div>
      </div>
    );
  }

  const methodStyle = METHOD_STYLES[endpoint.method] ?? METHOD_STYLES.GET;
  const showBody = ["POST", "PUT", "PATCH"].includes(endpoint.method);

  // Build display URL
  const resolvedPath = endpoint.path.replace(/:([^/?&]+)/g, (_, key) =>
    params[key] ? encodeURIComponent(params[key]) : `:${key}`
  );
  const displayUrl = `${collection.baseUrl}${resolvedPath}`;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto p-4 gap-4"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Method + URL bar */}
      <div
        className="flex items-center gap-2 p-2 rounded border"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <span
          className="text-xs px-2 py-1 rounded font-bold shrink-0"
          style={{ background: methodStyle.bg, color: methodStyle.text }}
        >
          {endpoint.method}
        </span>
        <div className="flex-1 text-xs overflow-hidden">
          <span style={{ color: "var(--text-muted)" }}>
            {collection.baseUrl}
          </span>
          {endpoint.path.split(/(:([^/?&]+))/).map((segment, i) => {
            if (segment.startsWith(":")) {
              const key = segment.slice(1);
              return (
                <span key={i} style={{ color: "var(--accent)" }}>
                  {params[key] ? encodeURIComponent(params[key]) : segment}
                </span>
              );
            }
            return (
              <span key={i} style={{ color: "var(--text-primary)" }}>
                {segment}
              </span>
            );
          })}
        </div>
      </div>

      {/* Description */}
      {endpoint.description && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {endpoint.description}
        </p>
      )}

      {/* Params */}
      <ParamEditor params={params} onChange={setParams} />

      {/* Body */}
      {showBody && <BodyEditor value={body} onChange={setBody} />}

      {/* Auth info */}
      {collection.authType !== "none" && !authKey && (
        <div
          className="text-xs p-2 rounded border"
          style={{
            borderColor: "var(--method-patch-text)",
            color: "var(--method-patch-text)",
            background: "var(--method-patch-bg)",
          }}
        >
          No {collection.authLabel} provided — mock response will be returned
        </div>
      )}

      {/* Run button */}
      <button
        onClick={() => onRun(params, body)}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold transition-all"
        style={{
          background: loading ? "var(--bg-surface)" : "var(--accent)",
          color: loading ? "var(--text-muted)" : "var(--bg-page)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <span className="animate-spin">◌</span> Running...
          </>
        ) : (
          <>▶ Run</>
        )}
      </button>

      {/* Resolved URL preview */}
      <div
        className="text-xs p-2 rounded border overflow-x-auto"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>→ </span>
        <span style={{ color: "var(--json-string)" }}>{displayUrl}</span>
        {collection.authType === "query" && authKey && (
          <span style={{ color: "var(--accent)" }}>
            &{collection.authParamName}=***
          </span>
        )}
      </div>
    </div>
  );
}
