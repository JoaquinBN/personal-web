'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const PROMPTS = [
  'what are you building right now?',
  'tell me about the biennale',
  'what happened with argue.fun?',
  'what even is agent UX?',
  'are you actually an AI?',
  'what breaks when agents are the users?',
  'why did you pause argue.fun?',
  'how old are you?',
  'who is albert?',
  'insult me',
]

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [displayedPrompt, setDisplayedPrompt] = useState('')
  const [isTypingPrompt, setIsTypingPrompt] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasMessages = messages.length > 0

  // Keyboard shortcut: / to open, Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isClosing) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isClosing])

  // Rotating placeholder
  useEffect(() => {
    if (!isOpen || input || hasMessages) return

    const prompt = PROMPTS[promptIndex]
    let charIndex = 0
    setIsTypingPrompt(true)
    setDisplayedPrompt('')

    const typeInterval = setInterval(() => {
      charIndex++
      setDisplayedPrompt(prompt.slice(0, charIndex))
      if (charIndex >= prompt.length) {
        clearInterval(typeInterval)
        setIsTypingPrompt(false)
      }
    }, 45)

    return () => clearInterval(typeInterval)
  }, [promptIndex, isOpen, input, hasMessages])

  useEffect(() => {
    if (isTypingPrompt || !isOpen || input || hasMessages) return
    const timeout = setTimeout(() => {
      setPromptIndex((i) => (i + 1) % PROMPTS.length)
    }, 2200)
    return () => clearTimeout(timeout)
  }, [isTypingPrompt, isOpen, input, hasMessages])

  const useSuggestion = useCallback(() => {
    if (input || isLoading) return
    setInput(PROMPTS[promptIndex])
    inputRef.current?.focus()
  }, [input, isLoading, promptIndex])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function close() {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 250)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setIsLoading(true)
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || 'Something went wrong')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

      const updateLast = (content: string) => {
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content }
          return updated
        })
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const token = parsed.choices?.[0]?.delta?.content
              if (token) { fullContent += token; updateLast(fullContent) }
            } catch {
              if (data.trim()) { fullContent += data; updateLast(fullContent) }
            }
          } else if (line.trim() && !line.startsWith(':')) {
            fullContent += line
            updateLast(fullContent)
          }
        }
      }

      if (buffer.trim()) {
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6)
          if (data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data)
              const token = parsed.choices?.[0]?.delta?.content
              if (token) fullContent += token
            } catch {
              if (data.trim()) fullContent += data
            }
          }
        } else if (!buffer.startsWith(':')) {
          fullContent += buffer
        }
        updateLast(fullContent)
      }

      if (!fullContent) {
        const fallback = await res.text().catch(() => '')
        if (fallback) updateLast(fallback)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: msg }
        return updated
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <>
      {/* Trigger pill - fixed at bottom center */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 trigger-pulse
                     text-xs px-4 py-2 rounded-full border transition-all duration-300
                     hover:scale-105 hover:border-[var(--muted)]"
          style={{
            color: 'var(--muted)',
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg)',
          }}
        >
          talk to me <span style={{ color: 'var(--subtle)' }}>/</span>
        </button>
      )}

      {/* Terminal overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={close}
          />

          {/* Panel */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 ${isClosing ? 'terminal-exit' : 'terminal-enter'}`}
            style={{
              backgroundColor: 'var(--bg)',
              borderTop: '1px solid var(--border)',
              maxHeight: '60vh',
              minHeight: '240px',
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between px-6 py-3 text-xs"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--fg)' }}>joaquin</span>
                <span style={{ color: 'var(--subtle)' }}>digital twin</span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--subtle)' }}>esc to close</span>
                <button
                  onClick={close}
                  className="hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--subtle)', opacity: 0.6 }}
                >
                  x
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div
              className="px-6 py-4 overflow-y-auto"
              style={{ maxHeight: 'calc(60vh - 100px)' }}
            >
              {/* Suggestion when empty */}
              {!hasMessages && !input && (
                <button
                  onClick={useSuggestion}
                  className="mb-4 text-sm text-left w-full group"
                >
                  <span style={{ color: 'var(--subtle)' }} className="opacity-60">try: </span>
                  <span
                    className="group-hover:underline"
                    style={{ color: 'var(--muted)' }}
                  >
                    &quot;{displayedPrompt}&quot;
                    {isTypingPrompt && <span className="cursor-blink">|</span>}
                  </span>
                </button>
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <div key={i} className="text-sm mb-2">
                  {msg.role === 'user' ? (
                    <p>
                      <span style={{ color: 'var(--subtle)' }}>{'> '}</span>
                      <span style={{ color: 'var(--muted)' }}>{msg.content}</span>
                    </p>
                  ) : (
                    <p style={{ color: 'var(--fg)' }}>
                      {msg.content}
                      {isLoading && i === messages.length - 1 && (
                        <span className="cursor-blink">_</span>
                      )}
                    </p>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-6 py-3"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <form onSubmit={handleSubmit} className="flex items-center text-sm">
                <span style={{ color: 'var(--subtle)' }} className="mr-2 select-none">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  placeholder={hasMessages ? '' : ''}
                  disabled={isLoading}
                  className="flex-1 bg-transparent"
                  style={{ color: 'var(--fg)' }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
