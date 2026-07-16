import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

// Componentes globales para todo contenido .mdx (case studies de
// proyectos, Fase 3) — estilo "ink & code" en vez del prose genérico.
// Ver internal/v2-next/branding-y-filosofia.md §4 y §10.
const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-display mt-10 mb-4 text-4xl text-cyan first:mt-0 sm:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display mt-10 mb-3 text-3xl text-white first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-label mt-8 mb-2 text-xl tracking-wide text-yellow">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 max-w-[68ch] leading-relaxed text-white/80">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-cyan underline decoration-cyan/40 underline-offset-4 hover:decoration-cyan"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-5 list-disc space-y-1 text-white/80">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-5 list-decimal space-y-1 text-white/80">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-3 border-cyan pl-4 text-white/70 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="font-mono rounded-sm bg-panel-bg-alt px-1.5 py-0.5 text-sm text-yellow">
      {children}
    </code>
  ),
  img: ({ alt = "", ...props }) => (
    <Image
      sizes="100vw"
      className="ink-stroke my-6 h-auto w-full"
      {...(props as ImageProps)}
      alt={alt}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
