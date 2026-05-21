"use client";

import type { Collection, Endpoint } from "@/lib/types";

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET: { bg: "var(--method-get-bg)", text: "var(--method-get-text)" },
  POST: { bg: "var(--method-post-bg)", text: "var(--method-post-text)" },
  DELETE: { bg: "var(--method-delete-bg)", text: "var(--method-delete-text)" },
  PATCH: { bg: "var(--method-patch-bg)", text: "var(--method-patch-text)" },
  PUT: { bg: "var(--method-put-bg)", text: "var(--method-put-text)" },
};

interface EndpointListProps {
  collection: Collection;
  activeEndpointId: string | null;
  onSelect: (endpoint: Endpoint) => void;
}

export default function EndpointList({
  collection,
  activeEndpointId,
  onSelect,
}: EndpointListProps) {
  // Group endpoints by category
  const grouped = collection.endpoints.reduce<Record<string, Endpoint[]>>(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) acc[endpoint.category] = [];
      acc[endpoint.category].push(endpoint);
      return acc;
    },
    {}
  );

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {Object.entries(grouped).map(([category, endpoints]) => (
        <div key={category} className="mb-1">
          <div
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            {category}
          </div>
          {endpoints.map((endpoint) => {
            const isActive = activeEndpointId === endpoint.id;
            const methodStyle = METHOD_STYLES[endpoint.method] ?? METHOD_STYLES.GET;

            return (
              <button
                key={endpoint.id}
                onClick={() => onSelect(endpoint)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                style={{
                  background: isActive ? "var(--accent-dim)" : "transparent",
                  borderLeft: isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0"
                  style={{
                    background: methodStyle.bg,
                    color: methodStyle.text,
                    minWidth: "46px",
                    textAlign: "center",
                  }}
                >
                  {endpoint.method}
                </span>
                <span className="text-xs truncate">{endpoint.name}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
