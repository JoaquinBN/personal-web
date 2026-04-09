'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let mouseX = -1000
    let mouseY = -1000
    let smoothX = -1000
    let smoothY = -1000
    let raf: number
    let mounted = true

    const TILE = 40
    const RADIUS = 180
    const LINE_ALPHA_BASE = 0.03
    const LINE_ALPHA_MAX = 0.12

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function isDark() {
      return document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') &&
         window.matchMedia('(prefers-color-scheme: dark)').matches)
    }

    function draw() {
      if (!mounted) return

      smoothX += (mouseX - smoothX) * 0.08
      smoothY += (mouseY - smoothY) * 0.08

      const w = window.innerWidth
      const h = window.innerHeight
      const dark = isDark()
      const color = dark ? '255,255,255' : '0,0,0'

      ctx!.clearRect(0, 0, w, h)

      const cols = Math.ceil(w / TILE) + 1
      const rows = Math.ceil(h / TILE) + 1

      // Draw grid lines
      for (let col = 0; col <= cols; col++) {
        const x = col * TILE
        const minDist = Math.abs(x - smoothX)

        for (let row = 0; row < rows; row++) {
          const y1 = row * TILE
          const y2 = y1 + TILE
          const midY = (y1 + y2) / 2
          const dy = midY - smoothY
          const dist = Math.sqrt(minDist * minDist + dy * dy)
          const proximity = Math.max(0, 1 - dist / RADIUS)
          const alpha = LINE_ALPHA_BASE + (LINE_ALPHA_MAX - LINE_ALPHA_BASE) * proximity * proximity

          ctx!.strokeStyle = `rgba(${color},${alpha})`
          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          ctx!.moveTo(x, y1)
          ctx!.lineTo(x, y2)
          ctx!.stroke()
        }
      }

      for (let row = 0; row <= rows; row++) {
        const y = row * TILE
        const minDist = Math.abs(y - smoothY)

        for (let col = 0; col < cols; col++) {
          const x1 = col * TILE
          const x2 = x1 + TILE
          const midX = (x1 + x2) / 2
          const dx = midX - smoothX
          const dist = Math.sqrt(dx * dx + minDist * minDist)
          const proximity = Math.max(0, 1 - dist / RADIUS)
          const alpha = LINE_ALPHA_BASE + (LINE_ALPHA_MAX - LINE_ALPHA_BASE) * proximity * proximity

          ctx!.strokeStyle = `rgba(${color},${alpha})`
          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          ctx!.moveTo(x1, y)
          ctx!.lineTo(x2, y)
          ctx!.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function onLeave() {
      mouseX = -1000
      mouseY = -1000
    }

    resize()
    raf = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      mounted = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
