/**
 * IMAX Content Release Approval API Route
 * 
 * API endpoint for approving content release in the IMAX content review workflow.
 * This endpoint is called when a user approves or rejects content release via the approval page.
 * 
 * The approval is handled via workflow hooks that pause execution
 * until the approver responds.
 */

import { NextRequest, NextResponse } from 'next/server';
import { contentReleaseApprovalHook } from '@/workflows/imax/content-review/hooks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST Handler for Content Release Approval
 * 
 * Processes approval/rejection of content release.
 * 
 * Request body:
 * - token: Approval token from the workflow hook
 * - approved: Whether the content is approved for release
 * - comment: Optional feedback from approver
 * - by: Email of the approver
 * - releaseNotes: Optional notes about the release
 * 
 * Response: Success or error status
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, approved, comment, by, releaseNotes } = body as {
      token: string;
      approved: boolean;
      comment?: string;
      by?: string;
      releaseNotes?: string;
    };

    console.log('[Content Approval API] Received approval request', {
      token,
      approved,
      by: by || 'unknown',
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Approval token is required' },
        { status: 400 }
      );
    }

    // Resolve the approval hook with the decision
    await contentReleaseApprovalHook.resolve({
      token,
      result: {
        approved,
        comment,
        by: by || 'content-manager@imax.com',
        releaseNotes,
      },
    });

    return NextResponse.json({
      success: true,
      message: approved ? 'Content release approved' : 'Content release rejected',
    });
  } catch (error) {
    console.error('[Content Approval API] Error processing approval', error);
    return NextResponse.json(
      { error: 'Failed to process approval', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

