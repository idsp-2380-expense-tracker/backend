import { z } from "zod";

export const BudgetDTO = z.object({
  id: z.number(),
  age: z.number(),
  goalAmount: z.number(),
  income: z.number(),
  periodRange: z.string(),
  needs: z.number(),
  wants: z.number(),
  save: z.number(),
  createdAt: z.date(),
  userId: z.number(),
});

export const TrackingDTO = z.object({
  id: z.number(),
  category: z.string(),
  paymentMethod: z.string(),
  amount: z.number(),
  dateOfPayment: z.date(),
  repeat: z.preprocess((val) => Boolean(Number(val)), z.boolean()),
  title: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  userId: z.number(),
});

export const RewardsDTO = z.object({
  id: z.number(),
  points: z.number(),
  createdAt: z.date(),
  userId: z.number(),
});
export const UserDTO = z.object({
  tracking: z.array(TrackingDTO).default([]),
  budget: z.array(BudgetDTO).default([]),
  rewards: z.array(RewardsDTO).default([]),
});
export const pointsUpdateSchema = z.object({
  id: z.string(),
  points: z.number(),
});
export type pointsUpdate = z.TypeOf<typeof pointsUpdateSchema>;
export type IBudget = z.infer<typeof BudgetDTO>;
export type ITracking = z.infer<typeof TrackingDTO>;
export type IRewards = z.infer<typeof RewardsDTO>;
export type IUser = z.infer<typeof UserDTO>;
