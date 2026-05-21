"use client";

import { useState } from "react";

interface FollowUpInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export default function FollowUpInput({ onSubmit, disabled }: FollowUpInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="flex items-end gap-2 p-3 border-t shrink-0"
      style={{ borderColor: "var(--border)" }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a follow-up question..."
        rows={2}
        disabled={disabled}
        className="flex-1 text-xs px-2.5 py-2 rounded border outline-none resize-none"
        style={{
          background: "var(--bg-page)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
          fontFamily: "inherit",
          opacity: disabled ? 0.5 : 1,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className="px-3 py-2 rounded text-xs font-semibold transition-all shrink-0"
        style={{
          background:
            !value.trim() || disabled ? "var(--bg-surface-2)" : "var(--accent)",
          color:
            !value.trim() || disabled ? "var(--text-muted)" : "var(--bg-page)",
          cursor: !value.trim() || disabled ? "not-allowed" : "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
