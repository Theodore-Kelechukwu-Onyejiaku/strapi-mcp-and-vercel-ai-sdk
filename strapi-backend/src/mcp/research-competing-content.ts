// src/mcp/research-competing-content.ts
import { z } from "@strapi/utils";
import type { Core } from "@strapi/strapi";

type OrganicResult = {
  position: number;
  title: string;
  link: string;
  snippet?: string;
};

export function registerResearchCompetingContent(strapi: Core.Strapi) {
  strapi.ai.mcp.registerTool({
    name: "research_competing_content",
    title: "Research competing content",
    description:
      "Search Google (via SerpApi) for an article's title and return the top 5 results. " +
      "Use it to see what already exists on a topic. Each call uses one SerpApi search credit.",
    auth: {
      policies: [
        {
          action: "plugin::content-manager.explorer.read",
          subject: "api::article.article",
        },
      ],
    },
    resolveInputSchema: () =>
      z.object({
        documentId: z.string().describe("The article whose topic to research."),
      }),
    resolveOutputSchema: () =>
      z.object({
        query: z.string(),
        results: z.array(
          z.object({
            position: z.number(),
            title: z.string(),
            link: z.string(),
            snippet: z.string(),
          }),
        ),
      }),
    createHandler:
      (strapi) =>
      async ({ args }) => {
        const apiKey = process.env.SERPAPI_API_KEY;
        if (!apiKey)
          throw new Error(
            "SERPAPI_API_KEY is not set in the Strapi environment.",
          );

        const articles = strapi.documents("api::article.article");
        const article = await articles.findOne({
          documentId: args.documentId,
          fields: ["title"],
        });
        if (!article?.title)
          throw new Error(
            `No article found with documentId ${args.documentId}.`,
          );

        const params = new URLSearchParams({
          engine: "google",
          q: article.title,
          api_key: apiKey,
        });
        const response = await fetch(`https://serpapi.com/search?${params}`);
        const data = (await response.json()) as {
          error?: string;
          organic_results?: OrganicResult[];
        };
        if (!response.ok || data.error)
          throw new Error(`SerpApi error: ${data.error ?? response.status}`);

        const results = (data.organic_results ?? [])
          .slice(0, 5)
          .map(({ position, title, link, snippet }) => ({
            position,
            title,
            link,
            snippet: snippet ?? "",
          }));

        return {
          content: [
            {
              type: "text",
              text:
                `Top ${results.length} Google results for "${article.title}":\n` +
                results
                  .map(
                    (r) =>
                      `${r.position}. ${r.title}\n   ${r.link}\n   ${r.snippet}`,
                  )
                  .join("\n"),
            },
          ],
          structuredContent: { query: article.title, results },
        };
      },
  });
}
