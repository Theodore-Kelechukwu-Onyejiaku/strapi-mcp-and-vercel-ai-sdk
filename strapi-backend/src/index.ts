import type { Core } from "@strapi/strapi";
import { registerRelatedContent } from "./mcp/find-related-content";
import { registerResearchCompetingContent } from "./mcp/research-competing-content";
import { registerCheckInternalLinks } from "./mcp/check-internal-links";

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerRelatedContent(strapi);
    registerResearchCompetingContent(strapi);
    registerCheckInternalLinks(strapi);
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
