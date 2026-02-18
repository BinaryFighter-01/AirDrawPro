import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AirDraw Pro - Draw in the Air',
  description: 'Draw in the air using hand gestures with AI-powered hand tracking. A magical drawing experience.',
  keywords: ['air draw', 'hand tracking', 'gesture drawing', 'AI drawing', 'mediapipe'],
  authors: [{ name: 'AirDraw Team' }],
  openGraph: {
    title: 'AirDraw Pro - Draw in the Air',
    description: 'Draw in the air using hand gestures with AI-powered hand tracking',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        
        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
