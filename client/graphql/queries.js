import { gql } from "@apollo/client";

export const GET_ROOMS = gql`
  query {
    rooms {
      id
      name
    }
  }
`;
export const GET_MESSAGES = gql`
  query GetMessages($roomId: ID!) {
    messages(roomId: $roomId) {
      id
      content
      sender {
        id
        username
      }
      createdAt
    }
  }
`; 
export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $roomId: ID!) {
    sendMessage(content: $content, roomId: $roomId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
    }
  }
`;
export const MESSAGE_ADDED = gql`
  subscription MessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      id
      content
      sender {
        id
        username
      }
      createdAt
    }
  }
`;