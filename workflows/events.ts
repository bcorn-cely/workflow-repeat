// lib/workflows/events.ts
import { getWritable } from "workflow";
import { UIMessageChunk } from "ai";

const enc = new TextEncoder();

/**
 * Emit a machine-readable JSONL line from a workflow.
 * NOTE: getWritable() takes no args; "namespace" is just a field in the JSON.
 */
export async function emitEvent(writable: WritableStream<UIMessageChunk> ,params: {
  namespace: string;  // e.g. "AI" or "Renewal"
  step: string;        // e.g. "UserNotification" or "Progress"
  message: string;
  data?: unknown;
}) {
  const { namespace, step, message, data } = params;
  const ts = new Date().toISOString();
  const line = JSON.stringify({ ts, namespace, step, message, data }) + "\n";
  const writer = writable.getWriter();
  await writer.write({
    type: 'data-progress',
    data: { message: line},
    transient: true,
  })
  // const writable = getWritable(); // <- no options
  // const writer = writable.getWriter();
  // const line = JSON.stringify({ ts, namespace, step, message, data }) + "\n";
  // await writer.write(enc.encode(line));
  writer.releaseLock();
  // Don't close the stream; many events may follow
  return { ts };
}

/** Convenience wrapper for user-facing chat notices. */
export async function aiTell(writable: WritableStream<UIMessageChunk>, message: string, data?: unknown) {
  'use step'
  return emitEvent(writable, {
    namespace: "AI",
    step: "UserNotification",
    message,
    data,
  });
}
