"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Badge, Menu, X, Cpu, Terminal  } from "lucide-react"
import dynamic from "next/dynamic"

function Navigation() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toRoute = (text: string) => {
    if (text === "Rock Game") return "/rock-game" // Specific fix for your case
    return "/" + text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  }

  const NavigationItems = ["Rock Game", "Cadena",  "Vote", "Message", "About Us",]

  if (!mounted) return <div className="h-20 bg-white border-b-4 border-black" />

  return (
    <nav className="w-full bg-white border-b-4 border-black sticky top-0 z-[100] text-black px-6 md:px-10 py-5">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="bg-black p-2 transition-transform group-hover:rotate-12">
            <Terminal size={24} className="text-white" />
          </div>
          <p className="font-black text-2xl uppercase tracking-tighter italic italic underline decoration-4 underline-offset-4">
            Cadena
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {NavigationItems.map((item, index) => {
            const route = toRoute(item)
            const isActive = pathname === route
            
            return (
              <button
                key={index}
                onClick={() => router.push(route)}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest transition-all border-2 ${
                  isActive
                    ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                    : "text-black border-transparent hover:border-black hover:italic"
                }`}
              >
                {item.replace(" ", "_")}
              </button>
            )
          })}
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden border-2 border-black p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-[84px] left-0 w-full bg-white border-b-4 border-black p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {NavigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(toRoute(item))
                setIsMenuOpen(false)
              }}
              className="text-left py-4 border-b-2 border-gray-100 font-black uppercase tracking-widest text-sm italic"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
