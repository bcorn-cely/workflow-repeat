// app/api/workflows/renewal/approve/route.ts
import { brokerApprovalHook } from "@/workflows/renewals/hooks";

export async function POST(req: Request) {
  const { token: rawToken, approved, comment, by } = await req.json();
  if (typeof rawToken !== "string" || typeof approved !== "boolean") {
    return new Response("Bad Request", { status: 400 });
  }
  
  // Clean the token - remove any trailing quotes or whitespace that might have been introduced during URL encoding/decoding
  const token = rawToken.replace(/['"]+$/, '').trim();
  
  try {
    const result = await brokerApprovalHook.resume(token, { approved, comment, by });
    
    if (!result) {
      return Response.json(
        { 
          ok: false, 
          error: 'Hook not found',
          message: 'The approval hook was not found. The workflow may not have reached the approval point yet, or it may have already timed out.',
          token 
        },
        { status: 404 }
      );
    }
    
    return Response.json({ ok: true, runId: result.runId });
  } catch (error) {
    return Response.json(
      { 
        ok: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        token 
      },
      { status: 500 }
    );
  }
}

