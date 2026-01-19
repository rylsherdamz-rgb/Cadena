import type { Metadata } from "next"
import Navigation from "@/components/Navigation"
import "@rainbow-me/rainbowkit/styles.css";
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers" // <-- client wrapper
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cadena",
  description: "A website prototype that showcases how Cadena Bill will work in practice",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
<meta name="google-site-verification" content="apb_P3D--8M4e_6IHv6eB5ZLlxNbBaTvcP66dJdsKnc" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navigation />
            <Toaster position='top-right' reverseOrder={false} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
