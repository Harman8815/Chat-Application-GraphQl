"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "@/graphql/queries";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SendMessage = ({ roomId, onMessageSent }) => {
  const [content, setContent] = useState("");

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
    refetchQueries: ["GetMessages"],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      setContent("");
      if (onMessageSent) onMessageSent(data.sendMessage);
    },
    onError: (err) => {
      console.error("Send message failed:", err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessage({ variables: { content, roomId } });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 border-t border-border bg-background"
    >
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        disabled={loading}
        className="flex-1 rounded-full px-4 py-3 border-2 border-transparent bg-card focus:border-electric-blue transition-all duration-300"
      />
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-full px-4 py-3 bg-gradient-to-r from-electric-blue to-neon-green text-white font-semibold border-0 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : <Send size={18} />}
        </Button>
      </motion.div>
    </form>
  );
};
