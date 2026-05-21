"use client";

import { useState } from "react";
import type { HttpMethod, HeaderPair } from "@/lib/types";
import HeadersEditor from "@/components/request/HeadersEditor";
import BodyEditor from "@/components/request/BodyEditor";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET: { bg: "var(--method-get-bg)", text: "var(--method-get-text)" },
  POST: { bg: "var(--method-post-bg)", text: "var(--method-post-text)" },
  DELETE: { bg: "var(--method-delete-bg)", text: "var(--method-delete-text)" },
  PATCH: { bg: "var(--method-patch-bg)", text: "var(--method-patch-text)" },
  PUT: { bg: "var(--method-put-bg)", text: "var(--method-put-text)" },
};

type AuthType = "none" | "bearer" | "apikey-header" | "apikey-query";

interface CustomRequestFormProps {
  loading: boolean;
  onRun: (opts: {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    body: string;
  }) => void;
}

export default function CustomRequestForm({ loading, onRun }: CustomRequestFormProps) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://");
  const [headers, setHeaders] = useState<HeaderPair[]>([]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState<AuthType>("none");
  const [authValue, setAuthValue] = useState("");
  const [authKeyName, setAuthKeyName] = useState("x-api-key");

  const showBody = ["POST", "PUT", "PATCH"].includes(method);
  const methodStyle = METHOD_STYLES[method] ?? METHOD_STYLES.GET;

  const handleRun = () => {
    const resolvedHeaders: Record<string, string> = {};
    headers.filter((h) => h.enabled && h.key).forEach((h) => {
      resolvedHeaders[h.key] = h.value;
    });

    let resolvedUrl = url;

    if (authType === "bearer" && authValue) {
      resolvedHeaders["Authorization"] = `Bearer ${authValue}`;
    } else if (authType === "apikey-header" && authValue) {
      resolvedHeaders[authKeyName] = authValue;
    } else if (authType === "apikey-query" && authValue) {
      const sep = resolvedUrl.includes("?") ? "&" : "?";
      resolvedUrl = `${resolvedUrl}${sep}${authKeyName}=${encodeURIComponent(authValue)}`;
    }

    onRun({ url: resolvedUrl, method, headers: resolvedHeaders, body });
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Method + URL */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="text-xs px-2.5 py-2 rounded border outline-none appearance-none pr-6 font-bold"
            style={{
              background: methodStyle.bg,
              color: methodStyle.text,
              borderColor: "transparent",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 text-xs px-3 py-2 rounded border outline-none"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        />
      </div>

      {/* Auth section */}
      <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            AUTH
          </span>
          <select
            value={authType}
            onChange={(e) => setAuthType(e.target.value as AuthType)}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              fontFamily: "inherit",
            }}
          >
            <option value="none">None</option>
            <option value="bearer">Bearer Token</option>
            <option value="apikey-header">API Key (Header)</option>
            <option value="apikey-query">API Key (Query Param)</option>
          </select>
        </div>

        {authType !== "none" && (
          <div className="flex flex-col gap-2">
            {(authType === "apikey-header" || authType === "apikey-query") && (
              <input
                type="text"
                value={authKeyName}
                onChange={(e) => setAuthKeyName(e.target.value)}
                placeholder="Key name (e.g. x-api-key)"
                className="text-xs px-2.5 py-1.5 rounded border outline-none"
                style={{
                  background: "var(--bg-page)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                }}
              />
            )}
            <input
              type="text"
              value={authValue}
              onChange={(e) => setAuthValue(e.target.value)}
              placeholder={authType === "bearer" ? "Token value..." : "Key value..."}
              className="text-xs px-2.5 py-1.5 rounded border outline-none"
              style={{
                background: "var(--bg-page)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                fontFamily: "inherit",
              }}
            />
          </div>
        )}
      </div>

      {/* Headers */}
      <HeadersEditor headers={headers} onChange={setHeaders} />

      {/* Body */}
      {showBody && <BodyEditor value={body} onChange={setBody} />}

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={loading || !url || url === "https://"}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold transition-all"
        style={{
          background:
            loading || !url || url === "https://"
              ? "var(--bg-surface)"
              : "var(--accent)",
          color:
            loading || !url || url === "https://"
              ? "var(--text-muted)"
              : "var(--bg-page)",
          cursor:
            loading || !url || url === "https://" ? "not-allowed" : "pointer",
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
    </div>
  );
}
