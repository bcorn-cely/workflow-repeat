export async function POST(req: Request) {
  const body = await req.json();
  const { careType, specialty, zipCode } = body;
  
  // Simulate provider search results
  const providers = [
    {
      providerId: 'prov-001',
      name: 'Dr. Sarah Johnson',
      specialty: specialty || 'Primary Care',
      distance: 2.5,
      rating: 4.8,
      address: `${zipCode} Medical Center`,
    },
    {
      providerId: 'prov-002',
      name: 'Dr. Michael Chen',
      specialty: specialty || 'Primary Care',
      distance: 5.1,
      rating: 4.6,
      address: `${zipCode} Health Clinic`,
    },
    {
      providerId: 'prov-003',
      name: 'Dr. Emily Rodriguez',
      specialty: specialty || 'Primary Care',
      distance: 3.8,
      rating: 4.9,
      address: `${zipCode} Family Practice`,
    },
  ];
  
  // Filter by specialty if provided
  const filtered = specialty
    ? providers.filter((p) => p.specialty.toLowerCase().includes(specialty.toLowerCase()))
    : providers;
  
  // Simulate delay
  await new Promise((r) => setTimeout(r, 300));
  
  return Response.json(filtered);
}

