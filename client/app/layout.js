"use client";
import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/client";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
