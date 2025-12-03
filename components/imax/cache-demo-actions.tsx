/**
 * IMAX Cache Demo Actions Component
 * 
 * Client component for interactive cache revalidation.
 * Only handles user interactions - data fetching is server-side.
 */

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { revalidateCacheAction } from "@/app/actions/cache-demo";
import { useRouter } from "next/navigation";

export function CacheDemoActions() {
  const [isPending, startTransition] = useTransition();
  const [isRevalidating, setIsRevalidating] = useState(false);
  const router = useRouter();

  // Trigger revalidation via Server Action
  const handleRevalidate = () => {
    setIsRevalidating(true);
    startTransition(async () => {
      await revalidateCacheAction();
      // Refresh the page to show updated cached data
      router.refresh();
      setIsRevalidating(false);
    });
  };

  // Refresh to refetch cached data
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/50">
        <Button
          onClick={handleRefresh}
          disabled={isPending}
          variant="outline"
          className="flex-1"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isPending && "animate-spin")} />
          Refresh (Cached)
        </Button>
        <Button
          onClick={handleRevalidate}
          disabled={isRevalidating || isPending}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", (isRevalidating || isPending) && "animate-spin")} />
          Revalidate Cache
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <p className="text-sm text-card-foreground/80 mb-2">
          <strong>What this demo shows:</strong>
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            <strong>Cached content:</strong> The data above is fetched using Next.js 16's 'use cache' directive, which caches the result server-side
          </li>
          <li>
            <strong>Same data served:</strong> Click "Refresh (Cached)" multiple times - you'll see the same version number and timestamp because the data is cached
          </li>
          <li>
            <strong>Automatic revalidation:</strong> After 60 seconds, the cache expires and Next.js automatically fetches fresh data on the next request
          </li>
          <li>
            <strong>On-demand revalidation:</strong> Click "Revalidate Cache" to immediately mark the cache as stale and fetch fresh data using revalidateTag
          </li>
          <li>
            <strong>Streaming with Suspense:</strong> The cached data loads inside a Suspense boundary, allowing the page to render immediately while data streams in
          </li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-purple-500/20">
          <strong>Technical details:</strong> Uses 'use cache' + cacheTag('imax-cache-demo') + cacheLife('cache-demo') for 1min cache lifetime, with revalidateTag() for on-demand invalidation
        </p>
      </div>
    </div>
  );
}

