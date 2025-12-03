/**
 * IMAX Content Review Workflow
 * 
 * This is the main orchestration workflow for IMAX content review and distribution preparation.
 * It coordinates all steps in the content review lifecycle:
 * 
 * Workflow Steps:
 * 1. Analyze Content - Analyze movie content using ToolLoopAgent (generic)
 * 2. Generate Marketing Materials - Generate marketing materials using ToolLoopAgent (concurrent with step 3)
 * 3. Check Theater Availability - Check theater availability (mock data, concurrent with step 2)
 * 4. Content Release Approval - Human approval required before distribution (hook)
 * 
 * Key Features:
 * - Generic ToolLoopAgent usage in step 1
 * - Concurrent execution of steps 2 and 3
 * - Human-in-the-loop approval with hook
 * - Comprehensive content analysis and marketing preparation
 * - Error handling and retry logic
 */

import { sleep } from 'workflow';
import { FatalError } from 'workflow';
import {
  analyzeContent,
  generateMarketingMaterials,
  checkTheaterAvailability,
  ContentReviewInput,
} from './steps';
import { contentReleaseApprovalHook } from './hooks';

const BASE = process.env.APP_BASE_URL ?? 'http://localhost:3000';

/**
 * Main Content Review Workflow Function
 * 
 * Orchestrates the entire content review process from analysis to approval.
 * 
 * @param input - Content review input with content details, markets, requester info
 * @returns Content review result with analysis, marketing materials, theater availability, and approval
 */
export async function contentReview(input: ContentReviewInput) {
  'use workflow'
  
  const contentId = input.contentId;
  const startTime = Date.now();

  // Log workflow start
  console.log(`[Content Review Workflow] Started for ${contentId}`, {
    contentId,
    contentTitle: input.contentTitle,
    contentType: input.contentType,
    targetMarkets: input.targetMarkets,
  });

  // ========== Step 1: Analyze Content ==========
  // Use a generic ToolLoopAgent to analyze the content
  // This demonstrates generic ToolLoopAgent usage in a workflow step
  const analysisStartTime = Date.now();
  const analysis = await analyzeContent({
    contentId: input.contentId,
    contentTitle: input.contentTitle,
    contentType: input.contentType,
    duration: input.duration,
    rating: input.rating,
  });
  const analysisLatency = Date.now() - analysisStartTime;

  console.log(`[Content Review Workflow] Content analysis complete`, {
    contentId,
    latency: analysisLatency,
    highlightsCount: analysis.keyHighlights.length,
  });

  // ========== Steps 2 & 3: Concurrent Execution ==========
  // These two steps run concurrently to demonstrate parallel execution
  // Step 2: Generate marketing materials using ToolLoopAgent
  // Step 3: Check theater availability (mock data)
  console.log(`[Content Review Workflow] Starting concurrent steps: marketing materials and theater availability`, {
    contentId,
  });

  const [marketingMaterials, theaterAvailability] = await Promise.all([
    // Step 2: Generate Marketing Materials (ToolLoopAgent)
    generateMarketingMaterials({
      contentId: input.contentId,
      contentTitle: input.contentTitle,
      contentType: input.contentType,
      analysis: analysis,
    }),
    // Step 3: Check Theater Availability (mock data)
    checkTheaterAvailability({
      targetMarkets: input.targetMarkets,
      releaseDate: input.releaseDate,
      contentType: input.contentType,
    }),
  ]);

  console.log(`[Content Review Workflow] Concurrent steps complete`, {
    contentId,
    marketingMaterialsGenerated: !!marketingMaterials.tagline,
    theatersAvailable: theaterAvailability.availableTheaters,
  });

  // ========== Step 4: Content Release Approval ==========
  // Approval is REQUIRED before content can be distributed
  // This is a critical checkpoint that ensures content quality and compliance
  // The workflow pauses here and waits for approval (with timeout)
  const approvalToken = `${contentId}:release-approval`;
  const approval = contentReleaseApprovalHook.create({ token: approvalToken });

  // Send approval request (in production, this would send an email/notification)
  console.log(`[Content Review Workflow] Sending approval request`, {
    contentId,
    approvalToken,
    requesterEmail: input.requesterEmail,
  });

  // Simulate sending approval notification
  // In production, this would call an email/notification service
  

  const approvalTimeout = '2h';
  const approvalDecision = await Promise.race([
    approval,
    (async () => {
      await sleep(approvalTimeout);
      return { approved: false, comment: 'Approval timeout' };
    })(),
  ]);

  if (approvalDecision.approved === false) {
    return {
      contentId,
      analysis,
      marketingMaterials,
      theaterAvailability,
      approval: approvalDecision,
      error: 'Content release not approved',
    };
  }

  const totalLatency = Date.now() - startTime;
  const contentUrl = `${BASE}/content/${contentId}`;

  // Final completion log
  console.log(`[Content Review Workflow] Complete`, {
    contentId,
    contentUrl,
    totalLatency,
    analysisLatency,
    theatersAvailable: theaterAvailability.availableTheaters,
  });

  // Return final result with complete content review data
  return {
    contentId,
    analysis,
    marketingMaterials,
    theaterAvailability,
    approval: approvalDecision,
    contentUrl,
  };
}

