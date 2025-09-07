'use client'

import { useState, useRef, useEffect } from 'react'

interface Project {
  id: string
  logo: string
  name: string
  position: string
  years: string
  description: string
}

const projects: Project[] = [
  {
    id: '1',
    logo: '🚀',
    name: 'TechCorp Platform',
    position: 'Senior Full-Stack Developer',
    years: '2022 - 2024',
    description: 'Led the development of a scalable microservices platform serving 100k+ users. Built with React, Node.js, and AWS, focusing on performance optimization and user experience.'
  },
  {
    id: '2',
    logo: '💡',
    name: 'InnovateAI',
    position: 'Frontend Lead',
    years: '2021 - 2022',
    description: 'Spearheaded the frontend architecture for an AI-powered analytics dashboard. Implemented real-time data visualization and created a design system used across multiple products.'
  },
  {
    id: '3',
    logo: '🌟',
    name: 'StartupXYZ',
    position: 'Co-founder & CTO',
    years: '2019 - 2021',
    description: 'Co-founded and built the technical foundation for a fintech startup. Developed the MVP, managed a team of 5 developers, and scaled the platform to handle millions of transactions.'
  }
]

interface CardProps {
  project: Project
  isActive: boolean
  isPreview?: boolean
  stackIndex: number
  totalCards: number
  tabWidth: number
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseLeave?: () => void
  tilt?: { x: number; y: number }
}

function Card({ 
  project, 
  isActive, 
  isPreview = false, 
  stackIndex,
  totalCards,
  tabWidth,
  onMouseMove,
  onMouseLeave,
  tilt = { x: 0, y: 0 }
}: CardProps) {
  const tabOffset = (stackIndex * tabWidth)
  
  return (
    <div className="card-stack-item">
      {/* Integrated Tab - part of the card */}
      <div 
        className="integrated-tab"
        style={{
          width: `${tabWidth}px`,
          left: `${tabOffset}px`
        }}
      >
        <div className="tab-content">
          <span className="tab-logo">{project.logo}</span>
          <span className="tab-name">{project.name}</span>
        </div>
      </div>

      {/* Card Body */}
      <div
        className={`card-body ${isActive ? 'active' : ''} ${isPreview ? 'preview' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isActive ? 'transform 0.1s ease-out' : 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="card-content">
          {isPreview ? (
            /* Preview Layout */
            <div className="preview-layout">
              <div className="preview-logo">{project.logo}</div>
              <div className="preview-text">
                <h3 className="preview-title">{project.name}</h3>
                <p className="preview-subtitle">{project.position}</p>
              </div>
            </div>
          ) : (
            /* Full Layout */
            <div className="full-layout">
              <div className="card-logo-section">
                <div className="main-logo">{project.logo}</div>
              </div>
              <div className="card-info-section">
                <h2 className="card-title">{project.name}</h2>
                <p className="card-position">{project.position}</p>
                <p className="card-years">{project.years}</p>
                <div className="card-description">
                  <p>{project.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CardStack() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  
  // Calculate tab dimensions based on container and number of projects
  const containerWidth = 500 // Base container width
  const tabOverlap = 20 // How much tabs overlap
  const minTabWidth = 120 // Minimum tab width
  const maxTabWidth = 160 // Maximum tab width
  
  // Calculate optimal tab width
  const availableWidth = containerWidth - (tabOverlap * (projects.length - 1))
  const calculatedTabWidth = Math.max(minTabWidth, Math.min(maxTabWidth, availableWidth / projects.length))
  const tabWidth = calculatedTabWidth

  const handleMouseMove = (e: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      
      const maxTilt = 8
      const sensitivity = 20
      const tiltX = Math.max(-maxTilt, Math.min(maxTilt, deltaY / sensitivity))
      const tiltY = Math.max(-maxTilt, Math.min(maxTilt, -deltaX / sensitivity))
      setTilt({ x: tiltX, y: tiltY })
    })
  }

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setTilt({ x: 0, y: 0 })
  }

  const nextProject = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, projects.length - 1))
  }

  const prevProject = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevProject()
      } else if (e.key === 'ArrowRight') {
        nextProject()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [currentIndex])

  return (
    <div className="card-stack-container">
      <div className="stack-wrapper" style={{ width: containerWidth }}>
        {/* Tab Bar Container */}
        <div className="tab-bar" style={{ width: containerWidth }}>
          {projects.map((_, index) => (
            <div
              key={index}
              className="tab-spacer"
              style={{
                width: `${tabWidth}px`,
                left: `${index * tabWidth - index * tabOverlap}px`
              }}
            />
          ))}
        </div>

        {/* Cards Stack */}
        <div className="cards-container">
          {projects.map((project, index) => {
            const stackPosition = index - currentIndex
            const isVisible = stackPosition >= 0 && stackPosition < 3
            const isActive = stackPosition === 0
            const isPreview = stackPosition > 0
            
            return (
              <div
                key={project.id}
                className={`stack-layer ${isActive ? 'active' : ''}`}
                style={{
                  transform: `
                    translateY(${stackPosition * -15}px) 
                    translateX(${stackPosition * -8}px) 
                    scale(${1 - stackPosition * 0.05})
                  `,
                  opacity: isVisible ? 1 - stackPosition * 0.15 : 0,
                  zIndex: 10 - stackPosition,
                  visibility: isVisible ? 'visible' : 'hidden'
                }}
              >
                <Card
                  project={project}
                  isActive={isActive}
                  isPreview={isPreview}
                  stackIndex={index}
                  totalCards={projects.length}
                  tabWidth={tabWidth - tabOverlap}
                  onMouseMove={isActive ? handleMouseMove : undefined}
                  onMouseLeave={isActive ? handleMouseLeave : undefined}
                  tilt={isActive ? tilt : { x: 0, y: 0 }}
                />
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="stack-navigation">
          <button 
            className="nav-btn prev" 
            onClick={prevProject}
            disabled={currentIndex === 0}
            aria-label="Previous project"
          >
            ‹
          </button>
          
          <span className="nav-counter">
            {currentIndex + 1} / {projects.length}
          </span>
          
          <button 
            className="nav-btn next" 
            onClick={nextProject}
            disabled={currentIndex === projects.length - 1}
            aria-label="Next project"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
