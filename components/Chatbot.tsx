"use client";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import { Message, MessageContent } from "./ai-elements/message";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "motion/react";
import {
  ExternalLink,
  Loader,
  MessageSquareIcon,
  RefreshCw,
  RotateCw,
  X,
} from "lucide-react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "./ai-elements/prompt-input";

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
      <div className="prose text-sm">
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
              className="text-xs rounded-full shadow-none"
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
              className="text-xs rounded-full shadow-none"
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

const ChatBotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <Button
        size="sm"
        className="fixed bottom-5 right-5 rounded-full p-4 h-fit"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquareIcon className="size-5" />
      </Button>
      <AnimatePresence mode="wait">
        {isOpen && <ChatBot key="chatbot" onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ChatBotWrapper;

export const ChatBot = ({ onClose }: { onClose: () => void }) => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status } = useChat({
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

  const clearMessages = () => {
    setMessages([
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
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`
        justify-between flex flex-col
        fixed z-20 bg-white
        
        /* Mobile: Full screen */
        inset-0 w-screen h-screen rounded-none border-0
        
        /* Desktop: Bottom right panel */
        md:max-w-100 md:w-full md:h-110 md:bottom-20 md:right-4 md:rounded-sm md:border md:inset-auto
      `}
    >
      <div className="px-1 py-2 flex flex-row justify-between items-center">
        <p className="font-bold pl-4">Area 51 Gizmo AI Assistant</p>
        <div>
          <Button onClick={clearMessages} size="icon" variant="ghost">
            <RotateCw />
          </Button>
          <Button onClick={onClose} size="icon" variant="ghost">
            <X />
          </Button>
        </div>
      </div>
      <Conversation className="overflow-hidden">
        <ConversationContent className="px-2">
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
                <div className="flex gap-1 justify-center items-center py-2 px-1">
                  <span className="sr-only">Loading...</span>
                  <div className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce delay-150"></div>
                  <div className="h-2 w-2 bg-neutral-300 rounded-full animate-bounce delay-300"></div>
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput
        onSubmit={handleSubmit}
        className="flex items-center py-3 px-4 gap-2 border-t"
      >
        <PromptInputTextarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className=""
        />
        <PromptInputSubmit
          disabled={!input}
          status={status}
          className="rounded-sm self-start"
        />
      </PromptInput>
    </motion.div>
  );
};
