# Personal Web

A modern personal website built with Next.js 14, TypeScript, and Bun for blazing fast performance.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Runtime**: [Bun](https://bun.sh/) for fast package management and runtime
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- **Linting**: ESLint with Next.js configuration

## 📋 Prerequisites

Make sure you have Bun installed on your system:

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start the development server**:
   ```bash
   bun dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `bun dev` - Start the development server
- `bun build` - Build the application for production
- `bun start` - Start the production server
- `bun lint` - Run ESLint to check for code issues
- `bun type-check` - Run TypeScript compiler to check for type errors

## 🏗️ Project Structure

```
personal-web/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Home page
│   └── components/          # Reusable components (create as needed)
├── public/                  # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` to customize Tailwind theme
- Add custom components in `src/components/`

### Configuration
- Update `next.config.js` for Next.js settings
- Modify `tsconfig.json` for TypeScript configuration
- Adjust ESLint rules in `.eslintrc.json`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Vercel will automatically detect Next.js and deploy

### Other Platforms
- **Netlify**: Use `bun build` and deploy the `out` directory
- **Railway**: Connect your GitHub repository
- **Docker**: Create a Dockerfile for containerized deployment

## 🔧 Development Tips

1. **Hot Reload**: The development server supports hot reload for instant updates
2. **Type Checking**: Run `bun type-check` regularly to catch TypeScript errors
3. **Linting**: Use `bun lint` to maintain code quality
4. **Path Aliases**: Use `@/` for imports from the `src` directory

## 📝 Environment Variables

Create a `.env.local` file in the root directory for environment variables:

```env
# Example environment variables
NEXT_PUBLIC_API_URL=your_api_url_here
DATABASE_URL=your_database_url_here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and Bun
