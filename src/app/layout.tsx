import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smart Calculator',
  description: 'Advanced calculator with history tracking',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <main className="min-h-screen p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Smart Calculator</h1>
              <p className="text-gray-600">Advanced calculator with history tracking and scientific functions</p>
            </header>
            {children}
            <footer className="mt-12 text-center text-gray-500 text-sm">
              <p>Smart Calculator • Built with Next.js 14 & TypeScript</p>
            </footer>
          </div>
        </main>
      </body>
    </html>
  )
}
