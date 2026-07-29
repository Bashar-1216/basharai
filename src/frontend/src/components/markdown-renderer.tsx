"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by code blocks or table blocks
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let keyIndex = 0;

  const flushTable = () => {
    if (tableHeader.length > 0) {
      elements.push(
        <div key={`table-${keyIndex++}`} style={{ overflowX: "auto", margin: "0.75rem 0" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8125rem",
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(16, 185, 129, 0.12)", borderBottom: "1px solid rgba(255, 255, 255, 0.15)" }}>
                {tableHeader.map((th, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "0.5rem 0.75rem",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "hsl(var(--color-primary))",
                    }}
                  >
                    {parseInline(th)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: rIdx < tableRows.length - 1 ? "1px solid rgba(255, 255, 255, 0.06)" : "none",
                  }}
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: "0.45rem 0.75rem", color: "hsl(var(--color-text-body))" }}>
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx].trim();

    // Markdown Table Row Detection
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if separator line (| --- | --- |)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue; // Skip separator line
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={`h3-${keyIndex++}`} style={{ margin: "0.85rem 0 0.35rem", fontSize: "0.9375rem", fontWeight: 700, color: "hsl(var(--color-text))" }}>
          {parseInline(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={`h2-${keyIndex++}`} style={{ margin: "1rem 0 0.4rem", fontSize: "1.0625rem", fontWeight: 800, color: "hsl(var(--color-primary))" }}>
          {parseInline(line.slice(3))}
        </h3>
      );
      continue;
    }

    // Bullet points (* item or - item or 1. item)
    const bulletMatch = line.match(/^(\*|-|\d+\.)\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={`bullet-${keyIndex++}`} style={{ display: "flex", gap: "0.5rem", margin: "0.3rem 0 0.3rem 0.25rem", lineHeight: 1.6 }}>
          <span style={{ color: "hsl(var(--color-primary))", fontWeight: 700 }}>•</span>
          <div style={{ flex: 1 }}>{parseInline(bulletMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Empty line
    if (!line) {
      elements.push(<div key={`space-${keyIndex++}`} style={{ height: "0.4rem" }} />);
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p key={`p-${keyIndex++}`} style={{ margin: "0.3rem 0", lineHeight: 1.6 }}>
        {parseInline(line)}
      </p>
    );
  }

  if (inTable) {
    flushTable();
  }

  return <div style={{ display: "flex", flexDirection: "column" }}>{elements}</div>;
}

// Inline Parser for **bold**, `code`, etc.
function parseInline(text: string): React.ReactNode {
  if (!text) return text;

  // Split by bold (**text**)
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "hsl(var(--color-text))", fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            fontFamily: "var(--font-mono)",
            background: "rgba(255, 255, 255, 0.08)",
            padding: "0.15rem 0.4rem",
            borderRadius: "4px",
            fontSize: "0.8em",
            color: "hsl(var(--color-primary))",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
