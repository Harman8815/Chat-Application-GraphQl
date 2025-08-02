// graphql/subscriptions.js
import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded($roomId: ID!) {
    messageAdded(roomId: $roomId) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      replyTo {
        id
        content
      }
    }
  }
`;
