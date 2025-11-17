// workflows/included-health/hooks.ts
import { createWebhook, defineHook } from "workflow";
import { z } from "zod";


export function createCareReviewHook(token: string) {
    return createWebhook({
        respondWith: 'manual',
        token
    });
}

export const createReviewConfirmationHook = defineHook({
    schema: z.object({
        appointmentId: z.string(),
        providerId: z.string(),
        patientId: z.string(),
        date: z.string(),
        time: z.string(),
        careType: z.string(),
        status: z.string(),
        confirmationNumber: z.string(),
    })
})

// Define the response payload type
export type CareReviewResponse = {
  approved: boolean;
  notes?: string;
  alternativeProviderId?: string;
  reviewedBy?: string;
};

