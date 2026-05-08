import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Trash2, Bot } from 'lucide-react'
import { useChat } from '../../hooks/useChat'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, isTyping, sendMessage, clearChat } = useChat()
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    sendMessage(input)
    setInput('')
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-12 h-12 rounded-full flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 cursor-pointer"
        style={{
          background: 'var(--accent)',
          color: '#fff',
          boxShadow: `0 4px 20px var(--accent-glow), var(--shadow-lg)`,
        }}
        id="chatbot-toggle-btn"
        aria-label="Toggle AI assistant"
      >
        {isOpen ? <X size={19} /> : <MessageCircle size={19} />}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 w-[340px] max-w-[calc(100vw-40px)] flex flex-col z-50 chat-enter"
          style={{
            height: '460px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <div className="flex items-center gap-2">
              <Bot size={16} />
              <div>
                <h3 className="text-xs font-bold leading-tight">Space AI</h3>
                <p className="text-[9px] opacity-70">Dashboard data only</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              title="Clear chat"
              id="chat-clear-btn"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5" style={{ background: 'var(--bg-base)' }}>
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full gap-2.5 py-6 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: 'var(--accent-soft)' }}
                >
                  🛰️
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  Ask about the dashboard
                </p>
                <p className="text-[10px] leading-relaxed max-w-[200px]" style={{ color: 'var(--text-tertiary)' }}>
                  ISS position, speed, astronauts, or latest news headlines
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade`}
              >
                <div
                  className="max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'var(--accent)',
                          color: '#fff',
                          borderBottomRightRadius: '6px',
                        }
                      : {
                          background: 'var(--bg-card)',
                          color: msg.isError ? 'var(--danger)' : 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderBottomLeftRadius: '6px',
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade">
                <div
                  className="rounded-2xl px-3.5 py-2.5 flex items-center gap-1"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderBottomLeftRadius: '6px',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'var(--accent)',
                        animation: `pulse-dot 1.4s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
            style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about dashboard data…"
              className="flex-1 bg-transparent text-xs outline-none px-3 py-2 rounded-xl"
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
              disabled={isTyping}
              id="chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 cursor-pointer disabled:cursor-default"
              style={{ background: 'var(--accent)', color: '#fff' }}
              id="chat-send-btn"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
