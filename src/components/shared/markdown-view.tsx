"use client";

import { useEffect, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import {
  CourseFigureBySrc,
  isCourseFigureSrc,
} from "@/features/catalog/diagrams/course-figures";

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
  "img",
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

function componentsFor(tone: "light" | "onDark", variant: "default" | "longform"): Components {
  const heading = "text-paper";
  const body = "text-paper";
  const strong = tone === "onDark" ? "text-flare-ink" : "text-paper";
  const quote =
    tone === "onDark"
      ? "border-l-steel bg-steel-surf text-steel"
      : "border-l-steel bg-steel-surf text-steel";
  const longform = variant === "longform";
  return {
  h1: ({ children }) => (
    <h1 className={cn("mt-6 mb-3 font-semibold", heading, longform ? "text-3xl tracking-tight" : "text-2xl")}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className={cn("mt-8 mb-3 font-semibold", heading, longform ? "text-2xl tracking-tight" : "text-xl")}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className={cn("mt-4 mb-2 text-lg font-semibold", heading)}>{children}</h3>
  ),
  p: ({ children }) => (
    <p
      className={cn(
        "my-2 text-pretty",
        body,
        longform ? "my-4 leading-[1.7] text-[length:var(--library-body,1.125rem)]" : "leading-relaxed",
      )}
    >
      {children}
    </p>
  ),
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
      className="cursor-pointer text-flare-ink underline decoration-flare/40 hover:decoration-flare"
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
    if (isCourseFigureSrc(src)) {
      return <CourseFigureBySrc src={src} />;
    }
    return (
      <figure className="my-6 overflow-hidden rounded-card border border-line bg-card p-2">
        {/* O caminho é dinâmico no Markdown e restrito a /study/; next/image não aceita esse contrato sem conhecer o asset no build. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="h-auto w-full rounded-xl"
        />
        {alt ? (
          <figcaption className="px-2 pb-1 pt-2 text-center text-xs text-mist">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse border border-line text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-inset">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-line px-3 py-2 font-semibold text-paper">{children}</th>
  ),
  td: ({ children }) => <td className="border border-line px-3 py-2 align-top">{children}</td>,
  strong: ({ children }) => (
    <strong className={cn("font-semibold", strong)}>{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-inset px-1 py-0.5 text-[0.9em]">{children}</code>
  ),
  hr: () => <hr className="my-6 border-line" />,
  };
}

export interface MarkdownViewProps {
  markdown: string;
  className?: string;
  tone?: "light" | "onDark";
  variant?: "default" | "longform";
}

export function MarkdownView({
  markdown,
  className,
  tone = "light",
  variant = "default",
}: MarkdownViewProps) {
  const { t } = useI18n();
  const [sanitized, setSanitized] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    void import("isomorphic-dompurify").then((mod) => {
      const next = mod.default.sanitize(markdown, {
        ALLOWED_TAGS,
        ALLOWED_ATTR: ["href", "title", "target", "rel", "src", "alt"],
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
      <div className={cn("min-h-16 text-sm", tone === "onDark" ? "text-mist" : "text-mist", className)}>
        {t("markdown.loading")}
      </div>
    );
  }

  return (
    <div className={cn("max-w-none", tone === "onDark" ? "text-paper" : "text-paper", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={componentsFor(tone, variant)}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  );
}
