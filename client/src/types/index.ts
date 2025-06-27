// Shared types for the application
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: "admin" | "client";
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  clientId: string;
  title: string;
  description?: string;
  status: "inquiry" | "proposal" | "active" | "completed" | "cancelled";
  budget?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  projectId: number;
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ProjectUpdate {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  preferredContact?: string;
  project?: string;
  budget?: string;
  message: string;
  responded?: boolean;
  createdAt: Date;
}