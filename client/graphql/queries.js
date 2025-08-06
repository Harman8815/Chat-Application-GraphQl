import { gql } from "@apollo/client";

/* ===========================
   Get all rooms with members
   =========================== */
export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      isGroup
      createdAt
      createdBy {
        id
        username
      }
      members {
        id
        username
        isOnline
      }
    }
  }
`;

/* ===========================
   Get all messages in a room
   =========================== */
export const GET_MESSAGES = gql`
  query GetMessages($roomId: ID!) {
    messages(roomId: $roomId) {
      id
      content
      createdAt
      status
      sender {
        id
        username
      }
      roomId {
        id
        name
      }
      replyTo {
        id
        content
        sender {
          id
          username
        }
      }
    }
  }
`;

/* ===========================
   Send a new message
   =========================== */
export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $roomId: ID!, $replyTo: ID) {
    sendMessage(content: $content, roomId: $roomId, replyTo: $replyTo) {
      id
      content
      createdAt
      status
      sender {
        id
        username
      }
      roomId {
        id
        name
      }
      replyTo {
        id
        content
        sender {
          id
          username
        }
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      bio
      isOnline
      role
      createdAt
    }
  }
`;