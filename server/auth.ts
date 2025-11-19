import type { Express, RequestHandler } from "express";
import { supabase } from "./supabase";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);

  // Supabase Auth - Session verification endpoint
  app.get("/api/auth/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: "Invalid session" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.full_name?.split(" ")[0] || null,
        lastName: user.user_metadata?.full_name?.split(" ")[1] || null,
        profileImageUrl: user.user_metadata?.avatar_url || null,
      });
    } catch (error) {
      console.error("[AUTH ERROR] Session verification failed:", error);
      res.status(401).json({ message: "Authentication failed" });
    }
  });

  // Logout endpoint - handled client-side with Supabase
  app.post("/api/logout", (req, res) => {
    res.json({ message: "Logout successful" });
  });

  // Legacy compatibility endpoints
  app.get("/api/login", (req, res) => {
    res.json({ message: "Please use Supabase client-side auth" });
  });
}

// Helper function to ensure user exists in public.users table
async function ensureUserExists(supabaseUser: any) {
  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, supabaseUser.id))
      .limit(1);

    // If user doesn't exist, create them
    if (!existingUser) {
      const nameParts = supabaseUser.user_metadata?.full_name?.split(" ") || [];
      
      await db.insert(users).values({
        id: supabaseUser.id,
        email: supabaseUser.email,
        oauthSub: supabaseUser.id,
        firstName: nameParts[0] || null,
        lastName: nameParts.slice(1).join(" ") || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      }).onConflictDoNothing();
      
      console.log(`[AUTH] Created new user record for ${supabaseUser.email}`);
    }
  } catch (error) {
    console.error("[AUTH ERROR] Failed to ensure user exists:", error);
    // Don't throw - let the request continue even if user creation fails
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure user exists in public.users table
    await ensureUserExists(user);

    // Attach user to request for use in protected routes
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("[AUTH ERROR] Authentication middleware failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
