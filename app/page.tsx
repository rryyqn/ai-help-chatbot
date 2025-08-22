import ChatBotWrapper from "@/components/Chatbot";
import React from "react";

const page = () => {
  return (
    <main className="m-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">AI Business Website Chatbot</h1>
        <p>
          This chatbot was built using Vercel&apos;s AI SDK, powered by Gemini
          2.5 Flash Lite.
        </p>
        <p>
          It was trained on data based on Area 51 indoor playgrounds to show how
          AI can be used in business websites to guide users.
        </p>
        <p>It features smart choices and links in the conversations.</p>
        <p>It also includes a rate limit system to prevent abuse.</p>
      </div>
      <ChatBotWrapper />
    </main>
  );
};

export default page;
