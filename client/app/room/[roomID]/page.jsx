"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES } from "../../../graphql/queries"; // adjust path as per your structure
import {SendMessage} from "@/components/SendMessage"; // ✅ correct

const RoomPage = () => {
  const { roomID } = useParams();
  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { roomId: roomID },
    skip: !roomID,
  });
  console.log(data);
  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Room: {roomID}</h2>
      <div style={{ marginTop: "1rem" }}>
        {data.messages.map((msg) => (
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
          console.log("New message sent:", msg);
          // Optional: trigger refetch or update message list
        }}
      />
    </div>
  );
};

export default RoomPage;
