import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai, AI_MODEL, WEALTH_CONSCIOUSNESS_SYSTEM_PROMPT } from "./openai";
import { sessionSchema, aiResponseSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import * as XLSX from "xlsx";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Get single session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Create session
  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createSession(req.body);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Update session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Delete session
  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSession(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Session not found" });
      }
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

  const httpServer = createServer(app);
  return httpServer;
}
