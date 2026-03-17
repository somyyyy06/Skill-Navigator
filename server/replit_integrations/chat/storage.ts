import { db } from "../../db";
import { conversations, messages, roadmaps, steps } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;

  // 🔥 UPDATED FUNCTION
  getRoadmapStats(): Promise<{
    id: number;
    title: string;
    category: string;
    difficulty: string;
    totalMinutes: number;
    stepCount: number; // 🔥 NEW
  }[]>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));

    return conversation;
  },

  async getAllConversations() {
    return db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.createdAt));
  },

  async createConversation(title: string) {
    const [conversation] = await db
      .insert(conversations)
      .values({ title })
      .returning();

    return conversation;
  },

  async deleteConversation(id: number) {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  },

  async getMessagesByConversation(conversationId: number) {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db
      .insert(messages)
      .values({ conversationId, role, content })
      .returning();

    return message;
  },

  // 🔥 UPDATED FUNCTION IMPLEMENTATION
  async getRoadmapStats() {
    const roadmapData = await db.select().from(roadmaps);
    const stepData = await db.select().from(steps);

    const roadmapMap = new Map<
      number,
      {
        totalMinutes: number;
        stepCount: number;
      }
    >();

    // Aggregate total minutes + module count
    for (const step of stepData) {
      const current = roadmapMap.get(step.roadmapId) || {
        totalMinutes: 0,
        stepCount: 0,
      };

      roadmapMap.set(step.roadmapId, {
        totalMinutes: current.totalMinutes + (step.estimatedMinutes || 0),
        stepCount: current.stepCount + 1,
      });
    }

    return roadmapData.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      difficulty: r.difficulty,
      totalMinutes: roadmapMap.get(r.id)?.totalMinutes || 0,
      stepCount: roadmapMap.get(r.id)?.stepCount || 0, // 🔥 NEW
    }));
  },
};