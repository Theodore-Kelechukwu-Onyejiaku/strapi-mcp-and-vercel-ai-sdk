// components/tool-results.tsx
import type { ReactNode } from "react";
import { z } from "zod";

// MCP results arrive as { content, structuredContent }. Parse, don't cast.
function structured<T>(schema: z.ZodType<T>, output: unknown): T | null {
  const candidate =
    (output as { structuredContent?: unknown })?.structuredContent ?? output;
  const parsed = schema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full break-words rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
      <p className="mb-2 font-medium">{title}</p>
      {children}
    </div>
  );
}

const RelatedSchema = z.object({
  related: z.array(z.object({ title: z.string(), slug: z.string() })),
});

export function RelatedArticles({ output }: { output: unknown }) {
  const data = structured(RelatedSchema, output);
  if (!data) return null;

  return (
    <Card title="🔗 Related articles">
      {data.related.length === 0 && (
        <p className="text-neutral-500">No related articles found.</p>
      )}
      <ul className="space-y-1">
        {data.related.map((article) => (
          <li key={article.slug}>
            {article.title}{" "}
            <span className="text-neutral-500">/blog/{article.slug}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const LinksSchema = z.object({
  checked: z.number(),
  broken: z.array(z.string()),
});

export function BrokenLinks({ output }: { output: unknown }) {
  const data = structured(LinksSchema, output);
  if (!data) return null;

  return (
    <Card title="🧭 Link check">
      <p className="text-neutral-600">
        {data.checked} internal link(s) checked, {data.broken.length} broken
      </p>
      <ul className="mt-2 space-y-1 text-red-600">
        {data.broken.map((slug) => (
          <li key={slug}>❌ /blog/{slug}</li>
        ))}
      </ul>
    </Card>
  );
}

const CompetingSchema = z.object({
  query: z.string(),
  results: z.array(
    z.object({ position: z.number(), title: z.string(), link: z.string() }),
  ),
});

export function CompetingContent({ output }: { output: unknown }) {
  const data = structured(CompetingSchema, output);
  if (!data) return null;

  return (
    <Card title={`🔎 Top Google results for "${data.query}"`}>
      <ol className="space-y-1">
        {data.results.map((result) => (
          <li key={result.link}>
            {result.position}.{" "}
            <a
              href={result.link}
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              {result.title}
            </a>
          </li>
        ))}
      </ol>
    </Card>
  );
}
