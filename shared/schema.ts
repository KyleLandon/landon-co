import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with role-based access
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("client"), // "admin", "client"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table for tracking client work
export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: varchar("client_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("inquiry"), // "inquiry", "proposal", "active", "completed", "cancelled"
  budget: decimal("budget", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table for client-admin communication
export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  replyTo: integer("reply_to"),
  attachments: text("attachments"), // JSON string of attachments
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project updates/milestones
export const projectUpdates = pgTable("project_updates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  title: varchar("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact form submissions (existing)
export const contacts = pgTable("contacts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  preferredContact: varchar("preferred_contact"),
  project: varchar("project").notNull(),
  budget: varchar("budget"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project submissions from "Let's Work" form
export const projectSubmissions = pgTable("project_submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  companyName: varchar("company_name"),
  projectTitle: varchar("project_title").notNull(),
  projectType: varchar("project_type").notNull(),
  description: text("description").notNull(),
  budget: varchar("budget").notNull(),
  timeline: varchar("timeline").notNull(),
  website: varchar("website"),
  additionalNotes: text("additional_notes"),
  status: varchar("status").default("pending"), // pending, reviewed, converted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Project files for file sharing and storage
export const projectFiles = pgTable("project_files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  filePath: varchar("file_path").notNull(),
  fileCategory: varchar("file_category").default("general").notNull(), // general, asset, deliverable, reference
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(), // visible to client
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contracts for digital signing
export const contracts = pgTable("contracts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  terms: text("terms"),
  totalAmount: varchar("total_amount"), // Using varchar for flexibility with currency formatting
  status: varchar("status").default("draft").notNull(), // draft, sent, signed, completed, cancelled
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  signedBy: varchar("signed_by").references(() => users.id),
  signedAt: timestamp("signed_at"),
  signature: text("signature"), // Base64 encoded signature
  clientIp: varchar("client_ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Invoices with payment processing
export const invoices = pgTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  contractId: integer("contract_id").references(() => contracts.id),
  invoiceNumber: varchar("invoice_number").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  items: jsonb("items").notNull(), // Array of {description, quantity, rate, amount}
  subtotal: varchar("subtotal").notNull(), // Using varchar for currency formatting
  taxRate: varchar("tax_rate").default("0"),
  taxAmount: varchar("tax_amount").default("0"),
  totalAmount: varchar("total_amount").notNull(),
  status: varchar("status").default("draft").notNull(), // draft, sent, paid, overdue, cancelled
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  paymentMethod: varchar("payment_method"), // stripe, bank_transfer, etc.
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  sentMessages: many(messages),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, {
    fields: [projects.clientId],
    references: [users.id],
  }),
  messages: many(messages),
  updates: many(projectUpdates),
  files: many(projectFiles),
  contracts: many(contracts),
  invoices: many(invoices),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  project: one(projects, {
    fields: [messages.projectId],
    references: [projects.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, {
    fields: [projectUpdates.projectId],
    references: [projects.id],
  }),
}));

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
  uploader: one(users, {
    fields: [projectFiles.uploadedBy],
    references: [users.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  project: one(projects, {
    fields: [contracts.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [contracts.createdBy],
    references: [users.id],
  }),
  signer: one(users, {
    fields: [contracts.signedBy],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
  contract: one(contracts, {
    fields: [invoices.contractId],
    references: [contracts.id],
  }),
  creator: one(users, {
    fields: [invoices.createdBy],
    references: [users.id],
  }),
}));

// Schema validation
export const upsertUserSchema = createInsertSchema(users);

export const insertProjectSchema = createInsertSchema(projects).pick({
  clientId: true,
  title: true,
  description: true,
  status: true,
  budget: true,
  startDate: true,
  endDate: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  projectId: true,
  senderId: true,
  message: true,
  replyTo: true,
  attachments: true,
});

export const insertProjectUpdateSchema = createInsertSchema(projectUpdates).pick({
  projectId: true,
  title: true,
  description: true,
  isCompleted: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  phone: true,
  preferredContact: true,
  project: true,
  budget: true,
  message: true,
});

export const insertProjectSubmissionSchema = createInsertSchema(projectSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  companyName: true,
  projectTitle: true,
  projectType: true,
  description: true,
  budget: true,
  timeline: true,
  website: true,
  additionalNotes: true,
});

export const insertProjectFileSchema = createInsertSchema(projectFiles).pick({
  projectId: true,
  uploadedBy: true,
  fileName: true,
  originalName: true,
  fileSize: true,
  mimeType: true,
  filePath: true,
  fileCategory: true,
  description: true,
  isPublic: true,
});

export const insertContractSchema = createInsertSchema(contracts).pick({
  projectId: true,
  title: true,
  description: true,
  content: true,
  terms: true,
  totalAmount: true,
  createdBy: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  projectId: true,
  contractId: true,
  invoiceNumber: true,
  title: true,
  description: true,
  items: true,
  subtotal: true,
  taxRate: true,
  taxAmount: true,
  totalAmount: true,
  dueDate: true,
  createdBy: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertProjectUpdate = z.infer<typeof insertProjectUpdateSchema>;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertProjectSubmission = z.infer<typeof insertProjectSubmissionSchema>;
export type ProjectSubmission = typeof projectSubmissions.$inferSelect;
export type InsertProjectFile = z.infer<typeof insertProjectFileSchema>;
export type ProjectFile = typeof projectFiles.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;