// Server-side only data utilities
// This file uses Node.js modules and can only be imported in server-side code

import fs from 'fs'
import path from 'path'

// Load LLM prompt (server-side only)
export function getLLMPrompt(): string {
  const promptPath = path.join(process.cwd(), 'data', 'llm-prompt.md')
  return fs.readFileSync(promptPath, 'utf-8')
}
