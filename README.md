# Personal Website

A minimalist website with a simple UI to share your vision and experiences. People can chat with your "digital twin". You can check it out here: [www.joaquinbressan.com](https://www.joaquinbressan.com)

> **⚠️ IMPORTANT:** This repo contains my personal information as an example. **You MUST replace all content in the `data/` folder with your own information** before deploying. Use the `data.example/` folder as a reference for the structure.

## Features

- Minimalist design  
- AI chat integration (desktop only — mobile was a pain in the ass, got lazy)  
- No database or analytics to see activity or chat conversations (might do it later)  

### Small Disclaimer About Having Chat on Your Personal Site ⚠️⚠️⚠️

>Look, putting an AI chat on your personal website might mean smart people finding a way to spam your OpenAI credits. I added some basic protection:
>
>- **Rate limiting**: 5 requests per minute per IP (keeps the trolls away)
>- **CORS**: Yes, the most hated guy in web development. But it prevents other websites from embedding your chat and draining your wallet. I made sure you can disable it during development so you don't hate your life.
>
>Sooo if you enable the AI chat, make sure to keep an eye on your usage costs or set up rate limiting or spending limits with your OpenAI API key (or whatever LLM provider you use).

## Setup

```bash
git clone https://github.com/yourusername/personal-web.git
cd personal-web
chmod +x setup.sh
./setup.sh
# Fill files in /data with your information (check README in data.example folder)
npm install
npm run dev
```

I used OpenAI for my digital twin. You need an OpenAI API key if you want the chat to work. Add it to `.env.local`.

### Environment Variables

Create a `.env.local` file:

```
OPENAI_API_KEY=your-openai-api-key
SITE_URL=https://yourwebsite.com
ENABLE_CORS=true                    # Set to false for development if needed
ALLOWED_ORIGINS=https://yourwebsite.com  # Optional, comma-separated
```

**Security Note**: CORS is enabled by default to prevent other websites from using your OpenAI credits. You can disable it during development by setting `ENABLE_CORS=false`.

## Project Structure

```
├── data/                   # Your content
│   ├── personal.json       # Basic info, bio, contact
│   ├── experiences.json    # Work history, projects
│   ├── config.json         # Site settings
│   └── llm-prompt.md       # AI personality
├── data.example/           # Examples and docs
├── src/
│   ├── app/
│   │   ├── api/chat/       # OpenAI chat endpoint
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # UI components (chat, animations, etc)
│   └── lib/                # Data utilities
└── public/
    ├── logos/
    │   └── social/         # GitHub, Twitter, etc icons
    ├── background.svg      # Background pattern
    └── fonts/              # Menlo font files
```

## License

MIT

## Inspiration and Credits

Inspired by the slide-to-unlock button on the iPhone 4 — best UI component ever made.