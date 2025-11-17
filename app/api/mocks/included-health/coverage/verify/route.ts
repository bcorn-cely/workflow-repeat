export async function POST(req: Request) {
  const body = await req.json();
  const { insurancePlanId, providerId, careType } = body;
  
  // Simulate insurance verification
  // Randomly return covered/uncovered to demonstrate workflow
  const covered = Math.random() > 0.2; // 80% covered
  
  const result = {
    covered,
    copay: covered ? (careType === 'specialist' ? 50 : 25) : undefined,
    deductible: covered ? 500 : undefined,
    outOfNetwork: !covered,
    message: covered
      ? 'Provider is in-network and covered by your plan'
      : 'Provider may be out-of-network or not fully covered',
  };
  
  // Simulate delay
  await new Promise((r) => setTimeout(r, 300));
  
  return Response.json(result);
}

