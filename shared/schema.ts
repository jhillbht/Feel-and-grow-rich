import { z } from "zod";

// Intake Wizard Schema
export const intakeDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "Consent is required"),
  conditionsOfLife: z.string().min(10, "Please describe your conditions of life"),
  loopToBreak: z.string().min(10, "Please describe the loop you want to break"),
});

// Belief Mapper Schema
export const beliefMapItemSchema = z.object({
  id: z.string(),
  type: z.enum(["event", "belief", "loop", "disconnection"]),
  content: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  connectedTo: z.array(z.string()).optional(),
});

export const beliefMapSchema = z.object({
  items: z.array(beliefMapItemSchema),
});

// Triangle Shift Schema
export const triangleShiftSchema = z.object({
  currentRole: z.enum(["victim", "hero", "persecutor"]),
  situation: z.string().min(10, "Please describe the situation"),
  transformedRole: z.enum(["creator", "coach", "challenger"]),
  newPerspective: z.string().optional(),
});

// Six Fears Schema
export const sixFearsSchema = z.object({
  fears: z.array(z.enum([
    "fear_of_failure",
    "fear_of_success", 
    "fear_of_rejection",
    "fear_of_abandonment",
    "fear_of_loss_of_control",
    "fear_of_death"
  ])),
  notes: z.record(z.string()).optional(),
});

// Feelings Dial Schema
export const feelingsDialSchema = z.object({
  emotions: z.object({
    anger: z.number().min(0).max(10),
    sadness: z.number().min(0).max(10),
    guilt: z.number().min(0).max(10),
    shame: z.number().min(0).max(10),
    fear: z.number().min(0).max(10),
    joy: z.number().min(0).max(10),
  }),
  sitCompletedAt: z.string().optional(),
  reflections: z.string().optional(),
});

// Hill Overlay Schema
export const hillOverlaySchema = z.object({
  principle: z.string().min(1, "Please select a principle"),
  microAction: z.string().min(5, "Please add a micro-action"),
  commitment: z.string().optional(),
});

// Daily 10 Schema
export const daily10Schema = z.object({
  prompt1: z.string().optional(),
  prompt2: z.string().optional(),
  prompt3: z.string().optional(),
  prompt4: z.string().optional(),
  prompt5: z.string().optional(),
  completedAt: z.string().optional(),
  duration: z.number().optional(),
});

// Complete Session Schema
export const sessionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  intake: intakeDataSchema.optional(),
  beliefMap: beliefMapSchema.optional(),
  triangleShift: triangleShiftSchema.optional(),
  sixFears: sixFearsSchema.optional(),
  feelingsDial: feelingsDialSchema.optional(),
  hillOverlay: hillOverlaySchema.optional(),
  daily10: daily10Schema.optional(),
  aiInteractions: z.array(z.object({
    prompt: z.string(),
    response: z.string(),
    timestamp: z.string(),
  })).optional(),
});

// Insert schemas (for creating new data)
export const insertIntakeDataSchema = intakeDataSchema;
export const insertBeliefMapSchema = beliefMapSchema;
export const insertTriangleShiftSchema = triangleShiftSchema;
export const insertSixFearsSchema = sixFearsSchema;
export const insertFeelingsDialSchema = feelingsDialSchema;
export const insertHillOverlaySchema = hillOverlaySchema;
export const insertDaily10Schema = daily10Schema;
export const insertSessionSchema = sessionSchema.omit({ id: true, createdAt: true, updatedAt: true });

// TypeScript types
export type IntakeData = z.infer<typeof intakeDataSchema>;
export type BeliefMapItem = z.infer<typeof beliefMapItemSchema>;
export type BeliefMap = z.infer<typeof beliefMapSchema>;
export type TriangleShift = z.infer<typeof triangleShiftSchema>;
export type SixFears = z.infer<typeof sixFearsSchema>;
export type FeelingsDial = z.infer<typeof feelingsDialSchema>;
export type HillOverlay = z.infer<typeof hillOverlaySchema>;
export type Daily10 = z.infer<typeof daily10Schema>;
export type Session = z.infer<typeof sessionSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;

// AI Response Schema
export const aiResponseSchema = z.object({
  response: z.string(),
  suggestions: z.array(z.string()).optional(),
  insights: z.string().optional(),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
