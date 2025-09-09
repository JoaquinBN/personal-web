// Server-side only data utilities
// This file uses Node.js modules and can only be imported in server-side code

import fs from 'fs'
import path from 'path'

// Load LLM prompt with enhanced experience data (server-side only)
export function getLLMPrompt(): string {
  const promptPath = path.join(process.cwd(), 'data', 'llm-prompt.md')
  const experiencesPath = path.join(process.cwd(), 'data', 'experiences.json')
  
  const basePrompt = fs.readFileSync(promptPath, 'utf-8')
  const experiencesData = JSON.parse(fs.readFileSync(experiencesPath, 'utf-8'))
  
  // Extract technologies and highlights for enhanced prompt
  let enhancedData = '\n\n## Additional Experience Details\n\n'
  
  experiencesData.experiences.forEach((experience: any) => {
    enhancedData += `### ${experience.name}\n`
    
    if (experience.technologies && experience.technologies.length > 0) {
      enhancedData += `**Technologies:** ${experience.technologies.join(', ')}\n`
    }
    
    if (experience.highlights && experience.highlights.length > 0) {
      enhancedData += `**Key Highlights:**\n`
      experience.highlights.forEach((highlight: string) => {
        enhancedData += `- ${highlight}\n`
      })
    }
    
    enhancedData += '\n'
  })
  
  return basePrompt + enhancedData
}
