import { type Session, type InsertSession } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

export interface IStorage {
  getSession(id: string): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private initialized: boolean = false;

  constructor() {
    this.sessions = new Map();
    this.init();
  }

  private async init() {
    if (this.initialized) return;
    
    await ensureDataDir();
    await this.loadFromFile();
    this.initialized = true;
  }

  private async loadFromFile() {
    try {
      const data = await fs.readFile(SESSIONS_FILE, "utf-8");
      const sessions: Session[] = JSON.parse(data);
      sessions.forEach(session => {
        this.sessions.set(session.id, session);
      });
      console.log(`Loaded ${sessions.length} sessions from file`);
    } catch (error) {
      // File doesn't exist yet, start fresh
      console.log("No existing sessions file, starting fresh");
    }
  }

  private async saveToFile() {
    await ensureDataDir();
    const sessions = Array.from(this.sessions.values());
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  }

  async getSession(id: string): Promise<Session | undefined> {
    await this.init();
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<Session[]> {
    await this.init();
    return Array.from(this.sessions.values());
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    await this.init();
    const id = randomUUID();
    const now = new Date().toISOString();
    const session: Session = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.sessions.set(id, session);
    await this.saveToFile();
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    await this.init();
    const existing = this.sessions.get(id);
    if (!existing) return undefined;

    const updated: Session = {
      ...existing,
      ...updates,
      id, // Preserve original id
      createdAt: existing.createdAt, // Preserve creation time
      updatedAt: new Date().toISOString(),
    };
    
    this.sessions.set(id, updated);
    await this.saveToFile();
    return updated;
  }

  async deleteSession(id: string): Promise<boolean> {
    await this.init();
    const deleted = this.sessions.delete(id);
    if (deleted) {
      await this.saveToFile();
    }
    return deleted;
  }
}

export const storage = new MemStorage();
