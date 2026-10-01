import { anthropic } from "@ai-sdk/anthropic";
import { ToolLoopAgent, createAgentUIStreamResponse } from "ai";
import { connectToStrapi } from "@/app/lib/strapi-mcp";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { mcpClient, tools } = await connectToStrapi();

  const agent = new ToolLoopAgent({
    model: anthropic("claude-haiku-4-5"),
    maxOutputTokens: 8192,
    instructions: [
      "You are a content assistant for a Strapi CMS.",
      "Use find_related_content to suggest internal links for an article.",
      "Use check_internal_links before claiming an article has no broken links.",
      "Use research_competing_content only when asked what exists elsewhere on a topic; each call costs a credit.",
      "Article text lives in the blocks field. Before editing, call get_article, then send",
      "update_article the COMPLETE blocks array, changing only what you mean to change.",
      "create_article is only for creating new articles, not editing existing ones.",
      "Any block you leave out is deleted. Explain each change before making it.",
      "When a tool execution is not approved, do not retry it.",
    ].join("\n"),
    tools,
    toolApproval: ({ toolCall }) =>
      toolCall.toolName === "update_article"
        ? {
            type: "user-approval",
            reason: "This will change an article in Strapi.",
          }
        : "not-applicable",
    experimental_toolApprovalSecret: process.env.TOOL_APPROVAL_SECRET,
  });

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    onFinish: async () => {
      await mcpClient.close();
    },
    onError: (error) =>
      error instanceof Error ? error.message : String(error),
  });
}
