'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      setDark(false)
    } else if (stored === 'dark') {
      setDark(true)
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    const className = next ? 'dark' : 'light'
    document.documentElement.className = className
    localStorage.setItem('theme', className)
  }

  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 text-xs z-50 transition-colors duration-150"
      style={{ color: 'var(--subtle)' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--subtle)')}
      aria-label="Toggle theme"
    >
      {dark ? 'light' : 'dark'}
    </button>
  )
}
