'use client'

import { useState, useEffect } from 'react'
import TypingEffect from '@/components/TypingEffect'
import ChatInterface from '@/components/ChatInterface'
import DraggableGlassChat from '@/components/DraggableGlassChat'
import SlideToUnlock from '@/components/SlideToUnlock'

// Calculate age from birth date (August 1, 2001)
function calculateAge() {
  const birthDate = new Date(2001, 7, 1) // Month is 0-indexed, so 7 = August
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

const aboutText = `I'm a passionate software developer who loves creating meaningful digital experiences. I specialize in full-stack development with modern web technologies like React, Next.js, and TypeScript.

I believe in building products that solve real problems and delight users. My experience spans from co-founding a fintech startup to leading frontend architecture at AI-powered platforms.

When I'm not coding, you'll find me exploring new technologies, contributing to open source, or enjoying a good cup of coffee while planning the next big project.`

export default function Home() {
  const [started, setStarted] = useState(false)
  const [showSlideToUnlock, setShowSlideToUnlock] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [nameTypingComplete, setNameTypingComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const age = calculateAge()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !started) {
      setStarted(true)
    }
  }

  const handleClick = () => {
    if (!started && isMobile) {
      setStarted(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [started])

  const handleNameTypingComplete = () => {
    setNameTypingComplete(true)
  }

  const handleTypingComplete = () => {
    setTimeout(() => {
      setShowSlideToUnlock(true)
    }, 300)
  }

  const handleSlideUnlock = () => {
    setShowChat(true)
  }

  return (
    <main className="min-h-screen px-6">
      <div className="max-w-lg w-full mx-auto">
        {!started ? (
          /* Initial view - Just name, age and press enter */
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <TypingEffect 
                text={`Joaquin Bressan, ${age}`}
                speed={80}
                delay={500}
                onComplete={handleNameTypingComplete}
              />
            </h1>
            {nameTypingComplete && (
              <div 
                className="text-gray-400 leading-relaxed cursor-pointer"
                onClick={handleClick}
              >
                <span className="text-white">{'>'}</span>
                <span className="ml-2 shimmer">
                  {isMobile ? 'press here' : 'press enter'}
                  {!isMobile && (
                    <span className="inline-flex items-center ml-2 px-2 py-1 bg-gray-800 rounded text-xs">
                      ⏎
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-16">
            {/* Fixed name/age at top */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Joaquin Bressan, {age}
            </h1>
            
            {/* About text flows from top to bottom */}
            <div className="text-gray-200 leading-relaxed whitespace-pre-line mb-8">
              <span className="text-white">{'>'}</span>
              <span className="ml-2">
                <TypingEffect 
                  text={aboutText}
                  speed={15}
                  delay={200}
                  onComplete={handleTypingComplete}
                  allowSkip={true}
                  allowTouchSkip={isMobile}
                />
              </span>
            </div>
            
            {/* Slide to unlock */}
            {showSlideToUnlock && (
              <SlideToUnlock 
                onUnlock={handleSlideUnlock} 
                isVisible={!showChat}
              />
            )}
          </div>
        )}
      </div>

      {/* Draggable Chat Interface */}
      {showChat && (
        <DraggableGlassChat 
          onClose={() => setShowChat(false)}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        >
          <ChatInterface isExpanded={isExpanded} />
        </DraggableGlassChat>
      )}
    </main>
  )
}
