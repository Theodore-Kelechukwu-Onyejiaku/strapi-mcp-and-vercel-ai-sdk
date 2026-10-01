"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/app/components/chat-message";

const SUGGESTIONS = [
  "Find articles related to JavaScript Closures Explained with Practical Examples.",
  "Check the links in Build a REST API with Express and remove the broken one.",
  "What's already published elsewhere about How the JavaScript Event Loop Works?",
];

export default function ContentCopilot() {
  const { messages, sendMessage, addToolApprovalResponse, status, error } =
    useChat({
      transport: new DefaultChatTransport({ api: "/api/chat" }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex h-dvh flex-col bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-4 py-3">
        <h1 className="font-semibold">🤖 Content Copilot</h1>
        <p className="text-xs text-neutral-500">
          Your Strapi assistant. Every change waits for your approval.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
          {messages.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-5xl">🤖</p>
              <p className="mt-3 text-neutral-600">
                Ask me anything about your articles.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm hover:bg-neutral-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onApproval={addToolApprovalResponse}
            />
          ))}

          {status === "submitted" && (
            <p className="text-sm text-neutral-500">🤖 Thinking…</p>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <p>{error?.message}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-neutral-200 bg-white p-3"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your content…"
            className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
