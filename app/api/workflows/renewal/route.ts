import { start } from 'workflow/api'
import { renewal } from '@/lib/workflows/renewals/workflow';


export async function POST(req: Request) {
    const { chatId, accountData } = await req.json();

    if (!chatId) {
        return new Response('Chat ID is required', { status: 400 });
    }

    const mockAccountData = {
        accountId: 'ACME-123',
        effectiveDate: new Date().toISOString(),
        sovFileId: 'demo-sov',
        state: 'CA',
        brokerEmail: 'broker@example.com',
        carriers: ['Acme','Bravo']
    }

    const workflow = await start(renewal, [accountData || mockAccountData])
    return new Response(JSON.stringify({ run: workflow.runId}), { status: 200 });
}