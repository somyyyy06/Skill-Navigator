import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Define message type based on the schema
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function useChat(conversationId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch initial history if needed, though for a fresh chat session 
  // we might want to just start empty or fetch from backend if persistence is key.
  // For this implementation, we'll assume we load history when opening the chat.

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    // Optimistic update
    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamedContent("");

    abortControllerRef.current = new AbortController();

    try {
      const url = `/api/conversations/${conversationId}/messages`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        signal: abortControllerRef.current.signal,
        credentials: "include", // Important for Replit Auth
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessageContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]" || dataStr.includes('"done":true')) {
              // Stream finished
              continue;
            }

            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                assistantMessageContent += data.content;
                setStreamedContent(assistantMessageContent);
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }

      // Once done, add the full assistant message to history
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessageContent },
      ]);
      setStreamedContent("");
      setIsStreaming(false);

    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Chat error:", error);
        // Handle error visually
      }
      setIsStreaming(false);
    }
  }, [conversationId]);

  return {
    messages,
    sendMessage,
    isStreaming,
    streamedContent,
  };
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return await res.json();
    }
  });
}
