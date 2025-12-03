/**
 * IMAX Content Review Workflow Steps
 * 
 * This file defines all durable steps used in the IMAX content review workflow.
 * Each step is a "durable step" that can be retried and persisted across workflow runs.
 * 
 * Workflow Flow Overview:
 * 1. analyzeContent - Analyze movie content using ToolLoopAgent (generic)
 * 2. generateMarketingMaterials - Generate marketing materials using ToolLoopAgent (concurrent with step 3)
 * 3. checkTheaterAvailability - Check theater availability (mock data, concurrent with step 2)
 * 
 * Note: Steps 2 and 3 run concurrently to demonstrate parallel execution.
 */

import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

/**
 * Input type for content review workflow
 * Defines all required information to review and prepare content for distribution
 */
export type ContentReviewInput = {
  contentId: string;
  contentTitle: string;
  contentType: 'feature-film' | 'documentary' | 'short-film' | 'imax-experience';
  duration: number; // in minutes
  rating: string; // e.g., "PG-13", "R", "G"
  releaseDate: string;
  targetMarkets: string[]; // e.g., ["US", "CA", "UK"]
  requesterEmail: string;
  requesterRole: 'content-manager' | 'marketing' | 'distribution';
};

/**
 * Result type returned from the content review workflow
 * Contains analysis results, marketing materials, theater availability, and approval status
 */
export type ContentReviewResult = {
  contentId: string;
  analysis: {
    summary: string;
    keyHighlights: string[];
    targetAudience: string;
    recommendedTheaters: string[];
  };
  marketingMaterials: {
    tagline: string;
    socialMediaPosts: string[];
    pressRelease: string;
  };
  theaterAvailability: {
    availableTheaters: number;
    totalScreens: number;
    markets: Array<{
      market: string;
      theaters: number;
      screens: number;
    }>;
  };
  approval?: {
    approved: boolean;
    approvedBy?: string;
    comment?: string;
  };
  contentUrl?: string;
};

/** ---------- Durable Steps ---------- */

/**
 * Step 1: Analyze Content
 * 
 * Uses a generic ToolLoopAgent to analyze movie content and provide insights.
 * This demonstrates the generic use of ToolLoopAgent in a workflow step.
 * 
 * The agent analyzes:
 * - Content quality and highlights
 * - Target audience identification
 * - Recommended theater types and markets
 * - Key selling points for marketing
 */
export async function analyzeContent(input: {
  contentId: string;
  contentTitle: string;
  contentType: string;
  duration: number;
  rating: string;
}) {
  "use step";
  
  // Create a generic ToolLoopAgent for content analysis
  const agent = new ToolLoopAgent({
    model: 'openai/gpt-4o-mini',
    instructions: `You are an IMAX content analysis specialist. Your job is to analyze movie content and provide insights for distribution planning.

Your analysis should include:
1. A brief summary of the content's key themes and appeal
2. Key highlights that make this content suitable for IMAX theaters
3. Target audience identification (demographics, interests)
4. Recommended theater types and markets based on content characteristics

Be concise, professional, and focus on distribution and marketing insights.`,
  });

  const result = await agent.generate({
    prompt: `Analyze the following IMAX content:

Title: ${input.contentTitle}
Type: ${input.contentType}
Duration: ${input.duration} minutes
Rating: ${input.rating}
Content ID: ${input.contentId}

Provide a comprehensive analysis including summary, key highlights, target audience, and recommended theaters.`
  });

  // Parse the agent's response into structured data
  const text = result.text;
  const highlights = text.match(/Key Highlights?:?\s*(.+?)(?:\n|$)/gi)?.map(h => h.replace(/Key Highlights?:?\s*/i, '').trim()) || [];
  const audienceMatch = text.match(/Target Audience:?\s*(.+?)(?:\n|$)/i);
  const theatersMatch = text.match(/Recommended Theaters?:?\s*(.+?)(?:\n|$)/i);

  return {
    summary: text.split('\n')[0] || text.substring(0, 200),
    keyHighlights: highlights.length > 0 ? highlights : ['High-quality IMAX experience', 'Engaging narrative', 'Visual excellence'],
    targetAudience: audienceMatch?.[1]?.trim() || 'General audience (ages 13+)',
    recommendedTheaters: theatersMatch?.[1]?.split(',').map(t => t.trim()) || ['IMAX Laser', 'IMAX 70mm'],
  };
}
analyzeContent.maxRetries = 3;

/**
 * Step 2: Generate Marketing Materials
 * 
 * Uses a ToolLoopAgent to generate marketing materials for the content.
 * This step runs concurrently with checkTheaterAvailability.
 * 
 * Generates:
 * - Tagline for promotional use
 * - Social media posts (multiple platforms)
 * - Press release content
 */
export async function generateMarketingMaterials(input: {
  contentId: string;
  contentTitle: string;
  contentType: string;
  analysis: {
    summary: string;
    keyHighlights: string[];
    targetAudience: string;
  };
}) {
  "use step";
  
  // Create a ToolLoopAgent for marketing material generation
  const agent = new ToolLoopAgent({
    model: 'openai/gpt-4o-mini',
    instructions: `You are an IMAX marketing specialist. Your job is to create compelling marketing materials for IMAX content.

Create:
1. A catchy tagline (1 sentence, memorable)
2. Social media posts (3-4 posts for different platforms: Twitter, Instagram, Facebook)
3. A brief press release (2-3 paragraphs)

Make the content exciting, professional, and aligned with IMAX's premium brand. Focus on the immersive experience and visual quality.`,
  });

  const result = await agent.generate({
    prompt: `Create marketing materials for this IMAX content:

Title: ${input.contentTitle}
Type: ${input.contentType}
Analysis Summary: ${input.analysis.summary}
Key Highlights: ${input.analysis.keyHighlights.join(', ')}
Target Audience: ${input.analysis.targetAudience}

Generate a tagline, social media posts, and a press release.`
  });

  // Parse the agent's response
  const text = result.text;
  const taglineMatch = text.match(/Tagline:?\s*(.+?)(?:\n|$)/i);
  const postsMatch = text.match(/Social Media Posts?:?\s*([\s\S]+?)(?:Press Release|$)/i);
  const pressReleaseMatch = text.match(/Press Release:?\s*([\s\S]+?)$/i);

  return {
    tagline: taglineMatch?.[1]?.trim() || `Experience ${input.contentTitle} in IMAX`,
    socialMediaPosts: postsMatch?.[1]?.split('\n').filter(p => p.trim().length > 0).slice(0, 4) || [
      `🎬 ${input.contentTitle} is coming to IMAX theaters!`,
      `Experience the ultimate cinematic journey with ${input.contentTitle} in IMAX.`,
      `Get ready for an immersive experience like no other. ${input.contentTitle} in IMAX.`,
    ],
    pressRelease: pressReleaseMatch?.[1]?.trim() || `IMAX is proud to announce the release of ${input.contentTitle}, an exceptional ${input.contentType} that showcases the power of IMAX technology.`,
  };
}
generateMarketingMaterials.maxRetries = 3;

/**
 * Step 3: Check Theater Availability
 * 
 * Returns mock data for theater availability across target markets.
 * This step runs concurrently with generateMarketingMaterials.
 * 
 * In a real implementation, this would query a theater management system.
 * For this demo, we return mock data to show concurrent execution.
 */
export async function checkTheaterAvailability(input: {
  targetMarkets: string[];
  releaseDate: string;
  contentType: string;
}) {
  "use step";
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock theater availability data
  // In production, this would query a real theater management system
  const markets = input.targetMarkets.map(market => ({
    market,
    theaters: Math.floor(Math.random() * 20) + 10, // 10-30 theaters per market
    screens: Math.floor(Math.random() * 50) + 25, // 25-75 screens per market
  }));

  const totalTheaters = markets.reduce((sum, m) => sum + m.theaters, 0);
  const totalScreens = markets.reduce((sum, m) => sum + m.screens, 0);

  return {
    availableTheaters: totalTheaters,
    totalScreens: totalScreens,
    markets: markets,
    lastUpdated: new Date().toISOString(),
  };
}
checkTheaterAvailability.maxRetries = 3;

