"use client";

import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : "";

const httpLink = new HttpLink({
  uri: "https://chat-application-graphql.onrender.com/graphql",
  headers: {
    authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
});
const wsClient = typeof window !== "undefined"
  ? createClient({
    url: "wss://chat-application-graphql.onrender.com/graphql",
    connectionParams: () => ({
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    }),
    webSocketImpl: typeof window !== "undefined" ? WebSocket : undefined,
    on: {
      opened: (socket) => {
        console.log("[CLIENT] WebSocket connection opened");
      },
      closed: (event) => {
        console.log("[CLIENT] WebSocket connection closed", event);
      },
      error: (error) => {
        console.log("[CLIENT] WebSocket error", error);
      }
    }
  })
  : null;

const wsLink = wsClient ? new GraphQLWsLink(wsClient) : null;

const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return (
          def.kind === "OperationDefinition" &&
          def.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
    : httpLink;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
