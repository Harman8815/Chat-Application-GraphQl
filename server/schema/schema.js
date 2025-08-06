import { gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

export const pubsub = new PubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';

// Utility to generate safe random strings
const safeString = (str, prefix = 'unknown') => {
  if (str && typeof str === 'string' && str.trim()) return str;
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
};

// Utility to generate safe random date
const safeDate = (date) => {
  return date ? new Date(date).toISOString() : new Date().toISOString();
};

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
    me: User!
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
  // ✅ Ensure all non-nullable fields are safe
  User: {
    id: (parent) => parent._id?.toString() || `${Math.floor(Math.random() * 1000000)}`,
    username: (parent) => safeString(parent.username, 'user'),
    email: (parent) => parent.email || null,
    bio: (parent) => parent.bio || '',
    isOnline: (parent) => parent.isOnline ?? false,
    lastOnline: (parent) => safeDate(parent.lastOnline),
    role: (parent) => parent.role || 'member',
    contacts: (parent) => parent.contacts || [],
    notificationsEnabled: (parent) => parent.notificationsEnabled ?? true,
    emailVerified: (parent) => parent.emailVerified ?? false,
    createdAt: (parent) => safeDate(parent.createdAt),
    updatedAt: (parent) => safeDate(parent.updatedAt)
  },
  Room: {
    id: (parent) => parent._id?.toString() || `${Math.floor(Math.random() * 1000000)}`,
    name: (parent) => safeString(parent.name, 'room'),
    isGroup: (parent) => parent.isGroup ?? false,
    members: (parent) => parent.members || [],
    createdBy: (parent) => parent.createdBy || null,
    createdAt: (parent) => safeDate(parent.createdAt),
    updatedAt: (parent) => safeDate(parent.updatedAt)
  },
  Message: {
    id: (parent) => parent._id?.toString() || `${Math.floor(Math.random() * 1000000)}`,
    content: (parent) => safeString(parent.content, 'message'),
    sender: (parent) => parent.sender || {},
    roomId: (parent) => parent.roomId || {},
    readBy: (parent) => parent.readBy || [],
    replyTo: (parent) => parent.replyTo || null,
    status: (parent) => parent.status || 'sent',
    createdAt: (parent) => safeDate(parent.createdAt),
    updatedAt: (parent) => safeDate(parent.updatedAt)
  },

  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const foundUser = await User.findById(user.id);
      return foundUser || { username: safeString(null, 'user') };
    },
    messages: async (_, { roomId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const msgs = await Message.find({ roomId })
        .populate(['sender', 'replyTo', 'roomId'])
        .sort({ createdAt: 1 });
      return msgs || [];
    },
    rooms: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const rms = await Room.find({ members: user.id }).populate('members');
      return rms || [];
    },
    users: async () => (await User.find()) || [],
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existing = await User.findOne({ username });
      if (existing) throw new Error("Username already taken");

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username: safeString(username), email, passwordHash });

      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.passwordHash || '');
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
        { bio: bio || '', notificationsEnabled: notificationsEnabled ?? true },
        { new: true }
      );
    },

    createRoom: async (_, { name, isGroup, members }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const room = await Room.create({
        name: safeString(name, 'room'),
        isGroup: isGroup ?? false,
        members: [...(members || []), user.id],
        createdBy: user.id
      });
      return room.populate('members');
    },

    sendMessage: async (_, { content, roomId, replyTo }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const message = await Message.create({
        content: safeString(content, 'message'),
        sender: user.id,
        roomId,
        replyTo: replyTo || null
      });

      const populatedMessage = await message.populate(['sender', 'replyTo', 'roomId']);
      console.log('[PUBSUB] Publishing messageAdded for room:', roomId);
      pubsub.publish(`MESSAGE_ADDED_${roomId}`, { messageAdded: populatedMessage });

      return populatedMessage;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: (_, { roomId }) => {
        console.log('[SUBSCRIPTION] Setting up subscription for room:', roomId);
        return pubsub.asyncIterableIterator(`MESSAGE_ADDED_${roomId}`);
      },
    },
  },
};
