import { Router } from "express";
import userRouter from "./userRouter";
import { Request, Response } from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import { insertUserToDb, checkUserInDb } from "../database/databaseAccessLayer";
import { ClerkUser } from "../types/User";
const router = Router();

router.use("/user", userRouter);

router.post(
  "/registerUser",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { userId } = req.auth;

    try {
      const user = await clerkClient.users.getUser(userId!);

      const userData: ClerkUser = {
        userId: userId!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        email: user.emailAddresses[0].emailAddress,
      };

      const existingUser = await checkUserInDb(userId!);
      console.log(userId);
      console.log(!existingUser);
      if (!existingUser) {
        await insertUserToDb(userData);
      }

      res.json({ success: true });
    } catch {
      res
        .status(500)
        .json({ success: false, error: "failed to register user" });
    }
  }
);

export default router;
