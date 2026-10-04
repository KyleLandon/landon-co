import { getAuth } from "@clerk/express";
import type { Request, RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type User } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      dbUser?: User;
    }
  }
}

export async function resolveLocalUser(req: Request) {
  const auth = getAuth(req);
  if (!auth.userId) return undefined;
  const userId = auth.sessionClaims?.userId;
  if (typeof userId !== "string" || !userId) {
    throw new Error("Authenticated session is missing its local user ID");
  }
  let [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    const [inserted] = await db.insert(users).values({
      id: userId,
      role: auth.sessionClaims?.email === "kyle@landonco.co" ? "admin" : "client",
    }).onConflictDoNothing().returning();
    user = inserted ?? (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
  }
  if (!user) throw new Error("Unable to provision local user");
  req.dbUser = user;
  return user;
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!await resolveLocalUser(req)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    await resolveLocalUser(req);
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.dbUser?.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
};