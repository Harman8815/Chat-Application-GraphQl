// shared/schema.ts
export interface User {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  isOnline?: boolean;
  lastOnline?: string;
  role?: string;
  contacts?: User[];
  notificationsEnabled?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  name: string;
  isGroup?: boolean;
  members: User[];
  createdBy?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  content?: string;
  sender: User;
  roomId: Room;
  readBy?: User[];
  replyTo?: Message;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}
