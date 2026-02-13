import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { registerLocalAuthRoutes } from "./localAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Register local JWT-based auth routes (this includes /api/auth/register, /api/auth/login, and /api/auth/user)
  registerLocalAuthRoutes(app);
}
