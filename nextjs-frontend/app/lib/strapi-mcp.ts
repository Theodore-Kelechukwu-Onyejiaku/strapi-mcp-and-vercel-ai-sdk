import { createMCPClient } from "@ai-sdk/mcp";
import type { ToolSet } from "ai";

const ALLOWED_TOOLS = [
  "list_article",
  "create_article",
  "get_article",
  "update_article",
  "find_related_content",
  "research_competing_content",
  "check_internal_links",
];

export async function connectToStrapi() {
  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: `${process.env.STRAPI_URL}/mcp`,
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
    },
  });
  const allTools = await mcpClient.tools();
  const tools = Object.fromEntries(
    Object.entries(allTools).filter(([name]) => ALLOWED_TOOLS.includes(name)),
  ) satisfies ToolSet;

  return { mcpClient, tools };
}
