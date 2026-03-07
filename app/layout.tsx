import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Chat - Next Gen Assistant',
  description: 'Chat dengan AI cerdas, simpan riwayat percakapan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
