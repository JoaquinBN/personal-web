'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import TypingEffect from './TypingEffect'
import { getExperiences, type Experience } from '@/lib/data'

interface Message {
  id: number
  sender: 'User' | 'Joaquin'
  text: string
  isTyping?: boolean
}

const experiences = getExperiences()

interface ChatInterfaceProps {
  onFirstMessage?: () => void
  isExpanded?: boolean
}

export default function ChatInterface({ onFirstMessage, isExpanded = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showInput, setShowInput] = useState(true)
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null)
  const [hasFirstMessage, setHasFirstMessage] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionFilter, setMentionFilter] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle @ mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const position = e.target.selectionStart || 0
    setInputValue(value)
    setCursorPosition(position)

    // Check for @ mentions
    const beforeCursor = value.slice(0, position)
    const atIndex = beforeCursor.lastIndexOf('@')
    
    if (atIndex !== -1 && atIndex === beforeCursor.length - 1) {
      // Just typed @
      setShowMentions(true)
      setMentionFilter('')
    } else if (atIndex !== -1 && /^@\w*$/.test(beforeCursor.slice(atIndex))) {
      // Typing after @
      const filter = beforeCursor.slice(atIndex + 1)
      setShowMentions(true)
      setMentionFilter(filter)
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (projectName: string) => {
    const beforeCursor = inputValue.slice(0, cursorPosition)
    const afterCursor = inputValue.slice(cursorPosition)
    const atIndex = beforeCursor.lastIndexOf('@')
    
    if (atIndex !== -1) {
      const newValue = beforeCursor.slice(0, atIndex) + `@${projectName} ` + afterCursor
      setInputValue(newValue)
      setShowMentions(false)
      
      // Focus back to input
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = atIndex + projectName.length + 2
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newPosition, newPosition)
        }
      }, 0)
    }
  }

  const filteredExperiences = experiences.filter(experience =>
    experience.name.toLowerCase().includes(mentionFilter.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Trigger first message callback
    if (!hasFirstMessage && onFirstMessage) {
      setHasFirstMessage(true)
      onFirstMessage()
    }

    // Hide input and add user message
    setShowInput(false)
    const userMessage: Message = {
      id: Date.now(),
      sender: 'User',
      text: inputValue.trim()
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = inputValue.trim()
    setInputValue('')
    setIsTyping(true)

    try {
      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const joaquinMessageId = Date.now() + 1
      const joaquinMessage: Message = {
        id: joaquinMessageId,
        sender: 'Joaquin',
        text: '',
        isTyping: true
      }
      
      setMessages(prev => [...prev, joaquinMessage])
      setTypingMessageId(joaquinMessageId)
      setIsTyping(false)

      // Stream the response
      let fullText = ''
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value, { stream: true })
        buffer += chunk
        
        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const jsonData = JSON.parse(line.slice(6))
              if (jsonData.choices?.[0]?.delta?.content) {
                fullText += jsonData.choices[0].delta.content
                
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === joaquinMessageId ? { ...msg, text: fullText } : msg
                  )
                )
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue
            }
          }
        }
      }

      // Mark as complete
      setMessages(prev => 
        prev.map(msg => 
          msg.id === joaquinMessageId ? { ...msg, isTyping: false } : msg
        )
      )
      setTypingMessageId(null)

    } catch (error) {
      console.error('Error:', error)
      // Fallback to mock response
      const fallbackResponse = "Sorry, I'm having trouble connecting right now. Please try again later!"
      const joaquinMessageId = Date.now() + 1
      const joaquinMessage: Message = {
        id: joaquinMessageId,
        sender: 'Joaquin',
        text: fallbackResponse,
        isTyping: true
      }
      
      setMessages(prev => [...prev, joaquinMessage])
      setTypingMessageId(joaquinMessageId)
      setIsTyping(false)
    }

    // Show input again after a delay
    setTimeout(() => {
      setShowInput(true)
    }, 500)
  }

  const handleTypingComplete = (messageId: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    )
    setTypingMessageId(null)
    setTimeout(() => {
      setShowInput(true)
    }, 500)
  }

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % experiences.length)
  }

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  const currentProject = experiences[currentProjectIndex]

  return (
    <div className="flex flex-col h-full pb-3">
      <div className="mb-4"></div>

      <div className={`flex h-full transition-all duration-300 ${isExpanded ? 'space-x-4' : ''}`}>
        {/* Chat Area */}
        <div 
          className={`flex flex-col transition-all duration-300 ${isExpanded ? 'w-3/5' : 'w-full'} cursor-text`}
          onClick={() => {
            if (inputRef.current && showInput) {
              inputRef.current.focus()
            }
          }}
        >
          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 space-y-2 overflow-y-auto chat-container mb-4"
          >
            {messages.map((message) => (
              <div key={message.id} className="text-gray-200 text-sm">
                <span className="text-gray-400">{message.sender}: </span>
                {message.isTyping ? (
                  <TypingEffect 
                    text={message.text}
                    speed={20}
                    onComplete={() => handleTypingComplete(message.id)}
                  />
                ) : (
                  <span>{message.text}</span>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="text-gray-200 text-sm">
                <span className="text-gray-400">Joaquin: </span>
                <span className="typing-cursor">|</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="relative">
            {showMentions && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
              {filteredExperiences.map((experience) => (
                <button
                  key={experience.id}
                  onClick={() => insertMention(experience.name)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-3 text-sm"
                >
                  <Image 
                    src={experience.logo} 
                    alt={`${experience.name} logo`}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <div>
                    <div className="text-white">{experience.name}</div>
                    <div className="text-gray-400 text-xs">{experience.position}</div>
                  </div>
                </button>
              ))}
              </div>
            )}
            
            {showInput && (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center">
                  <span className="text-white mr-2">{'>'}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={inputValue ? "" : "ask me anything"}
                    className="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none text-sm focus:placeholder-gray-500 p-0 transition-none"
                    style={{ boxShadow: 'none', transition: 'none' }}
                    disabled={isTyping}
                    autoFocus
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Experience Sidebar */}
        {isExpanded && (
          <div className="w-2/5 flex flex-col">
            {/* Subtle separator */}
            <div className="w-px bg-gray-800/50 self-start h-full absolute ml-[-8px]"></div>
            
            <div className="pl-4 flex flex-col h-full">
              <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-4 font-mono">Experience</h3>
              
              {/* Single Project Display */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-start space-x-3 mb-3">
                  <Image 
                    src={currentProject.logo} 
                    alt={`${currentProject.name} logo`}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-base">{currentProject.name}</h4>
                    <p className="text-gray-400 text-sm">{currentProject.position}</p>
                    <p className="text-gray-500 text-sm">{currentProject.years}</p>
                  </div>
                </div>
                
                {/* Scrollable Description */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2">
                  <p className="text-gray-300 text-sm leading-relaxed">{currentProject.description}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center space-x-4 mt-4 pt-3 border-t border-gray-800/50">
                <button 
                  onClick={prevProject}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  aria-label="Previous project"
                >
                  ‹
                </button>
                
                <span className="text-gray-600 text-sm font-mono">
                  {currentProjectIndex + 1}/{experiences.length}
                </span>
                
                <button 
                  onClick={nextProject}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  aria-label="Next project"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
