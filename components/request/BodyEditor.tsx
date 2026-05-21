"use client";

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BodyEditor({ value, onChange }: BodyEditorProps) {
  const isValidJson = (() => {
    if (!value.trim()) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  })();

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // not parseable, leave as is
    }
  };

  return (
    <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          REQUEST BODY{" "}
          {!isValidJson && (
            <span style={{ color: "var(--method-delete-text)" }}>— invalid JSON</span>
          )}
        </span>
        <button
          onClick={formatJson}
          className="text-xs px-2 py-0.5 rounded transition-colors"
          style={{ color: "var(--accent)", background: "var(--accent-dim)" }}
        >
          Format
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        spellCheck={false}
        className="w-full text-xs p-2.5 rounded border outline-none resize-y"
        style={{
          background: "var(--bg-page)",
          borderColor: isValidJson ? "var(--border)" : "var(--method-delete-text)",
          color: "var(--text-primary)",
          fontFamily: "inherit",
          lineHeight: "1.6",
          minHeight: "100px",
        }}
      />
    </div>
  );
}
