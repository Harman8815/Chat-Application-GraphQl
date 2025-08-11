"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { GET_MESSAGES } from "@/graphql/queries";
import { MESSAGE_SUBSCRIPTION } from "@/graphql/subscription";
import { LEAVE_GROUP, DELETE_GROUP } from "@/graphql/mutation"; // your new mutations
import { SendMessage } from "@/components/SendMessage";
import { Navbar } from "@/components/navbar";
import { GET_ROOM_USERS } from "@/graphql/queries";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast"; // import your toast hook

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomName = searchParams.get("name") || "Unnamed Room";

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { roomId: roomID },
    skip: !roomID,
    fetchPolicy: "cache-and-network",
  });

  const [leaveGroup] = useMutation(LEAVE_GROUP);
  const [deleteGroup] = useMutation(DELETE_GROUP);

  useEffect(() => {
    if (data?.messages) setMessages(data.messages);
  }, [data]);

  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { roomId: roomID },
    skip: !roomID,
    onData: ({ data }) => {
      const newMessage = data.data?.messageAdded;
      if (newMessage) {
        setMessages((prev) =>
          prev.some((msg) => msg.id === newMessage.id)
            ? prev
            : [...prev, newMessage]
        );
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_ROOM_USERS, {
    variables: { roomId: roomID },
    skip: !roomID,
    fetchPolicy: "cache-and-network",
  });
  const uniqueUsers = usersData?.roomUsers || [];

  async function handleLeaveGroup() {
    try {
      await leaveGroup({ variables: { roomId: roomID } });
      toast.toast({
        title: "Left group successfully",
        description: `You left "${roomName}"`,
      });
      router.push("/room"); // redirect to homepage or chat list
    } catch (e: any) {
      toast.toast({
        title: "Error leaving group",
        description: e.message,
        action: undefined,
      });
    }
  }

  async function handleDeleteGroup() {
    try {
      await deleteGroup({ variables: { roomId: roomID } });
      toast.toast({
        title: "Group deleted",
        description: `"${roomName}" has been deleted`,
      });
      router.push("/room"); // redirect to homepage or chat list
    } catch (e: any) {
      toast.toast({
        title: "Error deleting group",
        description: e.message,
        action: undefined,
      });
    }
  }

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
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border mt-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <h2 className="text-xl font-semibold truncate">Room: {roomName}</h2>
      </div>

      <div className="flex flex-1 max-h-[calc(100vh-150px)] overflow-hidden relative">
        <div className="w-80 min-h-[calc(100vh-150px)] border-r border-border p-4 px-10 flex flex-col h-full overflow-y-auto">
          <div>
            <h1 className="text-xl font-semibold mb-4">All Users</h1>
            {usersLoading && <p>Loading users...</p>}
            {usersError && <p className="text-red-500">Failed to load users</p>}
            {!usersLoading && !usersError && uniqueUsers.length === 0 && (
              <p>No users in this room</p>
            )}
            {uniqueUsers.map((u) => (
              <div
                key={u.id}
                className={`p-2 rounded-full text-center text-sm font-medium bg-gradient-to-r ${getUserColor(
                  u.id
                )} text-white shadow-md mb-2`}
              >
                {u.username}
              </div>
            ))}
          </div>

          <hr className="my-4 border-t border-gray-300" />

          <div className="flex flex-row gap-4 mt-auto">
            <Button
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 border-0"
              onClick={handleLeaveGroup}
            >
              Leave Group
            </Button>
            <Button
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 border-0"
              onClick={handleDeleteGroup}
            >
              Delete Group
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => {
              const isOwnMessage = msg.sender.id === user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[60%] w-fit p-3 rounded-xl border-2 border-border shadow-lg bg-gradient-to-r ${getUserColor(
                    msg.sender.id
                  )} text-white ${
                    isOwnMessage
                      ? "self-end text-right"
                      : "self-start text-left"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold opacity-90">
                      {msg.sender.username}
                    </div>
                  )}
                  <div className="mt-1">{msg.content}</div>
                  <div className="mt-1 text-[0.7rem] opacity-70">
                    {msg?.createdAt
                      ? new Date(Number(msg.createdAt)).toLocaleTimeString()
                      : "Unknown"}
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="w-[30vw] border-l border-border p-4 flex flex-col justify-end">
          <SendMessage roomId={roomID} onMessageSent={() => {}} />
        </div>
      </div>
    </div>
  );
}
