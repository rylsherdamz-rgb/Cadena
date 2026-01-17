"use client"

import Header from "@/components/Header"
import Hero from "@/components/HeroComponents/Hero"
import MessagingShowCase from "@/components/LandingComponents/Message"
import VotingShowcase from "@/components/LandingComponents/Voting"
import NationalBudgetShowCase from  "@/components/LandingComponents/NationalBuget"


export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col flex-1 bg-white">
      <div className="w-full flex-1 flex items-center">
        <Header />
      </div>
      <div className="w-full flex flex-1 items-center ">
        <Hero />
      </div>
      <div>
        <MessagingShowCase />
      </div>
      <div>
        <VotingShowcase />
      </div>
      <div>
        <NationalBudgetShowCase /> 
      </div>
    </div>
  )
}
