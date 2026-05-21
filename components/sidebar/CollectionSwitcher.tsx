"use client";

import type { CollectionId } from "@/lib/types";

const TABS: { id: CollectionId | "custom"; label: string }[] = [
  { id: "paystack", label: "Paystack" },
  { id: "github", label: "GitHub" },
  { id: "openweathermap", label: "OWM" },
  { id: "coingecko", label: "CoinGecko" },
  { id: "custom", label: "Custom" },
];

interface CollectionSwitcherProps {
  active: CollectionId | "custom";
  onChange: (id: CollectionId | "custom") => void;
}

export default function CollectionSwitcher({ active, onChange }: CollectionSwitcherProps) {
  return (
    <div
      className="flex border-b shrink-0 overflow-x-auto"
      style={{ borderColor: "var(--border)" }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const isCustom = tab.id === "custom";
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as CollectionId | "custom")}
            className="px-3 py-2 text-xs whitespace-nowrap transition-colors shrink-0"
            style={{
              color: isActive
                ? isCustom
                  ? "var(--accent)"
                  : "var(--text-primary)"
                : "var(--text-muted)",
              borderBottom: isActive ? `2px solid ${isCustom ? "var(--accent)" : "var(--accent)"}` : "2px solid transparent",
              background: isActive ? "var(--accent-dim)" : "transparent",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
