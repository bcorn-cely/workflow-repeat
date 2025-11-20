// workflows/greenlight/hooks.ts
import { defineHook } from "workflow";
import { z } from "zod";

// Type-safe human approval payload; automatically validated.
export const campaignApprovalHook = defineHook({
  schema: z.object({
    approved: z.boolean(),
    comment: z.string().optional(),
    by: z.string().email().optional(),
    budgetAdjustment: z.number().optional(),
    alternativeChannels: z.array(z.string()).optional(),
  }),
});

