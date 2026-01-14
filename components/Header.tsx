"use client"

import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  return (
    <div className="w-full h-full px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="w-full md:w-1/2 text-black flex flex-col gap-6 max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Transparency is not a promise — it&apos;s a system.
        </h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          In a country where public trust has been tested repeatedly, accountability cannot rely on assurances alone. It requires systems that make misuse difficult, concealment impossible, and audits immediate. By embedding transparency into how public funds are distributed and tracked, the people no longer have to ask where their money went — they can verify it themselves.
        </p>
        <button
          onClick={() => router.push("/cadena")}
          className="w-fit px-8 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Get Started
        </button>
      </div>
      <div className="w-full md:w-1/2 h-full flex justify-center items-center">
        
      </div>
    </div>
  )
}