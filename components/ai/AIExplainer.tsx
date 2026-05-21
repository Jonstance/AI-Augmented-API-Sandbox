"use client";

import { useState, useRef, useEffect } from "react";
import type { ApiResponse, ChatMessage } from "@/lib/types";
import AIMessage from "./AIMessage";
import FollowUpInput from "./FollowUpInput";

interface AIExplainerProps {
  response: ApiResponse | null;
  collection: string;
  method: string;
  url: string;
}

export default function AIExplainer({
  response,
  collection,
  method,
  url,
}: AIExplainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [responseKey, setResponseKey] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset conversation when response changes
  useEffect(() => {
    if (!response) return;
    const key = `${method}-${url}-${response.status}-${Date.now()}`;
    if (key !== responseKey) {
      setMessages([]);
      setStreamingText("");
      setResponseKey(key);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const streamExplanation = async (question?: string) => {
    if (!response || isStreaming) return;

    setIsStreaming(true);
    setStreamingText("");

    const history: ChatMessage[] = question
      ? messages
      : [];

    const body = {
      collection,
      method,
      url,
      status: response.status,
      response: response.data,
      question: question ?? undefined,
      history,
    };

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        accumulated += text;
        setStreamingText(accumulated);
      }

      // Commit to messages
      if (question) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: question },
          { role: "assistant", content: accumulated },
        ]);
      } else {
        setMessages([{ role: "assistant", content: accumulated }]);
      }
      setStreamingText("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get explanation";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠ Error: ${message}` },
      ]);
      setStreamingText("");
    } finally {
      setIsStreaming(false);
    }
  };

  const hasError = response ? response.status >= 400 : false;
  const hasResponse = response !== null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-2 h-2 rounded-full pulse-dot"
          style={{ background: "var(--accent)" }}
        />
        <span className="text-xs font-semibold tracking-widest" style={{ color: "var(--accent)" }}>
          AI EXPLAINER
        </span>
      </div>

      {/* Empty state */}
      {!hasResponse && (
        <div
          className="flex-1 flex items-center justify-center p-4"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2 opacity-20">✦</div>
            <div className="text-xs">Run a request to enable AI explanations</div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {hasResponse && messages.length === 0 && !isStreaming && (
        <div className="p-4 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => streamExplanation()}
            className="w-full text-xs py-2 px-3 rounded text-left transition-all"
            style={{
              background: "var(--accent-dim)",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
            }}
          >
            ✦ Explain this response
          </button>
          <button
            onClick={() => streamExplanation("What should I do next based on this response?")}
            className="w-full text-xs py-2 px-3 rounded text-left transition-all"
            style={{
              background: "var(--bg-surface-2)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            → What do I do next?
          </button>
          {hasError && (
            <button
              onClick={() =>
                streamExplanation(
                  "This request failed. Why did this fail and how do I fix it?"
                )
              }
              className="w-full text-xs py-2 px-3 rounded text-left transition-all"
              style={{
                background: "var(--method-delete-bg)",
                color: "var(--method-delete-text)",
                border: "1px solid var(--method-delete-text)",
              }}
            >
              ⚠ Why did this fail?
            </button>
          )}
        </div>
      )}

      {/* Streaming indicator when no messages yet */}
      {isStreaming && messages.length === 0 && (
        <div className="px-4 pt-4">
          <AIMessage content={streamingText} role="assistant" isStreaming />
        </div>
      )}

      {/* Message thread */}
      {(messages.length > 0 || (isStreaming && messages.length === 0)) && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
            {messages.map((msg, i) => (
              <AIMessage
                key={i}
                content={msg.content}
                role={msg.role}
                isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
              />
            ))}
            {isStreaming && messages.length > 0 && (
              <AIMessage content={streamingText} role="assistant" isStreaming />
            )}
          </div>
          <FollowUpInput onSubmit={streamExplanation} disabled={isStreaming} />
        </>
      )}
    </div>
  );
}
