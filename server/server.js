import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema/schema.js';
import connectDB from './config/db.js';
import { verifyToken } from './utils/auth.js';

const startServer = async () => {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const decoded = verifyToken(token.replace("Bearer ", ""));
      return { user: decoded };
    }
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

startServer();
