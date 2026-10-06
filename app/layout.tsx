import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, DM_Sans } from 'next/font/google'
import { SiteNav } from '@/components/site-nav'
import { StaleBackupBanner } from '@/components/stale-backup-banner'
import 'katex/dist/katex.min.css'
import './globals.css'

const _nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const _dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: {
    default: 'GateConsole - Master GATE CSE',
    template: '%s | GateConsole',
  },
  description: 'The ultimate gamified strategy engine and preparation platform for the GATE Computer Science Exam.',
  keywords: ['GATE CSE', 'Computer Science', 'Exam Prep', 'GATE 2025', 'Programming', 'Gamified Learning', 'Study Tracker'],
  authors: [{ name: 'GateConsole Team' }],
  creator: 'GateConsole',
  publisher: 'GateConsole',
  generator: 'Next.js',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GateConsole',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://gateconsole.com',
    title: 'GateConsole - Master GATE CSE',
    description: 'The ultimate gamified strategy engine and preparation platform for the GATE Computer Science Exam.',
    siteName: 'GateConsole',
    images: [
      {
        url: '/og-image.png', // Assuming we will add this or it acts as a placeholder
        width: 1200,
        height: 630,
        alt: 'GateConsole - Gamified GATE CSE Prep',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GateConsole - Master GATE CSE',
    description: 'The ultimate gamified strategy engine and preparation platform for the GATE Computer Science Exam.',
    images: ['/og-image.png'],
    creator: '@gateconsole',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents zooming on input focus on mobile
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1CB0F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1CB0F6' },
  ],
}

import { KeyboardShortcutsModal } from '@/components/keyboard-shortcuts-modal'
import { BackgroundElements } from '@/components/background-elements'
import { LayoutWrapper } from '@/components/layout-wrapper'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background overflow-x-hidden ${_nunito.variable} ${_dmSans.variable}`}
    >
      <body className="antialiased min-h-screen bg-background text-primary-text font-sans relative flex flex-col overflow-x-hidden max-w-full">
        <BackgroundElements />
        <SiteNav />
        <LayoutWrapper>
          <StaleBackupBanner />
          <KeyboardShortcutsModal />
          {children}
        </LayoutWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
