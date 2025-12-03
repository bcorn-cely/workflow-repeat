/**
 * IMAX Cache Demo Component
 * 
 * Server component that demonstrates Next.js 16 caching and revalidation capabilities.
 * 
 * Architecture:
 * - Server component for static shell
 * - Suspense boundary for cached data (streaming)
 * - Client component only for interactive buttons
 * - Server Action for cache revalidation
 * 
 * This demonstrates:
 * - 'use cache' directive in data fetching function
 * - cacheTag for on-demand revalidation
 * - cacheLife for cache lifetime configuration
 * - Suspense boundaries for streaming
 * - Server Actions for cache invalidation
 */

import { CacheDemoData } from './cache-demo-data';
import { CacheDemoActions } from './cache-demo-actions';

export function CacheDemo() {
  return (
    <div className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-card to-pink-500/5 rounded-xl p-8 shadow-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-card-foreground">Cache Revalidation Demo</h3>
            <p className="text-sm text-muted-foreground">
              Next.js 16 Cache Components with 'use cache', cacheTag, cacheLife, and Suspense
            </p>
          </div>
        </div>
      </div>

      {/* Cached data with Suspense boundary */}
      <CacheDemoData />

      {/* Interactive actions (client component) */}
      <CacheDemoActions />
    </div>
  );
}
