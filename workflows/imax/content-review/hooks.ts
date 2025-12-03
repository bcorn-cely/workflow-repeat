/**
 * IMAX Content Review Workflow Hooks
 * 
 * Hooks are used to pause workflow execution and wait for human input.
 * They enable "human-in-the-loop" checkpoints in the workflow.
 * 
 * Each hook defines a schema that validates the approval response,
 * ensuring type safety and data validation.
 * 
 * Workflow Usage:
 * - contentReleaseApprovalHook: Used for content release approval (required before distribution)
 */

import { defineHook } from "workflow";
import { z } from "zod";

/**
 * Content Release Approval Hook
 * 
 * Used when content needs approval before being released to theaters.
 * This is a REQUIRED checkpoint for all content distribution.
 * 
 * Schema includes:
 * - approved: Whether the content is approved for release
 * - comment: Optional feedback from approver
 * - by: Email of the approver
 * - releaseNotes: Optional notes about the release
 */
export const contentReleaseApprovalHook = defineHook({
  schema: z.object({
    approved: z.boolean(),
    comment: z.string().optional(),
    by: z.string().email().optional(),
    releaseNotes: z.string().optional(),
  }),
});

