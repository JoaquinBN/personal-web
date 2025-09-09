'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface SlideToUnlockProps {
  onUnlock: () => void
  isVisible?: boolean
  isMobile?: boolean
}

export default function SlideToUnlock({ onUnlock, isVisible = true, isMobile = false }: SlideToUnlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getMaxPosition = () => {
    if (!containerRef.current) return 250
    const containerWidth = containerRef.current.offsetWidth
    return containerWidth - 70 - 10 // Container width - button width (70) - padding (5*2) = maxPosition
  }

  // Handle visibility changes and animations
  useEffect(() => {
    if (!isVisible && !isAnimatingOut) {
      // Start fade-out animation
      setIsAnimatingOut(true)
      setCurrentPosition(getMaxPosition() + 100) // Move button off-screen to the right
    } else if (isVisible && isAnimatingOut) {
      // Start fade-in animation
      setIsAnimatingOut(false)
      setIsUnlocked(false)
      setIsPressed(false)
      setPosition(0)
      setCurrentPosition(0)
    }
  }, [isVisible, isAnimatingOut])

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current || isAnimatingOut) return

      const rect = containerRef.current.getBoundingClientRect()
      const maxPos = getMaxPosition()
      const newPosition = Math.max(0, Math.min(maxPos, clientX - rect.left - 35))
      
      // Update both position and currentPosition immediately for fluid movement
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

      const maxPos = getMaxPosition()
      // More forgiving threshold - if user gets to 70% or within 50px of the end, count as unlocked
      const unlockThreshold = Math.max(maxPos * 0.7, maxPos - 50)
      
      if (position >= unlockThreshold) {
        setIsUnlocked(true)
        // Snap to end position for visual feedback
        setPosition(maxPos)
        setCurrentPosition(maxPos)
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

    if (isDragging && !isMobile) {
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
  }, [isDragging, isUnlocked, onUnlock, position, isAnimatingOut, isMobile])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (isMobile) {
      handleMobilePress()
    } else {
      setIsDragging(true)
    }
  }

  const handleMobilePress = () => {
    if (isPressed || isUnlocked || isAnimatingOut) return
    
    setIsPressed(true)
    const maxPos = getMaxPosition()
    
    // Animate to end position
    setPosition(maxPos)
    setCurrentPosition(maxPos)
    setIsUnlocked(true)
    
    // Trigger unlock after animation
    setTimeout(() => {
      onUnlock()
      // Reset states after unlock to allow future taps
      setTimeout(() => {
        setIsPressed(false)
        setIsUnlocked(false)
        setPosition(0)
        setCurrentPosition(0)
      }, 100)
    }, 500)
  }

  return (
    <div className="flex justify-center items-center mt-8">
      <div
        ref={containerRef}
        className="relative overflow-hidden shadow-inner"
        style={{
          width: 'min(330px, calc(100vw - 48px))',
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
              opacity: isUnlocked ? 0 : Math.max(0, 1 - (position / getMaxPosition())),
              transition: isDragging ? 'none' : 'opacity 0.3s ease-out'
            }}
          >
{isMobile ? 'tap to unlock' : 'slide to unlock'}
          </span>
        </div>

        {/* Slider button */}
        <div
          ref={sliderRef}
          className={`absolute ${isMobile ? 'cursor-pointer hover:scale-105' : 'cursor-grab active:cursor-grabbing'}`}
          style={{
            width: '70px',
            height: '40px',
            borderRadius: '8px',
            transform: `translateX(${currentPosition}px)`,
            background: 'linear-gradient(to bottom, #FBFBFC 30%, #A5A4A2 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.9)',
            border: '1px solid #999',
            transition: isDragging ? 'none' : isPressed ? 'transform 0.5s ease-out, scale 0.2s ease-out' : 'transform 0.3s ease-out, scale 0.2s ease-out',
            scale: isPressed ? '0.95' : '1'
          }}
          onMouseDown={isMobile ? undefined : handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={isMobile ? handleMobilePress : undefined}
        >
          {/* Arrow icon */}
          <div className="w-full h-full flex items-center justify-center">
            <Image 
              src="/arrow.svg" 
              alt="Arrow" 
              width={30} 
              height={30}
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
