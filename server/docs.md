# 🟢 Chat App GraphQL API Documentation

[![Node.js](https://img.shields.io/badge/node-%3E%3D12-green)](https://nodejs.org/)  
[![GraphQL](https://img.shields.io/badge/graphql-API-blueviolet)](https://graphql.org/)  
[![MongoDB](https://img.shields.io/badge/mongodb-Database-green)](https://www.mongodb.com/)  
[![Apollo Server](https://img.shields.io/badge/apollo_server-Express-yellowgreen)](https://www.apollographql.com/docs/apollo-server/)  
[![JWT](https://img.shields.io/badge/jwt-Authentication-orange)](https://jwt.io/)

---

## 📚 Overview

A real-time chat backend with:

- **User authentication & authorization** via JWT.
- **Group & private chat rooms** management.
- **Real-time messaging** with subscriptions.
- Role-based permissions (creator/admin vs member).
- Message threading and read receipts.

---

## 🔍 GraphQL Schema

### Types

| Type         | Description                                      |
|--------------|-------------------------------------------------|
| **User**     | User profile, status, contacts, and metadata.   |
| **Room**     | Group or 1:1 chat room with members and owner. |
| **Message**  | Chat message with sender, reply, and read status.|
| **AuthPayload** | Token and user data on signup/login.           |

---

### Queries

| Query                       | Description                                    |
|-----------------------------|------------------------------------------------|
| `me`                        | Current authenticated user profile.            |
| `messages(roomId)`          | Messages in a room, sorted by creation time.  |
| `rooms`                     | Rooms where user is a member.                   |
| `roomUsers(roomId)`         | Users in a particular room.                     |
| `getRoomShareLink(roomId)`  | URL to share/join a room.                       |
| `getUserChatLink(userId)`   | Private chat URL for a user.                    |

---

### Mutations

| Mutation                       | Description                                         |
|-------------------------------|----------------------------------------------------|
| `createGroup(name)`            | Create a new group chat room.                       |
| `leaveGroup(roomId)`           | Leave a group chat.                                 |
| `deleteGroup(roomId)`          | Delete a group (only by creator/admin).            |
| `joinGroup(name)`              | Join a group by its name.                           |
| `getOrCreateChat(username)`    | Get or create a 1:1 private chat with user.        |
| `signup(username, email, password)` | Register a new user.                             |
| `login(username, password)`   | Authenticate user and get JWT token.                |
| `updateProfile(bio, notificationsEnabled)` | Update user profile settings.             |
| `sendMessage(content, roomId, replyTo)` | Send a message if user is a room member.     |

---

### Subscriptions

| Subscription                 | Description                                      |
|------------------------------|-------------------------------------------------|
| `messageAdded(roomId)`        | Real-time updates for new messages in a room.  |

---

## 🗃️ Data Models Summary

### User Model
- **username** (String, required, unique)
- **email** (String, unique, optional)
- **passwordHash** (String, required)
- **bio** (String)
- **lastOnline** (Date)
- **isOnline** (Boolean, default: false)
- **role** (String: 'user' or 'admin', default: 'user')
- **contacts** (Array of User references)
- **notificationsEnabled** (Boolean, default: true)
- **emailVerified** (Boolean, default: false)

### Room Model
- **name** (String, required)
- **isGroup** (Boolean, default: false)
- **members** (Array of User references)
- **createdBy** (User reference)

### Message Model
- **content** (String, required)
- **sender** (User reference, required)
- **roomId** (Room reference, required)
- **readBy** (Array of User references)
- **replyTo** (Message reference)
- **status** (Enum: 'sent', 'delivered', 'read', default: 'sent')

---

## 🔐 Authentication Utilities (`auth.js`)

- **generateToken(user)**:  
  Generates a JWT with user id, username, role. Token expires in 7 days.

- **verifyToken(token)**:  
  Validates JWT and returns decoded payload or null if invalid/expired.

- **Constants**:  
  - `JWT_SECRET` — secret key for signing tokens (from env).  
  - Store securely in production (environment variables).

---

## 🛠️ To-Do / Improvement Guide

- [ ] Add rate limiting on mutations (e.g., sending messages) to prevent spam.  
- [ ] Implement email verification flows for signup users.  
- [ ] Add pagination support on `messages(roomId)` query.  
- [ ] Implement user presence tracking and broadcast via subscriptions.  
- [ ] Add roles/permissions beyond just 'creator' and 'member'.  
- [ ] Secure WebSocket connections with token expiration checks.  
- [ ] Add message edit and delete mutations with proper permissions.  
- [ ] Implement file/image attachments for messages.  
- [ ] Add testing for resolvers and subscription behavior.  
- [ ] Improve error handling with standardized error codes and messages.

---

## ⚙️ Environment Variables

```env
MONGO_URL=mongodb://127.0.0.1:27017/chat-app
PORT=4000

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d

FRONTEND_URL=http://localhost:3000
