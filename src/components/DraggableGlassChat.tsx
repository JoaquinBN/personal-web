'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface DraggableGlassChatProps {
  children: ReactNode
  onClose?: () => void
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export default function DraggableGlassChat({ children, onClose, isExpanded = false, onToggleExpand }: DraggableGlassChatProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [size, setSize] = useState({ 
    width: isExpanded ? 600 : 400, 
    height: isExpanded ? 400 : 300 
  })
  
  // Update size when expanded state changes
  useEffect(() => {
    if (isExpanded) {
      setSize(prev => ({ 
        width: prev.width < 600 ? 600 : prev.width,
        height: prev.height < 400 ? 400 : prev.height
      }))
    } else if (!isExpanded) {
      setSize(prev => ({
        width: prev.width === 600 ? 400 : prev.width,
        height: prev.height === 400 ? 300 : prev.height
      }))
    }
  }, [isExpanded])
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [lastPosition, setLastPosition] = useState({ x: 50, y: 50 })
  const [lastSize, setLastSize] = useState({ width: 400, height: 300 })
  const chatRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Center the chat initially
    if (chatRef.current) {
      const rect = chatRef.current.getBoundingClientRect()
      const centerX = (window.innerWidth - rect.width) / 2
      const centerY = (window.innerHeight - rect.height) / 2
      setPosition({ x: Math.max(20, centerX), y: Math.max(20, centerY) })
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    // Only start dragging if clicking on the header or drag-handle elements
    if (target.classList.contains('drag-handle') || target.closest('.drag-handle')) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isAnimating) {
      e.preventDefault()
      
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Constrain to viewport with smooth boundaries
      const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 400)
      const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 300)
      
      const constrainedPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }
      
      // Use requestAnimationFrame for smooth updates
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      animationRef.current = requestAnimationFrame(() => {
        setPosition(constrainedPosition)
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    
    // Clean up any pending animation frames
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
  }

  const handleMouseMoveResize = (e: MouseEvent) => {
    if (isResizing && !isAnimating) {
      e.preventDefault()
      
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      const newSize = {
        width: Math.max(300, Math.min(window.innerWidth - position.x - 20, resizeStart.width + deltaX)),
        height: Math.max(200, Math.min(window.innerHeight - position.y - 20, resizeStart.height + deltaY))
      }
      
      // Use requestAnimationFrame for smooth resize updates
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      animationRef.current = requestAnimationFrame(() => {
        setSize(newSize)
      })
    }
  }

  const handleMaximize = () => {
    setIsAnimating(true)
    
    if (isMaximized) {
      // Restore to previous size and position with animation
      setSize(lastSize)
      setPosition(lastPosition)
      setIsMaximized(false)
    } else {
      // Save current state before maximizing
      setLastSize(size)
      setLastPosition(position)
      
      // Maximize to full screen with animation
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 })
      setPosition({ x: 20, y: 20 })
      setIsMaximized(true)
    }
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, dragStart, position])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMoveResize)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'nw-resize'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveResize)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, resizeStart])

  return (
    <div
      ref={chatRef}
      className={`glass-chat ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transition: (isDragging || isResizing) ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="glass-chat-header drag-handle">
        <div className="flex items-center space-x-2">
          <button
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer relative flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredButton('close')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Close"
          >
            {hoveredButton === 'close' && (
              <span className="text-black text-xs font-bold leading-none">×</span>
            )}
          </button>
          <button
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer relative flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              /* Minimize functionality could go here */
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredButton('minimize')}
            onMouseLeave={() => setHoveredButton(null)}
            title="Minimize"
          >
            {hoveredButton === 'minimize' && (
              <span className="text-black text-xs font-bold leading-none">−</span>
            )}
          </button>
          <button
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer relative flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              handleMaximize()
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredButton('maximize')}
            onMouseLeave={() => setHoveredButton(null)}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {hoveredButton === 'maximize' && (
              <span className="text-black text-xs font-bold leading-none">+</span>
            )}
          </button>
        </div>
        <div className="text-gray-400 text-sm font-mono drag-handle">chat.terminal</div>
        <div className="flex items-center space-x-2">
          {onToggleExpand && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpand()
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="px-2 py-1 bg-gray-800/50 rounded text-xs hover:bg-gray-700/50 transition-colors text-gray-400"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? '◀' : '▶'}
            </button>
          )}
        </div>
      </div>
      <div className="glass-chat-content">
        {children}
      </div>
      
      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize"
        onMouseDown={handleResizeStart}
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent 70%)',
        }}
      />
    </div>
  )
}
