import { Router } from "express";
import userRouter from "./userRouter";
import { Request, Response } from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
const router = Router();

router.use("/user", userRouter);

router.get("/checkUser", requireAuth(), async (req: Request, res: Response) => {
  const { userId } = req.auth;

  if (!userId) return;

  try {
    const user = await clerkClient.users.getUser(userId);

    const email = user.emailAddresses[0].emailAddress;
    const firstName = user.firstName;
    const lastName = user.lastName;

    res.json({ userId, email, firstName, lastName });
  } catch (err) {
    console.log(err);
  }
});

export default router;
