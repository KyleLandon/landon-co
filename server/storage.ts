import {
  users,
  contacts,
  projects,
  messages,
  projectUpdates,
  projectSubmissions,
  projectFiles,
  contracts,
  invoices,
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
  type ProjectFile,
  type InsertProjectFile,
  type Contract,
  type InsertContract,
  type Invoice,
  type InsertInvoice,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Local application users and authorization data.
  getUser(id: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
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
  
  // Notification operations
  getRecentMessages(limit: number): Promise<any[]>;
  getRecentContacts(limit: number): Promise<Contact[]>;
  getRecentProjectSubmissions(limit: number): Promise<ProjectSubmission[]>;
  
  // File operations
  createProjectFile(file: InsertProjectFile): Promise<ProjectFile>;
  getProjectFiles(projectId: number): Promise<ProjectFile[]>;
  getProjectFile(fileId: number): Promise<ProjectFile | undefined>;
  deleteProjectFile(fileId: number): Promise<void>;
  updateProjectFileVisibility(fileId: number, isPublic: boolean): Promise<ProjectFile>;
  
  // Contract operations
  createContract(contract: InsertContract): Promise<Contract>;
  getProjectContracts(projectId: number): Promise<Contract[]>;
  getContract(contractId: number): Promise<Contract | undefined>;
  updateContract(contractId: number, updates: Partial<Contract>): Promise<Contract>;
  signContract(contractId: number, signedBy: string, signature: string, clientIp: string): Promise<Contract>;
  deleteContract(contractId: number): Promise<void>;
  
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getProjectInvoices(projectId: number): Promise<Invoice[]>;
  getInvoice(invoiceId: number): Promise<Invoice | undefined>;
  updateInvoice(invoiceId: number, updates: Partial<Invoice>): Promise<Invoice>;
  markInvoicePaid(invoiceId: number, paymentMethod: string, stripePaymentIntentId?: string): Promise<Invoice>;
  deleteInvoice(invoiceId: number): Promise<void>;
  generateInvoiceNumber(): string;
}

export class DatabaseStorage implements IStorage {
  // Local application users and authorization data.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
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

  // Notification operations
  async getRecentMessages(limit: number): Promise<any[]> {
    const result = await db
      .select({
        id: messages.id,
        projectId: messages.projectId,
        senderId: messages.senderId,
        message: messages.message,
        createdAt: messages.createdAt,
        projectTitle: projects.title,
        senderName: users.firstName
      })
      .from(messages)
      .leftJoin(projects, eq(messages.projectId, projects.id))
      .leftJoin(users, eq(messages.senderId, users.id))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
    
    return result;
  }

  async getRecentContacts(limit: number): Promise<Contact[]> {
    const result = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(limit);
    
    return result;
  }

  async getRecentProjectSubmissions(limit: number): Promise<ProjectSubmission[]> {
    const result = await db
      .select()
      .from(projectSubmissions)
      .orderBy(desc(projectSubmissions.createdAt))
      .limit(limit);
    
    return result;
  }

  // File operations
  async createProjectFile(insertFile: InsertProjectFile): Promise<ProjectFile> {
    const [file] = await db
      .insert(projectFiles)
      .values(insertFile)
      .returning();
    return file;
  }

  async getProjectFiles(projectId: number): Promise<ProjectFile[]> {
    return await db
      .select()
      .from(projectFiles)
      .where(eq(projectFiles.projectId, projectId))
      .orderBy(desc(projectFiles.createdAt));
  }

  async getProjectFile(fileId: number): Promise<ProjectFile | undefined> {
    const [file] = await db
      .select()
      .from(projectFiles)
      .where(eq(projectFiles.id, fileId));
    return file;
  }

  async deleteProjectFile(fileId: number): Promise<void> {
    await db.delete(projectFiles).where(eq(projectFiles.id, fileId));
  }

  async updateProjectFileVisibility(fileId: number, isPublic: boolean): Promise<ProjectFile> {
    const [file] = await db
      .update(projectFiles)
      .set({ isPublic })
      .where(eq(projectFiles.id, fileId))
      .returning();
    return file;
  }

  // Contract operations
  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db
      .insert(contracts)
      .values(insertContract)
      .returning();
    return contract;
  }

  async getProjectContracts(projectId: number): Promise<Contract[]> {
    const result = await db
      .select()
      .from(contracts)
      .where(eq(contracts.projectId, projectId))
      .orderBy(desc(contracts.createdAt));
    return result;
  }

  async getContract(contractId: number): Promise<Contract | undefined> {
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, contractId));
    return contract;
  }

  async updateContract(contractId: number, updates: Partial<Contract>): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async signContract(contractId: number, signedBy: string, signature: string, clientIp: string): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({
        status: "signed",
        signedBy,
        signature,
        clientIp,
        signedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(contracts.id, contractId))
      .returning();
    return contract;
  }

  async deleteContract(contractId: number): Promise<void> {
    await db.delete(contracts).where(eq(contracts.id, contractId));
  }

  // Invoice operations
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();
    return invoice;
  }

  async getProjectInvoices(projectId: number): Promise<Invoice[]> {
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.projectId, projectId))
      .orderBy(desc(invoices.createdAt));
    return result;
  }

  async getInvoice(invoiceId: number): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, invoiceId));
    return invoice;
  }

  async updateInvoice(invoiceId: number, updates: Partial<Invoice>): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(invoices.id, invoiceId))
      .returning();
    return invoice;
  }

  async markInvoicePaid(invoiceId: number, paymentMethod: string, stripePaymentIntentId?: string): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set({
        status: "paid",
        paidAt: new Date(),
        paymentMethod,
        stripePaymentIntentId,
        updatedAt: new Date()
      })
      .where(eq(invoices.id, invoiceId))
      .returning();
    return invoice;
  }

  async deleteInvoice(invoiceId: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, invoiceId));
  }

  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `INV-${year}${month}${day}-${timestamp}`;
  }
}

export const storage = new DatabaseStorage();