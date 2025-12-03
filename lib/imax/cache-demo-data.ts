/**
 * IMAX Cache Demo Data Fetching
 * 
 * Server-side data fetching function using Next.js 16 'use cache' directive.
 * This demonstrates proper use of cacheTag and cacheLife.
 */

import { cacheTag, cacheLife } from 'next/cache';

// Simulated data store (in production, this would be a database)
// Execution counter that increments each time the function runs
// This demonstrates cache expiration: when cache expires, function re-runs and counter increments
let executionCounter = 0; // Increments each time getCachedData executes (when cache expires)
let manualVersionIncrement = 0; // For manual updates via revalidateTag

export interface CacheData {
  version: number;
  timestamp: string;
  message: string;
  stats: {
    contentReviewed: number;
    theatersAvailable: number;
    marketingMaterialsGenerated: number;
  };
  cacheInfo: {
    cached: boolean;
    revalidated: boolean;
  };
}

/**
 * Get Cached Data Function
 * 
 * Uses Next.js 16 'use cache' directive with cacheTag and cacheLife.
 * This function is cached server-side and tagged for on-demand revalidation.
 * 
 * The data changes based on execution count to demonstrate cache expiration.
 * When cache expires, this function re-runs and the execution counter increments,
 * showing fresh data. This demonstrates that cache expiration automatically
 * triggers fresh data retrieval without manual revalidation.
 */
export async function getCachedData(): Promise<CacheData> {
  'use cache';
  
  // Tag this cache entry for targeted revalidation
  cacheTag('imax-cache-demo');
  
  // Set cache lifetime using custom profile from next.config.ts
  cacheLife('cache-demo');
  
  // Increment execution counter each time this function runs
  // When cache expires, Next.js re-runs this function, incrementing the counter
  // This demonstrates that expired cache automatically fetches fresh data
  executionCounter += 1;
  
  // Get current time for timestamp display
  const now = new Date();
  
  // Combine execution counter with manual increments
  // Execution counter shows cache expiration behavior
  // Manual increment shows on-demand revalidation behavior
  const dataVersion = executionCounter + manualVersionIncrement;
  
  // Simulate some data that changes over time
  const content: CacheData = {
    version: dataVersion,
    timestamp: now.toISOString(),
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
 * Update Data Version
 * 
 * This function increments the manual version counter (simulating a data change).
 * In production, this would update a database.
 * 
 * When called via revalidateTag, the cache will revalidate and fetch fresh data
 * with an incremented version number.
 */
export function updateDataVersion() {
  manualVersionIncrement += 1;
}

