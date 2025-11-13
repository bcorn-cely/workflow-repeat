// lib/ai/provider.ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const gateway = createOpenAICompatible({
  name: 'ai-gateway',
  baseURL: process.env.AI_GATEWAY_BASE_URL ?? 'https://ai-gateway.vercel.sh/v1',
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  includeUsage: true,
});

export const model = gateway(process.env.AI_MODEL_ID ?? 'openai/gpt-4o-mini');

