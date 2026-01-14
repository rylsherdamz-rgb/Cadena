"use client"

import { useState } from "react"

export default function SearchBarComponent() {
  const [search, setSearch] = useState<string>("")

  return (
    <div className="w-full h-full">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="focus:outline-none bg-white px-4 py-2 rounded-2xl text-black border border-gray-200 w-full"
        placeholder="Search Contracts.."
      />
    </div>
  )
}