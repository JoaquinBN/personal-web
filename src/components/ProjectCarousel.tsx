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

interface ProjectCardProps {
  project: Project
  isActive: boolean
  isPreview?: boolean
}

function ProjectCard({ project, isActive, isPreview = false }: ProjectCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive) return
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        
        const maxTilt = 8
        const sensitivity = 20
        const tiltX = Math.max(-maxTilt, Math.min(maxTilt, deltaY / sensitivity))
        const tiltY = Math.max(-maxTilt, Math.min(maxTilt, -deltaX / sensitivity))
        setTilt({ x: tiltX, y: tiltY })
      }
    })
  }

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setTilt({ x: 0, y: 0 })
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`project-card ${isActive ? 'active' : ''}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`project-card-content ${isPreview ? 'preview' : ''}`}>
        {isPreview ? (
          /* Preview Layout - Logo left, info right */
          <div className="card-layout-horizontal">
            <div className="card-logo-small">{project.logo}</div>
            <div className="card-info-compact">
              <h3 className="card-title-small">{project.name}</h3>
              <p className="card-subtitle">{project.position} • {project.years}</p>
            </div>
          </div>
        ) : (
          /* Full Layout - Logo left, titles right, description below */
          <>
            <div className="card-header-section">
              <div className="card-logo-large">{project.logo}</div>
              <div className="card-titles">
                <h2 className="card-title-large">{project.name}</h2>
                <p className="card-subtitle-large">{project.position} • {project.years}</p>
              </div>
            </div>
            <div className="card-description-section">
              <p>{project.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

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
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex])

  return (
    <div className="project-stack">
      <div className="stack-container">
        <div className="cards-stack">
          {projects.map((project, index) => {
            const stackPosition = index - currentIndex
            const isVisible = stackPosition >= 0 && stackPosition < 3
            const isActive = stackPosition === 0
            const isPreview = stackPosition > 0
            
            return (
              <div
                key={project.id}
                className={`stack-card ${isActive ? 'active' : ''}`}
                style={{
                  transform: `
                    translateY(${stackPosition * -12}px) 
                    translateX(${stackPosition * -6}px) 
                    scale(${1 - stackPosition * 0.04})
                  `,
                  opacity: isVisible ? 1 - stackPosition * 0.12 : 0,
                  zIndex: 10 - stackPosition,
                  visibility: isVisible ? 'visible' : 'hidden'
                }}
              >
                <ProjectCard
                  project={project}
                  isActive={isActive}
                  isPreview={isPreview}
                />
              </div>
            )
          })}
        </div>

        {/* Navigation under the cards */}
        <div className="stack-navigation-bottom">
          <button 
            className="nav-arrow prev" 
            onClick={prevProject}
            disabled={currentIndex === 0}
            aria-label="Previous project"
          >
            ‹
          </button>
          
          <span className="nav-counter">
            {currentIndex + 1}/{projects.length}
          </span>
          
          <button 
            className="nav-arrow next" 
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
