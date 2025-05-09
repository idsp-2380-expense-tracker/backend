import { z } from "zod";

export const BudgetDTO = z.object({
  id: z.number(),
  age: z.number().nonnegative(),
  goalAmount: z.number().nonnegative(),
  income: z.number().nonnegative(),
  periodRange: z.string(),
  needs: z.number().nonnegative(),
  wants: z.number().nonnegative(),
  save: z.number().nonnegative(),
  createdAt: z.date().optional(),
  userId: z.number(),
});
export const PartialBudgetDTO = BudgetDTO.omit({
  id: true,
  createdAt: true,
  age: true,
  goalAmount: true,
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
export const PartialTrackingDTO = TrackingDTO.omit({
  id: true,
  createdAt: true,
});
export const RewardsDTO = z.object({
  id: z.number(),
  points: z.number(),
  createdAt: z.date(),
  userId: z.number(),
});
export const PartialRewardsDTO = RewardsDTO.omit({ id: true, createdAt: true });
export const UserDTO = z.object({
  tracking: z.array(TrackingDTO).default([]),
  budget: BudgetDTO.nullable(),
  rewards: RewardsDTO.nullable(),
});
export const pointsUpdateSchema = z.object({
  id: z.string(),
  points: z.number(),
});

export type pointsUpdate = z.TypeOf<typeof pointsUpdateSchema>;
export type IPartialBudget = z.infer<typeof PartialBudgetDTO>;
export type IBudget = z.infer<typeof BudgetDTO>;
export type IPartialTracking = z.infer<typeof PartialTrackingDTO>;
export type IPartialRewards = z.infer<typeof PartialRewardsDTO>;
export type IUser = z.infer<typeof UserDTO>;
