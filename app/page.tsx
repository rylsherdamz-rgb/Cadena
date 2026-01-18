"use client"

import Header from "@/components/Header"
import Hero from "@/components/HeroComponents/Hero"
import MessagingShowCase from "@/components/LandingComponents/Message"
import VotingShowcase from "@/components/LandingComponents/Voting"
import NationalBudgetShowCase from "@/components/LandingComponents/NationalBuget"
import Footer from "@/components/Footer" // Added footer for a complete layout

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        <section className="w-full border-b-8 border-black">
          <Hero />
        </section>

        <section className="w-full py-12 md:py-24 border-b-8 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <MessagingShowCase />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 border-b-8 border-black bg-zinc-50">
          <div className="container mx-auto px-4 md:px-6">
            <VotingShowcase />
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <NationalBudgetShowCase /> 
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
