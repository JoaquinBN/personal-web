# personal-web

Minimal personal site with an agent-first layer. Dark monospace aesthetic with light mode. AI chat inline.

Live at [joaquinbressan.com](https://joaquinbressan.com)

## Agent-first

AI agents visiting the site get structured markdown instead of HTML, detected via User-Agent header. The site practices what it preaches: agents are first-class users.

- `GET /` with AI agent UA returns structured markdown
- `GET /api/info` returns markdown (default) or JSON (`Accept: application/json`)
- `POST /api/chat` with `{ "message": "..." }` talks to the digital twin
- `GET /llms.txt` is the LLM discovery file
- `?format=agent` forces the agent view for testing

## Setup

```bash
git clone https://github.com/JoaquinBN/personal-web.git
cd personal-web
bun install
cp .env.example .env.local
# Fill in your OPENAI_API_KEY and LLM_SYSTEM_PROMPT
bun dev
```

### Environment Variables

```
OPENAI_API_KEY=your-openai-api-key
LLM_SYSTEM_PROMPT=your-system-prompt-for-the-digital-twin
SITE_URL=https://joaquinbressan.com
```

Set these in Vercel dashboard for production.

## Stack

Next.js 14, TypeScript, Tailwind CSS, Menlo monospace font, OpenAI API.

## License

MIT
