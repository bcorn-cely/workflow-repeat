/**
 * IMAX Cache Demo Data Component
 * 
 * Server component that fetches cached data using 'use cache' directive.
 * This component demonstrates Next.js 16 Cache Components.
 */

import { Suspense } from 'react';
import { getCachedData } from '@/lib/imax/cache-demo-data';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CacheTimeAgo } from './cache-time-ago';

/**
 * Cached Data Display Component
 * 
 * This component fetches data using the cached function.
 * The 'use cache' directive is in the getCachedData function.
 */
async function CachedDataDisplay() {
  const data = await getCachedData();

  return (
    <div className="space-y-6">
      {/* Cache Status */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge
          variant={data.cacheInfo.cached ? "default" : "destructive"}
          className={cn(
            "text-sm px-3 py-1",
            data.cacheInfo.cached
              ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
              : "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
          )}
        >
          {data.cacheInfo.cached ? "Cached" : "Fresh"}
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Version {data.version}
        </Badge>
        {/* Client component for time calculation - Date.now() is not allowed in Server Components */}
        <CacheTimeAgo timestamp={data.timestamp} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>Server Component</span>
        </div>
      </div>

      {/* Data Display */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Content Reviewed
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {data.stats.contentReviewed}
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Theaters Available
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {data.stats.theatersAvailable}
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Marketing Materials
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {data.stats.marketingMaterialsGenerated}
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="bg-background/30 rounded-lg p-3 border border-border/30">
        <div className="text-xs font-mono text-muted-foreground">
          Generated: {new Date(data.timestamp).toLocaleString()}
        </div>
        <div className="text-xs font-mono text-muted-foreground mt-1">
          Cached with 'use cache' directive
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Fallback Component
 */
function CacheDataLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading cached data...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Cache Demo Data Component with Suspense
 * 
 * Wraps the cached data display in Suspense for proper streaming.
 */
export function CacheDemoData() {
  return (
    <Suspense fallback={<CacheDataLoading />}>
      <CachedDataDisplay />
    </Suspense>
  );
}

