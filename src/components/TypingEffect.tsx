'use client'

import { useState, useEffect, useCallback } from 'react'

interface TypingEffectProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
  allowSkip?: boolean
  allowTouchSkip?: boolean
}

export default function TypingEffect({ 
  text, 
  speed = 50, 
  delay = 0,
  onComplete,
  allowSkip = false,
  allowTouchSkip = false
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
  }, [isSkipped, started, currentIndex, text.length, text, onComplete])

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

  return (
    <span 
      onClick={handleTouchSkip}
      className={allowTouchSkip ? 'cursor-pointer' : ''}
    >
      {displayedText}
      {currentIndex < text.length && !isSkipped && (
        <span className="typing-cursor">|</span>
      )}
    </span>
  )
}
