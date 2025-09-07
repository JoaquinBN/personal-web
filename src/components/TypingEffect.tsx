'use client'

import { useState, useEffect, useCallback } from 'react'

// Simple markdown renderer for bold and italic text
const renderMarkdown = (text: string) => {
  // Split text by markdown patterns while keeping delimiters
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold text
      return <strong key={index}>{part.slice(2, -2)}</strong>
    } else if (part.startsWith('*') && part.endsWith('*')) {
      // Italic text
      return <em key={index}>{part.slice(1, -1)}</em>
    } else {
      // Regular text
      return part
    }
  })
}

interface TypingEffectProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
  allowSkip?: boolean
  allowTouchSkip?: boolean
  enableMarkdown?: boolean
}

export default function TypingEffect({ 
  text, 
  speed = 50, 
  delay = 0,
  onComplete,
  allowSkip = false,
  allowTouchSkip = false,
  enableMarkdown = false
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)

  const handleSkip = useCallback(() => {
    if (!isSkipped && started && currentIndex < text.length) {
      setIsSkipped(true)
      setDisplayedText(text)
      setCurrentIndex(text.length)
      if (onComplete) {
        onComplete()
      }
    }
  }, [isSkipped, started, currentIndex, text, onComplete])

  const handleTouchSkip = () => {
    if (allowTouchSkip) {
      handleSkip()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (allowSkip && (e.key === 'Enter' || e.key === ' ')) {
        handleSkip()
      }
    }

    if (allowSkip) {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [allowSkip, handleSkip])

  useEffect(() => {
    if (!started || isSkipped) return

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, started, onComplete, isSkipped])

  // Check if typing is complete
  const isTypingComplete = currentIndex >= text.length || isSkipped

  return (
    <span 
      onClick={handleTouchSkip}
      className={allowTouchSkip ? 'cursor-pointer' : ''}
    >
      {enableMarkdown && isTypingComplete ? renderMarkdown(displayedText) : displayedText}
      {!isTypingComplete && (
        <span className="typing-cursor">|</span>
      )}
    </span>
  )
}
