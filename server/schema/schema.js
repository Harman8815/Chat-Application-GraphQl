import { gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

export const pubsub = new PubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
    bio: String
    isOnline: Boolean
    lastOnline: String
    role: String
    contacts: [User!]
    notificationsEnabled: Boolean
    emailVerified: Boolean
    createdAt: String
    updatedAt: String
  }

  type Room {
    id: ID!
    name: String!
    isGroup: Boolean
    members: [User!]!
    createdBy: User
    createdAt: String
    updatedAt: String
  }

  type Message {
    id: ID!
    content: String
    sender: User!
    roomId: Room!
    readBy: [User!]
    replyTo: Message
    status: String
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    messages(roomId: ID!): [Message!]!
    rooms: [Room!]!
    users: [User!]!
  }

  type Mutation {
    signup(username: String!, email: String, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    updateProfile(bio: String, notificationsEnabled: Boolean): User!
    createRoom(name: String!, isGroup: Boolean, members: [ID!]!): Room!
    sendMessage(content: String!, roomId: ID!, replyTo: ID): Message!
  }

  type Subscription {
    messageAdded(roomId: ID!): Message!
  }
`;

export const resolvers = {
  Query: {
    messages: async (_, { roomId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Message.find({ roomId })
        .populate(['sender', 'replyTo', 'roomId'])
        .sort({ createdAt: 1 });
    },
    rooms: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Room.find({ members: user.id }).populate('members');
    },
    users: async () => await User.find()
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existing = await User.findOne({ username });
      if (existing) throw new Error("Username already taken");

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, passwordHash });

      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new Error("Invalid password");

      const token = generateToken(user);
      user.isOnline = true;
      user.lastOnline = new Date();
      await user.save();

      return { token, user };
    },

    updateProfile: async (_, { bio, notificationsEnabled }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findByIdAndUpdate(
        user.id,
        { bio, notificationsEnabled },
        { new: true }
      );
    },

    createRoom: async (_, { name, isGroup, members }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const room = await Room.create({
        name,
        isGroup,
        members: [...members, user.id],
        createdBy: user.id
      });
      return room.populate('members');
    },

    sendMessage: async (_, { content, roomId, replyTo }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const message = await Message.create({
        content,
        sender: user.id,
        roomId,
        replyTo: replyTo || null
      });

      const populatedMessage = await message.populate(['sender', 'replyTo', 'roomId']);
      // Debug: Log when publishing
      console.log('[PUBSUB] Publishing messageAdded for room:', roomId, populatedMessage);
      pubsub.publish(`${MESSAGE_ADDED}_${roomId}`, { messageAdded: populatedMessage });

      return populatedMessage;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: (_, { roomId }) => {
        return pubsub.asyncIterator(`MESSAGE_ADDED_${roomId}`);
      },
    },
  },

};
