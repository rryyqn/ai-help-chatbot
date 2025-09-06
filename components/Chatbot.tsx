"use client";
import { useRef, useState } from "react";
import React from "react";
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
import { ExternalLink, MessageSquareIcon, RotateCw, X } from "lucide-react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "./ai-elements/prompt-input";
import { chatbotConfig } from "@/lib/config";

type ErrorMessage = {
  error: Error;
  message: string;
  status: number;
  statusCode: number;
  response: Response;
};

const MarkdownWithButtons = ({
  children,
  onConversationChoice,
  onLinkClick,
  isRateLimited,
  status,
}: {
  children: string;
  onConversationChoice: (choice: string) => void;
  onLinkClick: (url: string) => void;
  isRateLimited: boolean;
  status: string;
}) => {
  // Extract and remove conversation choices from markdown
  const conversationChoiceRegex = /\{\{choice:([^}]+)\}\}/g;
  const linkButtonRegex = /\{\{link:([^|]+)\|([^}]+)\}\}/g;
  const conversationChoices: string[] = [];
  const linkButtons: { url: string; label: string }[] = [];
  let match;
  while ((match = conversationChoiceRegex.exec(children)) !== null) {
    conversationChoices.push(match[1].trim());
  }
  while ((match = linkButtonRegex.exec(children)) !== null) {
    linkButtons.push({
      url: match[1].trim(),
      label: match[2].trim(),
    });
  }
  const cleanMarkdown = children
    .replace(conversationChoiceRegex, "")
    .replace(linkButtonRegex, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();

  return (
    <div>
      <div className="prose text-sm">
        <ReactMarkdown>{cleanMarkdown}</ReactMarkdown>
      </div>
      {(conversationChoices.length > 0 || linkButtons.length > 0) && (
        <div className="flex flex-row flex-wrap mt-2 gap-2">
          {conversationChoices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onConversationChoice(choice)}
              disabled={isRateLimited || status === "submitted"}
              className={`text-xs rounded-full shadow-none ${
                isRateLimited ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {choice}
            </Button>
          ))}

          {/* Render link buttons */}
          {linkButtons.map((button, index) => (
            <Button
              key={index}
              variant="default"
              size="sm"
              onClick={() => onLinkClick(button.url)}
              className="text-xs rounded-full shadow-none"
            >
              {button.label}
              <ExternalLink className="w-3 h-3 mr-1" />
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
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(
    null
  );
  const lastMessageTime = useRef(Date.now());

  const { messages, sendMessage, setMessages, status } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: chatbotConfig.welcomeMessage,
          },
        ],
      },
    ],
    onError: (error) => {
      // Check for rate limiting (429 status code)
      const isRateLimit =
        (error as unknown as ErrorMessage).status === 429 ||
        (error as unknown as ErrorMessage).statusCode === 429 ||
        error.message?.includes("429") ||
        error.message?.toLowerCase().includes("rate limit") ||
        error.message?.toLowerCase().includes("too many requests");

      if (isRateLimit) {
        setIsRateLimited(true);

        // Extract retry-after header if available
        const response = (error as unknown as ErrorMessage).response;
        if (response) {
          const retryAfterHeader = response.headers.get("Retry-After");
          if (retryAfterHeader) {
            const retrySeconds = parseInt(retryAfterHeader, 10);
            setRateLimitCountdown(retrySeconds);

            // Start countdown timer
            const countdownInterval = setInterval(() => {
              setRateLimitCountdown((prev) => {
                if (prev && prev > 1) {
                  return prev - 1;
                } else {
                  clearInterval(countdownInterval);
                  setIsRateLimited(false);
                  setRateLimitCountdown(null);
                  return null;
                }
              });
            }, 1000);
          } else {
            // Default 10 second cooldown if no retry-after header
            setRateLimitCountdown(10);

            setTimeout(() => {
              setIsRateLimited(false);
              setRateLimitCountdown(null);
            }, 10000);
          }
        } else {
          // Fallback for errors without response object
          setRateLimitCountdown(10);

          setTimeout(() => {
            setIsRateLimited(false);
            setRateLimitCountdown(null);
          }, 10000);
        }

        setRateLimitMessage("");
      } else {
        // Handle other errors
        setRateLimitMessage(`Error: ${error.message}`);
        setTimeout(() => setRateLimitMessage(""), 5000);
      }
    },
  });

  const sendMessageWithThrottle = async (text: string) => {
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime.current;

    // Prevent spam (minimum time between messages)
    if (timeSinceLastMessage < chatbotConfig.rateLimit.minTimeBetweenMessages) {
      return;
    }

    // Don't send if rate limited
    if (isRateLimited) {
      return;
    }

    try {
      await sendMessage({ text });
      lastMessageTime.current = now;
    } catch (error) {
      console.log("Direct send error:", error);

      // Check for rate limiting in caught errors
      const isRateLimit =
        (error as unknown as ErrorMessage).status === 429 ||
        (error as unknown as ErrorMessage).statusCode === 429 ||
        (error as unknown as ErrorMessage).response?.status === 429 ||
        (error as unknown as ErrorMessage).message?.includes("429") ||
        (error as unknown as ErrorMessage).message
          ?.toLowerCase()
          .includes("rate limit");

      if (isRateLimit) {
        setIsRateLimited(true);
        setRateLimitMessage(
          "Rate limit exceeded. Please wait before sending another message."
        );

        // Default 10 second cooldown
        setRateLimitCountdown(10);

        setTimeout(() => {
          setIsRateLimited(false);
          setRateLimitCountdown(null);
        }, 10000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      input.trim() &&
      !isRateLimited &&
      input.length <= chatbotConfig.rateLimit.maxMessageLength
    ) {
      sendMessageWithThrottle(input);
      setInput("");
    }
  };

  const isInputValid =
    input.length <= chatbotConfig.rateLimit.maxMessageLength &&
    input.trim().length > 0;

  const handleConversationChoice = (choice: string) => {
    if (!isRateLimited) {
      sendMessageWithThrottle(choice);
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const clearMessages = () => {
    // Clear all error and rate limit state when resetting chat
    setIsRateLimited(false);
    setRateLimitMessage("");
    setRateLimitCountdown(null);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: chatbotConfig.welcomeMessage,
          },
        ],
      },
    ]);
  };

  // Format countdown message
  const getRateLimitMessage = () => {
    if (rateLimitCountdown !== null && rateLimitCountdown > 0) {
      return `Rate limit exceeded. Please wait ${rateLimitCountdown} second${
        rateLimitCountdown !== 1 ? "s" : ""
      }...`;
    }
    return rateLimitMessage || "Rate limit exceeded. Please wait...";
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
            inset-0 w-screen h-screen rounded-none border-0
            md:max-w-100 md:w-full md:h-110 md:bottom-20 md:right-4 md:rounded-sm md:border md:inset-auto
          `}
    >
      {(isRateLimited || rateLimitMessage) && (
        <div className="text-red-700 rounded text-xs absolute bottom-16 w-full text-center z-10 bg-red-50 px-2 py-1">
          {getRateLimitMessage()}
        </div>
      )}
      <div className="px-2 py-2 flex flex-row justify-between items-center">
        <div className="flex-col pl-2">
          <p className="font-bold">{chatbotConfig.ui.windowTitle}</p>
        </div>
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
                            isRateLimited={isRateLimited}
                            status={status}
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
          placeholder={
            isRateLimited
              ? "Rate limited, please wait..."
              : chatbotConfig.ui.inputPlaceholder
          }
          disabled={isRateLimited}
        />
        <PromptInputSubmit
          disabled={!isInputValid || isRateLimited || status === "submitted"}
          status={status}
          className="rounded-sm self-start"
        />
      </PromptInput>
    </motion.div>
  );
};
