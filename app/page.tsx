"use client";

import { useState, useCallback } from "react";
import type { CollectionId, Endpoint, ApiResponse, HttpMethod } from "@/lib/types";
import { collections } from "@/lib/collections";

import TitleBar from "@/components/layout/TitleBar";
import ThreeColumnLayout from "@/components/layout/ThreeColumnLayout";
import CollectionSwitcher from "@/components/sidebar/CollectionSwitcher";
import EndpointList from "@/components/sidebar/EndpointList";
import AuthInput from "@/components/sidebar/AuthInput";
import RequestPanel from "@/components/request/RequestPanel";
import ResponsePanel from "@/components/response/ResponsePanel";
import AIExplainer from "@/components/ai/AIExplainer";
import CustomRequestForm from "@/components/custom/CustomRequestForm";

export default function Home() {
  const [activeCollection, setActiveCollection] = useState<CollectionId | "custom">("github");
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);
  const [authKeys, setAuthKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [lastRequestMeta, setLastRequestMeta] = useState<{
    method: string;
    url: string;
    collection: string;
  } | null>(null);

  const collection =
    activeCollection === "custom"
      ? null
      : collections.find((c) => c.id === activeCollection) ?? null;

  const handleCollectionChange = (id: CollectionId | "custom") => {
    setActiveCollection(id);
    setActiveEndpoint(null);
    setResponse(null);
    setLastRequestMeta(null);
  };

  const buildRequestUrl = useCallback(
    (endpoint: Endpoint, params: Record<string, string>) => {
      if (!collection) return "";
      let path = endpoint.path;
      path = path.replace(/:([^/?&]+)/g, (_, key) =>
        params[key] ? encodeURIComponent(params[key]) : `:${key}`
      );
      return `${collection.baseUrl}${path}`;
    },
    [collection]
  );

  const runRequest = useCallback(
    async (params: Record<string, string>, body: string) => {
      if (!activeEndpoint || !collection) return;

      const authKey = authKeys[activeCollection] ?? "";
      const url = buildRequestUrl(activeEndpoint, params);

      setLoading(true);
      setResponse(null);

      await new Promise((r) => setTimeout(r, 600));

      try {
        const res = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            method: activeEndpoint.method,
            headers: {},
            body: body || undefined,
            collectionId: activeCollection,
            endpointId: activeEndpoint.id,
            authKey,
          }),
        });

        const data = await res.json();

        setResponse({
          data: data.data ?? data,
          status: data.status ?? res.status,
          responseTime: data.responseTime ?? 0,
          size: data.size ?? 0,
        });

        setLastRequestMeta({
          method: activeEndpoint.method,
          url,
          collection: collection.name,
        });
      } catch (err) {
        setResponse({
          data: { error: err instanceof Error ? err.message : "Network error" },
          status: 0,
          responseTime: 0,
          size: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [activeEndpoint, collection, activeCollection, authKeys, buildRequestUrl]
  );

  const runCustomRequest = useCallback(
    async (opts: {
      url: string;
      method: HttpMethod;
      headers: Record<string, string>;
      body: string;
    }) => {
      setLoading(true);
      setResponse(null);

      await new Promise((r) => setTimeout(r, 600));

      try {
        const res = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: opts.url,
            method: opts.method,
            headers: opts.headers,
            body: opts.body || undefined,
            collectionId: "custom",
          }),
        });

        const data = await res.json();

        setResponse({
          data: data.data ?? data,
          status: data.status ?? res.status,
          responseTime: data.responseTime ?? 0,
          size: data.size ?? 0,
        });

        setLastRequestMeta({
          method: opts.method,
          url: opts.url,
          collection: "Custom",
        });
      } catch (err) {
        setResponse({
          data: { error: err instanceof Error ? err.message : "Network error" },
          status: 0,
          responseTime: 0,
          size: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const isCustom = activeCollection === "custom";

  const leftSidebar = collection ? (
    <>
      {collection.authType !== "none" && collection.authLabel && (
        <AuthInput
          label={collection.authLabel}
          value={authKeys[activeCollection] ?? ""}
          onChange={(v) =>
            setAuthKeys((prev) => ({ ...prev, [activeCollection]: v }))
          }
          placeholder={
            collection.authType === "bearer" ? "sk_live_..." : "Your API key..."
          }
        />
      )}
      <EndpointList
        collection={collection}
        activeEndpointId={activeEndpoint?.id ?? null}
        onSelect={setActiveEndpoint}
      />
    </>
  ) : (
    <div />
  );

  const center = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Collection switcher tabs */}
      <div
        className="shrink-0 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <CollectionSwitcher active={activeCollection} onChange={handleCollectionChange} />
      </div>

      {/* Request + Response panels */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div
          className="shrink-0 border-b overflow-y-auto"
          style={{
            borderColor: "var(--border)",
            maxHeight: "45%",
            minHeight: "180px",
          }}
        >
          {isCustom ? (
            <CustomRequestForm loading={loading} onRun={runCustomRequest} />
          ) : (
            <RequestPanel
              endpoint={activeEndpoint}
              collection={collection}
              authKey={authKeys[activeCollection] ?? ""}
              loading={loading}
              onRun={runRequest}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ResponsePanel response={response} loading={loading} />
        </div>
      </div>
    </div>
  );

  const rightSidebar = (
    <AIExplainer
      response={response}
      collection={lastRequestMeta?.collection ?? String(activeCollection)}
      method={lastRequestMeta?.method ?? "GET"}
      url={lastRequestMeta?.url ?? ""}
    />
  );

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <TitleBar />
      <ThreeColumnLayout
        leftSidebar={leftSidebar}
        center={center}
        rightSidebar={rightSidebar}
        customMode={isCustom}
      />
    </div>
  );
}
