"use client";

interface JsonHighlighterProps {
  data: unknown;
}

function highlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "color:var(--json-number)";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "color:var(--json-key)";
          } else {
            cls = "color:var(--json-string)";
          }
        } else if (/true|false/.test(match)) {
          cls = "color:var(--json-boolean)";
        } else if (/null/.test(match)) {
          cls = "color:var(--json-null)";
        }
        return `<span style="${cls}">${match}</span>`;
      }
    );
}

export default function JsonHighlighter({ data }: JsonHighlighterProps) {
  const jsonString = JSON.stringify(data, null, 2);
  const highlighted = highlight(jsonString);

  return (
    <pre
      className="text-xs leading-relaxed overflow-auto flex-1 p-4"
      style={{
        fontFamily: "inherit",
        color: "var(--text-primary)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
