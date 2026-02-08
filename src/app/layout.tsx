import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'botthef',
  description: 'A redemption arc. Documenting the journey to mastery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              botthef <span style={{ color: 'var(--primary)', fontSize: '0.8em' }}>// redemption</span>
            </h1>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/">Home</a>
              <a href="/about">About</a>
            </nav>
          </header>
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} botthef. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  )
}
