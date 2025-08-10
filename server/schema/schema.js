import { gql } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

export const pubsub = new PubSub();

const safeString = (str, prefix = 'unknown') => {
  if (str && typeof str === 'string' && str.trim()) return str;
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
};

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
    getRoomShareLink(roomId: ID!): String!
    getUserChatLink(userId: ID!): String!
  }

  type Mutation {
    createGroup(name: String!): Room!
    joinGroup(name: String!): Room!
    getOrCreateChat(username: String!): Room!
    signup(username: String!, email: String, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    updateProfile(bio: String, notificationsEnabled: Boolean): User!
    sendMessage(content: String!, roomId: ID!, replyTo: ID): Message!
  }

  type Subscription {
    messageAdded(roomId: ID!): Message!
  }
`;

export const resolvers = {
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
      return await User.findById(user.id);
    },
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
    users: async () => await User.find(),
    getRoomShareLink: async (_, { roomId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const room = await Room.findById(roomId);
      if (!room) throw new Error("Room not found");
      return `${process.env.FRONTEND_URL}/join/room/${room.id}`;
    },
    getUserChatLink: async (_, { userId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const targetUser = await User.findById(userId);
      if (!targetUser) throw new Error("User not found");
      return `${process.env.FRONTEND_URL}/chat/user/${targetUser.id}`;
    }
  },

  Mutation: {
    createGroup: async (_, { name }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const groupName = name.trim();
      const existingGroup = await Room.findOne({
        name: { $regex: `^${groupName}$`, $options: 'i' },
        isGroup: true
      });
      if (existingGroup) throw new Error("Group with this name already exists");
      const group = await Room.create({
        name: groupName,
        isGroup: true,
        members: [user.id],
        createdBy: user.id
      });
      return group.populate('members');
    },
    joinGroup: async (_, { name }, { user, models }) => {
      if (!user) throw new Error("Authentication required");
      name = name.trim();
      if (!name) throw new Error("Group name is required");
      const group = await Room.findOne({ name }).populate("members createdBy");
      if (!group) throw new Error("Group not found");
      if (!group.isGroup) throw new Error("Not a group");

      if (!group.members.some(member => member.id.toString() === user.id.toString())) {
        group.members.push(user.id);
        await group.save();
        await group.populate("members createdBy");
      }

      return group;
    },
    getOrCreateChat: async (_, { username }, { user, models }) => {
      if (!user) throw new Error("Authentication required");
      if (user.username === username) throw new Error("Cannot chat with yourself");

      const otherUser = await User.findOne({ username });
      if (!otherUser) throw new Error("User not found");

      let room = await Room.findOne({
        isGroup: false,
        members: { $all: [user.id, otherUser.id], $size: 2 },
      }).populate("members createdBy");

      if (!room) {
        const sortedNames = [user.username, otherUser.username].sort();
        const roomName = `chat ${sortedNames[0]}-${sortedNames[1]}`;

        room = await Room.create({
          name: roomName,
          isGroup: false,
          members: [user.id, otherUser.id],
          createdBy: user.id,
        });

        await room.populate("members createdBy");

        await Message.create({
          content: "Joined the chat",
          sender: user.id,
          roomId: room._id,
        });

        await Message.create({
          content: "Joined the chat",
          sender: otherUser.id,
          roomId: room._id,
        });
      }

      return room;
    },
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
    sendMessage: async (_, { content, roomId, replyTo }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const message = await Message.create({
        content: safeString(content, 'message'),
        sender: user.id,
        roomId,
        replyTo: replyTo || null
      });
      const populatedMessage = await message.populate(['sender', 'replyTo', 'roomId']);
      pubsub.publish(`MESSAGE_ADDED_${roomId}`, { messageAdded: populatedMessage });
      return populatedMessage;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: (_, { roomId }) => pubsub.asyncIterableIterator(`MESSAGE_ADDED_${roomId}`)
    }
  }
};
