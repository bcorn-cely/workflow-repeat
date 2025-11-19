import { sleep, getWritable } from 'workflow';
import {
  findProviders,
  checkProviderAvailability,
  verifyInsuranceCoverage,
  scheduleAppointment,
  sendAppointmentConfirmation,
  CareNavigationInput,
} from './steps';
import { aiTell } from '../events';
import { createCareReviewHook, createReviewConfirmationHook } from './hooks';

export async function careNavigation(input: CareNavigationInput) {
  'use workflow';

  // Initial logging

  const writable = getWritable();
  // Find matching providers
  const providers = await findProviders({
    careType: input.careType,
    specialty: input.specialty,
    zipCode: input.zipCode,
  });


  if (providers.length === 0) {
    await aiTell(writable,
      `I couldn't find any providers matching your criteria. Would you like to expand your search?`,
      { token: `care:${input.patientId}:${Date.now()}` }
    );
    return { patientId: input.patientId, providers: [], error: 'No providers found' };
  }

  // Check availability for top providers (first 3)
  const topProviders = providers.slice(0, 3);
  const availabilityChecks = await Promise.all(
    topProviders.map((provider: any) =>
      checkProviderAvailability(provider.providerId, input.preferredDate)
    )
  );


  // Find first available provider
  let selectedProvider = null;
  let selectedSlot = null;
  for (let i = 0; i < topProviders.length; i++) {
    const provider = topProviders[i];
    const availability = availabilityChecks[i];
    if (availability.availableSlots && availability.availableSlots.length > 0) {
      selectedProvider = provider;
      selectedSlot = availability.availableSlots[0];
      break;
    }
  }

  if (!selectedProvider || !selectedSlot) {
    await aiTell(writable,
      `I found providers, but none have immediate availability. Would you like me to check for later dates?`,
      { token: `care:${input.patientId}:${Date.now()}` }
    );
    return {
      patientId: input.patientId,
      providers,
      error: 'No immediate availability',
    };
  }

  // Verify insurance coverage
  const insuranceVerification = await verifyInsuranceCoverage(writable, {
    insurancePlanId: input.insurancePlanId,
    providerId: selectedProvider.providerId,
    careType: input.careType,
    patientId: input.patientId
  });


  // For urgent/emergency cases or complex insurance situations, require human review
  const token = `care:${input.patientId}:${Date.now()}`;
  let requiresReview = input.urgency === 'emergency' || !insuranceVerification.covered;

  if (requiresReview) {
    const review = createCareReviewHook(token);
    
    await sendCareReviewRequest(token, input.patientEmail, {
      provider: selectedProvider,
      slot: selectedSlot,
      insurance: insuranceVerification,
    });

    // Wait for review OR timeout (5 minutes for emergency, 1 hour for routine)
    const timeout = input.urgency === 'emergency' ? '30s' : '1m';
    const decision = await Promise.race([
      review,
      (async () => {
        await sleep(timeout);
        return { approved: false, notes: 'Review timeout' };
      })(),
    ]);

    if ('approved' in decision && decision.approved === false) {
      return {
        patientId: input.patientId,
        providers,
        insuranceVerification,
        error: `Review not approved. Your appointment request requires additional review. ${decision.notes || ''}`,
      };
    }

    // If alternative provider suggested, use it
    if ('alternativeProviderId' in decision) {
      const altProvider = providers.find((p: any) => p.providerId === decision.alternativeProviderId);
      if (altProvider) {
        selectedProvider = altProvider;
        const altAvailability = await checkProviderAvailability(
          altProvider.providerId,
          input.preferredDate
        );
        if (altAvailability.availableSlots && altAvailability.availableSlots.length > 0) {
          selectedSlot = altAvailability.availableSlots[0];
        }
      }
    }

  }

  // Schedule the appointment
  const appointment = await scheduleAppointment({
    providerId: selectedProvider.providerId,
    patientId: input.patientId,
    date: selectedSlot.date,
    time: selectedSlot.time,
    careType: input.careType,
  });

  const confirmationToken = `confirmation:${input.patientId}:${Date.now()}`;
  const confirmationHook = createReviewConfirmationHook.create({ token: confirmationToken });
  sleep('30s');

  // Send confirmation
  const confirmationUrl = `${process.env.APP_BASE_URL ?? 'http://localhost:3000'}/appointments/confirm?token=${encodeURIComponent(token)}`;
  await sendAppointmentConfirmation(writable, token, input.patientEmail, {
    provider: selectedProvider,
    appointment,
    insurance: insuranceVerification,
  });


  return {
    patientId: input.patientId,
    providers,
    insuranceVerification,
    appointment,
    confirmationUrl,
  };
}


async function sendCareReviewRequest(token: string, email: string, details: any) {
  'use step';
  const reviewUrl = `${process.env.APP_BASE_URL ?? 'http://localhost:3000'}/care/review?token=${encodeURIComponent(token)}`;
  const writable = getWritable();
  
  await fetch(`${process.env.NOTIFY ?? process.env.APP_BASE_URL ?? 'http://localhost:3000'}/api/mocks/notify/email`, {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      subject: 'Care Navigation Review Required - Included Health',
      url: reviewUrl,
      details,
    }),
    headers: { 'content-type': 'application/json' },
  });

  await aiTell(writable,
    `I've sent a review request to ${email}. Please check your inbox to complete the review.`,
    { token, reviewUrl, email }
  );
}
