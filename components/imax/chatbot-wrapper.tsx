/**
 * IMAX Chatbot Wrapper
 * 
 * Server component that wraps the ContentChatbot client component.
 * Handles chat persistence by getting or creating a chat ID from cookies
 * and loading existing chat messages from the database.
 * 
 * Uses Suspense boundary internally to handle uncached data access (cookies).
 */

import { Suspense } from "react"
import { cookies } from "next/headers"
import { ContentChatbot } from "./content-chatbot"
import { createChat, loadChatMessages, convertSelectMessagesToChatUIMessages } from "@/lib/chat"
import type { ChatUIMessage } from "@/lib/chat"

/**
 * Chatbot with Cookies Access
 * 
 * Inner component that accesses cookies() (uncached data).
 * This is wrapped in Suspense to prevent blocking the page.
 */
async function ChatbotWithCookies() {
  const cookieStore = await cookies()
  let chatId = cookieStore.get('chat_id')?.value

  // Generate new chatId if it doesn't exist
  if (!chatId) {
    chatId = await createChat()
  }

  // Fetch initial messages for this chat
  const messages = await loadChatMessages(chatId)
  const initialMessages: ChatUIMessage[] = convertSelectMessagesToChatUIMessages(messages)

  return <ContentChatbot id={chatId} initialMessages={initialMessages} />
}

/**
 * Chatbot Wrapper Component
 * 
 * Wraps the chatbot in Suspense to handle uncached data access.
 * This keeps the Suspense boundary encapsulated within the component.
 */
export function ChatbotWrapper() {
  return (
    <Suspense fallback={null}>
      <ChatbotWithCookies />
    </Suspense>
  )
}

