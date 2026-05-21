"use client";

interface AuthInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AuthInput({ label, value, onChange, placeholder }: AuthInputProps) {
  return (
    <div className="px-3 py-3 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
      <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "sk_live_..."}
        className="w-full text-xs px-2.5 py-1.5 rounded border outline-none transition-colors"
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
  );
}
