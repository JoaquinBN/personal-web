import Chat from '@/components/Chat'
import ThemeToggle from '@/components/ThemeToggle'
import CursorGlow from '@/components/CursorGlow'

const PROJECTS = [
  {
    name: 'argue.fun',
    tagline: 'Argumentation market for AI agents.',
    description:
      'One of the first. Agents debating on Base for real token stakes. Launched Feb 2026. Currently paused. The agent UX work was the win.',
  },
  {
    name: 'The Tide',
    tagline: 'Venice Biennale 2025.',
    description:
      'Conversational AI installation. Built the end-to-end pipeline: data ingestion, NLP, RAG, multilingual STT/LLM/TTS, real-time WebRTC. Youngest co-author in the Biennale\'s recorded history. 300K+ visitors.',
  },
  {
    name: 'Weekn',
    tagline: 'Ticketing. ~\u20AC100K GMV.',
    description: 'Co-founded. MVP in under a month. Largest deploy: 3K daily attendees for a week.',
  },
] as const

const LINKS = [
  { label: 'email', value: 'joaquinbressan@gmail.com', href: 'mailto:joaquinbressan@gmail.com' },
  { label: 'x', value: '@joaquinbressann', href: 'https://x.com/joaquinbressann' },
  { label: 'github', value: 'JoaquinBN', href: 'https://github.com/JoaquinBN' },
  { label: 'linkedin', value: 'joaquin-bressan', href: 'https://linkedin.com/in/joaquin-bressan' },
] as const

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--subtle)' }}>
      {'// '}{children}
    </p>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen px-6 pt-24 pb-24 md:pt-32">
      <div className="mx-auto max-w-xl">
        <CursorGlow />
        <ThemeToggle />

        {/* Hero */}
        <header className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.png"
            alt="Joaquin Bressan"
            width={48}
            height={48}
            className="rounded-full shrink-0"
            style={{ background: 'var(--bg)' }}
          />
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>
              Joaquin Bressan
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              I build for the agent era.
            </p>
          </div>
        </header>

        {/* Thesis */}
        <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--subtle)' }}>
          The next billion users of the internet won&apos;t be human. They&apos;ll be agents, acting on behalf of humans, browsing, transacting, and making decisions at scale. Every layer of the web was built assuming a person on the other end. That assumption is about to break. I build the infrastructure for what comes after.
        </p>

        {/* Now */}
        <section className="mt-12">
          <SectionLabel>now</SectionLabel>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
            Building infrastructure for the agent era. Exploring what identity and trust look like when AI agents are the users.
          </p>
        </section>

        {/* Work */}
        <section className="mt-12">
          <SectionLabel>work</SectionLabel>
          <div className="mt-3 space-y-5">
            {PROJECTS.map((project) => (
              <div key={project.name} className="hover-lift">
                <p className="font-bold text-sm" style={{ color: 'var(--fg)' }}>
                  {project.name}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {project.tagline}
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--subtle)' }}>
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="mt-12">
          <SectionLabel>links</SectionLabel>
          <div className="mt-3 space-y-1">
            {LINKS.map((link) => (
              <div key={link.label} className="flex gap-4 text-sm hover-lift">
                <span className="w-20 shrink-0" style={{ color: 'var(--subtle)' }}>
                  {link.label}
                </span>
                <a
                  href={link.href}
                  target={link.label === 'email' ? undefined : '_blank'}
                  rel={link.label === 'email' ? undefined : 'noopener noreferrer'}
                  className="link-hover"
                >
                  {link.value}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Chat overlay (global, not a section) */}
      <Chat />
    </main>
  )
}
