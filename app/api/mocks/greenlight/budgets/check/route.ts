export async function POST(req: Request) {
  const body = await req.json();
  const { campaignId, requestedBudget, dateRange } = body;
  
  // Simulate budget availability check
  // Mock budget limits by campaign type
  const campaignBudgets: Record<string, number> = {
    'acquisition': 200000,
    'retention': 100000,
    'brand_awareness': 150000,
    'product_launch': 300000,
  };
  
  // Determine campaign type from ID or default
  const campaignType = campaignId?.includes('acq') ? 'acquisition' 
    : campaignId?.includes('ret') ? 'retention'
    : campaignId?.includes('brand') ? 'brand_awareness'
    : campaignId?.includes('launch') ? 'product_launch'
    : 'acquisition';
  
  const campaignBudget = campaignBudgets[campaignType];
  const available = campaignBudget * 0.4; // Assume 40% remaining for this period
  
  const availableAmount = available;
  const isAvailable = !requestedBudget || requestedBudget <= availableAmount;
  
  let warning: string | undefined;
  if (requestedBudget && requestedBudget > availableAmount * 0.7) {
    warning = 'Budget is running low for this campaign type. Consider alternative channels or timing.';
  }
  
  // Simulate delay
  await new Promise((r) => setTimeout(r, 300));
  
  return Response.json({
    available: isAvailable,
    availableAmount,
    totalBudget: campaignBudget,
    usedAmount: campaignBudget - availableAmount,
    reason: isAvailable ? undefined : 'Insufficient budget remaining for this campaign type',
    warning,
    campaignType,
  });
}

