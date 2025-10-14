import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai, AI_MODEL, WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT } from "./openai";
import { sessionSchema, aiResponseSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import * as XLSX from "xlsx";
import PDFDocument from "pdfkit";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, sessions as sessionsTable } from "./db/schema";
import { eq } from "drizzle-orm";

// Auth validation schemas
const signupSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const signinSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  
  // Sign up
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validation = signupSchema.safeParse(req.body);
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        return res.status(400).json({ error: validationError.message });
      }

      const { email, password, name } = validation.data;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name: name || null,
      }).returning();

      // Set session and save explicitly
      req.session.userId = newUser.id;
      
      // Save session before responding
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.status(201).json({ 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name 
      });
    } catch (error) {
      console.error("Error during sign up:", error);
      
      // Check if it's a database constraint error
      if (error instanceof Error && error.message.includes('unique')) {
        return res.status(409).json({ error: "User already exists" });
      }
      
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Sign in
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const validation = signinSchema.safeParse(req.body);
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        return res.status(400).json({ error: validationError.message });
      }

      const { email, password } = validation.data;

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;

      res.json({ 
        id: user.id, 
        email: user.email, 
        name: user.name 
      });
    } catch (error) {
      console.error("Error during sign in:", error);
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  // Sign out
  app.post("/api/auth/signout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during sign out:", err);
        return res.status(500).json({ error: "Failed to sign out" });
      }
      res.status(204).send();
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        id: user.id, 
        email: user.email, 
        name: user.name 
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Kajabi Webhook - Auto-create accounts for course enrollments
  app.post("/api/webhooks/kajabi", async (req, res) => {
    try {
      const { name, email, external_user_id } = req.body;

      // Validate required fields from Kajabi
      if (!email) {
        return res.status(400).json({ error: "Email is required from Kajabi webhook" });
      }

      console.log(`Kajabi webhook received for: ${email}`);

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
      
      if (existingUser.length > 0) {
        console.log(`User already exists: ${email}`);
        return res.status(200).json({ 
          message: "User already has access",
          userId: existingUser[0].id 
        });
      }

      // Generate a secure random password (12 characters)
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create new user account
      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name || null,
      }).returning();

      console.log(`Auto-created account for Kajabi student: ${email}`);

      // TODO: Send welcome email with login credentials
      // For now, log the temporary password (in production, email this to the user)
      console.log(`Temporary password for ${email}: ${tempPassword}`);

      res.status(201).json({ 
        message: "Account created successfully",
        userId: newUser.id,
        email: newUser.email,
        // NOTE: Remove tempPassword from response in production - only email it
        tempPassword: tempPassword 
      });
    } catch (error) {
      console.error("Kajabi webhook error:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  // Session Routes - Database-based
  
  // Get all sessions for current user
  app.get("/api/sessions", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const userSessions = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.userId, req.session.userId));
      
      res.json(userSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Get single session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const [session] = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, req.params.id))
        .limit(1);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Verify session belongs to user
      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Create session for current user
  app.post("/api/sessions", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const [newSession] = await db.insert(sessionsTable).values({
        userId: req.session.userId,
        ...req.body,
      }).returning();

      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Update session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Verify session belongs to user
      const [existing] = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, req.params.id))
        .limit(1);
      
      if (!existing) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (existing.userId !== req.session.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const [updated] = await db.update(sessionsTable)
        .set({
          ...req.body,
          updatedAt: new Date(),
        })
        .where(eq(sessionsTable.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Delete session
  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Verify session belongs to user
      const [existing] = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, req.params.id))
        .limit(1);
      
      if (!existing) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (existing.userId !== req.session.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await db.delete(sessionsTable)
        .where(eq(sessionsTable.id, req.params.id));

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // AI Response endpoint
  app.post("/api/respond", async (req, res) => {
    try {
      const { sessionState, prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const userMessage = `
Session Context:
${JSON.stringify(sessionState, null, 2)}

User Question/Reflection:
${prompt}

Please provide wealth consciousness guidance in JSON format.`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: "system", content: WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const aiResponse = JSON.parse(responseContent);
      const validated = aiResponseSchema.parse(aiResponse);
      
      res.json(validated);
    } catch (error) {
      console.error("Error generating AI response:", error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Export as JSON
  app.get("/api/export/json", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      const exportData = {
        exportDate: new Date().toISOString(),
        sessionCount: sessions.length,
        sessions,
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="feel-and-grow-rich-export-${Date.now()}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error("Error exporting JSON:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // Export as Excel
  app.get("/api/export/excel", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = sessions.map(session => ({
        "Session ID": session.id,
        "Created": new Date(session.createdAt).toLocaleDateString(),
        "Updated": new Date(session.updatedAt).toLocaleDateString(),
        "Name": session.intake?.name || "N/A",
        "Has Intake": session.intake ? "Yes" : "No",
        "Has Belief Map": session.beliefMap ? "Yes" : "No",
        "Has Triangle Shift": session.triangleShift ? "Yes" : "No",
        "Has Six Fears": session.sixFears ? "Yes" : "No",
        "Has Feelings Dial": session.feelingsDial ? "Yes" : "No",
        "Has Hill Overlay": session.hillOverlay ? "Yes" : "No",
        "Has Daily 10": session.daily10 ? "Yes" : "No",
      }));
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

      // Intake data sheet
      const intakeData = sessions
        .filter(s => s.intake)
        .map(s => ({
          "Session ID": s.id,
          "Name": s.intake!.name,
          "Birth Date": s.intake!.birthDate || "N/A",
          "Birth Time": s.intake!.birthTime || "N/A",
          "Birth Place": s.intake!.birthPlace || "N/A",
          "Conditions of Life": s.intake!.conditionsOfLife,
          "Loop to Break": s.intake!.loopToBreak,
        }));
      if (intakeData.length > 0) {
        const intakeSheet = XLSX.utils.json_to_sheet(intakeData);
        XLSX.utils.book_append_sheet(wb, intakeSheet, "Intake");
      }

      // Feelings data sheet
      const feelingsData = sessions
        .filter(s => s.feelingsDial)
        .map(s => ({
          "Session ID": s.id,
          "Anger": s.feelingsDial!.emotions.anger,
          "Sadness": s.feelingsDial!.emotions.sadness,
          "Guilt": s.feelingsDial!.emotions.guilt,
          "Shame": s.feelingsDial!.emotions.shame,
          "Fear": s.feelingsDial!.emotions.fear,
          "Joy": s.feelingsDial!.emotions.joy,
          "Reflections": s.feelingsDial!.reflections || "N/A",
        }));
      if (feelingsData.length > 0) {
        const feelingsSheet = XLSX.utils.json_to_sheet(feelingsData);
        XLSX.utils.book_append_sheet(wb, feelingsSheet, "Feelings");
      }

      // Belief Map data sheet
      const beliefMapData = sessions
        .filter(s => s.beliefMap?.items && s.beliefMap.items.length > 0)
        .flatMap(s => s.beliefMap!.items.map(item => ({
          "Session ID": s.id,
          "Type": item.type,
          "Content": item.content,
          "Connected To": item.connectedTo?.join(", ") || "None",
        })));
      if (beliefMapData.length > 0) {
        const beliefMapSheet = XLSX.utils.json_to_sheet(beliefMapData);
        XLSX.utils.book_append_sheet(wb, beliefMapSheet, "Belief Map");
      }

      // Triangle Shift data sheet
      const triangleData = sessions
        .filter(s => s.triangleShift)
        .map(s => ({
          "Session ID": s.id,
          "Current Role": s.triangleShift!.currentRole,
          "Situation": s.triangleShift!.situation,
          "Transformed Role": s.triangleShift!.transformedRole,
          "New Perspective": s.triangleShift!.newPerspective || "N/A",
        }));
      if (triangleData.length > 0) {
        const triangleSheet = XLSX.utils.json_to_sheet(triangleData);
        XLSX.utils.book_append_sheet(wb, triangleSheet, "Triangle Shift");
      }

      // Six Fears data sheet
      const fearsData = sessions
        .filter(s => s.sixFears?.fears && s.sixFears.fears.length > 0)
        .map(s => ({
          "Session ID": s.id,
          "Identified Fears": s.sixFears!.fears.join(", "),
          "Notes": s.sixFears!.notes ? Object.entries(s.sixFears!.notes).map(([k,v]) => `${k}: ${v}`).join("; ") : "N/A",
        }));
      if (fearsData.length > 0) {
        const fearsSheet = XLSX.utils.json_to_sheet(fearsData);
        XLSX.utils.book_append_sheet(wb, fearsSheet, "Six Fears");
      }

      // Hill Overlay data sheet
      const hillData = sessions
        .filter(s => s.hillOverlay)
        .map(s => ({
          "Session ID": s.id,
          "Principle": s.hillOverlay!.principle,
          "Micro Action": s.hillOverlay!.microAction,
          "Commitment": s.hillOverlay!.commitment || "N/A",
        }));
      if (hillData.length > 0) {
        const hillSheet = XLSX.utils.json_to_sheet(hillData);
        XLSX.utils.book_append_sheet(wb, hillSheet, "Hill Overlay");
      }

      // Daily 10 data sheet
      const daily10Data = sessions
        .filter(s => s.daily10)
        .map(s => ({
          "Session ID": s.id,
          "Prompt 1": s.daily10!.prompt1 || "N/A",
          "Prompt 2": s.daily10!.prompt2 || "N/A",
          "Prompt 3": s.daily10!.prompt3 || "N/A",
          "Prompt 4": s.daily10!.prompt4 || "N/A",
          "Prompt 5": s.daily10!.prompt5 || "N/A",
          "Duration (seconds)": s.daily10!.duration || "N/A",
          "Completed At": s.daily10!.completedAt ? new Date(s.daily10!.completedAt).toLocaleString() : "N/A",
        }));
      if (daily10Data.length > 0) {
        const daily10Sheet = XLSX.utils.json_to_sheet(daily10Data);
        XLSX.utils.book_append_sheet(wb, daily10Sheet, "Daily 10");
      }

      // Generate buffer
      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="feel-and-grow-rich-export-${Date.now()}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // Export as PDF
  app.get("/api/export/pdf", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      const doc = new PDFDocument({ margin: 50, size: 'LETTER' });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="feel-and-grow-rich-export-${Date.now()}.pdf"`);
      
      // Pipe PDF to response
      doc.pipe(res);

      // Title Page
      doc.fontSize(24).font('Helvetica-Bold').text('Feel and Grow Rich', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica').text('Wealth, Worthiness & Personal Development Journey', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Export Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // Helper function for section headers
      const sectionHeader = (title: string) => {
        doc.addPage();
        doc.fontSize(18).font('Helvetica-Bold').text(title, { underline: true });
        doc.moveDown(1);
        doc.fontSize(11).font('Helvetica');
      };

      // Helper function for subsection headers
      const subsectionHeader = (title: string) => {
        doc.moveDown(0.5);
        doc.fontSize(13).font('Helvetica-Bold').text(title);
        doc.fontSize(11).font('Helvetica');
        doc.moveDown(0.3);
      };

      // Process each session
      sessions.forEach((session, index) => {
        if (index > 0) doc.addPage();
        
        doc.fontSize(16).font('Helvetica-Bold').text(`Session ${index + 1}`, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(`Session ID: ${session.id}`);
        doc.text(`Created: ${new Date(session.createdAt).toLocaleDateString()}`);
        doc.text(`Last Updated: ${new Date(session.updatedAt).toLocaleDateString()}`);
        doc.moveDown(1);

        // Intake Information
        if (session.intake) {
          subsectionHeader('Intake Assessment');
          doc.text(`Name: ${session.intake.name}`);
          if (session.intake.birthDate) doc.text(`Birth Date: ${session.intake.birthDate}`);
          if (session.intake.birthTime) doc.text(`Birth Time: ${session.intake.birthTime}`);
          if (session.intake.birthPlace) doc.text(`Birth Place: ${session.intake.birthPlace}`);
          doc.moveDown(0.5);
          doc.text('Current Conditions of Life:', { underline: true });
          doc.text(session.intake.conditionsOfLife, { indent: 20 });
          doc.moveDown(0.5);
          doc.text('Loop to Break:', { underline: true });
          doc.text(session.intake.loopToBreak, { indent: 20 });
          doc.moveDown(1);
        }

        // Belief Map
        if (session.beliefMap?.items && session.beliefMap.items.length > 0) {
          subsectionHeader('Belief Map');
          session.beliefMap.items.forEach((item, i) => {
            doc.text(`${i + 1}. [${item.type.toUpperCase()}] ${item.content}`);
            if (item.connectedTo && item.connectedTo.length > 0) {
              doc.text(`   Connected to: ${item.connectedTo.join(', ')}`, { indent: 20 });
            }
          });
          doc.moveDown(1);
        }

        // Triangle Shift
        if (session.triangleShift) {
          subsectionHeader('Triangle Shift');
          doc.text(`Current Role: ${session.triangleShift.currentRole.toUpperCase()}`);
          doc.text(`Situation: ${session.triangleShift.situation}`, { indent: 20 });
          doc.moveDown(0.3);
          doc.text(`Transformed Role: ${session.triangleShift.transformedRole.toUpperCase()}`);
          if (session.triangleShift.newPerspective) {
            doc.text(`New Perspective: ${session.triangleShift.newPerspective}`, { indent: 20 });
          }
          doc.moveDown(1);
        }

        // Six Fears
        if (session.sixFears?.fears && session.sixFears.fears.length > 0) {
          subsectionHeader('Six Fears Assessment');
          doc.text('Identified Fears:');
          session.sixFears.fears.forEach(fear => {
            doc.text(`• ${fear.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`, { indent: 20 });
          });
          if (session.sixFears.notes && Object.keys(session.sixFears.notes).length > 0) {
            doc.moveDown(0.3);
            doc.text('Notes:');
            Object.entries(session.sixFears.notes).forEach(([fear, note]) => {
              doc.text(`• ${fear}: ${note}`, { indent: 20 });
            });
          }
          doc.moveDown(1);
        }

        // Feelings Dial
        if (session.feelingsDial) {
          subsectionHeader('Feelings Dial');
          doc.text('Emotion Ratings (0-10):');
          Object.entries(session.feelingsDial.emotions).forEach(([emotion, rating]) => {
            doc.text(`• ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${rating}`, { indent: 20 });
          });
          if (session.feelingsDial.reflections) {
            doc.moveDown(0.3);
            doc.text('Reflections:');
            doc.text(session.feelingsDial.reflections, { indent: 20 });
          }
          doc.moveDown(1);
        }

        // Hill Overlay
        if (session.hillOverlay) {
          subsectionHeader('Hill Overlay');
          doc.text(`Guiding Principle: ${session.hillOverlay.principle}`);
          doc.text(`Micro Action: ${session.hillOverlay.microAction}`);
          if (session.hillOverlay.commitment) {
            doc.text(`Commitment: ${session.hillOverlay.commitment}`);
          }
          doc.moveDown(1);
        }

        // Daily 10
        if (session.daily10) {
          subsectionHeader('Daily 10 Practice');
          if (session.daily10.prompt1) doc.text(`1. ${session.daily10.prompt1}`);
          if (session.daily10.prompt2) doc.text(`2. ${session.daily10.prompt2}`);
          if (session.daily10.prompt3) doc.text(`3. ${session.daily10.prompt3}`);
          if (session.daily10.prompt4) doc.text(`4. ${session.daily10.prompt4}`);
          if (session.daily10.prompt5) doc.text(`5. ${session.daily10.prompt5}`);
          if (session.daily10.duration) {
            doc.moveDown(0.3);
            doc.text(`Duration: ${Math.floor(session.daily10.duration / 60)} minutes ${session.daily10.duration % 60} seconds`);
          }
          if (session.daily10.completedAt) {
            doc.text(`Completed: ${new Date(session.daily10.completedAt).toLocaleString()}`);
          }
        }
      });

      // Footer on last page
      doc.moveDown(2);
      doc.fontSize(9).font('Helvetica-Oblique').text('Feel and Grow Rich - Your Journey to Wealth, Worthiness & Abundance', { align: 'center' });
      
      doc.end();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ error: "Failed to export PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
