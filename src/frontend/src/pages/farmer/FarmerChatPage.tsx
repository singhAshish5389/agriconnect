import type { Principal } from "@icp-sdk/core/principal";
import { MessageCircle, Send, User } from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Loader } from "../../components/agri/Loader";
import { useAuth, useChat } from "../../hooks/useBackend";
import type { ChatMessage, ConversationSummary } from "../../types";

function formatTime(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FarmerChatPage() {
  const { user } = useAuth();
  const { conversations, isLoading, sendMessage, getMessages } = useChat();
  const [activeConv, setActiveConv] = useState<ConversationSummary | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgText, setMsgText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const convList = conversations as unknown as ConversationSummary[];

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    let cancelled = false;

    async function fetchMsgs() {
      if (!activeConv) return;
      setLoadingMsgs(true);
      const msgs = await getMessages(activeConv.partnerId as Principal);
      if (!cancelled) {
        setMessages(msgs as unknown as ChatMessage[]);
        setLoadingMsgs(false);
      }
    }

    fetchMsgs();

    // Poll every 5 seconds
    const interval = setInterval(fetchMsgs, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeConv, getMessages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages change only
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!msgText.trim() || !activeConv) return;
    setIsSending(true);
    await sendMessage({
      receiverId: activeConv.partnerId as Principal,
      message: msgText.trim(),
    });
    setMsgText("");
    // Refresh messages
    const msgs = await getMessages(activeConv.partnerId as Principal);
    setMessages(msgs as unknown as ChatMessage[]);
    setIsSending(false);
  }

  const myIdText = user?.id?.toText?.() ?? "";

  if (isLoading) return <Loader className="py-24" />;

  return (
    <div className="flex h-[calc(100vh-9rem)] rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      {/* Sidebar: conversation list */}
      <div
        className="w-72 shrink-0 border-r border-border flex flex-col"
        data-ocid="chat-conversations"
      >
        <div className="border-b border-border p-4">
          <h2 className="font-semibold text-foreground font-display">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          ) : (
            convList.map((conv) => (
              <button
                key={conv.partnerId.toText()}
                type="button"
                onClick={() => {
                  setActiveConv(conv);
                  setMessages([]);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  activeConv?.partnerId.toText() === conv.partnerId.toText()
                    ? "bg-emerald-50 border-l-2 border-l-emerald-500"
                    : ""
                }`}
                data-ocid="conv-item"
              >
                {/* Add user profile image here */}
                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {conv.partnerName}
                    </span>
                    {Number(conv.unreadCount) > 0 && (
                      <span className="shrink-0 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {Number(conv.unreadCount)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex flex-1 flex-col min-w-0">
        {activeConv ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 border-b border-border p-4 bg-muted/20">
              {/* Add user profile image here */}
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="font-semibold text-foreground">
                {activeConv.partnerName}
              </span>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              data-ocid="chat-messages"
            >
              {loadingMsgs ? (
                <Loader className="py-8" />
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No messages yet. Say hello!
                </p>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId.toText() === myIdText;
                  return (
                    <motion.div
                      key={msg.id.toString()}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm ${
                          isMine
                            ? "bg-emerald-500 text-white rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                        data-ocid="chat-bubble"
                      >
                        <p>{msg.message}</p>
                        <p
                          className={`mt-0.5 text-[10px] text-right ${
                            isMine
                              ? "text-emerald-100"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-border p-3 flex gap-2 items-center bg-card"
              data-ocid="chat-input-area"
            >
              <input
                type="text"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="chat-message-input"
              />
              <button
                type="submit"
                disabled={isSending || !msgText.trim()}
                className="rounded-xl bg-emerald-500 p-2.5 text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                aria-label="Send message"
                data-ocid="chat-send-btn"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Select a conversation
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose a conversation from the left to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
