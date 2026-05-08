import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage } from '../services/chatService'
import { useDashboard } from '../context/DashboardContext'
import { storage } from '../utils/helpers'
import toast from 'react-hot-toast'

const CHAT_STORAGE_KEY = 'space-dashboard-chat'
const MAX_MESSAGES = 30

export function useChat() {
  const { state } = useDashboard()
  const [messages, setMessages] = useState(() => {
    return storage.get(CHAT_STORAGE_KEY) || []
  })
  const [isTyping, setIsTyping] = useState(false)

  // Persist messages to localStorage
  useEffect(() => {
    storage.set(CHAT_STORAGE_KEY, messages.slice(-MAX_MESSAGES))
  }, [messages])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text, timestamp: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      const dashboardContext = {
        issData: state.issData,
        nearestPlace: state.nearestPlace,
        issSpeed: state.issSpeed,
        astronauts: state.astronauts,
        newsArticles: state.newsArticles,
        issHistory: state.issHistory,
      }

      const response = await sendChatMessage(
        text,
        dashboardContext,
        messages.slice(-6)
      )

      const assistantMsg = { role: 'assistant', content: response, timestamp: Date.now() }
      setMessages((prev) => [...prev, assistantMsg].slice(-MAX_MESSAGES))
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ ${err.message}`,
        timestamp: Date.now(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMsg])
      toast.error('Chat error: ' + err.message)
    } finally {
      setIsTyping(false)
    }
  }, [state, messages])

  const clearChat = useCallback(() => {
    setMessages([])
    storage.remove(CHAT_STORAGE_KEY)
    toast.success('Chat cleared')
  }, [])

  return { messages, isTyping, sendMessage, clearChat }
}
