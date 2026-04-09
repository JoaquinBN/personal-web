const AI_AGENT_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /GPTBot/i, name: 'OpenAI-GPTBot' },
  { pattern: /ChatGPT-User/i, name: 'OpenAI-ChatGPT' },
  { pattern: /Claude-Web/i, name: 'Anthropic-Claude' },
  { pattern: /Anthropic/i, name: 'Anthropic' },
  { pattern: /Google-Extended/i, name: 'Google-Extended' },
  { pattern: /CCBot/i, name: 'CommonCrawl' },
  { pattern: /PerplexityBot/i, name: 'Perplexity' },
  { pattern: /cohere-ai/i, name: 'Cohere' },
  { pattern: /Meta-ExternalAgent/i, name: 'Meta' },
  { pattern: /Bytespider/i, name: 'ByteDance' },
  { pattern: /ClaudeBot/i, name: 'Anthropic-ClaudeBot' },
  { pattern: /Applebot-Extended/i, name: 'Apple-Extended' },
]

const SEO_BOT_PATTERNS: RegExp[] = [/Googlebot/i, /Bingbot/i, /baiduspider/i, /Yandex/i]

export function identifyAgent(userAgent: string): { isAgent: boolean; name: string | null } {
  // SEO bots should get the HTML page for indexing
  for (const pattern of SEO_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isAgent: false, name: null }
    }
  }

  for (const { pattern, name } of AI_AGENT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isAgent: true, name }
    }
  }

  return { isAgent: false, name: null }
}

export function wantsAgentFormat(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false
  return (
    acceptHeader.includes('text/markdown') ||
    (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html'))
  )
}
