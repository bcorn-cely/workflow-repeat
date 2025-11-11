import { getRun } from 'workflow/api'
// @ts-ignore - Internal APIs not exposed in public types
import { getWorld } from '@workflow/core/runtime'
// @ts-ignore - Internal APIs not exposed in public types  
import { serializeTraceCarrier } from '@workflow/core/telemetry'

export async function POST(req: Request) {
    const { runId } = await req.json();

    if (!runId) {
        return new Response('Run ID is required', { status: 400 });
    }

    try {
        // Get the failed workflow run
        const run = getRun(runId);
        const status = await run.status;

        if (status !== 'failed') {
            return new Response(
                JSON.stringify({ error: `Workflow is not in a failed state. Current status: ${status}` }), 
                { status: 400 }
            );
        }

        // Get the world instance to access run and queue APIs
        const world = getWorld();
        
        // Get the workflow run details to access workflow name
        const workflowRun = await world.runs.get(runId);
        const workflowName = workflowRun.workflowName;
        
        // Update the workflow status back to 'running' to resume it
        await world.runs.update(runId, {
            status: 'running',
        });
        
        // Serialize trace context to propagate across queue boundary
        const traceCarrier = await serializeTraceCarrier();
        
        // Re-enqueue the workflow to resume execution
        // The workflow will replay all events from the event log and continue from where it left off
        await world.queue(`__wkf_workflow_${workflowName}`, {
            runId: runId,
            traceCarrier,
        }, {
            deploymentId: workflowRun.deploymentId,
        });
        
        return new Response(
            JSON.stringify({ 
                message: 'Workflow resumed successfully',
                runId: runId,
                workflowName: workflowName
            }), 
            { status: 200 }
        );
    } catch (error) {
        console.error('Error resuming workflow:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to resume workflow', details: error instanceof Error ? error.message : String(error) }), 
            { status: 500 }
        );
    }
}

