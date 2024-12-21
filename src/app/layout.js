import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Savings Estimator',
  description: 'Get ahead on your savings',
}

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body className="flex flex-wrap justify-center content-center h-screen">{children}</body>
    </html>
  )
}
