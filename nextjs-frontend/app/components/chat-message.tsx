import type { ChatAddToolApproveResponseFunction, UIMessage } from "ai";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BrokenLinks,
  CompetingContent,
  RelatedArticles,
} from "@/app/components/tool-results";

// Which card renders each custom tool's result.
const RESULT_VIEWS: Record<string, (props: { output: unknown }) => ReactNode> =
  {
    find_related_content: RelatedArticles,
    check_internal_links: BrokenLinks,
    research_competing_content: CompetingContent,
  };

type Props = {
  message: UIMessage;
  onApproval: ChatAddToolApproveResponseFunction;
};

export function ChatMessage({ message, onApproval }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">
        {isUser ? "🧑" : "🤖"}
      </div>

      <div
        className={`flex min-w-0 max-w-[80%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            const bubble = isUser
              ? "rounded-br-sm bg-blue-600 text-white"
              : "rounded-bl-sm border border-neutral-200 bg-white";
            return (
              <div
                key={i}
                className={`prose prose-sm max-w-none wrap-break-word rounded-2xl px-4 py-2 ${bubble}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }

          if (part.type !== "dynamic-tool") return null;

          if (
            part.state === "approval-requested" &&
            !part.approval.isAutomatic
          ) {
            return (
              <div
                key={part.toolCallId}
                className="w-full rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm"
              >
                <p className="font-medium">✋ Approval needed</p>
                <p className="mt-1 text-neutral-700">
                  {part.approval.requestReason}
                </p>
                <details open className="mt-2">
                  <summary className="cursor-pointer text-xs text-neutral-500">
                    The exact change
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-white p-3 text-xs">
                    {JSON.stringify(part.input, null, 2)}
                  </pre>
                </details>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      onApproval({ id: part.approval.id, approved: true })
                    }
                    className="rounded-full bg-green-600 px-4 py-1.5 font-medium text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      onApproval({ id: part.approval.id, approved: false })
                    }
                    className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 hover:bg-neutral-100"
                  >
                    Deny
                  </button>
                </div>
              </div>
            );
          }

          if (part.state === "output-available") {
            const View = RESULT_VIEWS[part.toolName];
            return View ? (
              <View key={part.toolCallId} output={part.output} />
            ) : (
              <p key={part.toolCallId} className="text-xs text-neutral-500">
                ✅ {part.toolName} done
              </p>
            );
          }

          if (part.state === "output-denied") {
            return (
              <p key={part.toolCallId} className="text-xs text-neutral-500">
                🚫 Change denied
              </p>
            );
          }

          return (
            <p key={part.toolCallId} className="text-xs text-neutral-500">
              🔧 Running {part.toolName}…
            </p>
          );
        })}
      </div>
    </div>
  );
}
