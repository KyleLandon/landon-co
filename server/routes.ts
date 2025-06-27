import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { sendContactEmail } from "./email";
import { insertContactSchema, insertProjectSchema, insertMessageSchema, insertProjectUpdateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Contact form submission (public)
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      // Store contact in database
      const contact = await storage.createContact(validatedData);
      
      // Send email notification
      const emailSent = await sendContactEmail({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        preferredContact: validatedData.preferredContact || '',
        project: validatedData.project || '',
        budget: validatedData.budget || '',
        message: validatedData.message
      });
      
      if (!emailSent) {
        console.error('Failed to send email notification for contact:', contact.id);
      }
      
      res.json({ 
        success: true, 
        message: emailSent 
          ? "Thank you for your message! I'll get back to you within 24 hours."
          : "Message received! I'll get back to you within 24 hours.",
        contact: {
          id: contact.id,
          name: contact.name,
          createdAt: contact.createdAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error('Contact form error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message. Please try again." 
        });
      }
    }
  });

  // Admin routes - Contacts management
  app.get("/api/admin/contacts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve contacts" 
      });
    }
  });

  // Admin routes - Projects management
  app.get("/api/admin/projects", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve projects" });
    }
  });

  app.post("/api/admin/projects", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  app.put("/api/admin/projects/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = req.body;
      const project = await storage.updateProject(projectId, updates);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Client routes - My projects
  app.get("/api/my-projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjectsByClient(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve projects" });
    }
  });

  // Get specific project details
  app.get("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = await storage.getUser(userId);
      if (project.clientId !== userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve project" });
    }
  });

  // Project routes - Messages
  app.get("/api/projects/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify user has access to this project
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = await storage.getUser(userId);
      if (project.clientId !== userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const messages = await storage.getMessagesByProject(projectId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });

  app.post("/api/projects/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { message } = req.body;

      // Verify user has access to this project
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = await storage.getUser(userId);
      if (project.clientId !== userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const newMessage = await storage.createMessage({
        projectId,
        senderId: userId,
        message
      });

      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Project updates routes
  app.get("/api/projects/:id/updates", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify user has access to this project
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const user = await storage.getUser(userId);
      if (project.clientId !== userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const updates = await storage.getProjectUpdates(projectId);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve project updates" });
    }
  });

  app.post("/api/projects/:id/updates", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const validatedData = insertProjectUpdateSchema.parse({
        ...req.body,
        projectId
      });
      
      const update = await storage.createProjectUpdate(validatedData);
      res.json(update);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create project update" });
      }
    }
  });

  // Dashboard stats for admin
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const [allProjects, allContacts] = await Promise.all([
        storage.getAllProjects(),
        storage.getContacts()
      ]);

      const stats = {
        totalProjects: allProjects.length,
        activeProjects: allProjects.filter(p => p.status === 'active').length,
        totalContacts: allContacts.length,
        recentContacts: allContacts.slice(0, 5),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}