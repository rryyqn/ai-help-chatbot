"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { chatbotConfig } from "@/lib/config";
import type { UIMessage } from "ai";
import type { HTMLAttributes } from "react";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({
  className,
  from,
  children,
  ...props
}: MessageProps) => (
  <div
    className={cn(
      "group flex w-full items-end justify-end py-4",
      from === "user" ? "is-user" : "is-assistant flex-row-reverse justify-end",
      "[&>div]:max-w-[80%]",
      className
    )}
    {...props}
  >
    {children}
    {from !== "user" ? (
      <Avatar aria-label={chatbotConfig.name} className="w-10 h-10">
        <AvatarFallback>{chatbotConfig.ui.avatarFallback}</AvatarFallback>
        <AvatarImage
          src={chatbotConfig.ui.avatarImage}
          alt={chatbotConfig.name}
        />
      </Avatar>
    ) : null}
  </div>
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      "flex flex-col gap-2 overflow-hidden rounded-sm px-4 py-3 text-foreground text-sm",
      "group-[.is-user]:bg-secondary group-[.is-user]:text-foreground",
      "group-[.is-assistant]:bg-secondary/30 group-[.is-assistant]:text-foreground",
      className
    )}
    {...props}
  >
    <div className="is-user:dark">{children}</div>
  </div>
);
