import { Router } from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";

const router = Router();

router.get("/data", requireAuth(), async (req, res): Promise<void> => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req);
  if (!userId) {
    console.log("error");
    res.status(401).json({ error: "Incorrect Credentials" });
    return;
  }
  const user = await clerkClient.users.getUser(userId);
  res.json({ user });
});
export default router;
