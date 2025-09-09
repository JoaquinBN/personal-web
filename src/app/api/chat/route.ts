import { NextRequest, NextResponse } from 'next/server'
import { getLLMPrompt } from '@/lib/server-data'

// Simple in-memory rate limiting (resets on server restart)
const requests = new Map<string, number[]>()

// CORS configuration
function setCORSHeaders(response: Response, origin?: string | null) {
  const corsEnabled = process.env.ENABLE_CORS !== 'false' // Enabled by default
  
  if (!corsEnabled) {
    return response
  }

  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [process.env.SITE_URL || 'http://localhost:3000'] // Default to site URL or localhost

  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.some(allowedOrigin => 
    origin === allowedOrigin || 
    (allowedOrigin.includes('localhost') && origin.includes('localhost'))
  )

  if (isAllowedOrigin || allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '3600')
  }

  return response
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const response = new Response(null, { status: 200 })
  return setCORSHeaders(response, origin)
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const now = Date.now()
    const windowMs = 60000 // 1 minute
    const maxRequests = 5 // 5 requests per minute per IP

    const userRequests = requests.get(ip) || []
    const recentRequests = userRequests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      const response = NextResponse.json({ 
        error: 'Too many requests. Please wait a moment before trying again.' 
      }, { status: 429 })
      return setCORSHeaders(response, origin)
    }

    // Update request log
    requests.set(ip, [...recentRequests, now])

    // Clean up old entries periodically (basic cleanup)
    if (Math.random() < 0.1) { // 10% chance to clean up
      for (const [key, timestamps] of Array.from(requests.entries())) {
        const recent = timestamps.filter((time: number) => now - time < windowMs)
        if (recent.length === 0) {
          requests.delete(key)
        } else {
          requests.set(key, recent)
        }
      }
    }

    const { message } = await request.json()

    if (!message) {
      const response = NextResponse.json({ error: 'Message is required' }, { status: 400 })
      return setCORSHeaders(response, origin)
    }

    // Input validation
    if (message.length > 500) {
      const response = NextResponse.json({ error: 'Message too long (max 500 characters)' }, { status: 400 })
      return setCORSHeaders(response, origin)
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a fallback response if no API key is configured
      const fallbackResponse = "Hi there! not fully connected yet. Ask Joaquin to configure me. well, technically I'm him, just not fully autonomous yet..."
      
      const response = new Response(fallbackResponse, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      return setCORSHeaders(response, origin)
    }

    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          model: "gpt-5-nano",
          messages: [
            {
              role: 'system',
              content: getLLMPrompt()
            },
            {
              role: 'user',
              content: message
            }
          ],
          stream: true,
        }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API Error:', {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        body: errorText
      })
      throw new Error(`OpenAI API request failed: ${openaiResponse.status} ${openaiResponse.statusText}`)
    }

    // Return the streaming response
    const response = new Response(openaiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
    return setCORSHeaders(response, origin)

  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Return a fallback response on error
    const fallbackResponse = "Sorry, I'm having some technical difficulties right now. Please try again in a moment!"
    
    const response = new Response(fallbackResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    return setCORSHeaders(response, origin)
  }
}
