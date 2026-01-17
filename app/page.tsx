"use client"

import Header from "@/components/Header"
import Hero from "@/components/HeroComponents/Hero"

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col flex-1 bg-white">
      <div className="w-full flex-1 flex items-center">
        <Header />
      </div>
      <div className="w-full flex flex-1 items-center ">
        <Hero />
      </div>
    </div>
  )
}
