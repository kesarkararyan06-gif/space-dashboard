/**
 * Chat Service — HuggingFace Router API (Chat Completions format)
 * Uses mistralai/Mistral-7B-Instruct-v0.2:featherless-ai via router.huggingface.co
 * Answers ONLY using injected dashboard data.
 */

const MODEL = 'mistralai/Mistral-7B-Instruct-v0.2:featherless-ai'

/**
 * Core fetch function — uses the exact HuggingFace router endpoint.
 */
async function query(data) {
  const response = await fetch(
    'https://router.huggingface.co/v1/chat/completions',
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const status = response.status
    if (status === 401) throw new Error('Invalid AI token. Please check your VITE_AI_TOKEN.')
    if (status === 503) throw new Error('AI model is loading. Please try again in a moment.')
    if (status === 429) throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    throw new Error(`API request failed (${status})`)
  }

  const result = await response.json()
  return result
}

/**
 * Send a message to the AI chatbot.
 * Injects current dashboard data into the system prompt so the model
 * answers ONLY from ISS + News data.
 */
export async function sendChatMessage(userMessage, dashboardContext, conversationHistory = []) {
  const token = import.meta.env.VITE_AI_TOKEN
  if (!token) {
    throw new Error('AI token not configured. Please set VITE_AI_TOKEN in your .env file.')
  }

  const systemContext = buildSystemContext(dashboardContext)

  // Build messages array in OpenAI-compatible chat format
  const messages = [
    {
      role: 'system',
      content: `You are a helpful Space Dashboard AI assistant. You MUST answer ONLY using the provided dashboard data below. If the requested information is not available in the dashboard data, clearly state: "I don't have that information in the current dashboard data." Do NOT use any external or general knowledge. Be concise and helpful.\n\n${systemContext}`,
    },
  ]

  // Add recent conversation history for context continuity
  const recent = conversationHistory.slice(-6)
  for (const msg of recent) {
    messages.push({
      role: msg.role,
      content: msg.content,
    })
  }

  // Add the current user message
  messages.push({ role: 'user', content: userMessage })

  try {
    const result = await query({
      model: MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
    })

    // Extract the assistant reply from chat completions response
    const reply = result?.choices?.[0]?.message?.content
    if (reply) {
      return reply.trim()
    }

    throw new Error('Unexpected AI response format')
  } catch (err) {
    // Re-throw errors that already have user-friendly messages
    if (err.message.includes('AI token') || err.message.includes('model is loading') || err.message.includes('Rate limit')) {
      throw err
    }
    throw new Error(err.message || 'Failed to get AI response')
  }
}

/**
 * Build a text summary of current dashboard data to inject as context.
 */
function buildSystemContext(ctx) {
  const parts = ['CURRENT DASHBOARD DATA:']

  if (ctx.issData) {
    parts.push(`ISS Position: Latitude ${ctx.issData.latitude?.toFixed(4)}, Longitude ${ctx.issData.longitude?.toFixed(4)}`)
  }
  if (ctx.nearestPlace) {
    parts.push(`ISS Nearest Location: ${ctx.nearestPlace}`)
  }
  if (ctx.issSpeed?.length) {
    const latest = ctx.issSpeed[ctx.issSpeed.length - 1]
    parts.push(`ISS Current Speed: ${latest.speed?.toFixed(1)} km/h`)
  }
  if (ctx.astronauts?.length) {
    parts.push(`People in Space: ${ctx.astronauts.length}`)
    parts.push(`Astronauts: ${ctx.astronauts.map((a) => `${a.name} (${a.craft})`).join(', ')}`)
  }
  if (ctx.newsArticles?.length) {
    parts.push('Latest News Headlines:')
    ctx.newsArticles.slice(0, 5).forEach((a, i) => {
      parts.push(`  ${i + 1}. "${a.title}" — ${a.source}`)
    })
  }
  if (ctx.issHistory?.length) {
    parts.push(`ISS Tracked Positions: ${ctx.issHistory.length}`)
  }

  return parts.join('\n')
}
