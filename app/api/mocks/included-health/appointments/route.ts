export async function POST(req: Request) {
  const body = await req.json();
  const { providerId, patientId, date, time, careType } = body;
  
  // Simulate occasional slot conflicts
  if (Math.random() < 0.1) {
    return new Response('Appointment slot no longer available', { status: 409 });
  }
  
  // Generate appointment ID
  const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const appointment = {
    appointmentId,
    providerId,
    patientId,
    date,
    time,
    careType,
    status: 'confirmed',
    confirmationNumber: `CONF-${appointmentId.toUpperCase()}`,
  };
  
  // Simulate delay
  await new Promise((r) => setTimeout(r, 300));
  
  return Response.json(appointment);
}
