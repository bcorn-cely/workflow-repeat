import { sleep, getWritable } from 'workflow';
import { complianceCheck, extractSoV, getLossTrends, quoteCarrier, RenewalInput, sendBrokerApprovalRequest, compileMarketSummary} from './steps';
import { aiTell } from '../../events';
import { brokerApprovalHook } from './hooks';


export async function renewal(input: RenewalInput) {
    'use workflow';

    // first logging
    const writable = getWritable();
    // perform renewal work here
    const sov = await extractSoV(input.sovFileId);

    const loss = await getLossTrends(input.accountId);

    const quotes = await Promise.all(input.carriers.map((c) => quoteCarrier(c, sov, loss)));

    const compliance = await complianceCheck({ quotes, state: input.state });

    const token = `renewal:${input.accountId}:${input.effectiveDate}`;

    // Create the hook in workflow context (required)
    const approval = brokerApprovalHook.create({ token });
    
    // Send email and emit notification (step)
    await sendBrokerApprovalRequest(token, input.brokerEmail);

    // Pause: wait for approval OR timeout (in workflow context)
    const decision = await Promise.race([
      approval, // resolved when /api/workflows/renewal/approve calls brokerApprovalHook.resume(token, { ... })
      (async () => { await sleep("1m"); return { approved: false, comment: "timeout" as const }; })(),
    ]);

    // Post-outcome notices
    if (decision.comment === "timeout") {
      await aiTell(writable, `Approval timed out after 1 minute. You can restart when ready.`, { token });
    } else if (decision.approved === false) {
      await aiTell(writable, `Broker requested changes${decision.comment ? `: ${decision.comment}` : ""}.`, { token });
    } else {
      await aiTell(writable, `Approval received. Continuing.`, { token });
    }

    await aiTell(writable, `Approval: ${decision.approved ? "approved" : `rejected (${decision.comment ?? "no reason"})`}`, decision);

    if (!decision.approved) {
        await aiTell(writable, `Broker did not respond in time`, { token });
    }

    const summaryUrl = await compileMarketSummary({
        accountId: input.accountId,
        quotes,
    });
    await aiTell(writable, `Market summary compiled: ${summaryUrl}`, { token });

    return { accountId: input.accountId, quotes, compliance, summaryUrl };
}
