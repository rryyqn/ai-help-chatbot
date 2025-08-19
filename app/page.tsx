"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Loader } from "@/components/ai-elements/loader";
import ReactMarkdown from "react-markdown";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const extractSuggestions = (text: string): string[] => {
    // Capture [Choice] that is NOT a markdown link [label](url)
    const bracketed = [...text.matchAll(/\[([^\]]+)\](?!\()/g)].map((m) =>
      m[1].trim()
    );
    if (bracketed.length > 0) {
      return Array.from(new Set(bracketed)).slice(0, 6);
    }
    const bulletLines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- ") && l.length > 2)
      .map((l) => l.slice(2).trim());
    return Array.from(new Set(bulletLines)).slice(0, 6);
  };

  const stripSuggestionBrackets = (text: string) => {
    // Remove standalone [Choice] segments entirely (not markdown links [label](url))
    // Also collapse extra spaces left behind.
    return text
      .replace(/\s*\[([^\]]+)\](?!\()\s*/g, " ")
      .replace(/[ ]{2,}/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .trim();
  };
  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div className="prose" key={`${message.id}-${i}`}>
                              <ReactMarkdown>
                                {stripSuggestionBrackets(part.text)}
                              </ReactMarkdown>
                            </div>
                          );

                        default:
                          return null;
                      }
                    })}
                    {message.role === "assistant" &&
                      (() => {
                        const fullText = message.parts
                          .filter((p) => p.type === "text")
                          .map((p) => ("text" in p ? p.text : ""))
                          .join("\n");
                        const suggestions = extractSuggestions(fullText);
                        if (!suggestions.length) return null;
                        return (
                          <div className="mt-2">
                            <Suggestions>
                              {suggestions.map((s) => (
                                <Suggestion
                                  key={s}
                                  suggestion={s}
                                  onClick={(value) =>
                                    sendMessage({ text: value })
                                  }
                                />
                              ))}
                            </Suggestions>
                          </div>
                        );
                      })()}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && (
              <Message role="assistant" from="assistant">
                <MessageContent>
                  <Loader />
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBotDemo;
