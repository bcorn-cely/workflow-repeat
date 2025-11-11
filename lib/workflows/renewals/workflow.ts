import { getWritable } from 'workflow';
import { complianceCheck, extractSoV, getLossTrends, quoteCarrier, RenewalInput, waitForBrokerApproval, compileMarketSummary} from './steps';


export async function renewal(input: RenewalInput) {
    'use workflow';

    // first logging
    await writeProgress({ namespace: 'Renewal', step: 'Started', message: 'Starting the renewal workflow' });

    // perform renewal work here
    const sov = await extractSoV(input.sovFileId);
    await writeProgress({ namespace: 'Renewal', step: 'Extracted SoV', message: `Parsed SoV rows: ${sov?.rows ?? 0}` });

    const loss = await getLossTrends(input.accountId);
    await writeProgress({ namespace: 'Renewal', step: 'Loaded loss trends', message: `Loaded loss trends for ${input.accountId}` });

    const quotes = await Promise.all(input.carriers.map((c) => quoteCarrier(c, sov, loss)));
    await writeProgress({ namespace: 'Renewal', step: 'Received quotes', message: `Received ${quotes.length} carrier quotes` });

    const compliance = await complianceCheck({ quotes, state: input.state });
    await writeProgress({ namespace: 'Renewal', step: 'Checked compliance', message: `Compliance checked: ${compliance.ok ? 'ok' : 'failed'}` });

    const approval = await waitForBrokerApproval(input.brokerEmail);
    await writeProgress({ namespace: 'Renewal', step: 'Checked approval', message: `Approval checked: ${approval.approved ? 'ok' : 'failed'}` });

    const summaryUrl = await compileMarketSummary({
        accountId: input.accountId,
        quotes,
        notes: approval.comment,
    });
    await writeProgress({ namespace: 'Renewal', step: 'Compiled market summary', message: `Market summary compiled: ${summaryUrl}` });

    return { accountId: input.accountId, quotes, compliance, summaryUrl };
}


export async function writeProgress({
    namespace,
    step,
    message,
    data = {}
}: { namespace: string, step: string, message: string, data?: unknown }) {
    'use step'

    const now = new Date().toISOString();
    const composedMessage = `${now} namespace: [${namespace}]\n step: [${step}]\n message: ${message}\n data: ${JSON.stringify(data)}`;

    const writable = getWritable({ namespace });

    const writer =  writable.getWriter()

    await writer.write(composedMessage);
    return composedMessage;
}

// num retries
writeProgress.maxRetries = 3;