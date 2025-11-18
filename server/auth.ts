import type { Express, RequestHandler } from "express";
import { supabase } from "./supabase";

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

    // Attach user to request for use in protected routes
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
