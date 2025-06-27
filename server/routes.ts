import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { sendContactEmail } from "./email";
import { insertContactSchema, insertProjectSchema, insertMessageSchema, insertProjectUpdateSchema, insertProjectSubmissionSchema } from "@shared/schema";
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

  // Project submission from "Let's Work" form
  app.post("/api/project-submissions", async (req, res) => {
    try {
      // Handle incoming data with defaults for optional fields
      const projectSubmissionData = {
        name: req.body.name || "",
        email: req.body.email || "",
        phone: req.body.phone || null,
        companyName: req.body.companyName || null,
        projectTitle: req.body.projectTitle || "",
        projectType: req.body.projectType || "",
        description: req.body.description || "",
        budget: req.body.budget || "",
        timeline: req.body.timeline || "",
        website: req.body.website || null,
        additionalNotes: req.body.additionalNotes || null,
      };
      
      // Check if user is authenticated
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        // User is authenticated - create a proper project
        const userId = (req.user as any).claims.sub;
        
        const projectData = {
          clientId: userId,
          title: projectSubmissionData.projectTitle,
          description: projectSubmissionData.description,
          status: "pending",
          budget: projectSubmissionData.budget,
          timeline: projectSubmissionData.timeline,
          projectType: projectSubmissionData.projectType,
          websiteUrl: projectSubmissionData.website || null,
        };
        
        const project = await storage.createProject(projectData);
        
        res.json({
          success: true,
          message: "Project created successfully! You can now track its progress in your dashboard.",
          project: {
            id: project.id,
            title: project.title,
            status: project.status,
            createdAt: project.createdAt
          }
        });
      } else {
        // User not authenticated - store as submission for review
        const submission = await storage.createProjectSubmission(projectSubmissionData);

        res.json({
          success: true,
          message: "Project submitted successfully! We'll review your submission and get back to you within 24 hours.",
          submission: {
            id: submission.id,
            projectTitle: submission.projectTitle,
            createdAt: submission.createdAt
          }
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Project submission validation error:', error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error('Project submission error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit project. Please try again." 
        });
      }
    }
  });

  // Get all project submissions (admin only)
  app.get("/api/admin/project-submissions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const submissions = await storage.getProjectSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching project submissions:", error);
      res.status(500).json({ message: "Failed to fetch project submissions" });
    }
  });

  // Update project submission status (admin only)
  app.patch("/api/admin/project-submissions/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const submission = await storage.updateProjectSubmissionStatus(parseInt(id), status);
      res.json(submission);
    } catch (error) {
      console.error("Error updating project submission:", error);
      res.status(500).json({ message: "Failed to update project submission" });
    }
  });

  // Project request from authenticated client
  app.post("/api/project-request", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { projectType, budget, timeline, description, message } = req.body;
      
      // Create a contact entry for the project request
      const contactData = {
        name: req.user.claims.first_name && req.user.claims.last_name 
          ? `${req.user.claims.first_name} ${req.user.claims.last_name}`
          : req.user.claims.email?.split('@')[0] || 'User',
        email: req.user.claims.email || '',
        phone: '',
        preferredContact: 'email',
        project: projectType,
        budget: budget,
        message: message || description
      };

      const contact = await storage.createContact(contactData);
      
      // Send email notification to admin
      const emailSent = await sendContactEmail(contactData);
      
      res.json({ 
        success: true, 
        message: "Project request submitted successfully",
        contact,
        emailSent 
      });
    } catch (error) {
      console.error("Project request error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to submit project request" 
      });
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
      console.log("Creating project with data:", req.body);
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create project", error: error.message });
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

  // Admin routes - User management
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve users" });
    }
  });

  app.put("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
      const user = await storage.updateUser(userId, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const currentUserId = (req.user as any).claims.sub;
      
      // Prevent admin from deleting their own account
      if (userId === currentUserId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      await storage.deleteUser(userId);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
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

  // User profile update
  app.put("/api/users/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      const user = await storage.updateUser(userId, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Support request
  app.post("/api/support", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { subject, message, priority } = req.body;
      
      // Get user info for the support request
      const user = await storage.getUser(userId);
      
      // Create a contact entry for the support request
      const supportData = {
        name: user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        phone: '',
        preferredContact: 'email',
        project: `Support Request - ${priority?.toUpperCase() || 'MEDIUM'}`,
        budget: '',
        message: `Subject: ${subject}\n\nMessage: ${message}`
      };
      
      const contact = await storage.createContact(supportData);
      
      // Send email notification
      try {
        await sendContactEmail(supportData);
      } catch (emailError) {
        console.error("Failed to send support email:", emailError);
      }
      
      res.json({ success: true, message: "Support request submitted successfully" });
    } catch (error) {
      console.error("Error creating support request:", error);
      res.status(500).json({ message: "Failed to submit support request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}