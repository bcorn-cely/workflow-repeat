/**
 * IMAX Cache Demo API Route
 * 
 * Demonstrates Next.js 16 caching and revalidation capabilities on Vercel.
 * 
 * Features:
 * - Uses 'use cache' directive for Next.js 16 Cache Components
 * - Uses cacheTag for on-demand revalidation
 * - Uses cacheLife to set cache lifetime
 * - Returns timestamp to show when data was generated
 * - Supports on-demand revalidation via POST request
 * 
 * This endpoint showcases:
 * 1. Cached responses being served even after data updates
 * 2. Revalidation triggering fresh data fetch using revalidateTag
 */

import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife, revalidateTag } from 'next/cache';

// Simulated data store (in production, this would be a database)
let dataVersion = 1;
let lastUpdated = new Date().toISOString();

/**
 * Get Cached Data Function
 * 
 * Uses Next.js 16 'use cache' directive with cacheTag and cacheLife.
 * This function is cached and tagged for on-demand revalidation.
 */
async function getCachedData() {
  'use cache'
  
  // Tag this cache entry for targeted revalidation
  cacheTag('imax-cache-demo')
  
  // Set cache lifetime using custom profile from next.config.ts
  cacheLife('cache-demo')
  
  // Simulate some data that changes over time
  const content = {
    version: dataVersion,
    timestamp: lastUpdated,
    message: `IMAX Content Review Status - Version ${dataVersion}`,
    stats: {
      contentReviewed: 42 + dataVersion,
      theatersAvailable: 250 + (dataVersion * 2),
      marketingMaterialsGenerated: 18 + dataVersion,
    },
    cacheInfo: {
      cached: true,
      revalidated: false,
    },
  };

  return content;
}

/**
 * GET Handler - Returns cached content with timestamp
 * 
 * Uses Next.js 16 'use cache' directive with cacheTag and cacheLife.
 * The cache is automatically managed by Next.js based on the cacheLife profile.
 */
export async function GET(request: NextRequest) {
  const content = await getCachedData();

  const response = NextResponse.json(content);

  return response;
}

/**
 * POST Handler - Triggers on-demand revalidation
 * 
 * Updates the data and uses revalidateTag to invalidate the cache.
 * Uses 'max' profile for stale-while-revalidate semantics (recommended).
 */
export async function POST(request: NextRequest) {
  // Update the data version
  dataVersion += 1;
  lastUpdated = new Date().toISOString();

  // Revalidate the cache tag - this marks it as stale
  // Using 'max' profile provides stale-while-revalidate semantics
  revalidateTag('imax-cache-demo', 'max');

  return NextResponse.json({
    success: true,
    message: 'Cache revalidation triggered',
    newVersion: dataVersion,
    timestamp: lastUpdated,
    note: 'Cache is now marked as stale. Next request will serve stale content while fetching fresh data in the background.',
  });
}
