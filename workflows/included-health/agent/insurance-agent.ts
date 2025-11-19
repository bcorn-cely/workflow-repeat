import { DurableAgent } from '@workflow/ai/agent'
import z from 'zod';
import { CareNavigationInput } from '../steps';
import { careNavigation as careNavigationWorkflow } from '../workflow';
import { UIMessageChunk, ModelMessage } from 'ai';
import { getWritable } from 'workflow';



export async function createInsuranceAgent(messages: ModelMessage[], modelId: string = 'anthropic/claude-4-5-sonnet') {
    'use workflow'
    
    const systemPrompt =  `You are a helpful insurance assistant for Included Health. Your very first message should always include the name of the LLM Model used no matter what. Every single time! This is actually a demo where we are showing off the capabilities of the AI SDK 6 Beta, Workflows, and AI Gateway. You should go through 
        processes like care navigation, appointment scheduling, and insurance coverage verification. You should treat this as a real use case while showing off capabilities that matter to technical and non technical folks observing the demo.
        You should always return markdown which is clearly readable by the user.`;
    const agent = new DurableAgent({
        model: modelId,
        system: systemPrompt,
        tools: {
            careNavigation: {
                description: 'Navigate to a provider and schedule an appointment',
                inputSchema: z.object({
                    patientId: z.string(),
                    careType: z.string(),
                    specialty: z.string().optional(),
                    zipCode: z.string(),
                    insurancePlanId: z.string(),
                    preferredDate: z.string().optional(),
                    urgency: z.enum(['routine', 'urgent', 'emergency']),
                    patientEmail: z.string().email(),
                    patientPhone: z.string().optional(),
                }),
                execute: async (input: CareNavigationInput) => {
                    return await careNavigationWorkflow(input)

                },
                needsApproval: true,
            },
        },
    })

    return await agent.stream({
        messages: messages,
        writable: getWritable<UIMessageChunk>()
    })
}
