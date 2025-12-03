/**
 * IMAX Cache Demo Server Actions
 * 
 * Server actions for triggering cache revalidation.
 */

'use server';

import { revalidateTag } from 'next/cache';
import { updateDataVersion } from '@/lib/imax/cache-demo-data';

/**
 * Revalidate Cache Action
 * 
 * Updates the data and triggers cache revalidation using revalidateTag.
 * Uses 'max' profile for stale-while-revalidate semantics (recommended).
 */
export async function revalidateCacheAction() {
  // Update the data version (simulating a data change)
  updateDataVersion();
  
  // Revalidate the cache tag - this marks it as stale
  // Using 'max' profile provides stale-while-revalidate semantics
  revalidateTag('imax-cache-demo', 'max');
  
  return {
    success: true,
    message: 'Cache revalidation triggered',
    timestamp: new Date().toISOString(),
  };
}

