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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${roboto.variable}`}>
      <body className="flex flex-wrap justify-center content-center h-screen">
        {children}
      </body>
    </html>
  )
}
