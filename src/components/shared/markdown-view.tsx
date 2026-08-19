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

function componentsFor(tone: "light" | "onDark"): Components {
  const heading = tone === "onDark" ? "text-paper" : "text-navy";
  const body = tone === "onDark" ? "text-paper" : "text-slate-800";
  const strong = tone === "onDark" ? "text-flare" : "text-slate-900";
  const quote =
    tone === "onDark"
      ? "border-flare bg-white/5 text-mist"
      : "border-amber text-slate-700";
  return {
  h1: ({ children }) => (
    <h1 className={cn("mt-6 mb-3 text-2xl font-semibold", heading)}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className={cn("mt-6 mb-2 text-xl font-semibold", heading)}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className={cn("mt-4 mb-2 text-lg font-semibold", heading)}>{children}</h3>
  ),
  p: ({ children }) => <p className={cn("my-2 leading-relaxed", body)}>{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className={cn("my-3 border-l-4 pl-4 italic", quote)}>
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
  img: ({ src, alt }) => {
    if (typeof src !== "string" || !src.startsWith("/study/")) {
      return null;
    }
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
        {/* O caminho é dinâmico no Markdown e restrito a /study/; next/image não aceita esse contrato sem conhecer o asset no build. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="h-auto w-full rounded-xl"
        />
        {alt ? (
          <figcaption className="px-2 pb-1 pt-2 text-center text-xs text-slate-500">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
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
  strong: ({ children }) => (
    <strong className={cn("font-semibold", strong)}>{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]">{children}</code>
  ),
  hr: () => <hr className="my-6 border-slate-200" />,
  };
}

const lightComponents = componentsFor("light");
const darkComponents = componentsFor("onDark");

export interface MarkdownViewProps {
  markdown: string;
  className?: string;
  tone?: "light" | "onDark";
}

export function MarkdownView({ markdown, className, tone = "light" }: MarkdownViewProps) {
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
    return (
      <div className={cn("min-h-16 text-sm", tone === "onDark" ? "text-mist" : "text-slate-500", className)}>
        Carregando conteúdo…
      </div>
    );
  }

  return (
    <div className={cn("max-w-none", tone === "onDark" ? "text-paper" : "text-slate-800", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={tone === "onDark" ? darkComponents : lightComponents}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  );
}
