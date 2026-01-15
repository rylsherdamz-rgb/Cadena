"use client"
import {useRouter } from "next/navigation"

export default function RockPage() {
  const router = useRouter()
  return <div className="w-full h-screen bg-white px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="w-full md:w-1/2 text-black flex flex-col gap-6 max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
         The Rock  
        </h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          is a simple implementation of a decentralized rock paper scissor game in order to onboard people on Dapps
        </p>
        <div className="w-full flex flex-row gap-x-5">
          <button
          onClick={() => router.push("/rock-game/create-game")}
          className="w-fit px-8 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors focus:outline-none  "
        >
          Create Game
        </button>
         <button
          onClick={() => router.push("/rock-game/join-game")}
          className="w-fit px-8 py-3 rounded-lg bg-white text-black border border-black font-semibold hover:bg-gray-100 transition-colors focus:outline-none  "
        >
          Join Game
        </button>
        </div>
     </div>
      <div className="w-full md:w-1/2 h-full flex justify-center items-center">
        
      </div>
    </div> 
}