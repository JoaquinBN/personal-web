'use client'

import { useState, useEffect } from 'react'
import TypingEffect from '@/components/TypingEffect'
import ChatInterface from '@/components/ChatInterface'
import DraggableGlassChat from '@/components/DraggableGlassChat'
import SlideToUnlock from '@/components/SlideToUnlock'
import { getPersonalInfo, getCurrentAge, getSiteConfig } from '@/lib/data'

const personalInfo = getPersonalInfo()
const config = getSiteConfig()

export default function Home() {
  const [started, setStarted] = useState(false)
  const [showSlideToUnlock, setShowSlideToUnlock] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [nameTypingComplete, setNameTypingComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const age = getCurrentAge()

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
                text={`${personalInfo.name}, ${age}`}
                speed={config.ui.typingSpeed.name}
                delay={config.ui.delays.initial}
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
              {personalInfo.name}, {age}
            </h1>
            
            {/* About text flows from top to bottom */}
            <div className="text-gray-200 leading-relaxed whitespace-pre-line mb-8">
              <span className="text-white">{'>'}</span>
              <span className="ml-2">
                <TypingEffect 
                  text={personalInfo.aboutText}
                  speed={config.ui.typingSpeed.aboutText}
                  delay={config.ui.delays.aboutText}
                  onComplete={handleTypingComplete}
                  allowSkip={config.ui.animations.enableSkip}
                  allowTouchSkip={isMobile && config.ui.animations.allowTouchSkip}
                />
              </span>
            </div>
            
            {/* Slide to unlock */}
            {showSlideToUnlock && (
              <>
                <SlideToUnlock 
                  onUnlock={handleSlideUnlock} 
                  isVisible={!showChat}
                />
                
                {/* Social Media Links */}
                <div className="mt-8 flex justify-center items-center space-x-6">
                  <a 
                    href={personalInfo.contact.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <img src="/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  </a>
                  <a 
                    href={personalInfo.contact.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <img src="/logos/instagram.svg" alt="Instagram" className="w-6 h-6" />
                  </a>
                  <a 
                    href={personalInfo.contact.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <img src="/logos/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                  </a>
                  <a 
                    href={personalInfo.contact.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <img src="/logos/twitter.svg" alt="Twitter" className="w-6 h-6" />
                  </a>
                </div>
              </>
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
