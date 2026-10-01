import { z } from "@strapi/utils";
import type { Core } from "@strapi/strapi";

export function registerRelatedContent(strapi: Core.Strapi) {
  strapi.ai.mcp.registerTool({
    name: "find_related_content",
    title: "Find related content",
    description:
      "Find up to 5 published articles in the same category as an article, newest first. " +
      "Use it to suggest internal links.",
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
        documentId: z
          .string()
          .describe("The article to find related posts for."),
      }),
    resolveOutputSchema: () =>
      z.object({
        related: z.array(
          z.object({
            title: z.string(),
            slug: z.string(),
          }),
        ),
      }),
    createHandler:
      (strapi) =>
      async ({ args }) => {
        const articles = strapi.documents("api::article.article");
        const article = await articles.findOne({
          documentId: args.documentId,
          populate: ["category"],
        });
        if (!article)
          throw new Error(
            `No article found with documentId ${args.documentId}.`,
          );
        if (!article.category)
          throw new Error("This article has no category to match on.");

        const docs = await articles.findMany({
          status: "published",
          filters: {
            documentId: { $ne: args.documentId },
            category: { documentId: article.category.documentId },
          },
          sort: "publishedAt:desc",
          fields: ["title", "slug"],
          limit: 5,
        });
        const related = docs.map((doc) => ({
          title: String(doc.title),
          slug: String(doc.slug),
        }));

        return {
          content: [
            {
              type: "text",
              text: `Found ${related.length} related article(s).`,
            },
          ],
          structuredContent: { related },
        };
      },
  });
}
