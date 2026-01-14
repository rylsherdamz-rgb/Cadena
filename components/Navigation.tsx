"use client"

import { Badge } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  
  const toRoute = (text: string) =>
    "/" +
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") 
      .replace(/[^a-z0-9-]/g, "") 

  const NavigationItems = ["Rock Game", "Cadena", "About Us"]

  return (
    <nav className="w-full flex bg-white border-b border-gray-200 flex-row justify-between items-center gap-4 px-4 md:px-10 py-4">
      <div
        className="flex flex-row items-center text-black gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push("/")}
      >
        <Badge size={24} color="#000" />
        <p className="font-bold text-lg">Cadena</p>
      </div>
      <div className="py-2 flex flex-row gap-4 md:gap-6 flex-wrap">
        {NavigationItems.map((item, index) => {
          const route: string = toRoute(item)
          const isActive = pathname === route
          return (
            <button
              key={index}
              onClick={() => router.push(route)}
              className={`text-sm md:text-base font-semibold transition-colors ${
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>
    </nav>
  )
}