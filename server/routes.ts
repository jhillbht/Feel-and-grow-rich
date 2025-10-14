import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { openai, AI_MODEL, WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT } from "./openai";
import { sessionSchema, aiRequestSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import * as XLSX from "xlsx";
import PDFDocument from "pdfkit";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, userAssessments } from "./db/schema";
import { eq } from "drizzle-orm";
import { storage } from "./storage";
import { syncUserAssessmentToGHL, batchSyncRecentAssessments } from "./ghl";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth (OAuth)
  await setupAuth(app);

  // Auth Routes - Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Legacy endpoint for compatibility
  app.get("/api/auth/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // User Assessment (Session) Routes
  
  // Create session
  app.post("/api/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [newSession] = await db.insert(userAssessments).values({
        userId,
        intake: null,
        beliefMap: null,
        triangleShift: null,
        sixFears: null,
        feelingsDial: null,
        hillOverlay: null,
        daily10: null,
        aiInteractions: null,
      }).returning();

      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Get session by ID
  app.get("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      const [session] = await db.select()
        .from(userAssessments)
        .where(eq(userAssessments.id, req.params.id))
        .limit(1);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Update session
  app.patch("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Verify session belongs to user
      const [existing] = await db.select()
        .from(userAssessments)
        .where(eq(userAssessments.id, req.params.id))
        .limit(1);
      
      if (!existing) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const [updated] = await db.update(userAssessments)
        .set({
          ...req.body,
          updatedAt: new Date(),
        })
        .where(eq(userAssessments.id, req.params.id))
        .returning();

      // Immediate GHL sync: Update contact with assessment data
      const user = await storage.getUser(userId);
      if (user?.email) {
        syncUserAssessmentToGHL(user.email, updated).catch(err => {
          console.error("GHL sync error (non-blocking):", err);
        });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Delete session
  app.delete("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Verify session belongs to user
      const [existing] = await db.select()
        .from(userAssessments)
        .where(eq(userAssessments.id, req.params.id))
        .limit(1);
      
      if (!existing) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await db.delete(userAssessments)
        .where(eq(userAssessments.id, req.params.id));

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // AI Response endpoint
  app.post("/api/respond", isAuthenticated, async (req: any, res) => {
    try {
      const validation = aiRequestSchema.safeParse(req.body);
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        return res.status(400).json({ error: validationError.message });
      }

      const { context, question } = validation.data;
      const userId = req.user.claims.sub;

      const messages = [
        {
          role: "system" as const,
          content: WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT
        },
        {
          role: "user" as const,
          content: `Context about my journey:\n${JSON.stringify(context, null, 2)}\n\nMy question: ${question}`
        }
      ];

      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiResponse = response.choices[0]?.message?.content || "I'm here to support your wealth consciousness journey. Please try asking your question again.";

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Export Routes
  
  // Export as JSON
  app.get("/api/export/json", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = req.query.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const [session] = await db.select()
        .from(userAssessments)
        .where(eq(userAssessments.id, sessionId))
        .limit(1);

      if (!session || session.userId !== userId) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="wealth-journey-${sessionId}.json"`);
      res.send(JSON.stringify(session, null, 2));
    } catch (error) {
      console.error("Error exporting JSON:", error);
      res.status(500).json({ error: "Failed to export session" });
    }
  });

  // Export as Excel
  app.get("/api/export/excel", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = req.query.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const [session] = await db.select()
        .from(userAssessments)
        .where(eq(userAssessments.id, sessionId))
        .limit(1);

      if (!session || session.userId !== userId) {
        return res.status(404).json({ error: "Session not found" });
      }

      const workbook = XLSX.utils.book_new();

      // Intake worksheet
      if (session.intake) {
        const intakeData = session.intake as any;
        const intakeSheet = XLSX.utils.json_to_sheet([intakeData]);
        XLSX.utils.book_append_sheet(workbook, intakeSheet, "Intake");
      }

      // Belief Map worksheet
      if (session.beliefMap) {
        const beliefData = session.beliefMap as any;
        const beliefSheet = XLSX.utils.json_to_sheet([beliefData]);
        XLSX.utils.book_append_sheet(workbook, beliefSheet, "Belief Map");
      }

      // Triangle Shift worksheet
      if (session.triangleShift) {
        const triangleData = session.triangleShift as any;
        const triangleSheet = XLSX.utils.json_to_sheet([triangleData]);
        XLSX.utils.book_append_sheet(workbook, triangleSheet, "Triangle Shift");
      }

      // Six Fears worksheet
      if (session.sixFears) {
        const fearsData = session.sixFears as any;
        const fearsSheet = XLSX.utils.json_to_sheet([fearsData]);
        XLSX.utils.book_append_sheet(workbook, fearsSheet, "Six Fears");
      }

      // Feelings Dial worksheet
      if (session.feelingsDial) {
        const feelingsData = session.feelingsDial as any;
        const feelingsSheet = XLSX.utils.json_to_sheet([feelingsData]);
        XLSX.utils.book_append_sheet(workbook, feelingsSheet, "Feelings Dial");
      }

      // Hill Overlay worksheet
      if (session.hillOverlay) {
        const hillData = session.hillOverlay as any;
        const hillSheet = XLSX.utils.json_to_sheet([hillData]);
        XLSX.utils.book_append_sheet(workbook, hillSheet, "Hill Overlay");
      }

      // Daily 10 worksheet
      if (session.daily10) {
        const dailyData = session.daily10 as any;
        const dailySheet = XLSX.utils.json_to_sheet([dailyData]);
        XLSX.utils.book_append_sheet(workbook, dailySheet, "Daily 10");
      }

      // AI Interactions worksheet
      if (session.aiInteractions) {
        const aiData = session.aiInteractions as any;
        const aiSheet = XLSX.utils.json_to_sheet(Array.isArray(aiData) ? aiData : [aiData]);
        XLSX.utils.book_append_sheet(workbook, aiSheet, "AI Insights");
      }

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="wealth-journey-${sessionId}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      res.status(500).json({ error: "Failed to export session" });
    }
  });

  // Export as PDF
  app.get("/api/export/pdf", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const sessionId = req.query.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const [session] = await db.select()
        .from(userAssessments)
        .where(eq(userAssessments.id, sessionId))
        .limit(1);

      if (!session || session.userId !== userId) {
        return res.status(404).json({ error: "Session not found" });
      }

      const doc = new PDFDocument({ margin: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="wealth-journey-${sessionId}.pdf"`);
      
      doc.pipe(res);

      // Title
      doc.fontSize(24).font("Helvetica-Bold").text("Feel and Grow Rich", { align: "center" });
      doc.fontSize(14).font("Helvetica").text("Your Wealth Consciousness Journey", { align: "center" });
      doc.moveDown(2);

      // Intake
      if (session.intake) {
        const intake = session.intake as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Intake Assessment");
        doc.fontSize(12).font("Helvetica");
        doc.text(`Name: ${intake.fullName || "N/A"}`);
        doc.text(`Email: ${intake.email || "N/A"}`);
        doc.text(`Life Conditions: ${intake.lifeConditions || "N/A"}`);
        doc.text(`Patterns to Transform: ${intake.patternsToTransform || "N/A"}`);
        doc.moveDown();
      }

      // Belief Map
      if (session.beliefMap) {
        const beliefMap = session.beliefMap as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Belief Mapper");
        doc.fontSize(12).font("Helvetica");
        doc.text(`Events: ${beliefMap.events || "N/A"}`);
        doc.text(`Beliefs: ${beliefMap.beliefs || "N/A"}`);
        doc.text(`Patterns: ${beliefMap.patterns || "N/A"}`);
        doc.text(`Blocks: ${beliefMap.blocks || "N/A"}`);
        doc.moveDown();
      }

      // Triangle Shift
      if (session.triangleShift) {
        const triangle = session.triangleShift as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Triangle Shift");
        doc.fontSize(12).font("Helvetica");
        doc.text(`Victim Perspective: ${triangle.victimPerspective || "N/A"}`);
        doc.text(`Creator Perspective: ${triangle.creatorPerspective || "N/A"}`);
        doc.moveDown();
      }

      // Six Fears
      if (session.sixFears) {
        const fears = session.sixFears as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Six Fears Assessment");
        doc.fontSize(12).font("Helvetica");
        if (Array.isArray(fears.selectedFears)) {
          doc.text(`Selected Fears: ${fears.selectedFears.join(", ")}`);
        }
        doc.text(`Insights: ${fears.insights || "N/A"}`);
        doc.moveDown();
      }

      // Feelings Dial
      if (session.feelingsDial) {
        const feelings = session.feelingsDial as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Feelings Dial");
        doc.fontSize(12).font("Helvetica");
        doc.text(`Anger: ${feelings.anger || 0}/10`);
        doc.text(`Sadness: ${feelings.sadness || 0}/10`);
        doc.text(`Guilt: ${feelings.guilt || 0}/10`);
        doc.text(`Shame: ${feelings.shame || 0}/10`);
        doc.text(`Fear: ${feelings.fear || 0}/10`);
        doc.text(`Joy: ${feelings.joy || 0}/10`);
        doc.text(`Reflection: ${feelings.reflection || "N/A"}`);
        doc.moveDown();
      }

      // Hill Overlay
      if (session.hillOverlay) {
        const hill = session.hillOverlay as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Hill Overlay");
        doc.fontSize(12).font("Helvetica");
        doc.text(`Principle: ${hill.principle || "N/A"}`);
        doc.text(`Action: ${hill.action || "N/A"}`);
        doc.moveDown();
      }

      // Daily 10
      if (session.daily10) {
        const daily = session.daily10 as any;
        doc.fontSize(18).font("Helvetica-Bold").text("Daily 10");
        doc.fontSize(12).font("Helvetica");
        doc.text(`Prompts Completed: ${daily.prompts?.length || 0}`);
        if (Array.isArray(daily.prompts)) {
          daily.prompts.forEach((prompt: any, index: number) => {
            doc.text(`${index + 1}. ${prompt.question}: ${prompt.answer || "N/A"}`);
          });
        }
        doc.moveDown();
      }

      doc.end();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ error: "Failed to export session" });
    }
  });

  // GHL Batch Sync - Daily sync of all users with recent assessment updates
  app.post('/api/ghl/batch-sync', isAuthenticated, async (req, res) => {
    try {
      // This endpoint can be called by a cron job or scheduled task
      // Syncs all users with assessments updated in the last 24 hours
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const recentAssessments = await db.select({
        email: users.email,
        assessment: userAssessments,
      })
        .from(userAssessments)
        .innerJoin(users, eq(userAssessments.userId, users.id))
        .where(sql`${userAssessments.updatedAt} >= ${yesterday}`);

      // Filter out null emails and prepare data
      const usersToSync = recentAssessments
        .filter(item => item.email)
        .map(item => ({
          email: item.email!,
          assessment: item.assessment
        }));

      const result = await batchSyncRecentAssessments(usersToSync);

      res.json({
        message: "Batch sync completed",
        synced: usersToSync.length,
        ...result,
      });
    } catch (error) {
      console.error("Error in batch sync:", error);
      res.status(500).json({ error: "Batch sync failed" });
    }
  });

  // Kajabi Webhook - Auto-create accounts for course students
  app.post("/api/webhooks/kajabi", async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const [existingUser] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      
      if (existingUser) {
        console.log(`Kajabi webhook: User ${normalizedEmail} already exists`);
        return res.status(200).json({ 
          message: "User already exists",
          userId: existingUser.id 
        });
      }

      // Create placeholder user - ID will be updated to OAuth sub on first login
      const [firstName, ...lastNameParts] = (name || '').split(' ');
      const lastName = lastNameParts.join(' ');

      const [newUser] = await db.insert(users).values({
        email: normalizedEmail,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
        oauthSub: null, // Will be set on first OAuth login
      }).returning();

      console.log(`Kajabi webhook: Created placeholder user for ${normalizedEmail}`);

      res.status(201).json({
        message: "User created successfully - will be linked on first OAuth login",
        userId: newUser.id,
        email: newUser.email,
        note: "User should sign in via OAuth (Google, GitHub, etc.) to complete account setup"
      });
    } catch (error) {
      console.error("Kajabi webhook error:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
