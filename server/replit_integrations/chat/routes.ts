import type { Express, Request, Response } from "express";
import { chatStorage } from "./storage";

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiBaseUrl =
  process.env.GEMINI_BASE_URL ||
  "https://generativelanguage.googleapis.com/v1beta";
const geminiModel =
  process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

function getGeminiUrl(
  method: "generateContent" | "streamGenerateContent" = "generateContent"
) {
  if (!geminiApiKey) return null;
  return `${geminiBaseUrl}/models/${geminiModel}:${method}?key=${geminiApiKey}`;
}

export function registerChatRoutes(app: Express): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages =
        await chatStorage.getMessagesByConversation(id);

      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(
        title || "New Chat"
      );
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // 🔥 CHAT ENDPOINT WITH DB CONTEXT
  app.post(
    "/api/conversations/:id/messages",
    async (req: Request, res: Response) => {
      try {
        const conversationId = parseInt(req.params.id);
        const { content } = req.body;

        if (!content) {
          return res
            .status(400)
            .json({ error: "Message content is required" });
        }

        // Save user message
        await chatStorage.createMessage(
          conversationId,
          "user",
          content
        );

        // Get chat history
        const messages =
          await chatStorage.getMessagesByConversation(conversationId);

        const chatMessages = messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        const geminiUrl = getGeminiUrl("generateContent");
        if (!geminiUrl) {
          return res
            .status(500)
            .json({ error: "Gemini API key is not configured" });
        }

        // 🔥 FETCH PLATFORM DATA FROM DB
        const roadmapStats = await chatStorage.getRoadmapStats();

        // 🔥 OPTIONAL SMART FILTER (based on user query)
        const relevant = roadmapStats.filter((r) =>
          content.toLowerCase().includes(r.title.toLowerCase())
        );

        const selectedData = relevant.length ? relevant : roadmapStats;

        // 🔥 BUILD CONTEXT
        const platformContext = `
You are an AI assistant for a developer learning platform.

Platform Overview:
- Total Roadmaps: ${roadmapStats.length}

Roadmaps:
${selectedData
  .map(
    (r) =>
      `${r.title} (${r.difficulty}) → ${Math.round(
        r.totalMinutes / 60
      )} hours, ${r.stepCount} modules`
  )
  .join("\n")}

Instructions:
- Use this platform data when answering
- Suggest relevant roadmaps based on user goals
- Be concise and helpful
`;

        // 🔥 INJECT CONTEXT INTO GEMINI
        const geminiMessages = [
          {
            role: "user",
            parts: [{ text: `SYSTEM:\n${platformContext}` }],
          },
          ...chatMessages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
        ];

        const geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          console.error("Gemini error:", errorText);
          return res
            .status(500)
            .json({ error: "Failed to send message to Gemini API" });
        }

        const geminiData = await geminiResponse.json();

        const fullResponse =
          geminiData?.candidates?.[0]?.content?.parts
            ?.map((part: { text: string }) => part.text)
            .join("") || "";

        if (!fullResponse) {
          return res
            .status(500)
            .json({ error: "Empty response from Gemini API" });
        }

        // SSE streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const chunks = fullResponse.match(/.{1,400}/g) || [];

        for (const chunk of chunks) {
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        // Save assistant response
        await chatStorage.createMessage(
          conversationId,
          "assistant",
          fullResponse
        );

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (error) {
        console.error("Error sending message:", error);

        if (res.headersSent) {
          res.write(
            `data: ${JSON.stringify({
              error: "Failed to send message",
            })}\n\n`
          );
          res.end();
        } else {
          res.status(500).json({ error: "Failed to send message" });
        }
      }
    }
  );
}