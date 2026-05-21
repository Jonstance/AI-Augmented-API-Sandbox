"use client";

interface ParamEditorProps {
  params: Record<string, string>;
  onChange: (params: Record<string, string>) => void;
}

export default function ParamEditor({ params, onChange }: ParamEditorProps) {
  if (Object.keys(params).length === 0) return null;

  return (
    <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
      <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        PATH PARAMETERS
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(params).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="text-xs w-24 shrink-0 truncate"
              style={{ color: "var(--accent)" }}
            >
              :{key}
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                onChange({ ...params, [key]: e.target.value })
              }
              className="flex-1 text-xs px-2 py-1.5 rounded border outline-none transition-colors"
              style={{
                background: "var(--bg-page)",
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
        ))}
      </div>
    </div>
  );
}
