export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'project' | 'user'; // 'project' is global/admin, 'user' is private
  createdAt: number;
}

export interface UserSettings {
  contextHistoryLimit: number; // Number of past messages to include
  useProjectKnowledge: boolean;
  useUserKnowledge: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  isAdmin: boolean;
}