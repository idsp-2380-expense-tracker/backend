import { Router } from "express";
import userRouter from "./userRouter";
import { Request, Response } from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import { insertUserToDb } from "../database/databaseAccessLayer";
import { ClerkUser } from "../types/Clerk";
const router = Router();

router.use("/user", userRouter);

router.get(
  "/registerUser",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { userId } = req.auth;

    if (!userId) return;
    try {
      const user = await clerkClient.users.getUser(userId);

      const userData: ClerkUser = {
        userId,
        firstName: user.firstName!,
        lastName: user.lastName!,
        email: user.emailAddresses[0].emailAddress,
      };
      await insertUserToDb(userData);
      res.json({ success: true });
    } catch {
      res.json({ succes: false, error: "failed to register user" });
    }
  }
);

export default router;
