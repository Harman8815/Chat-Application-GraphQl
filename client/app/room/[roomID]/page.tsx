"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "@/graphql/queries";
import { MESSAGE_SUBSCRIPTION } from "@/graphql/subscription";
import { SendMessage } from "@/components/SendMessage";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

// Consistent gradient color per user ID
const getUserColor = (userId: string) => {
  const colors = [
    "from-electric-blue to-neon-green",
    "from-pink-500 to-purple-500",
    "from-yellow-400 to-orange-500",
    "from-cyan-400 to-blue-500",
    "from-emerald-400 to-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function RoomPage() {
  const { roomID } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { roomId: roomID },
    skip: !roomID,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.messages) setMessages(data.messages);
    if(data) console.log("Fetched messages:", data);
  }, [data]);

  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { roomId: roomID },
    skip: !roomID,
    onData: ({ data }) => {
      const newMessage = data.data?.messageAdded;
      if (newMessage) {
        setMessages((prev) =>
          prev.some((msg) => msg.id === newMessage.id) ? prev : [...prev, newMessage]
        );
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  // Extract unique users for left column
  const uniqueUsers = Array.from(new Map(messages.map(m => [m.sender.id, m.sender])).values());

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500">
      <Navbar />

      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border mt-16">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </Button>
        <h2 className="text-xl font-semibold">Room: {name}</h2>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 max-h-[calc(100vh-260px)] overflow-hidden">
        {/* Left: Users list */}
        <div className="w-80 border-r border-border p-4 px-10 space-y-3 overflow-y-auto">
          <h1 className="text-xl font-semibold">All Users</h1>
          {uniqueUsers.map((u) => (
            <div
              key={u.id}
              className={`p-2 rounded-full text-center text-sm font-medium bg-gradient-to-r ${getUserColor(
                u.id
              )} text-white shadow-md`}
            >
              {u.username}
            </div>
          ))}
        </div>

        {/* Center: Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col space-y-4 ">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[60%] w-fit p-3 rounded-xl border-2 border-border shadow-lg bg-gradient-to-r ${getUserColor(
                  msg.sender.id
                )} text-white`}
              >
                <div className="text-xs font-semibold opacity-90">{msg.sender.username}</div>
                <div className="mt-1">{msg.content}</div>
                <div className="mt-1 text-[0.7rem] opacity-70">
                  {msg?.createdAt
                    ? new Date(Number(msg.createdAt)).toLocaleTimeString()
                    : "Unknown"}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right: Send message */}
        <div className="w-[30vw] border-l border-border p-4 flex flex-col justify-end">
          <SendMessage roomId={roomID} />
        </div>
      </div>
    </div>
  );
}
