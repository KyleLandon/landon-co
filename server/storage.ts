import {
  users,
  contacts,
  projects,
  messages,
  projectUpdates,
  projectSubmissions,
  type User,
  type UpsertUser,
  type Contact,
  type InsertContact,
  type Project,
  type InsertProject,
  type Message,
  type InsertMessage,
  type ProjectUpdate,
  type InsertProjectUpdate,
  type ProjectSubmission,
  type InsertProjectSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT - mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Project submission operations
  createProjectSubmission(submission: InsertProjectSubmission): Promise<ProjectSubmission>;
  getProjectSubmissions(): Promise<ProjectSubmission[]>;
  updateProjectSubmissionStatus(id: number, status: string): Promise<ProjectSubmission>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjectsByClient(clientId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByProject(projectId: number): Promise<Message[]>;
  markMessageAsRead(messageId: number): Promise<void>;
  getUnreadMessagesCount(userId: string): Promise<number>;
  
  // Project update operations
  createProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate>;
  getProjectUpdates(projectId: number): Promise<ProjectUpdate[]>;
  updateProjectUpdateStatus(id: number, isCompleted: boolean): Promise<ProjectUpdate>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT - mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  // Project submission operations
  async createProjectSubmission(insertSubmission: InsertProjectSubmission): Promise<ProjectSubmission> {
    const [submission] = await db
      .insert(projectSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getProjectSubmissions(): Promise<ProjectSubmission[]> {
    return await db.select().from(projectSubmissions).orderBy(desc(projectSubmissions.createdAt));
  }

  async updateProjectSubmissionStatus(id: number, status: string): Promise<ProjectSubmission> {
    const [submission] = await db
      .update(projectSubmissions)
      .set({ status })
      .where(eq(projectSubmissions.id, id))
      .returning();
    return submission;
  }

  // Project operations
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessagesByProject(projectId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.projectId, projectId))
      .orderBy(messages.createdAt);
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  async getUnreadMessagesCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: messages.id })
      .from(messages)
      .innerJoin(projects, eq(messages.projectId, projects.id))
      .where(
        and(
          eq(projects.clientId, userId),
          eq(messages.isRead, false)
        )
      );
    return result.length;
  }

  // Project update operations
  async createProjectUpdate(insertUpdate: InsertProjectUpdate): Promise<ProjectUpdate> {
    const [update] = await db
      .insert(projectUpdates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    return await db
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.projectId, projectId))
      .orderBy(projectUpdates.createdAt);
  }

  async updateProjectUpdateStatus(id: number, isCompleted: boolean): Promise<ProjectUpdate> {
    const [update] = await db
      .update(projectUpdates)
      .set({ isCompleted })
      .where(eq(projectUpdates.id, id))
      .returning();
    return update;
  }
}

export const storage = new DatabaseStorage();