# Data Structure Documentation

This folder contains all the centralized data that drives the content of your personal website. By organizing data separately from code, you can easily update your information without modifying the application logic.

## File Structure

```
data/
├── README.md              # This file
├── personal.json          # Personal information and bio
├── experiences.json       # Work experience and projects
├── config.json           # Site configuration and settings
└── llm-prompt.md         # System prompt for the AI chat
```

## File Descriptions

### `personal.json`
Contains your personal information including:
- **Basic Info**: Name, birthday, title, description
- **About Text**: The main bio text that types on your homepage
- **Skills**: Array of your technical skills
- **Contact**: Social media and contact information (currently empty - fill as needed)

### `experiences.json`
Contains your work experience and projects:
- **Array of experiences** with detailed information for each
- **Fields**: id, logo (image path), name, position, company, dates, description, technologies, highlights
- **Logo format**: Path to logo image file (e.g., "/logos/company.ico")
- **Used for**: Chat experience sidebar, @ mention autocomplete, AI context

### `config.json`
Site-wide configuration including:
- **Site metadata**: Title, description, URL, author
- **Branding**: Logo paths, colors, favicon
- **Feature flags**: Enable/disable features like chat, slide-to-unlock
- **UI settings**: Typing speeds, delays, animations
- **API settings**: OpenAI model, temperature, token limits

### `llm-prompt.md`
The system prompt that defines your AI assistant's personality and knowledge:
- **Markdown format** for easy editing
- **Includes**: Background, experiences, personality traits, special instructions
- **Used by**: The chat API to give the AI context about you

## How to Update Content

### Adding a New Experience
1. Open `experiences.json`
2. Add a new object to the `experiences` array
3. Include all required fields: `id`, `logo` (path to image), `name`, `position`, `company`, `startDate`, `endDate`, `years`, `current`, `description`, `technologies`, `highlights`
4. For the logo, use a path like `/logos/company-name.ico` pointing to your logo file in `/public/logos/`
5. The experience will automatically appear in the chat sidebar and be available for @ mentions

### Updating Personal Info
1. Open `personal.json`
2. Modify any field (name, description, about text, etc.)
3. Changes will automatically reflect on the homepage

### Configuring Features
1. Open `config.json`
2. Toggle features in the `features` section
3. Adjust UI timing in the `ui` section
4. Modify API settings in the `api` section

### Updating AI Personality
1. Open `llm-prompt.md`
2. Edit the prompt in natural language
3. The AI will use this context in all chat interactions

## Technical Notes

- **JSON files**: Must maintain valid JSON syntax
- **Date format**: Use ISO format (YYYY-MM-DD) for dates
- **Logo format**: Uses image file paths (e.g., "/logos/company.ico")
- **Logo display**: Logos are displayed as 20px × 20px images in mentions, 32px × 32px in experience sidebar
- **Auto-loading**: All data is automatically imported by the app
- **Type safety**: Data structure is validated by TypeScript interfaces

## Logo and Assets

Your personal logo is located at `/public/logos/JBN.svg` and referenced in the config file. This is used for:
- Website favicon
- Open Graph meta tags  
- Brand identity

To update your logo, replace the file or update the path in `config.json > branding.logo`.

## Environment Variables

The chat feature requires:
- `OPENAI_API_KEY`: Your OpenAI API key for the chat functionality

## Future Enhancements

Consider adding:
- Social media links in `personal.json`
- Project images/screenshots in experiences
- Testimonials or recommendations
- Blog posts or articles data
- Skills proficiency levels
