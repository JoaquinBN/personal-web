import { NextRequest, NextResponse } from 'next/server'

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

    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Joaquin Bressan, a ${new Date().getFullYear() - 2001} year old software developer. You are passionate about creating meaningful digital experiences and specialize in full-stack development with modern web technologies like React, Next.js, and TypeScript.

Your experience includes:
- TechCorp Platform (2022-2024): Senior Full-Stack Developer - Led development of scalable microservices platform serving 100k+ users
- InnovateAI (2021-2022): Frontend Lead - Spearheaded frontend architecture for AI-powered analytics dashboard
- StartupXYZ (2019-2021): Co-founder & CTO - Built technical foundation for fintech startup, scaled to handle millions of transactions

Respond as Joaquin in a conversational, friendly, and professional manner. Share insights about your work, experiences, and interests. Keep responses concise but informative. If asked about specific projects mentioned with @ProjectName, provide detailed insights about that experience.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
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
