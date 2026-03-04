"use client";

import { AssistantRuntimeProvider, useAssistantRuntime } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export const Assistant = () => {
  const [model, setModel] = useState("models/gemini-flash-latest");
  const runtime = useChatRuntime({
    api: "/api/chat",
    body: { model },
  });

  const switchModel = () => {
    setModel(model === "gpt-3.5-turbo" ? "gpt-4" : "gpt-3.5-turbo");
  };

  const exportChat = () => {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(runtime.messages, null, 2)], {
      type: "application/json",
    });
    a.href = URL.createObjectURL(file);
    a.download = "chat-history.json";
    a.click();
  };

  const importChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const messages = JSON.parse(content);
          runtime.setMessages(messages);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const copyLastMessage = () => {
    const lastAssistantMessage = runtime.messages.filter(
      (m) => m.role === "assistant"
    ).pop();
    if (lastAssistantMessage) {
      navigator.clipboard.writeText(lastAssistantMessage.content);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Own ChatGPT UX
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    Starter Template
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button onClick={switchModel}>Switch Model (Current: {model})</Button>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="ml-2 border rounded px-2 py-1">
                <option value="models/gemini-flash-latest">Gemini Flash</option>
                <option value="models/gemini-pro-latest">Gemini Pro</option>
              </select>
              <Button onClick={exportChat}>Export Chat</Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={importChat}
                accept=".json"
              />
              <Button onClick={() => fileInputRef.current?.click()}>Import Chat</Button>
              <Button onClick={copyLastMessage}>Copy Last Message</Button>
              <Button onClick={() => runtime.clear()}>Clear Chat</Button>
            </div>
          </header>
          <Thread />
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
