"use client";

interface ThreeColumnLayoutProps {
  leftSidebar: React.ReactNode;
  center: React.ReactNode;
  rightSidebar: React.ReactNode;
  customMode?: boolean;
}

export default function ThreeColumnLayout({
  leftSidebar,
  center,
  rightSidebar,
  customMode = false,
}: ThreeColumnLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar — hidden in custom mode */}
      {!customMode && (
        <div
          className="w-64 shrink-0 flex flex-col border-r overflow-hidden"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          {leftSidebar}
        </div>
      )}

      {/* Center column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {center}
      </div>

      {/* Right sidebar */}
      <div
        className="w-80 shrink-0 flex flex-col border-l overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {rightSidebar}
      </div>
    </div>
  );
}
