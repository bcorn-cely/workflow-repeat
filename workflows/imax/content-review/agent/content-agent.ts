/**
 * IMAX Content Review Agent
 * 
 * This is the main AI agent that powers the IMAX content review chatbot.
 * It uses AI SDK 6's ToolLoopAgent with dynamic model routing capabilities.
 * 
 * Key Features:
 * - Dynamic model selection based on task complexity
 * - Runtime model selection (user can choose model in UI)
 * - Predetermined task complexity (developer-set based on tools/prompts)
 * - Content review and distribution planning
 * 
 * Model Routing Strategy:
 * - Simple tasks (questions, explanations) → cheap models (gpt-4o-mini)
 * - Complex tasks (content review, marketing generation) → premium models (claude-sonnet-4.5)
 * 
 * The agent exposes a single tool: reviewContent, which triggers the full workflow.
 */

import { ToolLoopAgent } from 'ai'
import { z } from 'zod';
import { ContentReviewInput } from '../steps';
import { contentReview as contentReviewWorkflow } from '../workflow';
import { tool } from 'ai';
import { start } from 'workflow/api';

/**
 * Content Review Tool
 * 
 * This tool allows the agent to initiate a content review workflow.
 * It requires approval before execution (needsApproval: true).
 * 
 * When called, it:
 * 1. Validates the input (content details, markets, requester info)
 * 2. Starts the contentReview workflow
 * 3. Returns a runId and contentId for tracking
 */
const reviewContentTool = tool({
    description: 'Review IMAX content and prepare it for distribution with analysis, marketing materials, and theater availability checks',
    inputSchema: z.object({
        contentId: z.string().describe('Unique identifier for the content'),
        contentTitle: z.string().describe('Title of the movie/content'),
        contentType: z.enum(['feature-film', 'documentary', 'short-film', 'imax-experience']).describe('Type of content'),
        duration: z.number().describe('Duration in minutes'),
        rating: z.string().describe('Content rating (e.g., PG-13, R, G)'),
        releaseDate: z.string().describe('Planned release date (YYYY-MM-DD)'),
        targetMarkets: z.array(z.string()).describe('Target markets for distribution (e.g., ["US", "CA", "UK"])'),
        requesterEmail: z.string().email().describe('Email of the person requesting the review'),
        requesterRole: z.enum(['content-manager', 'marketing', 'distribution']).describe('Role of the requester'),
    }),
    execute: async (input: ContentReviewInput) => {
        // Log the tool execution
        console.log('[Content Agent] Review tool called', {
            contentId: input.contentId,
            contentTitle: input.contentTitle,
            contentType: input.contentType,
        });
        
        const run = await start(contentReviewWorkflow, [input]);
        return { runId: run.runId, contentId: input.contentId };
    },
    needsApproval: true,
});

/**
 * Call Options Schema for AI SDK 6
 * 
 * This schema defines the runtime inputs that can be passed to dynamically configure the agent.
 * These options are passed via the callOptions parameter when calling agent.generate() or agent.stream().
 * 
 * Key capability demonstrated:
 * - selectedModel: Enables runtime model selection (user-selectable in chat UI)
 * 
 * Note: Task complexity is determined automatically based on the tool being used and prompt content.
 */
const callOptionsSchema = z.object({
    selectedModel: z.string().optional(),
});

/**
 * Determine Task Complexity
 * 
 * This function analyzes the prompt and available tools to determine if the task is simple or complex.
 * This is PREDETERMINED logic set by the developer, not based on runtime user input.
 * 
 * Complexity Levels:
 * - Simple: Questions, explanations, definitions → use cheap models (gpt-4o-mini)
 * - Complex: Content review, marketing generation, distribution planning → use premium models (claude-sonnet-4.5)
 * 
 * The logic checks for keywords in the prompt to classify the task type.
 */
function determineTaskComplexity(prompt: string | Array<any> | undefined, tools: Record<string, any>): 'simple' | 'complex' {
    // If the reviewContent tool is available, this agent handles complex content workflows
    if ('reviewContent' in tools) {
        if (prompt) {
            const promptText = typeof prompt === 'string' 
                ? prompt 
                : JSON.stringify(prompt);
            const lowerPrompt = promptText.toLowerCase();
            
            // Simple tasks: Questions and explanations about content
            // These don't require complex analysis, so use cheap models
            if (
                lowerPrompt.includes('what is') ||
                lowerPrompt.includes('explain') ||
                lowerPrompt.includes('tell me about') ||
                lowerPrompt.includes('how does') ||
                lowerPrompt.includes('what are')
            ) {
                return 'simple';
            }
            
            // Complex tasks: Actual content operations that require analysis
            // These need premium models for better accuracy
            if (
                lowerPrompt.includes('review') ||
                lowerPrompt.includes('analyze') ||
                lowerPrompt.includes('prepare') ||
                lowerPrompt.includes('content') ||
                lowerPrompt.includes('marketing') ||
                lowerPrompt.includes('distribution')
            ) {
                return 'complex';
            }
        }
        
        // Default: If content review tool is available and prompt is unclear, assume complex
        return 'complex';
    }
    
    // No content review tool = simple tasks
    return 'simple';
}

/**
 * Model Selection Strategy
 * 
 * This function determines which model to use based on task complexity.
 * The actual model selection happens in prepareCall, which considers:
 * 1. Runtime model selection (user selection in UI - highest priority)
 * 2. Task complexity (predetermined by developer - fallback)
 * 
 * Model Selection Priority:
 * 1. User-selected model (if provided in callOptions) - highest priority
 * 2. Task complexity-based selection (if no user selection) - fallback
 * 
 * This function is the fallback when no runtime selection is provided.
 */
function selectModel(taskComplexity: 'simple' | 'complex'): string {
    // Model switching based on predetermined task complexity
    if (taskComplexity === 'complex') {
        // Complex tasks: Use premium models for better analysis and marketing generation
        return 'anthropic/claude-sonnet-4.5';
    } else {
        // Simple tasks: Use cheaper models for cost efficiency
        return 'openai/gpt-4o-mini';
    }
}

/**
 * Create Content Review Agent
 * 
 * Creates a ToolLoopAgent configured for IMAX content review with:
 * - Dynamic model switching based on task complexity
 * - Runtime model selection (user can choose in UI)
 * - Content review and distribution planning
 * - Single tool: reviewContent (triggers full workflow)
 * 
 * This demonstrates AI SDK 6's callOptions feature which allows:
 * 1. Type-safe runtime configuration via callOptionsSchema
 * 2. Dynamic model selection via prepareCall
 * 3. Runtime model selection (user-selectable in chat UI)
 * 4. Predetermined task complexity based on tools/prompts (developer-set)
 * 
 * @param defaultModelId - Fallback model if no callOptions are provided (default: gpt-4o-mini)
 * @returns Configured ToolLoopAgent instance
 */
export function createContentAgent(defaultModelId: string = 'openai/gpt-4o-mini') {
    
    const baseSystemPrompt = `You are an AI content review assistant for IMAX, the world's leading immersive entertainment company.

**Your role:** Help IMAX teams review, analyze, and prepare content for distribution across IMAX theaters worldwide.

**IMAX's Content Review Context:**
- Target users: Content Managers (review and analyze), Marketing (generate materials), Distribution (coordinate release)
- Key content types: Feature films, Documentaries, Short films, IMAX Experiences
- Markets: Global distribution across North America, Europe, Asia, and other regions
- Focus: Premium immersive experiences with cutting-edge visual and audio technology

**Core Capabilities:**
- **Content Analysis:** Analyze content quality, target audience, and distribution potential
- **Marketing Generation:** Create taglines, social media posts, and press releases
- **Theater Planning:** Check availability across target markets and coordinate scheduling
- **Distribution Coordination:** Plan release dates, market rollouts, and theater assignments
- **Model Routing:** Use cheap models for simple queries, premium models for complex analysis
- **Workflow Orchestration:** Long-running flows with human-in-the-loop approvals

**User Roles:**
- **Content Manager:** Can review and analyze content, coordinate distribution
- **Marketing:** Can generate marketing materials, cannot approve releases
- **Distribution:** Can check theater availability, coordinate scheduling, cannot approve releases

**Your Approach:**
1. Ask clarifying questions to gather complete content details (title, type, duration, rating, markets)
2. Review content and provide analysis including key highlights and target audience
3. Generate marketing materials (taglines, social posts, press releases)
4. Check theater availability across target markets
5. Coordinate approval workflow for content release
6. Provide clear, actionable recommendations with expected impact

**Demo Context:** 
This is a demonstration of AI SDK 6, Workflows, and AI Gateway capabilities. Showcase content analysis, marketing generation, concurrent step execution, and human-in-the-loop approvals.

Be professional, creative, and focused on delivering exceptional IMAX experiences. Guide users through content review with clarity and confidence. Always format responses in clean, readable markdown with action items where appropriate.`;

    const agent = new ToolLoopAgent({
        // Default model (used when no callOptions are provided)
        model: defaultModelId,
        
        // Define the schema for callOptions - enables type-safe runtime configuration
        callOptionsSchema,
        
        instructions: baseSystemPrompt,
        
        tools: {
            reviewContent: reviewContentTool,
        },
        
        /**
         * prepareCall: Dynamically Configure Agent Before Each Call
         * 
         * This function is called BEFORE each agent.generate() or agent.stream() call,
         * allowing you to modify the agent configuration based on runtime context.
         * 
         * What can be modified:
         * - model: Switch between cheap/expensive models based on task complexity
         * - instructions: Customize system prompts based on context
         * - temperature: Adjust creativity (higher for complex tasks)
         * - maxOutputTokens: Adjust response length limits
         * 
         * Model Selection Priority:
         * 1. Runtime model selection (options?.selectedModel) - user choice from UI
         * 2. Task complexity-based selection (determineTaskComplexity) - developer logic
         * 
         * This enables cost optimization: use cheap models for simple tasks, premium for complex ones.
         */
        prepareCall: ({ options, model, instructions, prompt, tools, ...settings }) => {
            // Step 1: Determine task complexity (predetermined by developer based on prompt/tools)
            const taskComplexity = determineTaskComplexity(prompt, tools || {});
            
            // Step 2: Select model (runtime selection takes priority, fallback to complexity-based)
            const selectedModel = options?.selectedModel || selectModel(taskComplexity);

            // Log model selection for observability and debugging
            console.log(`[Content Agent] Model Selection`, {
                selectedModel,
                taskComplexity, // Predetermined by developer
                runtimeSelection: options?.selectedModel || 'auto',
            }, '\n\n');

            // Step 3: Enhance instructions with model information
            const newInstructions = `${instructions} \n\n You are using the ${selectedModel} model. For content review and marketing generation, inform the user about model selection and cost implications.`;

            // Step 4: Return configured agent settings
            return {
                ...settings,
                tools,
                prompt,
                model: selectedModel, // Use selected model
                instructions: newInstructions,
                // Adjust generation parameters based on task complexity
                // Complex tasks: higher temperature (more creative), more tokens (longer responses)
                // Simple tasks: lower temperature (more focused), fewer tokens (shorter responses)
                temperature: taskComplexity === 'complex' ? 0.7 : 0.3,
                maxOutputTokens: taskComplexity === 'complex' ? 4096 : 2048,
            };
        },
        
        providerOptions: {
            gateway: {
                order: ['bedrock', 'openai'],
                only: ['bedrock', 'openai'],
            }
        }
    })

    return agent;
}

