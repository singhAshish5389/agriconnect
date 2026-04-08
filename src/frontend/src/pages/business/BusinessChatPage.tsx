import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "../../components/agri/Button";
import { Input } from "../../components/agri/Input";
import { Loader } from "../../components/agri/Loader";
import { useAuth, useChat } from "../../hooks/useBackend";
import type { ChatMessage, ConversationSummary } from "../../types";
import type { UserId } from "../../types";

function formatTime(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function BusinessChatPage() {
  const { user } = useAuth();
  const {
    conversations,
    isLoading,
    sendMessage,
    getMessages,
    chatActor,
    isSending,
  } = useChat();
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationSummary | null>(null);
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const partnerId = selectedConversation?.partnerId;
  const messagesQuery = useQuery<ChatMessage[]>({
    queryKey: ["conversation", partnerId?.toText()],
    queryFn: () => (partnerId ? getMessages(partnerId) : Promise.resolve([])),
    enabled: !!partnerId && !!chatActor,
    refetchInterval: 5000,
  });

  const messages = messagesQuery.data ?? [];

  // Scroll to bottom when new messages arrive
  const prevCountRef = useRef(0);
  if (messages.length !== prevCountRef.current) {
    prevCountRef.current = messages.length;
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;
    const text = messageText.trim();
    setMessageText("");
    await sendMessage({
      receiverId: selectedConversation.partnerId as UserId,
      message: text,
    });
  }

  const myId = user?.id.toText();

  return (
    <div
      className="flex h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden bg-card shadow-sm"
      data-ocid="business-chat-page"
    >
      {/* Left: Conversations list */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground font-display text-sm">
            Messages
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {conversations.length} conversation
            {conversations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.partnerId.toText()}
                type="button"
                onClick={() => setSelectedConversation(conv)}
                className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 ${
                  selectedConversation?.partnerId.toText() ===
                  conv.partnerId.toText()
                    ? "bg-teal-50 border-l-2 border-l-teal-500"
                    : ""
                }`}
                data-ocid={`conv-${conv.partnerId.toText()}`}
              >
                {/* Add user profile image here */}
                <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {conv.partnerName}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDate(conv.lastTimestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
                {Number(conv.unreadCount) > 0 && (
                  <span className="h-5 w-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {Number(conv.unreadCount)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Message thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/20">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="font-medium text-foreground">Select a conversation</p>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3 bg-card">
              {/* Add user profile image here */}
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                <User className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedConversation.partnerName}
                </p>
                <p className="text-xs text-muted-foreground">Farmer</p>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10"
              data-ocid="message-thread"
            >
              {messagesQuery.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Send a message to get started.
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isMine = msg.senderId.toText() === myId;
                    return (
                      <motion.div
                        key={msg.id.toString()}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            isMine
                              ? "bg-teal-600 text-white rounded-br-sm"
                              : "bg-card border border-border text-foreground rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              isMine ? "text-teal-100" : "text-muted-foreground"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Message input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-border bg-card flex items-center gap-2"
              data-ocid="message-input-form"
            >
              <Input
                placeholder="Type a message…"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
                data-ocid="message-input"
              />
              <Button
                type="submit"
                isLoading={isSending}
                disabled={!messageText.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
                leftIcon={<Send className="h-4 w-4" />}
                data-ocid="send-message-btn"
              >
                Send
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
