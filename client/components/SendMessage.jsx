'use client';

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "@/graphql/queries"; // adjust if you store mutations separately

export const SendMessage = ({ roomId, onMessageSent }) => {
  const [content, setContent] = useState("");

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
    refetchQueries: ['GetMessages'],
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
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        style={{ flex: 1, padding: "0.5rem" }}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !content.trim()}>
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};
