import { z } from "zod";

export const BudgetDTO = z.object({
  id: z.coerce.number(),
  age: z.coerce.number(),
  goalAmount: z.coerce.number(),
  income: z.coerce.number(),
  periodRange: z.string(),
  needs: z.coerce.number(),
  wants: z.coerce.number(),
  save: z.coerce.number(),
  createdAt: z.coerce.string().datetime(),
  userId: z.coerce.number(),
});

export const TrackingDTO = z.object({
  id: z.coerce.number(),
  category: z.coerce.string(),
  paymentMethod: z.coerce.string(),
  amount: z.coerce.number(),
  dateOfPayment: z.coerce.string(),
  repeat: z.preprocess((val) => Boolean(Number(val)), z.boolean()),
  title: z.coerce.string().optional(),
  note: z.coerce.string().optional(),
  createdAt: z.coerce.string().datetime(),
  userId: z.coerce.number(),
});

export const RewardsDTO = z.object({
  id: z.coerce.number(),
  points: z.coerce.number(),
  createdAt: z.coerce.string().datetime(),
  userId: z.coerce.number(),
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
