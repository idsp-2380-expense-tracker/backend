import { number, z } from "zod";

export const BudgetDTO = z.object({
  age: z.number().nonnegative().nullable().default(null),
  goalAmount: z.number().nonnegative().nullable().default(null),
  income: z.number().nonnegative(),
  periodRange: z.string(),
  needs: z.number().nonnegative(),
  wants: z.number().nonnegative(),
  save: z.number().nonnegative(),
  userId: z.string(),
});
export const PartialBudgetDTO = BudgetDTO.omit({
  age: true,
  goalAmount: true,
});
export const BaseTrackingDTO = z.object({
  id: z.number(),
  category: z.string(),
  paymentMethod: z.string(),
  amount: z.number(),
  dateOfPayment: z.date(),
  repeat: z.preprocess((val) => Boolean(Number(val)), z.boolean()),
  title: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  userId: z.string(),
});
export const EditTrackingDTO = BaseTrackingDTO.omit({
  title: true,
  note: true,
  createdAt: true,
});
export const AddTrackingDTO = BaseTrackingDTO.omit({
  id: true,
  title: true,
  note: true,
  userId: true,
  createdAt: true,
});

export const PartialTrackingDTO = BaseTrackingDTO.omit({
  id: true,
  createdAt: true,
});
export const RewardsDTO = z.object({
  id: z.number(),
  points: z.number(),
  createdAt: z.date(),
  userId: z.string(),
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

const TrackingDeleteDTO = z.object({
  id: z.number(),
  idForDelete: z.number(),
});
const TrackingResponseDTO = z.object({
  id: z.number(),
});
export type ITrackingDelete = z.infer<typeof TrackingDeleteDTO>;
export type ITrackingResponse = z.infer<typeof TrackingResponseDTO>;
export type ITrackingAdd = z.infer<typeof AddTrackingDTO>;
export type ITrackingEdit = z.infer<typeof EditTrackingDTO>;
