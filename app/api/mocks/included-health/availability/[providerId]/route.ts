export async function GET(
  _: Request,
  { params }: { params: { providerId: string } }
) {
  const { providerId } = await params;
  const url = new URL(_.url);
  const preferredDate = url.searchParams.get('date');
  
  // Simulate rate limiting occasionally (like the quote carrier endpoint)
  if (Math.random() < 0.3) {
    return new Response('Rate limited', { status: 429 });
  }
  
  // Generate available slots
  const baseDate = preferredDate ? new Date(preferredDate) : new Date();
  baseDate.setDate(baseDate.getDate() + 1); // Start from tomorrow
  
  const availableSlots = [];
  for (let i = 0; i < 5; i++) {
    const slotDate = new Date(baseDate);
    slotDate.setDate(slotDate.getDate() + i);
    
    availableSlots.push({
      date: slotDate.toISOString().split('T')[0],
      time: i % 2 === 0 ? '09:00' : '14:00',
      duration: 30,
    });
  }
  
  // Simulate delay
  await new Promise((r) => setTimeout(r, 300));
  
  return Response.json({
    providerId,
    availableSlots,
  });
}
