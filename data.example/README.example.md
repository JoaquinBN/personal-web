# Data Example Files

This folder contains example templates for all the data files used by your personal website. These files show the exact structure and format needed for each data file.

## Getting Started

1. Copy the files from this folder to the main `/data/` folder
2. Rename them by removing the `.example` part:
   - `personal.example.json` → `personal.json`
   - `experiences.example.json` → `experiences.json`
   - `config.example.json` → `config.json`
   - `llm-prompt.example.md` → `llm-prompt.md`
3. Fill in your actual information in each file

## File Descriptions

### `personal.example.json`
Contains your personal information:
- **name**: Your full name
- **birthday**: Birth date in YYYY-MM-DD format (used for age calculation)
- **aboutText**: Bio text that appears on homepage (supports **bold** and *italic* markdown)
- **contact**: Social media and contact links

### `experiences.example.json`
Contains your work experience and projects:
- **id**: Unique identifier for each experience
- **logo**: Path to company/project logo (place logos in `/public/logos/`)
- **name**: Company or project name
- **position**: Your role/position
- **years**: Time period (e.g., "2020 - Present")
- **description**: What you did and achieved
- **technologies**: Array of technologies used
- **highlights**: Key achievements or accomplishments

### `config.example.json`
Site-wide configuration:
- **site**: Metadata for SEO and social sharing
- **ui**: Typing speeds, delays, and animation settings
- **api**: OpenAI API configuration for chat feature

### `llm-prompt.example.md`
System prompt for your AI chat assistant. Customize this to define:
- Your personality and communication style
- Background and experience details
- Special instructions for responding to users
- Current interests and focus areas

## Tips

- Keep JSON files valid (check syntax)
- Use absolute paths for logos (e.g., `/logos/company.ico`)
- Place logo files in `/public/logos/` directory
- Test the typing speeds and delays to find what feels right
- Update the AI prompt to reflect your actual personality and experiences

## Environment Variables

Don't forget to add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```
