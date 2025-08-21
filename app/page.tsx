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
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Custom component to handle our special button syntax
const MarkdownWithButtons = ({
  children,
  onConversationChoice,
  onLinkClick,
}: {
  children: string;
  onConversationChoice: (choice: string) => void;
  onLinkClick: (url: string) => void;
}) => {
  // Extract and remove conversation choices from markdown
  const conversationChoiceRegex = /\{\{choice:([^}]+)\}\}/g;
  const linkButtonRegex = /\{\{link:([^|]+)\|([^}]+)\}\}/g;

  const conversationChoices: string[] = [];
  const linkButtons: { url: string; label: string }[] = [];

  // Extract conversation choices
  let match;
  while ((match = conversationChoiceRegex.exec(children)) !== null) {
    conversationChoices.push(match[1].trim());
  }

  // Extract link buttons
  while ((match = linkButtonRegex.exec(children)) !== null) {
    linkButtons.push({
      url: match[1].trim(),
      label: match[2].trim(),
    });
  }

  // Remove the special syntax from markdown content
  const cleanMarkdown = children
    .replace(conversationChoiceRegex, "")
    .replace(linkButtonRegex, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Clean up extra newlines
    .trim();

  return (
    <div>
      <div className="prose">
        <ReactMarkdown>{cleanMarkdown}</ReactMarkdown>
      </div>

      {/* Render conversation choice buttons */}
      {conversationChoices.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {conversationChoices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onConversationChoice(choice)}
              className="text-sm rounded-full cursor-pointer"
            >
              {choice}
            </Button>
          ))}
        </div>
      )}

      {/* Render link buttons */}
      {linkButtons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {linkButtons.map((button, index) => (
            <Button
              key={index}
              variant="default"
              size="sm"
              onClick={() => onLinkClick(button.url)}
              className="text-sm cursor-pointer rounded-full shadow-none"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {button.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hello explorer! Gizmo here, ready to help you find some out-of-this-world fun!🚀\n\nLet's start by choosing your Area 51 venue, or ask me about your questions!\n\n{{choice:Underwood}}\n{{choice:Mt Gravatt}}\n{{choice:Redcliffe}}\n{{choice:Helensvale}}",
          },
        ],
      },
    ],
  });
  console.log(messages);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleConversationChoice = (choice: string) => {
    sendMessage({ text: choice });
  };

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
                            <MarkdownWithButtons
                              key={`${message.id}-${i}`}
                              onConversationChoice={handleConversationChoice}
                              onLinkClick={handleLinkClick}
                            >
                              {part.text}
                            </MarkdownWithButtons>
                          );
                        default:
                          return null;
                      }
                    })}
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
