import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, useCreateConversation } from "@/hooks/use-chat";
import { AnimatePresence, motion } from "framer-motion";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  
  const createConversation = useCreateConversation();
  const { messages, sendMessage, isStreaming, streamedContent } = useChat(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize conversation on open if not exists
  useEffect(() => {
    if (isOpen && !conversationId) {
      createConversation.mutate("Mentorship Session", {
        onSuccess: (data) => setConversationId(data.id),
      });
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamedContent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden"
          >
            <Card className="flex flex-col h-full border-primary/20 bg-background/95 backdrop-blur-md">
              {/* Header */}
              <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Mentor</h3>
                    <p className="text-xs text-primary-foreground/80">Always here to help</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary-foreground hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && !isStreaming && (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Hi! I'm your AI learning mentor.</p>
                      <p className="text-xs mt-1">Ask me anything about your roadmap!</p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex w-max max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm",
                        msg.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))}

                  {isStreaming && (
                    <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm bg-muted text-foreground">
                      {streamedContent}
                      <span className="inline-block w-1.5 h-4 bg-primary align-middle ml-1 animate-pulse"/>
                    </div>
                  )}
                  
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-background/50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-background"
                    disabled={isStreaming}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isStreaming || !conversationId}>
                    {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300",
          isOpen ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
