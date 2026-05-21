"use client";

interface AIMessageProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export default function AIMessage({ content, role, isStreaming }: AIMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-3">
        <div
          className="text-xs px-3 py-2 rounded-lg max-w-[85%]"
          style={{
            background: "var(--accent-dim)",
            color: "var(--text-primary)",
            border: "1px solid var(--accent)",
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-3">
      <div
        className={`text-xs px-3 py-2 rounded-lg max-w-[95%] leading-relaxed${
          isStreaming ? " blinking-cursor" : ""
        }`}
        style={{
          background: "var(--bg-surface-2)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
    </div>
  );
}
