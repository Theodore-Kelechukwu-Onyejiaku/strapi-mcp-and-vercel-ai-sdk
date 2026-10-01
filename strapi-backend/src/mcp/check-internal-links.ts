import { z } from "@strapi/utils";
import type { Core } from "@strapi/strapi";

export function registerCheckInternalLinks(strapi: Core.Strapi) {
  strapi.ai.mcp.registerTool({
    name: "check_internal_links",
    title: "Check internal links",
    description:
      "Find /blog/{slug} links in an article's rich-text blocks that point to missing or unpublished articles. " +
      "Read-only: fix broken links with update_article.",
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
          .describe("The article to check, as returned by list_article."),
      }),
    resolveOutputSchema: () =>
      z.object({ checked: z.number(), broken: z.array(z.string()) }),
    createHandler:
      (strapi) =>
      async ({ args }) => {
        const articles = strapi.documents("api::article.article");
        const article = await articles.findOne({
          documentId: args.documentId,
          populate: ["blocks"],
        });
        if (!article)
          throw new Error(
            `No article found with documentId ${args.documentId}.`,
          );

        const text = (article.blocks ?? [])
          .map((block) =>
            block.__component === "shared.rich-text" ? block.body : "",
          )
          .join("\n");
        const slugs = [
          ...new Set(
            [...text.matchAll(/\]\(\/blog\/([\w-]+)\)/g)].map(
              (match) => match[1],
            ),
          ),
        ];

        const live = slugs.length
          ? await articles.findMany({
              status: "published",
              filters: { slug: { $in: slugs } },
              fields: ["slug"],
            })
          : [];
        const liveSlugs = new Set(live.map((doc) => doc.slug));
        const broken = slugs.filter((slug) => !liveSlugs.has(slug));

        return {
          content: [
            {
              type: "text",
              text: `Checked ${slugs.length} internal link(s): ${broken.length} broken.`,
            },
          ],
          structuredContent: { checked: slugs.length, broken },
        };
      },
  });
}
