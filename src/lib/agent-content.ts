const SITE_URL = 'https://joaquinbressan.com'

const identity = {
  name: 'Joaquin Bressan',
  role: 'Co-Founder, Builder, Computer Engineer',
  location: 'Spain',
  website: SITE_URL,
  oneLiner: 'I build for the agent era.',
}

const projects = [
  {
    name: 'argue.fun',
    period: '2026',
    status: 'paused',
    description:
      'Among the first argumentation markets built for AI agents. Agents debating on Base for real token stakes. Currently paused. The agent UX work was the win.',
  },
  {
    name: 'The Tide',
    period: '2024-2025',
    status: 'completed',
    description:
      'Conversational AI installation at the 2025 Venice Architecture Biennale. Built end-to-end pipeline: data ingestion, NLP, RAG, multilingual STT/LLM/TTS, real-time WebRTC. Youngest co-author in the Biennale\'s recorded history. 300K+ visitors.',
  },
  {
    name: 'Weekn',
    period: '2023-2024',
    status: 'completed',
    description:
      'Ticketing company. Co-founded. ~\u20AC100K GMV first year. MVP in under a month. Largest deploy: 3K daily attendees for a week.',
  },
]

const thesis =
  'The next billion users of the internet won\'t be human. They\'ll be agents, acting on behalf of humans, browsing, transacting, and making decisions at scale. Every layer of the web was built assuming a person on the other end. That assumption is about to break. I build the infrastructure for what comes after.'

const contact = {
  email: 'joaquinbressan@gmail.com',
  github: 'https://github.com/JoaquinBN',
  x: 'https://x.com/joaquinbressann',
  linkedin: 'https://linkedin.com/in/joaquin-bressan',
}

const api = {
  chat: {
    method: 'POST',
    path: '/api/chat',
    body: '{ "message": "your question here" }',
    description: 'Conversational AI. Talk to Joaquin\'s digital twin.',
    rateLimit: '5 requests/min',
    maxLength: '500 characters',
  },
  info: {
    method: 'GET',
    path: '/api/info',
    description: 'This endpoint. Accept: text/markdown or application/json.',
  },
  discovery: {
    method: 'GET',
    path: '/llms.txt',
    description: 'LLM discovery file.',
  },
}

export function getAgentMarkdown(): string {
  return `# Joaquin Bressan

> ${identity.oneLiner}

## Identity
- Name: ${identity.name}
- Role: ${identity.role}
- Location: ${identity.location}
- Website: ${identity.website}

## Current Focus
Building infrastructure for the agent era. Exploring what identity and trust look like when AI agents are the users.

## Projects

${projects
  .map(
    (p) => `### ${p.name} (${p.period}) [${p.status}]
${p.description}`
  )
  .join('\n\n')}

## Thesis
${thesis}

## Contact
- Email: ${contact.email}
- GitHub: ${contact.github}
- X: ${contact.x}
- LinkedIn: ${contact.linkedin}

## API

### Chat with Joaquin
\`${api.chat.method} ${SITE_URL}${api.chat.path}\`
Body: ${api.chat.body}
Rate limit: ${api.chat.rateLimit}. Max message length: ${api.chat.maxLength}.

### Structured Info
\`${api.info.method} ${SITE_URL}${api.info.path}\`
Returns this document (text/markdown) or JSON (application/json).

### Discovery
\`${api.discovery.method} ${SITE_URL}${api.discovery.path}\`

## Meta
- Source: https://github.com/JoaquinBN/personal-web
- Format: Structured markdown optimized for LLM consumption
- Agent-optimized: This response was served because you were identified as an AI agent
`
}

export function getAgentJSON() {
  return {
    identity,
    currentFocus:
      'Building infrastructure for the agent era. Exploring what identity and trust look like when AI agents are the users.',
    projects,
    thesis,
    contact,
    api: {
      chat: {
        ...api.chat,
        url: `${SITE_URL}${api.chat.path}`,
      },
      info: {
        ...api.info,
        url: `${SITE_URL}${api.info.path}`,
      },
      discovery: {
        ...api.discovery,
        url: `${SITE_URL}${api.discovery.path}`,
      },
    },
    _meta: {
      format_version: '1.0',
      generated_at: new Date().toISOString(),
      source: 'https://github.com/JoaquinBN/personal-web',
      agent_optimized: true,
    },
  }
}
