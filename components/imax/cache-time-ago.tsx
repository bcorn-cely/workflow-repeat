/**
 * Cache Time Ago Component
 * 
 * Client component that calculates and displays time ago.
 * This is needed because Date.now() cannot be used in Server Components
 * before accessing dynamic data.
 */

"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CacheTimeAgoProps {
  timestamp: string;
}

export function CacheTimeAgo({ timestamp }: CacheTimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState<number | null>(null);

  useEffect(() => {
    // Calculate time ago on client side where Date.now() is allowed
    const calculateTimeAgo = () => {
      const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
      setTimeAgo(diff);
    };

    calculateTimeAgo();
    // Update every second for live time display
    const interval = setInterval(calculateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  if (timeAgo === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>
        {timeAgo < 60
          ? `${timeAgo}s ago`
          : timeAgo < 3600
          ? `${Math.floor(timeAgo / 60)}m ago`
          : `${Math.floor(timeAgo / 3600)}h ago`}
      </span>
    </div>
  );
}

