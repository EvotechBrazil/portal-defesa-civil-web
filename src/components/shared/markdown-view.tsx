"use client";

import { useEffect, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const ALLOWED_TAGS = [
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
];

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-2xl font-semibold text-navy">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-2 text-xl font-semibold text-navy">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-lg font-semibold text-navy">{children}</h3>
  ),
  p: ({ children }) => <p className="my-2 leading-relaxed text-slate-800">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-amber pl-4 text-slate-700 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="cursor-pointer text-amber underline decoration-amber/40 hover:decoration-amber"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse border border-slate-300 text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-100">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-slate-300 px-3 py-2 font-semibold text-navy">{children}</th>
  ),
  td: ({ children }) => <td className="border border-slate-300 px-3 py-2 align-top">{children}</td>,
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]">{children}</code>
  ),
  hr: () => <hr className="my-6 border-slate-200" />,
};

export interface MarkdownViewProps {
  markdown: string;
  className?: string;
}

export function MarkdownView({ markdown, className }: MarkdownViewProps) {
  const [sanitized, setSanitized] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    void import("isomorphic-dompurify").then((mod) => {
      const next = mod.default.sanitize(markdown, {
        ALLOWED_TAGS,
        ALLOWED_ATTR: ["href", "title", "target", "rel"],
      });
      if (isMounted) {
        setSanitized(next);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [markdown]);

  if (sanitized === null) {
    return <div className={cn("min-h-16 text-sm text-slate-500", className)}>Carregando conteúdo…</div>;
  }

  return (
    <div className={cn("max-w-none text-slate-800", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  );
}
