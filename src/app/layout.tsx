import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/shared/theme-provider'
import QueryProvider from '@/lib/query-provider'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/layouts/navbar'
import { AuthInitializer } from '@/components/shared/auth-initializer'
import { AchievementNotification } from '@/components/shared/achievement-notification'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Code Adventure RPG',
    template: '%s | Code Adventure RPG',
  },
  description: 'A full-stack web application for learning code through RPG adventure. Solve challenges, level up, and conquer the world of programming.',
  keywords: ['coding', 'programming', 'RPG', 'learning', 'nextjs', 'supabase', 'gamification'],
  authors: [{ name: 'DauTruong Code Team' }],
  creator: 'DauTruong Code Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Code Adventure RPG',
    description: 'Learn to code by playing a game. Join the adventure today!',
    siteName: 'Code Adventure RPG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Code Adventure RPG',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Adventure RPG',
    description: 'Learn to code by playing a game. Join the adventure today!',
    images: ['/og-image.png'],
    creator: '@dautruongcode',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <AuthInitializer />
              <Navbar />
              <main className="flex-1">{children}</main>
              {/* Footer will go here */}
            </div>
            <Toaster position="top-center" richColors />
            <AchievementNotification />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
