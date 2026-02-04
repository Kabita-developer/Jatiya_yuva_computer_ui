import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api } from "@shared/routes";
import { storage } from "./storage";
import { dashboardResponseSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.dashboard.get.path, async (_req, res) => {
    const data = await storage.getDashboard();
    const parsed = dashboardResponseSchema.parse(data);
    res.json(parsed);
  });

  app.use((err: unknown, _req: unknown, res: any, _next: any) => {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0]?.message ?? "Invalid request",
        field: err.errors[0]?.path?.join(".") ?? undefined,
      });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  });

  return httpServer;
}
