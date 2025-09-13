'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import TypingEffect from '@/components/TypingEffect'
import ChatInterface from '@/components/ChatInterface'
import DraggableGlassChat from '@/components/DraggableGlassChat'
import SlideToUnlock from '@/components/SlideToUnlock'
import MobileExperience from '@/components/MobileExperience'
import Silk from '@/components/Backgrounds/Silk'
import { getPersonalInfo, getCurrentAge, getSiteConfig } from '@/lib/data'

const personalInfo = getPersonalInfo()
const config = getSiteConfig()

export default function Home() {
  const [started, setStarted] = useState(false)
  const [showSlideToUnlock, setShowSlideToUnlock] = useState(false)
  const [showSlideButton, setShowSlideButton] = useState(false)
  const [showSocialLogos, setShowSocialLogos] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true) // Default to expanded for better desktop experience
  const [nameTypingComplete, setNameTypingComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [showMobileExperience, setShowMobileExperience] = useState(false)
  const age = getCurrentAge()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !started) {
      setStarted(true)
    }
  }, [started])

  const handleClick = () => {
    if (!started) {
      setStarted(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [started, handleKeyPress])

  const handleNameTypingComplete = () => {
    setNameTypingComplete(true)
  }

  const handleTypingComplete = () => {
    setTimeout(() => {
      setShowSlideToUnlock(true)
      // Start slide button animation
      setTimeout(() => {
        setShowSlideButton(true)
        // Start social logos animation after slide button appears
        setTimeout(() => {
          setShowSocialLogos(true)
        }, 400) // Wait for slide button animation to complete
      }, 100)
    }, 300)
  }

  const handleSlideUnlock = () => {
    if (isMobile) {
      setShowMobileExperience(true)
    } else {
      setShowChat(true)
    }
  }

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.contact.email)
      setShowCopyToast(true)
      setTimeout(() => {
        setShowCopyToast(false)
      }, 3000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <main className="min-h-screen px-6 relative">
      {/* Silk Background */}
      <div className="fixed inset-0 z-0">
        <Silk 
          speed={5}
          scale={1.5}
          color="#262528"
          noiseIntensity={2}
          rotation={1}
        />
      </div>
      
      <div className="max-w-lg w-full mx-auto relative z-10">
        {!started ? (
          /* Initial view - Just name, age and press enter */
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="mb-4">
              <div className="text-lg md:text-3xl font-bold text-white mb-2">
                <TypingEffect 
                  text={`${personalInfo.name}, ${age}`}
                  speed={config.ui.typingSpeed.name}
                  delay={config.ui.delays.initial}
                  onComplete={handleNameTypingComplete}
                />
              </div>
              {nameTypingComplete && (
                <div 
                  className="text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  onClick={handleEmailCopy}
                >
                  <TypingEffect 
                    text={personalInfo.contact.email}
                    speed={config.ui.typingSpeed.name}
                    delay={200}
                  />
                </div>
              )}
            </div>
            {nameTypingComplete && (
              <div 
                className="text-sm md:text-base text-gray-400 leading-relaxed cursor-pointer"
                onClick={handleClick}
              >
                <span className="text-white">{'>'}</span>
                <span className="ml-2 shimmer">
                  {isMobile ? 'press here' : 'press enter'} 
                  {!isMobile && (
                    <span className="inline-flex items-center ml-2 px-2 py-1 rounded text-xl">
                      ⏎
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center min-h-screen md:py-16">
            <div className="w-full">
              {/* Fixed name/age/email at top */}
              <div className="text-center mb-6 md:mb-8">
              <h1 className="text-lg md:text-3xl font-bold text-white mb-2">
                {personalInfo.name}, {age}
              </h1>
              <div 
                className="text-sm md:text-base text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                onClick={handleEmailCopy}
              >
                {personalInfo.contact.email}
              </div>
            </div>
            
            {/* About text flows from top to bottom */}
            <div className="text-xs md:text-base text-gray-200 leading-relaxed whitespace-pre-line mb-6 md:mb-8 text-justify">
              <span className="text-white">{'>'}</span>
              <span className="ml-2">
                <TypingEffect 
                  text={personalInfo.aboutText}
                  speed={config.ui.typingSpeed.aboutText}
                  delay={config.ui.delays.aboutText}
                  onComplete={handleTypingComplete}
                  allowSkip={config.ui.animations.enableSkip}
                  allowTouchSkip={isMobile && config.ui.animations.allowTouchSkip}
                  enableMarkdown={true}
                />
              </span>
            </div>
            
            {/* Slide to unlock */}
            {showSlideToUnlock && (
              <>
                <div 
                  className={`transition-all duration-300 ${
                    showSlideButton 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform translate-y-4'
                  }`}
                  style={{ 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <SlideToUnlock 
                    onUnlock={handleSlideUnlock} 
                    isVisible={!showChat && !showMobileExperience}
                    isMobile={isMobile}
                  />
                </div>
                
                {/* Social Media Links */}
                <div className="mt-6 md:mt-8 flex justify-center items-center space-x-4 md:space-x-6">
                  <a 
                    href={personalInfo.contact.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-white ${
                      showSocialLogos 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-2'
                    }`}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: showSocialLogos ? '0ms' : '0ms'
                    }}
                    aria-label="GitHub"
                  >
                    <Image src="/logos/social/github.svg" alt="GitHub" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7" />
                  </a>
                  <a
                    href={personalInfo.contact.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-white ${
                      showSocialLogos 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-2'
                    }`}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: showSocialLogos ? '100ms' : '0ms'
                    }}
                    aria-label="LinkedIn"
                  >
                    <Image src="/logos/social/linkedin.svg" alt="LinkedIn" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7" />
                  </a>
                  <a 
                    href={personalInfo.contact.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-gray-400 hover:text-white ${
                      showSocialLogos 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-2'
                    }`}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: showSocialLogos ? '200ms' : '0ms'
                    }}
                    aria-label="Twitter"
                  >
                    <Image src="/logos/social/twitter.svg" alt="Twitter" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7" />
                  </a>
                </div>
              </>
            )}
            </div>
          </div>
        )}
      </div>

      {/* Draggable Chat Interface - Desktop */}
      {showChat && !isMobile && (
        <DraggableGlassChat 
          onClose={() => setShowChat(false)}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        >
          <ChatInterface isExpanded={isExpanded} />
        </DraggableGlassChat>
      )}

      {/* Mobile Experience */}
      {showMobileExperience && isMobile && (
        <MobileExperience 
          onClose={() => setShowMobileExperience(false)}
        />
      )}

      {/* Copy Toast Notification */}
      {showCopyToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-sm text-white font-medium">Copied</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
