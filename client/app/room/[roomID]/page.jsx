"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "@/graphql/queries";
import { MESSAGE_SUBSCRIPTION } from "@/graphql/subscription";
import { SendMessage } from "@/components/SendMessage";

const RoomPage = () => {
  const { roomID } = useParams();
  const [messages, setMessages] = useState([]);


  // Query for messages
  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { roomId: roomID },
    skip: !roomID,
    onCompleted: (data) => {
      console.log('[CLIENT] Initial messages loaded for room:', roomID, data?.messages);
    },
    onError: (err) => {
      console.error('[CLIENT] Error loading messages:', err);
    },
  });

  // Update messages state when query data changes
  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
      console.log('[CLIENT] Messages state updated from query:', data.messages);
    }
  }, [data]);

  // Subscription for new messages
  const { data: subData, error: subError } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { roomId: roomID },
    skip: !roomID,
    onData: ({ data }) => {
      const newMessage = data.data?.messageAdded;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
        console.log('[CLIENT] Subscription received new message:', newMessage);
      } else {
        console.log('[CLIENT] Subscription received data but no messageAdded:', data);
      }
    },
    // onError: (err) => {
    //   console.error('[CLIENT] Subscription error:', err);
    // },
  });

  useEffect(() => {
    if (!roomID) return;
    console.log('[CLIENT] Subscribing to messages for room:', roomID);
  }, [roomID]);

  useEffect(() => {
    if (subData) {
      console.log('[CLIENT] Subscription ACK for room:', roomID, subData);
    }
  }, [subData, roomID]);

  useEffect(() => {
    if (subError) {
      console.error('[CLIENT] Subscription error effect:', subError);
    }
  }, [subError]);


  if (loading) {
    console.log('[CLIENT] Loading messages for room:', roomID);
    return <p>Loading messages...</p>;
  }
  if (error) {
    console.error('[CLIENT] Query error:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Room: {roomID}</h2>
      <div style={{ marginTop: "1rem" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender.username}:</strong> {msg.content}
            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              {msg?.createdAt
                ? new Date(Number(msg.createdAt)).toLocaleString()
                : "Unknown time"}
            </div>
          </div>
        ))}
      </div>
      <SendMessage
        roomId={roomID}
        onMessageSent={(msg) => {
          // No need to manually add here because subscription handles it
          console.log("Message sent:", msg);
        }}
      />
    </div>
  );
};

export default RoomPage;
