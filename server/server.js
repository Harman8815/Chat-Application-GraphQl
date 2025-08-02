
import { pubsub } from './schema/schema.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import connectDB from './config/db.js';
import { verifyToken } from './utils/auth.js';
import { typeDefs, resolvers } from './schema/schema.js';
const startServer = async () => {
  await connectDB();

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  app.use(cors());
  app.use(express.json());


  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, connection }) => {
      // For HTTP requests
      if (req) {
        const token = req?.headers?.authorization || "";
        const decoded = verifyToken(token.replace("Bearer ", ""));
        return { user: decoded, pubsub };
      }
      // For WebSocket connections
      if (connection && connection.context) {
        return { ...connection.context, pubsub };
      }
      return { pubsub };
    }
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const httpServer = http.createServer(app);

  // Set up WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({
    schema,
    context: async (ctx, msg, args) => {
      // You can extract auth token from connectionParams if needed
      let user = null; console.log('[WS] New WebSocket connection:', ctx.connectionParams);
      const token = ctx.connectionParams?.Authorization || ctx.connectionParams?.authorization || "";
      if (token) {
        user = verifyToken(token.replace("Bearer ", ""));
        console.log('[WS] New WebSocket connection:', ctx.connectionParams);
      }
      return { user, pubsub };
    }, onSubscribe: (ctx, msg) => {
      console.log('[WS] onSubscribe called:', msg);
    }
  }, wsServer);
  wsServer.on('connection', (socket) => {
    console.log('[SERVER] New WebSocket connection established'); socket.on('close', (code, reason) => {
      console.log('[SERVER] WebSocket closed:', code, reason?.toString());
    });
  }); console.log("[SERVER] pubsub created:", pubsub, pubsub.constructor.name);
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🔌 WebSocket Server ready at ws://localhost:${PORT}/graphql`);
  });
};

startServer();
