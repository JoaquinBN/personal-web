'use client'

import { useState, useRef, useEffect } from 'react'

interface SlideToUnlockProps {
  onUnlock: () => void
  isVisible?: boolean
}

export default function SlideToUnlock({ onUnlock, isVisible = true }: SlideToUnlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const maxPosition = 250 // Container width (330) - button width (70) - padding (5*2) = 250

  // Handle visibility changes and animations
  useEffect(() => {
    if (!isVisible && !isAnimatingOut) {
      // Start fade-out animation
      setIsAnimatingOut(true)
      setCurrentPosition(maxPosition + 100) // Move button off-screen to the right
    } else if (isVisible && isAnimatingOut) {
      // Start fade-in animation
      setIsAnimatingOut(false)
      setIsUnlocked(false)
      setPosition(0)
      setCurrentPosition(0)
    }
  }, [isVisible, isAnimatingOut, maxPosition])

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current || isAnimatingOut) return

      const rect = containerRef.current.getBoundingClientRect()
      const newPosition = Math.max(0, Math.min(maxPosition, clientX - rect.left - 40))
      setPosition(newPosition)
      setCurrentPosition(newPosition)
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }

    const handleEnd = () => {
      if (isAnimatingOut) return

      // More forgiving threshold - if user gets to 70% or within 50px of the end, count as unlocked
      const unlockThreshold = Math.max(maxPosition * 0.7, maxPosition - 50)
      
      if (position >= unlockThreshold) {
        setIsUnlocked(true)
        // Snap to end position for visual feedback
        setPosition(maxPosition)
        setCurrentPosition(maxPosition)
        setTimeout(() => {
          onUnlock()
        }, 300)
      } else {
        // Smooth return to start if not unlocked
        setPosition(0)
        setCurrentPosition(0)
      }
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, isUnlocked, onUnlock, position, maxPosition, isAnimatingOut])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  return (
    <div className="flex justify-center items-center mt-8">
      <div
        ref={containerRef}
        className="relative overflow-hidden shadow-inner"
        style={{
          width: '330px',
          height: '50px',
          background: 'linear-gradient(to bottom, #000000 50%, #232E35 100%)',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.05)',
          padding: '5px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {/* Shimmer text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="slide-shimmer"
            style={{
              fontFamily: 'Menlo',
              fontSize: '20px',
              fontWeight: 'normal',
              paddingLeft: '60px',
              letterSpacing: '0.5px',
              opacity: isUnlocked ? 0 : Math.max(0, 1 - (position / maxPosition)),
              transition: isDragging ? 'none' : 'opacity 0.3s ease-out'
            }}
          >
            slide to unlock
          </span>
        </div>

        {/* Slider button */}
        <div
          ref={sliderRef}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{
            width: '70px',
            height: '40px',
            borderRadius: '8px',
            transform: `translateX(${currentPosition}px)`,
            background: 'linear-gradient(to bottom, #FBFBFC 30%, #A5A4A2 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.9)',
            border: '1px solid #999',
            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Arrow icon */}
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/arrow.svg" 
              alt="Arrow" 
              width="30" 
              height="30"
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
