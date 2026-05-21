"use client";

export default function TitleBar() {
  return (
    <div
      className="flex items-center gap-3 px-4 h-10 shrink-0 border-b"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* macOS traffic lights */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      {/* Title */}
      <div className="flex-1 text-center">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          universal-api-sandbox{" "}
          <span style={{ color: "var(--border)" }}>~</span>{" "}
          <span style={{ color: "var(--accent)" }}>ai-powered</span>
        </span>
      </div>

      {/* Spacer to balance macOS dots */}
      <div className="w-[54px]" />
    </div>
  );
}
