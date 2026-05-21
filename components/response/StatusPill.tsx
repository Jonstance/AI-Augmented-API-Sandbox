"use client";

interface StatusPillProps {
  status: number;
}

export default function StatusPill({ status }: StatusPillProps) {
  let bg: string;
  let text: string;
  let label: string;

  if (status >= 200 && status < 300) {
    bg = "var(--method-get-bg)";
    text = "var(--method-get-text)";
    label = `${status} OK`;
  } else if (status >= 400 && status < 500) {
    bg = "var(--method-patch-bg)";
    text = "var(--method-patch-text)";
    label = `${status} Client Error`;
  } else if (status >= 500) {
    bg = "var(--method-delete-bg)";
    text = "var(--method-delete-text)";
    label = `${status} Server Error`;
  } else {
    bg = "var(--bg-surface-2)";
    text = "var(--text-muted)";
    label = `${status}`;
  }

  const STATUS_TEXTS: Record<number, string> = {
    200: "200 OK",
    201: "201 Created",
    204: "204 No Content",
    301: "301 Moved",
    302: "302 Found",
    400: "400 Bad Request",
    401: "401 Unauthorized",
    403: "403 Forbidden",
    404: "404 Not Found",
    422: "422 Unprocessable",
    429: "429 Too Many Requests",
    500: "500 Server Error",
    502: "502 Bad Gateway",
    503: "503 Unavailable",
  };

  label = STATUS_TEXTS[status] ?? label;

  return (
    <span
      className="text-xs px-2 py-0.5 rounded font-semibold"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  );
}
