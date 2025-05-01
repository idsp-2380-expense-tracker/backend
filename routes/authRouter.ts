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
      console.log(user);
      const userData: ClerkUser = {
        userId: userId!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        email: user.emailAddresses[0].emailAddress,
      };
      console.log(userData);
      const existingUser = await checkUserInDb(userId!);
      if (!existingUser) {
        await insertUserToDb(userData);
      }
      console.log(existingUser);
      res.json({ success: true });
    } catch {
      res
        .status(500)
        .json({ success: false, error: "failed to register user" });
    }
  }
);

export default router;
