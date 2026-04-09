import { NextRequest } from 'next/server'
import { getAgentMarkdown, getAgentJSON } from '@/lib/agent-content'

export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept') || ''

  if (accept.includes('application/json') && !accept.includes('text/html')) {
    return new Response(JSON.stringify(getAgentJSON(), null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Agent-Optimized': 'true',
      },
    })
  }

  return new Response(getAgentMarkdown(), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Agent-Optimized': 'true',
    },
  })
}
