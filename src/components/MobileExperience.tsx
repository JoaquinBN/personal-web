'use client'

import { useState, useRef, useEffect } from 'react'
import { getExperiences, getPersonalInfo, type Experience } from '@/lib/data'

interface MobileExperienceProps {
  onClose: () => void
}

const experiences = getExperiences()
const personalInfo = getPersonalInfo()

export default function MobileExperience({ onClose }: MobileExperienceProps) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300)
  }

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % experiences.length)
  }

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  const currentProject = experiences[currentProjectIndex]

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Main content */}
      <div 
        ref={contentRef}
        className={`relative h-full flex flex-col bg-black/90 backdrop-blur-lg border-l border-white/10 transition-all duration-300 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ marginLeft: '10vw', width: '90vw' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-gray-400 text-sm uppercase tracking-wider font-mono">Experience</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="text-white text-lg leading-none">×</span>
          </button>
        </div>

        {/* Project content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Project header */}
          <div className="flex items-start space-x-3 mb-4">
            <img 
              src={currentProject.logo} 
              alt={`${currentProject.name} logo`}
              className="w-12 h-12 object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-lg">{currentProject.name}</h3>
              <p className="text-gray-400 text-sm">{currentProject.position}</p>
              <p className="text-gray-500 text-sm">{currentProject.years}</p>
            </div>
          </div>
          
          {/* Project description */}
          <div className="flex-1 overflow-y-auto">
            <p className="text-gray-300 text-sm leading-relaxed">{currentProject.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
            <button 
              onClick={prevProject}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white text-sm transition-colors"
              disabled={experiences.length <= 1}
            >
              <span>‹</span>
              <span>Previous</span>
            </button>
            
            <span className="text-gray-500 text-sm font-mono">
              {currentProjectIndex + 1} of {experiences.length}
            </span>
            
            <button 
              onClick={nextProject}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white text-sm transition-colors"
              disabled={experiences.length <= 1}
            >
              <span>Next</span>
              <span>›</span>
            </button>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-4 border-t border-white/10">
          <div className="flex justify-center items-center space-x-4">
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
        </div>
      </div>
    </div>
  )
}
