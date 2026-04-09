import { NextRequest, NextResponse } from 'next/server'

const requests = new Map<string, number[]>()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const now = Date.now()
    const windowMs = 60000
    const maxRequests = 5

    const userRequests = requests.get(ip) || []
    const recentRequests = userRequests.filter((time) => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    requests.set(ip, [...recentRequests, now])

    // Cleanup old entries occasionally
    if (Math.random() < 0.1) {
      for (const [key, timestamps] of Array.from(requests.entries())) {
        const recent = timestamps.filter((time: number) => now - time < windowMs)
        if (recent.length === 0) requests.delete(key)
        else requests.set(key, recent)
      }
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 characters)' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        "Hey. I'm not fully wired up yet. Joaquin needs to plug in the API key.",
        { status: 200, headers: { 'Content-Type': 'text/plain' } }
      )
    }

    const systemPrompt =
      process.env.LLM_SYSTEM_PROMPT ||
      'You are Joaquin Bressan. Respond as yourself. Be concise.'

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        stream: true,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    return new Response(openaiResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response("Something broke on my end. Try again in a sec.", {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
