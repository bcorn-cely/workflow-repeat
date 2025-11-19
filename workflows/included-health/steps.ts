// workflows/included-health/steps.ts
import { FatalError, RetryableError } from 'workflow';
import { UIMessageChunk } from 'ai';
import { aiTell } from '../events';

export type CareNavigationInput = {
  patientId: string;
  careType: string; // e.g., "primary care", "specialist", "urgent care"
  specialty?: string; // e.g., "cardiology", "dermatology"
  zipCode: string;
  insurancePlanId: string;
  preferredDate?: string; // ISO date
  urgency: 'routine' | 'urgent' | 'emergency';
  patientEmail: string;
  patientPhone?: string;
};

export type CareNavigationResult = {
  patientId: string;
  providers: Array<{
    providerId: string;
    name: string;
    specialty: string;
    distance: number;
    rating: number;
  }>;
  insuranceVerification: { covered: boolean; copay?: number; deductible?: number };
  appointment?: {
    providerId: string;
    appointmentId: string;
    date: string;
    time: string;
  };
  confirmationUrl: string;
};

const BASE = process.env.APP_BASE_URL ?? 'http://localhost:3000';
const PROVIDER = process.env.PROVIDER ?? `${BASE}/api/mocks/included-health`;
const INSURANCE = process.env.INSURANCE ?? `${BASE}/api/mocks/included-health`;
const SCHEDULE = process.env.SCHEDULE ?? `${BASE}/api/mocks/included-health`;
const NOTIFY = process.env.NOTIFY ?? `${BASE}/api/mocks`;

/** ---------- Durable steps ---------- */

export async function findProviders(input: { careType: string; specialty?: string; zipCode: string }) {
  "use step";
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  const res = await fetch(`${PROVIDER}/providers/search`, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) throw new Error(`findProviders failed: ${res.status}`);
  return res.json();
}
findProviders.maxRetries = 3;

export async function checkProviderAvailability(providerId: string, preferredDate?: string) {
  "use step";
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  const res = await fetch(`${SCHEDULE}/availability/${providerId}${preferredDate ? `?date=${preferredDate}` : ''}`);
  
  if (res.status === 429) throw new RetryableError('Rate limited', { retryAfter: '30s' });
  if (res.status >= 500) throw new RetryableError(`Provider availability service error`);
  if (!res.ok) throw new Error(`checkProviderAvailability failed: ${res.status}`);
  
  return res.json();
}
checkProviderAvailability.maxRetries = 5;

export async function verifyInsuranceCoverage(writable: WritableStream<UIMessageChunk>, input: { insurancePlanId: string; providerId: string; careType: string, patientId: string; }) {
  "use step";
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  const res = await fetch(`${INSURANCE}/coverage/verify`, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { 'content-type': 'application/json' },
  });
  
  if (res.status === 404) throw new FatalError(`Insurance plan ${input.insurancePlanId} not found`);
  if (!res.ok) throw new Error(`verifyInsuranceCoverage failed: ${res.status}`);
  
  const insuranceVerification = await res.json();
  if (!insuranceVerification.covered) {
    await aiTell(writable,
      `This provider may not be fully covered by your insurance plan. Would you like to see other options?`,
      { token: `care:${input.patientId}:${Date.now()}` }
    );
  }
  return insuranceVerification;
}
verifyInsuranceCoverage.maxRetries = 3;

export async function scheduleAppointment(input: {
  providerId: string;
  patientId: string;
  date: string;
  time: string;
  careType: string;
}) {
  "use step";
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  const res = await fetch(`${SCHEDULE}/appointments`, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { 'content-type': 'application/json' },
  });
  
  if (res.status === 409) throw new FatalError('Appointment slot no longer available');
  if (!res.ok) throw new Error(`scheduleAppointment failed: ${res.status}`);
  
  return res.json();
}
scheduleAppointment.maxRetries = 3;

export async function sendAppointmentConfirmation(writable: WritableStream<UIMessageChunk>, token: string, patientEmail: string, appointmentDetails: any) {
  "use step";
  
  const confirmationUrl = `${BASE}/appointments/confirm?token=${encodeURIComponent(token)}`;
  
  await sendConfirmationEmail(patientEmail, confirmationUrl, appointmentDetails);
  
  await aiTell(writable,
    `I've sent a confirmation email to ${patientEmail} with your appointment details. Please check your inbox.`,
    { token, confirmationUrl, patientEmail, appointmentDetails }
  );
}

export async function sendConfirmationEmail(email: string, url: string, details: any) {
  "use step";
  await fetch(`${NOTIFY}/notify/email`, {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      subject: 'Appointment Confirmation - Included Health',
      url,
      details,
    }),
    headers: { 'content-type': 'application/json' },
  });
}
