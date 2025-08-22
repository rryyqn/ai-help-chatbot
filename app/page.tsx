import ChatBot, { ChatBotTrigger } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="w-full relative">
      Home
      <ChatBotTrigger />
      <ChatBot />
    </div>
  );
};

export default page;
