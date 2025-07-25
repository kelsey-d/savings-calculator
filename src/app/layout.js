import './globals.css'
import { Metadata } from 'next'
import { Roboto_Mono, Pixelify_Sans } from 'next/font/google'

const roboto = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto' })
const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify-sans',
})

export const metadata = {
  title: 'Savings Calculator',
  description: 'Get ahead on your savings',
  icon: '/favicon.ico',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${roboto.variable}`}>
      <body className="flex flex-col justify-center content-center items-center font-roboto w-full bg-gradient-to-b from-[#403D8E] to-[#181C3C] text-white min-h-screen">
        {children}
        <footer className="py-5 bottom-2 text-xs text-gray-500">
          <a
            target="_blank"
            href="https://icons8.com/icon/cdSipEmaQK9s/money-box"
          >
            Piggy Bank
          </a>{' '}
          favicon by{' '}
          <a target="_blank" href="https://icons8.com">
            Icons8
          </a>
        </footer>
      </body>
    </html>
  )
}
