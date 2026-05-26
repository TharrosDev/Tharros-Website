"use client";

import { memo, type ReactNode } from "react";

type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

const INLINE_PATTERN =
  /(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|(?<![A-Za-z0-9])_[^_\n]+_(?![A-Za-z0-9])|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith("**") || raw.startsWith("__")) {
      tokens.push({ type: "bold", value: raw.slice(2, -2) });
    } else if (raw.startsWith("`")) {
      tokens.push({ type: "code", value: raw.slice(1, -1) });
    } else if (raw.startsWith("[")) {
      const close = raw.indexOf("](");
      tokens.push({
        type: "link",
        value: raw.slice(1, close),
        href: raw.slice(close + 2, -1),
      });
    } else {
      tokens.push({ type: "italic", value: raw.slice(1, -1) });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return parseInline(text).map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (token.type) {
      case "bold":
        return (
          <strong key={key} className="font-bold text-[color:var(--ink)]">
            {token.value}
          </strong>
        );
      case "italic":
        return (
          <em key={key} className="italic">
            {token.value}
          </em>
        );
      case "code":
        return (
          <code
            key={key}
            className="px-1.5 py-0.5 bg-[color:var(--surface-alt)] text-[color:var(--ink)] border border-[color:var(--rule)] font-mono text-[0.9em]"
          >
            {token.value}
          </code>
        );
      case "link":
        return (
          <a
            key={key}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--red-deep)] underline underline-offset-2 hover:text-[color:var(--red)]"
          >
            {token.value}
          </a>
        );
      default:
        return <span key={key}>{token.value}</span>;
    }
  });
}

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "h"; level: number; text: string };

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "p", lines: paragraph });
      paragraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "h", level: heading[1].length, text: heading[2] });
      continue;
    }

    const bullet = /^[-*•]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      const items = [bullet[1]];
      while (i + 1 < lines.length) {
        const next = lines[i + 1].trim();
        const m = /^[-*•]\s+(.*)$/.exec(next);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      const items = [numbered[1]];
      while (i + 1 < lines.length) {
        const next = lines[i + 1].trim();
        const m = /^\d+[.)]\s+(.*)$/.exec(next);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    paragraph.push(trimmed);
  }
  flushParagraph();
  return blocks;
}

interface FormattedMessageProps {
  text: string;
  className?: string;
}

const FormattedMessage = memo(({ text, className = "" }: FormattedMessageProps) => {
  const blocks = parseBlocks(text);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, idx) => {
        const key = `b-${idx}`;
        if (block.kind === "h") {
          const inner = renderInline(block.text, key);
          const cls = "font-bold text-[color:var(--ink)] tracking-tight";
          if (block.level === 1) return <h3 key={key} className={cls}>{inner}</h3>;
          if (block.level === 2) return <h4 key={key} className={cls}>{inner}</h4>;
          return <h5 key={key} className={cls}>{inner}</h5>;
        }
        if (block.kind === "ul") {
          return (
            <ul key={key} className="list-disc pl-5 space-y-1.5 marker:text-[color:var(--red)]">
              {block.items.map((item, i) => (
                <li key={`${key}-${i}`} className="leading-relaxed">
                  {renderInline(item, `${key}-${i}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "ol") {
          return (
            <ol key={key} className="list-decimal pl-5 space-y-1.5 marker:text-[color:var(--red)] marker:font-bold">
              {block.items.map((item, i) => (
                <li key={`${key}-${i}`} className="leading-relaxed">
                  {renderInline(item, `${key}-${i}`)}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={key} className="leading-relaxed">
            {block.lines.map((line, i) => (
              <span key={`${key}-${i}`}>
                {renderInline(line, `${key}-${i}`)}
                {i < block.lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
});

FormattedMessage.displayName = "FormattedMessage";

export default FormattedMessage;
