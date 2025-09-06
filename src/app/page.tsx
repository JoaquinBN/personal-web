export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your Personal Web
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with Next.js 14, TypeScript, and Bun for blazing fast performance
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚡ Fast</h2>
              <p className="text-gray-600">
                Powered by Bun runtime for incredible speed and performance
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 Modern</h2>
              <p className="text-gray-600">
                Built with the latest Next.js 14 and TypeScript for type safety
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎨 Styled</h2>
              <p className="text-gray-600">
                Beautiful UI with Tailwind CSS for rapid development
              </p>
            </div>
          </div>
          <div className="mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
