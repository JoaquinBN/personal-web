import { NextRequest, NextResponse } from 'next/server'
import { identifyAgent, wantsAgentFormat } from '@/lib/agent-detection'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const accept = request.headers.get('accept')
  const formatParam = request.nextUrl.searchParams.get('format')

  // Escape hatch for testing
  if (formatParam === 'human') {
    return NextResponse.next()
  }

  const isForceAgent = formatParam === 'agent'
  const { isAgent, name } = identifyAgent(userAgent)
  const wantsAgent = wantsAgentFormat(accept)

  if (isForceAgent || isAgent || wantsAgent) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/info'

    const response = NextResponse.rewrite(url)
    response.headers.set('X-Agent-Optimized', 'true')
    if (name) response.headers.set('X-Agent-Detected', name)
    return response
  }

  // For humans, add discovery headers
  const response = NextResponse.next()
  response.headers.set('X-Agent-Info', '/api/info')
  response.headers.set('X-LLMs-Txt', '/llms.txt')
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|logos|fonts|llms\\.txt|.*\\..*).*)'],
}
