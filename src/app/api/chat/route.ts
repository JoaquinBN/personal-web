import { NextRequest, NextResponse } from 'next/server'
import { getPersonalInfo, getCurrentAge, getSiteConfig } from '@/lib/data'
import { getLLMPrompt } from '@/lib/server-data'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a fallback response if no API key is configured
      const fallbackResponse = "Hi there! not fully connected yet. Ask Joaquin to configure me. well, technically I'm him, just not fully autonomous yet..."
      
      return new Response(fallbackResponse, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }

    const config = getSiteConfig()
    
    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.api.model,
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
        stream: config.api.streamResponse,
        temperature: config.api.temperature,
        max_tokens: config.api.maxTokens,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed')
    }

    // Stream the response back to the client
    return new Response(openaiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Return a fallback response on error
    const fallbackResponse = "Sorry, I'm having some technical difficulties right now. Please try again in a moment!"
    
    return new Response(fallbackResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
