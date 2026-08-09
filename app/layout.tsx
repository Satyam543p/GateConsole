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
  title: 'GateConsole',
  description: 'Data-driven strategy engine for competitive exams.',
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
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#FAFBFF',
}

import { KeyboardShortcutsModal } from '@/components/keyboard-shortcuts-modal'
import { BackgroundElements } from '@/components/background-elements'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${_nunito.variable} ${_dmSans.variable}`}
    >
      <body className="antialiased flex h-dvh overflow-hidden bg-background text-primary-text font-sans relative">
        <BackgroundElements />
        <SiteNav />
        <div className="flex-1 flex flex-col h-dvh overflow-y-auto overflow-x-hidden relative bg-transparent z-10 md:ml-16 pb-[60px] md:pb-0">
          <StaleBackupBanner />
          <KeyboardShortcutsModal />
          {children}
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
