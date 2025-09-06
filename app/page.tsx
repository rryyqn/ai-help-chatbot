import ChatBotWrapper from "@/components/Chatbot";
import DemoPage from "@/components/DemoPage";
import React from "react";

const page = () => {
  return (
    <main>
      {/* Remove Demo Page */}
      <DemoPage />
      <ChatBotWrapper />
    </main>
  );
};

export default page;
