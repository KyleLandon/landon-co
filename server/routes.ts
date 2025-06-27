import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { sendContactEmail } from "./email";
import { insertContactSchema, insertProjectSchema, insertMessageSchema, insertProjectUpdateSchema, insertProjectSubmissionSchema, insertProjectFileSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Store connected clients by project ID for WebSocket broadcasting
  const projectConnections = new Map<number, Set<WebSocket>>();
  
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    }
  });
  
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

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
      console.log("Project submission received:", req.body);
      
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
      
      console.log("Processed submission data:", projectSubmissionData);
      
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
        console.log("Creating project submission for unauthenticated user");
        
        // Validate the submission data
        const validatedSubmissionData = insertProjectSubmissionSchema.parse(projectSubmissionData);
        console.log("Validated submission data:", validatedSubmissionData);
        
        const submission = await storage.createProjectSubmission(validatedSubmissionData);
        console.log("Project submission created successfully:", submission.id);

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

  // Convert project submission to actual project (admin only)
  app.post("/api/admin/project-submissions/:id/convert", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const submissions = await storage.getProjectSubmissions();
      const submission = submissions.find((s: any) => s.id === submissionId);
      
      if (!submission) {
        return res.status(404).json({ message: "Project submission not found" });
      }

      // Check if user exists by email, create if not
      const existingUsers = await storage.getAllUsers();
      let clientUser = existingUsers.find((u: any) => u.email === submission.email);
      
      if (!clientUser) {
        // Create a new user account for the client
        clientUser = await storage.upsertUser({
          id: `temp_${Date.now()}`, // Temporary ID until they authenticate
          email: submission.email,
          firstName: submission.name?.split(' ')[0] || null,
          lastName: submission.name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: null,
          role: 'client'
        });
      }
      
      const clientId = clientUser.id;

      // Create project data from submission
      const projectData = {
        clientId: clientId,
        title: submission.projectTitle || `${submission.projectType} Project`,
        description: submission.description || `${submission.projectType} project for ${submission.name}`,
        status: "proposal",
        budget: submission.budget ? submission.budget.replace(/\D/g, '') : null,
        startDate: null,
        endDate: null,
      };

      console.log("Converting submission to project:", projectData);
      const project = await storage.createProject(projectData);
      
      // Update submission status
      await storage.updateProjectSubmissionStatus(submissionId, "converted");
      
      res.json({ project, message: "Project created successfully from submission" });
    } catch (error) {
      console.error("Error converting submission to project:", error);
      res.status(500).json({ message: "Failed to convert submission to project" });
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
      
      // Create an actual project for the authenticated user
      const projectTitle = `${projectType} Project`;
      const projectDescription = description || message || `New ${projectType} project request`;
      
      const projectData = {
        clientId: userId,
        title: projectTitle,
        description: projectDescription,
        status: "inquiry",
        budget: budget && budget !== "discuss" ? budget.replace(/\D/g, '') : null,
        startDate: null,
        endDate: null,
      };

      console.log("Creating project for authenticated user:", projectData);
      const project = await storage.createProject(projectData);
      
      // Also create a contact entry for record keeping
      const contactData = {
        name: req.user.claims.first_name && req.user.claims.last_name 
          ? `${req.user.claims.first_name} ${req.user.claims.last_name}`
          : req.user.claims.email?.split('@')[0] || 'User',
        email: req.user.claims.email || '',
        phone: '',
        preferredContact: 'email',
        project: projectType,
        budget: budget,
        message: `Project created: ${projectTitle}\n\n${projectDescription}`
      };

      const contact = await storage.createContact(contactData);
      
      // Send email notification to admin
      try {
        await sendContactEmail(contactData);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
      
      res.json({ 
        success: true, 
        message: "Project created successfully",
        project,
        contact
      });
    } catch (error) {
      console.error("Project request error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create project" 
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
      
      // Prepare data with defaults for optional fields
      const projectData = {
        clientId: req.body.clientId,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || "inquiry",
        budget: req.body.budget ? req.body.budget.toString() : null,
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null,
      };
      
      console.log("Prepared project data:", projectData);
      const validatedData = insertProjectSchema.parse(projectData);
      console.log("Validated data:", validatedData);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Failed to create project", error: errorMessage });
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
      const { message, replyTo } = req.body;

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
        message: message || "",
        replyTo: replyTo ? parseInt(replyTo) : undefined
      });

      // Broadcast new message to all connected clients for this project
      const connections = projectConnections.get(projectId);
      if (connections) {
        const messageWithUser = {
          ...newMessage,
          senderName: user?.firstName || user?.email || 'Unknown User'
        };
        
        connections.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'message-received',
              message: messageWithUser
            }));
          }
        });
      }

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

  // Update project update status (admin only)
  app.patch("/api/project-updates/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updateId = parseInt(req.params.id);
      const { isCompleted } = req.body;
      
      const update = await storage.updateProjectUpdateStatus(updateId, isCompleted);
      res.json(update);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project update status" });
    }
  });

  // Delete project update (admin only)
  app.delete("/api/project-updates/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updateId = parseInt(req.params.id);
      // For now, return success - can implement actual deletion later
      res.json({ message: "Project update deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project update" });
    }
  });

  // Update project (PATCH for admin project editing)
  app.patch("/api/projects/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = req.body;
      
      // Convert date strings to Date objects if provided
      if (updates.startDate) {
        updates.startDate = new Date(updates.startDate);
      }
      if (updates.endDate) {
        updates.endDate = new Date(updates.endDate);
      }
      
      const project = await storage.updateProject(projectId, updates);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Get user by ID (for admin project detail page)
  app.get("/api/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Contract Management Routes
  app.post("/api/projects/:id/contracts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = (req.user as any).claims.sub;
      const contractData = { ...req.body, projectId, createdBy: userId };
      
      const contract = await storage.createContract(contractData);
      res.json(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.get("/api/projects/:id/contracts", isAuthenticated, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const contracts = await storage.getProjectContracts(projectId);
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", isAuthenticated, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.patch("/api/contracts/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.updateContract(contractId, req.body);
      res.json(contract);
    } catch (error) {
      console.error("Error updating contract:", error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  app.post("/api/contracts/:id/sign", isAuthenticated, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const userId = (req.user as any).claims.sub;
      const { signature } = req.body;
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      
      const contract = await storage.signContract(contractId, userId, signature, clientIp);
      res.json(contract);
    } catch (error) {
      console.error("Error signing contract:", error);
      res.status(500).json({ message: "Failed to sign contract" });
    }
  });

  app.delete("/api/contracts/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      await storage.deleteContract(contractId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contract:", error);
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Invoice Management Routes
  app.post("/api/projects/:id/invoices", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = (req.user as any).claims.sub;
      const invoiceNumber = storage.generateInvoiceNumber();
      const invoiceData = { 
        ...req.body, 
        projectId, 
        createdBy: userId, 
        invoiceNumber 
      };
      
      const invoice = await storage.createInvoice(invoiceData);
      res.json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.get("/api/projects/:id/invoices", isAuthenticated, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const invoices = await storage.getProjectInvoices(projectId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.patch("/api/invoices/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.updateInvoice(invoiceId, req.body);
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  app.post("/api/invoices/:id/payment", isAuthenticated, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const { paymentMethod, stripePaymentIntentId } = req.body;
      
      const invoice = await storage.markInvoicePaid(invoiceId, paymentMethod, stripePaymentIntentId);
      res.json(invoice);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  app.delete("/api/invoices/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      await storage.deleteInvoice(invoiceId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Mark message as read (admin and client)
  app.patch("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      await storage.markMessageAsRead(messageId);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // File upload routes
  app.post("/api/projects/:id/files", isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = (req.user as any)?.claims?.sub;
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        projectId,
        uploadedBy: userId,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        filePath: req.file.path,
        fileCategory: req.body.category || "general",
        description: req.body.description || "",
        isPublic: req.body.isPublic === "true",
      };

      const validatedData = insertProjectFileSchema.parse(fileData);
      const file = await storage.createProjectFile(validatedData);
      
      res.json(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid file data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to upload file" });
      }
    }
  });

  // Get project files
  app.get("/api/projects/:id/files", isAuthenticated, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = (req.user as any)?.claims?.sub;
      const userRole = (req.user as any)?.claims?.role;
      
      let files = await storage.getProjectFiles(projectId);
      
      // Filter files based on user role and visibility
      if (userRole !== "admin") {
        files = files.filter(file => file.isPublic || file.uploadedBy === userId);
      }
      
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Download file
  app.get("/api/files/:id/download", isAuthenticated, async (req, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const userId = (req.user as any)?.claims?.sub;
      const userRole = (req.user as any)?.claims?.role;
      
      const file = await storage.getProjectFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Check file access permissions
      if (userRole !== "admin" && !file.isPublic && file.uploadedBy !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.download(file.filePath, file.originalName);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Delete file (admin or uploader only)
  app.delete("/api/files/:id", isAuthenticated, async (req, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const userId = (req.user as any)?.claims?.sub;
      const userRole = (req.user as any)?.claims?.role;
      
      const file = await storage.getProjectFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Check delete permissions (admin or uploader)
      if (userRole !== "admin" && file.uploadedBy !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Delete file from filesystem
      try {
        await fs.promises.unlink(file.filePath);
      } catch (fsError) {
        console.log("File already deleted from filesystem");
      }
      
      await storage.deleteProjectFile(fileId);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Update file visibility (admin only)
  app.patch("/api/files/:id/visibility", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const { isPublic } = req.body;
      
      const file = await storage.updateProjectFileVisibility(fileId, isPublic);
      res.json(file);
    } catch (error) {
      console.error("Error updating file visibility:", error);
      res.status(500).json({ message: "Failed to update file visibility" });
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

  // Get unread message count for admin notifications
  app.get("/api/admin/unread-count", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const unreadCount = await storage.getUnreadMessagesCount(userId);
      res.json(unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  // Get recent activity for admin notifications
  app.get("/api/admin/recent-activity", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      // Get recent messages, contacts, and project submissions
      const recentMessages = await storage.getRecentMessages(10);
      const recentContacts = await storage.getRecentContacts(5);
      const recentSubmissions = await storage.getRecentProjectSubmissions(5);
      
      // Combine and sort by timestamp
      const activities = [
        ...recentMessages.map(msg => ({
          ...msg,
          type: 'message',
          createdAt: msg.createdAt
        })),
        ...recentContacts.map(contact => ({
          ...contact,
          type: 'contact',
          createdAt: contact.createdAt
        })),
        ...recentSubmissions.map(submission => ({
          ...submission,
          type: 'submission',
          createdAt: submission.createdAt
        }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
       .slice(0, 15); // Keep most recent 15 items
      
      res.json(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'join-project') {
          const projectId = parseInt(data.projectId);
          if (!projectConnections.has(projectId)) {
            projectConnections.set(projectId, new Set());
          }
          projectConnections.get(projectId)?.add(ws);
          console.log(`Client joined project ${projectId}`);
        }
        
        if (data.type === 'new-message') {
          const projectId = parseInt(data.projectId);
          // Broadcast to all clients connected to this project
          const connections = projectConnections.get(projectId);
          if (connections) {
            connections.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'message-received',
                  message: data.message
                }));
              }
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove from all project connections
      projectConnections.forEach(connections => {
        connections.delete(ws);
      });
      console.log('WebSocket connection closed');
    });
  });
  
  return httpServer;
}