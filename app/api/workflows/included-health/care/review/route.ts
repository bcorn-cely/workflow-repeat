// app/api/workflows/care/review/route.ts
import { RequestWithResponse } from 'workflow';
import { createCareReviewHook } from "@/workflows/included-health/hooks";

export async function POST(req: RequestWithResponse) {
  const { token: rawToken, approved, notes, alternativeProviderId, reviewedBy } = await req.json();
  if (typeof rawToken !== "string" || typeof approved !== "boolean") {
    return new Response("Bad Request", { status: 400 });
  }
  
  // Clean the token - remove any trailing quotes or whitespace that might have been introduced during URL encoding/decoding
  const token = rawToken.replace(/['"]+$/, '').trim();
  
  try {    
    
    return req.respondWith(Response.json(
      { approved, notes, alternativeProviderId, reviewedBy },
      { status: 200 }
    ))
  } catch (error) {
    return req.respondWith(Response.json(
      { 
        ok: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        token 
      },
      { status: 500 }
    ))
  }
}
